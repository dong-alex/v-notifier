import React, { useState, useEffect } from "react";
import { ReactQueryDevtools } from "react-query/devtools";
import { useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";
import ContactSection from "components/contacts/ContactSection";
import IndividualCost from "components/paymentForm/IndividualCost";
import { User } from "types/user";
import { useContacts } from "components/hooks/useContacts";
import { useSpreadsheets } from "components/hooks/useSpreadsheets";
import { useSchoolData } from "components/hooks/useSchoolData";
import SectionWrapper from "@components/shared/SectionWrapper";
import { TextMessageBox } from "@components/paymentForm/TextMessageBox";
import {
  TEST_RECIPIENT,
  TestNumberCheckbox,
} from "@components/paymentForm/TestNumberCheckbox";
import EmailDropdown from "@components/paymentForm/EmailDropdown";
import { RecentMessages } from "@components/recentMessages/RecentMessages";
import IndividualNumber from "@components/paymentForm/IndividualNumber";
import { SentMessageStatus } from "@components/paymentForm/SentMessageStatus";
import { SubmitButton } from "@components/paymentForm/SubmitButton";
import { USERS } from "config/authorizedUsers";
import { SpreadsheetDropdown } from "@components/subheader/SpreadsheetDropdown";
import TogglePaymentOrPaidMode from "@components/subheader/TogglePaymentOrPaidMode";

const IS_PRODUCTION: boolean = process.env.NODE_ENV === "production";

const AuthShowcase: React.FC = () => {
  const [checkedPhoneNumbers, setCheckedPhoneNumbers] = React.useState<
    Set<string>
  >(new Set());

  const [checkedNames, setCheckedNames] = React.useState<Set<string>>(
    new Set(),
  );

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      individualCost: "0.00",
      email: USERS[0],
      schoolName: "",
      textMessage: "",
      individualNumber: 1,
      useTestNumber: !IS_PRODUCTION,
    },
  });

  const watchFields = watch();

  const [lastSentCount, setLastSentCount] = useState<number>(0);
  const [isPaymentMode, setPaymentMode] = useState<boolean>(true);

  const { spreadsheets } = useSpreadsheets();

  const { mutateAsync: mutatePending, isSuccess: pendingPaySet } =
    trpc.useMutation(["sheets.setPendingPay"]);

  const { mutateAsync: mutatePaid, isSuccess: paidSet } = trpc.useMutation([
    "sheets.setPaid",
  ]);

  const { contacts, loading: loadingContacts } = useContacts(watchFields?.schoolName, pendingPaySet);
  const { schoolData, refetch, schoolDataLoading } = useSchoolData(
    watchFields?.schoolName,
  );

  const {mutateAsync: mutateAddRows } = trpc.useMutation(["sheets.addAttendingRows"], {
    async onSuccess() {
      refetch();
    },
  });

  const {
    mutate,
    error: sendMessageError,
    isSuccess,
  } = trpc.useMutation(["messages.send"], {
    async onSuccess() {
      // set pending pay for the checked values
      const rows: string[] = [];

      selectedContacts.forEach((sc) => {
        if (!sc.row) {
          return;
        }

        rows.push(sc.row);
      });

      if (!spreadsheetId) {
        handleClearAll();
        return;
      }

      await mutatePending({
        sheetId: spreadsheetId,
        rows: JSON.stringify(rows),
      });

      refetch();

      handleClearAll();
    },
  });

  useEffect(() => {
    const { individualCost, email, schoolName, individualNumber } = watchFields;

    let formattedCost = individualCost;
    if (individualNumber > 1) {
      const totalCost = (
        Number(watchFields.individualCost) * individualNumber
      ).toFixed(2);
      formattedCost = `${totalCost} for ${individualNumber} people`;
    }

    const messagePlaceholder = `Send $${formattedCost} to ${email} for ${
      schoolName || "recent booking"
    }`;

    setValue("textMessage", messagePlaceholder);
  }, [
    watchFields.schoolName,
    watchFields.individualCost,
    watchFields.email,
    watchFields.individualNumber,
  ]);

  useEffect(() => {
    const { bookingFullAttendance = [], bookingAttendanceLock } = schoolData || {}
    if (bookingAttendanceLock && bookingFullAttendance?.length > 0) {
      mutateAddRows({
        schoolName: watchFields.schoolName,
        names: JSON.stringify(schoolData?.bookingFullAttendance),
      })
    }
  }, [
    watchFields.schoolName,
    schoolData?.bookingFullAttendance,
  ])

  const spreadsheetId = React.useMemo(() => {
    return spreadsheets.find((s) => s.title === watchFields.schoolName)
      ?.sheetId;
  }, [spreadsheets, watchFields.schoolName]);

  const filteredContacts: User[] = React.useMemo(() => {
    if (!isPaymentMode) {
      return contacts.filter((c) => !checkedNames.has(c.name) && !c?.paid);
    }
    return contacts.filter((c) => c.phone && !checkedPhoneNumbers.has(c?.phone));
  }, [contacts, checkedPhoneNumbers, isPaymentMode, checkedNames, schoolData]);

  const selectedContacts: User[] = React.useMemo(() => {
    if (!isPaymentMode) {
      return contacts.filter((c) => checkedNames.has(c.name));
    }
    return contacts.filter((c) => c?.phone && checkedPhoneNumbers.has(c?.phone));
  }, [contacts, checkedPhoneNumbers, checkedNames, isPaymentMode]);

  const onSubmit = React.useCallback(async () => {
    const recipients: string[] = watchFields.useTestNumber
      ? [TEST_RECIPIENT]
      : Array.from(checkedPhoneNumbers);

    setLastSentCount(recipients.length);

    mutate({
      phone: JSON.stringify(recipients),
      message: `${watchFields.textMessage}`,
    });
  }, [
    watchFields.useTestNumber,
    checkedPhoneNumbers,
    mutate,
    watchFields.textMessage,
  ]);

  const handleClearAll = () => {
    setCheckedPhoneNumbers(new Set());
    setCheckedNames(new Set());
  };

  const handleContactRemove = React.useCallback(
    (name: string, phone?: string) => {
      if (phone) {
        checkedPhoneNumbers.delete(phone);
        setCheckedPhoneNumbers(new Set(checkedPhoneNumbers));
      }
      checkedNames.delete(name);
      setCheckedNames(new Set(checkedNames));
    },
    [checkedPhoneNumbers, checkedNames],
  );

  const handleContactAdd = React.useCallback(
    (name: string, phone?: string) => {
      if (phone) {
        setCheckedPhoneNumbers(
          new Set([...Array.from(checkedPhoneNumbers), phone]),
        );
      }
      setCheckedNames(new Set([...Array.from(checkedNames), name]));
    },
    [checkedPhoneNumbers, checkedNames],
  );

  const onPaidSubmit = React.useCallback(async () => {
    // set paid for the checked values
    // refactor duplication with pending pay set
    const rows: string[] = [];

    selectedContacts.forEach((sc) => {
      if (!sc.row) {
        return;
      }

      rows.push(sc.row);
    });

    if (!spreadsheetId) {
      handleClearAll();
      return;
    }

    await mutatePaid({
      sheetId: spreadsheetId,
      rows: JSON.stringify(rows),
    });

    refetch();

    handleClearAll();
  }, [selectedContacts]);

  return (
    <div className="flex-col items-center p-3 md:p-0 md:items-start">
      <section className="flex w-full flex-col md:flex-row md:justify-between">
        <div className="inline-flex flex-row justify-between">
          <SpreadsheetDropdown register={register} />
          {watchFields.schoolName && (
            <TogglePaymentOrPaidMode
              isPaymentMode={isPaymentMode}
              setPaymentMode={setPaymentMode}
              handleClearAll={handleClearAll}
            />
          )}
        </div>
        <RecentMessages />
      </section>
      <section className="flex flex-col md:flex-row">
        <ContactSection
          name="Contacts"
          contactArray={filteredContacts}
          contactHandler={handleContactAdd}
          isLoading={loadingContacts || schoolDataLoading}
        />
        {isPaymentMode ? (
          <SectionWrapper name="Send Texts" maxMdWidth="md:w-80">
            <form onSubmit={handleSubmit(onSubmit)}>
              <IndividualCost
                title={watchFields.schoolName}
                data={schoolData?.bookingCost}
                setValue={setValue}
                register={register}
              />
              <IndividualNumber register={register} />
              <EmailDropdown register={register} />
              <TextMessageBox register={register} />
              <TestNumberCheckbox register={register} />
              <>
                <SubmitButton
                  contactsSelected={checkedPhoneNumbers.size > 0}
                  useTestNumber={watchFields.useTestNumber}
                />
                <SentMessageStatus
                  sentCount={lastSentCount}
                  errorMessage={sendMessageError}
                  isSuccess={isSuccess}
                />
              </>
            </form>
          </SectionWrapper>
        ) : (
          <SectionWrapper name="Set Paid 💸" maxMdWidth="md:w-80">
            <form onSubmit={handleSubmit(onPaidSubmit)}>
              {"Set currently selected users paid status to true"}
              <SubmitButton
                contactsSelected={
                  checkedPhoneNumbers.size > 0 || checkedNames.size > 0
                }
                isPaymentMode={isPaymentMode}
              />
            </form>
          </SectionWrapper>
        )}
        <ContactSection
          name="Selected"
          contactArray={selectedContacts}
          contactHandler={handleContactRemove}
          clearAllHandler={handleClearAll}
        />
      </section>
      {!IS_PRODUCTION && <ReactQueryDevtools initialIsOpen={false} />}
    </div>
  );
};

export default AuthShowcase;
