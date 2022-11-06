import React from "react";
import { User } from "types/user";

interface Props {
  contactArray: Array<User>;
  contactHandler: (number: string) => void;
}

const getBackgroundColour = (pendingPay = false, paid = false): string => {
  if (paid) {
    return "bg-emerald-100";
  }
  return pendingPay ? "bg-indigo-100" : "bg-white";
};

const GetContactButton = (user: User, handler: (number: string) => void) => {
  const { name, phone, pendingPay, paid } = user;
  const backgroundColour = getBackgroundColour(pendingPay, paid);
  return (
    <button
      className={`w-full py-2.5 px-5 mx-1 my-1 text-sm font-medium focus:outline-none ${backgroundColour} rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-200`}
      onClick={() => {
        handler(phone);
      }}
    >
      <span className="text-blue-500">{name}</span>
    </button>
  );
};

const ContactList = ({ contactArray, contactHandler }: Props) => {
  return (
    <div className="overflow-y-auto my-4 mr-8 max-h-96 p-2">
      {contactArray.length > 0 ? (
        contactArray.map((user) => {
          return GetContactButton(user, contactHandler);
        })
      ) : (
        <span className="text-lg">🤔 No contacts currently available </span>
      )}
    </div>
  );
};

export default ContactList;
