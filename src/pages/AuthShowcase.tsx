import React, { useState, useEffect } from "react";
import { ReactQueryDevtools } from "react-query/devtools";
import { useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";
import ContactSection from "components/contacts/ContactSection";
import IndividualCost from "components/paymentForm/IndividualCost";
import { SpreadsheetDropdown } from "components/spreadsheet/SpreadsheetDropdown";
import { User } from "types/user";
import { useContacts } from "components/hooks/useContacts";
import { useSpreadsheets } from "components/hooks/useSpreadsheets";
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

const IS_PRODUCTION: boolean = process.env.NODE_ENV === "production";

const AuthShowcase: React.FC = () => {
  const [checkedPhoneNumbers, setCheckedPhoneNumbers] = React.useState<
    Set<string>
  >(new Set());
  const [useTestNumber, setUseTestNumber] = useState<boolean>(!IS_PRODUCTION);
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      individualCost: "0.00",
      email: "",
      schoolName: "",
      textMessage: "",
      individualNumber: 1,
    },
  });

  const watchFields = watch();

  const { contacts } = useContacts(watchFields?.schoolName);

  const [lastSentCount, setLastSentCount] = useState<number>(0);

  const { spreadsheets } = useSpreadsheets();

  const { mutateAsync: mutatePending } = trpc.useMutation([
    "sheets.setPendingPay",
  ]);

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

    const messagePlaceholder = `Send $${formattedCost} to ${
      email || "[select an email!]"
    } for ${schoolName || "recent booking"}`;

    setValue("textMessage", messagePlaceholder);
  }, [
    watchFields.schoolName,
    watchFields.individualCost,
    watchFields.email,
    watchFields.individualNumber,
  ]);

  const spreadsheetId = React.useMemo(() => {
    return spreadsheets.find((s) => s.title === watchFields.schoolName)
      ?.sheetId;
  }, [spreadsheets, watchFields.schoolName]);

  const filteredContacts: User[] = React.useMemo(() => {
    return contacts.filter((c) => !checkedPhoneNumbers.has(c.phone));
  }, [contacts, checkedPhoneNumbers]);

  const selectedContacts: User[] = React.useMemo(() => {
    return contacts.filter((c) => checkedPhoneNumbers.has(c.phone));
  }, [contacts, checkedPhoneNumbers]);

  const onSubmit = React.useCallback(async () => {
    const recipients: string[] = useTestNumber
      ? [TEST_RECIPIENT]
      : Array.from(checkedPhoneNumbers);

    setLastSentCount(recipients.length);

    mutate({
      phone: JSON.stringify(recipients),
      message: `${watchFields.textMessage}`,
    });
  }, [useTestNumber, checkedPhoneNumbers, mutate, watchFields.textMessage]);

  const handleClearAll = () => {
    setCheckedPhoneNumbers(new Set());
  };

  const handleContactRemove = React.useCallback(
    (phoneNumber: string) => {
      if (!checkedPhoneNumbers.has(phoneNumber)) {
        return;
      }

      const numbers: string[] = Array.from(checkedPhoneNumbers).filter(
        (n) => n !== phoneNumber,
      );

      setCheckedPhoneNumbers(new Set(numbers));
    },
    [checkedPhoneNumbers],
  );

  const handleContactAdd = React.useCallback(
    (phoneNumber: string) => {
      setCheckedPhoneNumbers(
        new Set([...Array.from(checkedPhoneNumbers), phoneNumber]),
      );
    },
    [checkedPhoneNumbers],
  );

  return (
    <div className="flex-col items-center p-3 md:p-0 md:items-start">
      <section className="flex w-full flex-col md:flex-row md:justify-between">
        <SpreadsheetDropdown register={register} />
        <RecentMessages />
      </section>
      <section className="flex flex-col md:flex-row">
        <ContactSection
          name="Contacts"
          contactArray={filteredContacts}
          contactHandler={handleContactAdd}
        />
        <SectionWrapper name="Payment" maxMdWidth="md:w-80">
          <form onSubmit={handleSubmit(onSubmit)}>
            <IndividualCost
              title={watchFields.schoolName}
              setValue={setValue}
              register={register}
            />
            <IndividualNumber register={register} />
            <EmailDropdown register={register} />
            <TextMessageBox register={register} />
            <TestNumberCheckbox
              useTestNumber={useTestNumber}
              handleTestNumberChange={() => {
                setUseTestNumber(!useTestNumber);
              }}
            />
            <>
              <button
                className="border-2 border-indigo-400 py-2 px-4 mt-4 rounded-3xl shadow-lg min-w-full disabled:opacity-50"
                type="submit"
                disabled={checkedPhoneNumbers.size === 0 && !useTestNumber}
              >
                Send
              </button>
              <SentMessageStatus
                sentCount={lastSentCount}
                errorMessage={sendMessageError}
                isSuccess={isSuccess}
              />
            </>
          </form>
        </SectionWrapper>
        <ContactSection
          name="Recipients"
          contactArray={selectedContacts}
          contactHandler={handleContactRemove}
          clearAllHandler={handleClearAll}
        />
      </section>
      {!IS_PRODUCTION && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </div>
  );
};

export default AuthShowcase;
