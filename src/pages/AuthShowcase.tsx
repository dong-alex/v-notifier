import React, { useState, useEffect, ChangeEvent } from "react";
import { ReactQueryDevtools } from "react-query/devtools";
import { useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";
import ContactSection from "components/contacts/ContactSection";
import IndividualCost from "components/IndividualCost";
import { MoneySymbol, CurrencyDisplay } from "components/currencyUtil/currency";
import { Label } from "components/shared/label";
import { SpreadsheetDropdown } from "components/spreadsheet/SpreadsheetDropdown";
import { User } from "types/user";
import { useContacts } from "components/hooks/useContacts";
import { useSpreadsheets } from "components/hooks/useSpreadsheets";
import SentMessageToast from "components/toast/SentMessageToast";
import SectionWrapper from "@components/shared/SectionWrapper";
import { TextMessageBox } from "@components/paymentForm/TextMessageBox";
import {
  TEST_RECIPIENT,
  TestNumberCheckbox,
} from "@components/paymentForm/TestNumberCheckbox";
import EmailDropdown from "@components/paymentForm/EmailDropdown";
import { RecentMessages } from "@components/recentMessages/RecentMessages";
import { Invoice } from "@components/invoice/Invoice";

const IS_PRODUCTION: boolean = process.env.NODE_ENV === "production";

const AuthShowcase: React.FC = () => {
  const [checkedPhoneNumbers, setCheckedPhoneNumbers] = React.useState<
    Set<string>
  >(new Set());
  const [useTestNumber, setUseTestNumber] = useState<boolean>(!IS_PRODUCTION);
  const [schoolName, setSchoolName] = useState<string>("");

  const { contacts } = useContacts(schoolName);

  const [displayToast, setDisplayToast] = useState({
    display: false,
    countSent: 0,
  });

  const [messagePlaceholder, setMessagePlaceholder] = useState<string>("");

  const { register, handleSubmit, watch } = useForm();

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const totalPrice = watch("total-price") as string;

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
    if (isSuccess) {
      setDisplayToast({ display: true, countSent: checkedPhoneNumbers.size });
      setTimeout(
        () =>
          setDisplayToast({
            display: false,
            countSent: displayToast.countSent,
          }),
        8000,
      );
    }
  }, [isSuccess]);

  const spreadsheetId = React.useMemo(() => {
    return spreadsheets.find((s) => s.title === schoolName)?.sheetId;
  }, [spreadsheets, schoolName]);

  const filteredContacts: User[] = React.useMemo(() => {
    return contacts.filter((c) => !checkedPhoneNumbers.has(c.phone));
  }, [contacts, checkedPhoneNumbers]);

  const selectedContacts: User[] = React.useMemo(() => {
    return contacts.filter((c) => checkedPhoneNumbers.has(c.phone));
  }, [contacts, checkedPhoneNumbers]);

  const unitPrice: string = React.useMemo(() => {
    if (checkedPhoneNumbers.size === 0) {
      return "0.00";
    }

    return String((Number(totalPrice) / checkedPhoneNumbers.size).toFixed(2));
  }, [totalPrice, checkedPhoneNumbers]);

  const hoverEmail = React.useCallback(
    (email: string) => {
      if (!textareaRef.current) {
        return;
      }

      setMessagePlaceholder(
        `Send $${unitPrice} to ${email} for ${
          schoolName ? schoolName : "recent booking"
        }`,
      );
    },
    [unitPrice],
  );

  const onSubmit = React.useCallback(async () => {
    if (!textareaRef.current) {
      return;
    }

    const refactoredMessage = textareaRef.current.value.replace(
      "{unit-price}",
      unitPrice,
    );

    const recipients: string[] = useTestNumber
      ? [TEST_RECIPIENT]
      : Array.from(checkedPhoneNumbers);

    mutate({
      phone: JSON.stringify(recipients),
      message: `${refactoredMessage}`,
    });
  }, [unitPrice, useTestNumber, checkedPhoneNumbers, mutate]);

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
      <Invoice />
      <section className="flex w-full flex-col md:flex-row md:justify-between">
        <SpreadsheetDropdown
          school={schoolName}
          onSchoolChange={(s: string) => {
            setSchoolName(s);
          }}
        />
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
            <div className="mt-5">
              <Label id="price" title="Price" />
              <div className="relative mt-1 rounded-md shadow-sm">
                <MoneySymbol />
                <input
                  type="number"
                  step="0.01"
                  id="price"
                  className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="0.00"
                  pattern="^\d*(\.\d{0,2})?$"
                  {...register("total-price")}
                />
                <CurrencyDisplay />
              </div>
            </div>
            <IndividualCost
              unitPrice={unitPrice}
              individualCount={checkedPhoneNumbers.size}
            />
            <EmailDropdown
              handleEmailChange={(e: ChangeEvent<HTMLSelectElement>) =>
                hoverEmail(e?.target?.value)
              }
            />
            <TextMessageBox
              textareaRef={textareaRef}
              messagePlaceholder={messagePlaceholder}
            />
            <TestNumberCheckbox
              useTestNumber={useTestNumber}
              handleTestNumberChange={() => {
                setUseTestNumber(!useTestNumber);
              }}
            />
            <button
              className="border-2 border-indigo-400 py-2 px-4 mt-4 rounded-3xl shadow-lg min-w-full disabled:opacity-50"
              type="submit"
              disabled={checkedPhoneNumbers.size === 0}
            >
              Send
            </button>
            {displayToast.display && (
              <SentMessageToast countSent={displayToast.countSent} />
            )}
          </form>
        </SectionWrapper>
        {sendMessageError && (
          <span>An error has occurred when attempting to send the message</span>
        )}
        <ContactSection
          name="Recipients"
          contactArray={selectedContacts}
          contactHandler={handleContactRemove}
          clearAllHandler={handleClearAll}
        />
      </section>
      {process.env.NODE_ENV !== "production" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </div>
  );
};

export default AuthShowcase;
