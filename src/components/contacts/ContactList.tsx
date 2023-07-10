import React from "react";
import { User } from "types/user";

interface Props {
  contactArray: Array<User>;
  contactHandler: (name: string, phone?: string) => void;
  type: "selected" | "all"
}

const getBackgroundColour = (pendingPay = false, paid = false): string => {
  if (paid) {
    return "bg-emerald-100";
  }
  return pendingPay ? "bg-indigo-100" : "bg-white";
};

const GetContactButton = (
  user: User,
  handler: (name: string, phone?: string) => void,
) => {
  const { name, phone, pendingPay, paid } = user;
  const backgroundColour = getBackgroundColour(pendingPay, paid);
  return (
    <button
      key={name}
      className={`w-full py-2.5 my-1 text-sm font-medium focus:outline-none ${backgroundColour} rounded-lg border border-gray-200 hover:border-sky-400 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-200`}
      onClick={() => {
        handler(name, phone);
      }}
    >
      <span className="text-blue-500">{name}</span>
    </button>
  );
};

const ContactList = ({ contactArray, contactHandler, type }: Props) => {
  return (
    <div className="overflow-y-auto overflow-x-hidden max-h-96">
      {contactArray.length > 0 ? (
        contactArray.map((user) => {
          return GetContactButton(user, contactHandler);
        })
      ) : (
        <span className="text-lg flex justify-center text-purple-400">{`No contacts ${type == "selected" ? 'selected' : 'available'}` }</span>
      )}
    </div>
  );
};

export default ContactList;
