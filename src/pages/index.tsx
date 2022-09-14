import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { useForm } from "react-hook-form";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

interface User {
  name: string;
  phone: string;
}

const TEST_RECEPIENT: string = "780-850-8369";

const AUTHORIZED_USERS = new Set([
  "c.patel@hotmail.ca",
  "baffooneries@gmail.com",
]);

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>V-Notifier</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container flex mx-auto flex-col p-4">
        <section
          id="header"
          className="flex justify-between items-center w-full"
        >
          <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
            <span className="text-purple-300">V</span> Notifier
          </h1>
          <div className="space-x-2">
            {sessionData && (
              <span>
                Logged in as{" "}
                <span className="text-blue-500">{sessionData.user?.email}</span>
              </span>
            )}
            <button
              className="px-4 py-0 border border-black text-xl rounded-md bg-violet-50 hover:bg-violet-100 shadow-lg h-1/2"
              onClick={sessionData ? () => signOut() : () => signIn()}
            >
              {sessionData ? "Sign out" : "Sign in"}
            </button>
          </div>
        </section>

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
  const [messagePlaceholder, setMessagePlaceholder] =
    React.useState<string>("");

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

    const recepients =
      process.env.NODE_ENV === "production" ? numbers : TEST_RECEPIENT;

    mutate({
      phone: recepients,
      message: `${refactoredMessage}`,
    });
  }, [numbers, unitPrice]);

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

  const GetContactButton = React.useCallback(
    (name: string, phone: string, handler: (number: string) => void) => {
      return (
        <button
          className="border-2 space-x-4 my-4 py-2 px-12 min-w-full cursor-pointer rounded-3xl hover:border-indigo-400 flex flex-col"
          onClick={() => {
            handler(phone);
          }}
        >
          <span className="text-blue-500">{name}</span>
          <span>{phone}</span>
        </button>
      );
    },
    [],
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
      <div>
        <h3 className="text-5xl md:text-[2rem] font-extrabold text-gray-700">
          <span className="text-violet-500">C</span>
          ontacts
        </h3>
        <div className="overflow-y-auto h-screen px-8 my-4 mr-8">
          {filteredContacts.map(({ name, phone }) =>
            GetContactButton(name, phone, handleContactAdd),
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mr-4">
        <h3 className="text-5xl md:text-[2rem] font-extrabold text-gray-700">
          <span className="text-violet-500">P</span>
          ayment
        </h3>
        <div>
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
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Per Person Price
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
        <p>Total amount of persons: {checkedPhoneNumbers.size}</p>
        <div className="flex justify-center">
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
        </div>
        <button
          className="border-2 border-indigo-400 py-2 px-4 mt-4 rounded-3xl shadow-lg"
          type="submit"
        >
          Send
        </button>
      </form>
      {sendMessageError && (
        <span>An error has occurred when attempting to send the message</span>
      )}
      <section id="etransfer-emails" className="flex flex-col gap-4 mx-4">
        <h3 className="text-5xl md:text-[2rem] font-extrabold text-gray-700">
          <span className="text-violet-500">E</span>
          transfer Emails
        </h3>
        {Array.from(AUTHORIZED_USERS).map((email: string, i) => {
          return (
            <button
              key={i}
              className="border-2 border-indigo-200 p-4 rounded-xl hover:border-indigo-600"
              onMouseOver={() => {
                hoverEmail(email);
              }}
              onClick={() => {
                if (!textareaRef.current) {
                  return;
                }

                textareaRef.current.value = messagePlaceholder;
              }}
            >
              {email}
            </button>
          );
        })}
      </section>
      <section id="selected-contacts" className="mx-4">
        <h3 className="text-5xl md:text-[2rem] font-extrabold text-gray-700">
          <span className="text-violet-500">R</span>
          ecpients
        </h3>
        {selectedContacts.map(({ name, phone }, i) => {
          return GetContactButton(name, phone, handleContactRemove);
        })}
      </section>
    </div>
  );
};
