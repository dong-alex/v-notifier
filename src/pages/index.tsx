import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import SectionHeader from "../components/SectionHeader";
import ContactList from "../components/ContactList";

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

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>V-Notifier</title>
        <link rel="icon" href="/volleyball-emoji.png" />
      </Head>
      <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900 border-y dark:bg-gray-800 dark:border-gray-600">
        <div className="container flex flex-wrap justify-between items-center mx-auto">
          <div className="flex items-center">
            <img src="/volleyball-emoji.png" className="mr-3 h-6 sm:h-9" alt="Volleyball Emoji" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"><span className="text-purple-300">V</span> Notifier</span>
          </div>
         <div className="space-x-2">
          {sessionData && (
            <span>
              👋 Signed in as {" "}
              <span className="text-blue-500">{sessionData.user?.email}</span>
            </span>
          )}

            <button
              type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
              onClick={sessionData ? () => signOut() : () => signIn()}
            >
              {sessionData ? "Sign out" : "Sign in"}
            </button>
          </div>
        </div>
      </nav>

      <main className="container flex mx-auto flex-col p-4">
        <section id="users" className="items-start h-full">
          <AuthShowcase />
        </section>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const [checkedPhoneNumbers, setCheckedPhoneNumbers] = React.useState<
    Set<string>
  >(new Set());

  const [useTestNumber, setUseTestNumber] = React.useState<boolean>(
    !IS_PRODUCTION,
  );

  const [messagePlaceholder, setMessagePlaceholder] = useState<string>("");

  const { register, handleSubmit, watch } = useForm();

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const totalPrice = watch("total-price") as string;

  const { data: sessionData } = useSession();

  const { data: valid } = trpc.useQuery(["checks.validUser"], {
    enabled: !!sessionData?.user,
  });

  const { mutate, error: sendMessageError } = trpc.useMutation([
    "messages.send",
  ]);

  const {
    data: contacts,
    isLoading,
    error,
  } = trpc.useQuery(["sheets.getContacts"], {
    enabled: !!valid,
  });

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
      <section id="contacts" className="w-96">
        <SectionHeader name="Contacts" />
        <ContactList contactArray={filteredContacts} contactHandler={handleContactAdd} />
      </section>
      <form onSubmit={handleSubmit(onSubmit)} className="mr-4 w-80">
        <SectionHeader name="Payment" />
        <div className="mt-5">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              step="0.01"
              id="price"
              className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="0.00"
              pattern="^\d*(\.\d{0,2})?$"
              {...register("total-price")}
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <label htmlFor="currency" className="sr-only">
                Currency
              </label>
              <span
                id="currency"
                className="h-full rounded-md border-transparent bg-transparent py-2 pl-2 pr-3 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                CAD
              </span>
            </div>
          </div>
        </div>
        <div className="my-5">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Individual price for {checkedPhoneNumbers.size} persons
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              step="0.01"
              id="price"
              className="block w-full rounded-md border-gray-300 pl-7 pr-12 sm:text-sm"
              value={unitPrice}
              pattern="^\d*(\.\d{0,2})?$"
              placeholder="0.00"
              readOnly
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <label htmlFor="currency" className="sr-only">
                Currency
              </label>
              <span
                id="currency"
                className="h-full rounded-md border-transparent bg-transparent py-2 pl-2 pr-3 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                CAD
              </span>
            </div>
          </div>
        </div>
        <div className="my-5">
        <label
            htmlFor="etransfer-email"
            className="block text-sm font-medium text-gray-700"
          >
            E-transfer email
          </label>
        <select id="etransfer-email" onChange={(e) => hoverEmail(e.target.value)} className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected disabled>Choose an email</option>
            {
              Array.from(AUTHORIZED_USERS).map((email: string, i) => (
                <option value={email} key={i}>{email}</option>
              ))
            }
          </select>
        </div>
        <div className="flex justify-center flex-col">
          <div className="mb-3 xl:w-96">
            <label
              htmlFor="text-message"
              className="form-label inline-block mb-2 text-gray-700"
            >
              Text Message
            </label>
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
              placeholder={messagePlaceholder}
            />
          </div>
          <div className="flex flex-row">
          <input
            type={"checkbox"}
            checked={useTestNumber}
            onChange={() => {
              setUseTestNumber(!useTestNumber);
            }}
            className="mr-2"
          />
          <span className="leading-none">Use Test Number: {TEST_RECIPIENT}</span>
          </div>
        </div>

        <button
          className="border-2 border-indigo-400 py-2 px-4 mt-4 rounded-3xl shadow-lg min-w-full"
          type="submit"
        >
          Send
        </button>
      </form>
      {sendMessageError && (
        <span>An error has occurred when attempting to send the message</span>
      )}
      <section id="selected-contacts" className="w-96">
        <SectionHeader name="Recipients" />
        <ContactList contactArray={selectedContacts} contactHandler={handleContactRemove} />
      </section>
    </div>
  );
};
