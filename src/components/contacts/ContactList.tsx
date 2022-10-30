import React from "react";
import { User } from "types/user";

interface Props {
  contactArray: Array<User>;
  contactHandler: (number: string) => void;
  sentContacts: Set<string>;
}

const GetContactButton = (
  user: User,
  handler: (number: string) => void,
  hasSentMessage: boolean,
) => {
  const { name, phone, pendingPay, paid } = user;
  // TODO: fix ugliest ternaries in history
  // TODO: change outline colour not bg
  let backgroundColour = pendingPay ? "bg-pink-300" : "bg-white";
  backgroundColour = paid ? "bg-green-300" : backgroundColour;
  return (
    <button
      className={`w-full py-2.5 px-5 mx-1 my-1 text-sm font-medium focus:outline-none ${backgroundColour} rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700`}
      onClick={() => {
        handler(phone);
      }}
    >
      <span className="text-blue-500">
        {name}
        {hasSentMessage && " ✅"}
      </span>
    </button>
  );
};

const ContactList = ({ contactArray, contactHandler, sentContacts }: Props) => {
  return (
    <div className="overflow-y-auto my-4 mr-8 max-h-96 p-2">
      {contactArray.map((user) => {
        const hasSentMessage = sentContacts.has(user.phone);
        return GetContactButton(user, contactHandler, hasSentMessage);
      })}
    </div>
  );
};

export default ContactList;
