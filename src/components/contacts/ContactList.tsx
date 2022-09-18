import React, { useCallback } from 'react';

interface Props {
  contactArray: Array<{name: string, phone: string}>;
  contactHandler: (number: string) => void;
}

const GetContactButton = (name: string, phone: string, handler: (number: string) => void) => {
  return (
    <button
      className="w-full py-2.5 px-5 mx-1 my-1 text-sm font-medium focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      onClick={() => {
        handler(phone);
      }}
    >
      <span className="text-blue-500">{name}</span>
    </button>
  );
}


const ContactList = ({ contactArray, contactHandler }: Props) => {
  return (
    <div className="overflow-y-auto my-4 mr-8 max-h-96 p-2">
      {contactArray.map(({ name, phone }, i) => {
        return GetContactButton(name, phone, contactHandler);
      })}
    </div>
  )
};

export default ContactList