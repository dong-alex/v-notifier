import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import SectionHeader from "../components/SectionHeader";
import ContactSection from "../components/contacts/ContactSection";
import IndividualCost from "../components/IndividualCost";
import {
  MoneySymbol,
  CurrencyDisplay,
} from "../components/currencyUtil/currency";
import { Label } from "../components/shared/label";
import { RecentMessages } from "../components/RecentMessages";

interface User {
  name: string;
  phone: string;
}

const TEST_RECIPIENT: string = "780-850-8369";

const AUTHORIZED_USERS = new Set([
  "c.patel@hotmail.ca",
  "baffooneries@gmail.com",
  "kevinlam13@hotmail.com",
]);

const IS_PRODUCTION: boolean = process.env.NODE_ENV === "production";

const AuthShowcase: React.FC = () => {
  const [checkedPhoneNumbers, setCheckedPhoneNumbers] = React.useState<
    Set<string>
  >(new Set());

  const [sentNumbers, setSentNumbers] = useState(new Set());

  const [useTestNumber, setUseTestNumber] = useState<boolean>(!IS_PRODUCTION);
  const [showRecentMessages, setShowRecentMessages] = useState<boolean>(false);

  const [displayToast, setDisplayToast] = useState({
    display: false,
    countSent: 0,
  });

  const [messagePlaceholder, setMessagePlaceholder] = useState<string>("");

  const { register, handleSubmit, watch } = useForm();

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const totalPrice = watch("total-price") as string;

  const { data: sessionData } = useSession();

  const { data: valid } = trpc.useQuery(["checks.validUser"], {
    enabled: !!sessionData?.user,
  });

  const {
    mutate,
    error: sendMessageError,
    isSuccess,
  } = trpc.useMutation(["messages.send"]);

  const {
    data: contacts,
    isLoading,
    error,
  } = trpc.useQuery(["sheets.getContacts"], {
    enabled: !!valid,
  });

  useEffect(() => {
    if (isSuccess) {
      setDisplayToast({ display: true, countSent: checkedPhoneNumbers.size });
      handleContactSent(checkedPhoneNumbers)
      setTimeout(
        () =>
          setDisplayToast({
            display: false,
            countSent: displayToast.countSent,
          }),
        8000,
      );
      handleClearAll();
    }
  }, [isSuccess]);

  const numbers = React.useMemo(() => {
    const output = Array.from(checkedPhoneNumbers);

    return output.join(" ");
  }, [checkedPhoneNumbers]);

  const filteredContacts: User[] = React.useMemo(() => {
    if (!contacts) {
      return [];
    }

    const result: User[] = [];

    contacts.forEach(({ name, phone }) => {
      if (!phone || !name) {
        return;
      }

      if (!checkedPhoneNumbers.has(phone)) {
        result.push({
          name,
          phone,
        });
      }
    });

    return result;
  }, [contacts, checkedPhoneNumbers]);

  const selectedContacts: User[] = React.useMemo(() => {
    if (!contacts) {
      return [];
    }

    const result: User[] = [];

    contacts.forEach(({ name, phone }) => {
      if (!phone || !name) {
        return;
      }

      if (checkedPhoneNumbers.has(phone)) {
        result.push({
          name,
          phone,
        });
      }
    });

    return result;
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
        `Send ${unitPrice} to ${email} for the recent booking`,
      );
    },
    [unitPrice],
  );

  const onSubmit = React.useCallback(async () => {
    if (!textareaRef.current) {
      return;
    }

    let refactoredMessage = textareaRef.current.value.replace(
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

  const handleContactSent = React.useCallback(
    (phoneNumber: string) => {
      setSentNumbers(
        new Set([...Array.from(checkedPhoneNumbers), ...Array.from(sentNumbers)]),
      );
    },
    [sentNumbers, checkedPhoneNumbers],
  );

  if (!sessionData) {
    return null;
  }

  if (isLoading) {
    return <div>Loading contacts ...</div>;
  }

  if (error) {
    return <div>Some error occurred {error.message}</div>;
  }

  return (
    <div className="flex">
      <ContactSection
        name="Contacts"
        contactArray={filteredContacts}
        contactHandler={handleContactAdd}
        sentContacts={sentNumbers}
      />
      <form onSubmit={handleSubmit(onSubmit)} className="mr-4 w-80">
        <SectionHeader name="Payment" />
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
          <div className="flex">
            <input
              type={"checkbox"}
              checked={useTestNumber}
              onChange={() => {
                setUseTestNumber(!useTestNumber);
              }}
              className="mr-2"
            />
            <span className="leading-none">
              Use Test Number: {TEST_RECIPIENT}
            </span>
          </div>
        </div>
        <button
          className="border-2 border-indigo-400 py-2 px-4 mt-4 rounded-3xl shadow-lg min-w-full"
          type="submit"
        >
          Send
        </button>
        {displayToast.display && (
          <div
            id="toast-bottom-left"
            className="flex absolute bottom-5 left-5 items-center p-4 space-x-4 w-full max-w-xs text-gray-500 bg-white rounded-lg divide-x divide-gray-200 shadow dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800"
            role="alert"
          >
            <div className="inline-flex flex-shrink-0 justify-center items-center w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Check icon</span>
            </div>
            <span className="text-sm font-normal">{`Message sent successfully to ${displayToast.countSent} persons`}</span>
          </div>
        )}
      </form>
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
      <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={() => setShowRecentMessages(!showRecentMessages)}>
        {showRecentMessages ? "Hide Messages" : "Show Messages"}
      </button>
      {showRecentMessages && <RecentMessages />}
    </div>
  );
};

export default AuthShowcase;
