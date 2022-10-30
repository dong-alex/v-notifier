import React from "react";
import SectionHeader from "../SectionHeader";
import { User } from "types/user";
import ContactList from "./ContactList";

interface Props {
  name: string;
  contactArray: Array<User>;
  contactHandler: (number: string) => void;
  clearAllHandler?: () => void;
  sentContacts: Set<string>;
}

const ContactSection = ({
  name,
  contactArray,
  contactHandler,
  clearAllHandler,
  sentContacts,
}: Props) => {
  return (
    <section id={name} className="w-96">
      <SectionHeader name={name} />
      <ContactList
        contactArray={contactArray}
        contactHandler={contactHandler}
        sentContacts={sentContacts}
      />
      {clearAllHandler && contactArray.length > 0 && (
        <div className="flex justify-end mr-8">
          <button
            type="button"
            onClick={() => clearAllHandler()}
            className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
          >
            Clear all
          </button>
        </div>
      )}
    </section>
  );
};

export default ContactSection;
