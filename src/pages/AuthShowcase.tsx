import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";
import ContactSection from "components/contacts/ContactSection";
import IndividualCost from "components/IndividualCost";
import { MoneySymbol, CurrencyDisplay } from "components/currencyUtil/currency";
import { Label } from "components/shared/label";
import { RecentMessages } from "components/RecentMessages";
import { SpreadsheetDropdown } from "components/spreadsheet/SpreadsheetDropdown";
import { User } from "types/user";
import { useContacts } from "components/hooks/useContacts";
import { useSpreadsheets } from "components/hooks/useSpreadsheets";
import SentMessageToast from "components/toast/SentMessageToast";
import {
  TestNumberCheckbox,
  TEST_RECIPIENT,
} from "components/shared/TestNumberCheckbox";
import SectionWrapper from "@components/shared/SectionWrapper";

const AUTHORIZED_USERS = new Set([
  "c.patel@hotmail.ca",
  "baffooneries@gmail.com",
  "kevinlam13@hotmail.com",
  "rmtiam@gmail.com",
]);

const IS_PRODUCTION: boolean = process.env.NODE_ENV === "production";

const AuthShowcase: React.FC = () => {
  const [checkedPhoneNumbers, setCheckedPhoneNumbers] = React.useState<
    Set<string>
  >(new Set());

  const [sentNumbers, setSentNumbers] = useState<Set<string>>(new Set());
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
      handleContactSent();
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
        `Send ${unitPrice} to ${email} for ${
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

  const handleContactSent = React.useCallback(() => {
    setSentNumbers(
      new Set([
        ...Array.from(checkedPhoneNumbers),
        ...Array.from(sentNumbers),
      ]) as Set<string>,
    );
  }, [sentNumbers, checkedPhoneNumbers]);

  return (
    <div className="flex-col items-center p-3 md:p-0 md:items-start">
      <section className="flex w-full">
        <SpreadsheetDropdown
          school={schoolName}
          onSchoolChange={(s: string) => {
            setSchoolName(s);
          }}
        />
      </section>
      <section className="flex flex-col md:flex-row">
        <ContactSection
          name="Contacts"
          contactArray={filteredContacts}
          contactHandler={handleContactAdd}
          sentContacts={sentNumbers}
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
            <div className="my-5">
              <Label
                id="price"
                title={`Individual price for ${checkedPhoneNumbers.size} persons`}
              />
              <IndividualCost unitPrice={unitPrice} />
            </div>
            <div id="etransfer-dropdown" className="my-5">
              <Label id="etransfer-email" title="E-transfer email" />
              <select
                id="etransfer-email"
                onChange={(e) => hoverEmail(e.target.value)}
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option selected disabled>
                  Choose an email
                </option>
                {Array.from(AUTHORIZED_USERS).map((email: string, i) => (
                  <option value={email} key={i}>
                    {email}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <div className="mb-3">
                <Label id="text-message" title="Text Message" />
                <textarea
                  className="
          form-control
          block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
        "
                  id="exampleFormControlTextarea1"
                  rows={3}
                  ref={textareaRef}
                  defaultValue={messagePlaceholder}
                />
              </div>
              <TestNumberCheckbox
                useTestNumber={useTestNumber}
                handleTestNumberChange={() => {
                  setUseTestNumber(!useTestNumber);
                }}
              />
            </div>
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
          sentContacts={sentNumbers}
        />
        <RecentMessages />
      </section>
    </div>
  );
};

export default AuthShowcase;
