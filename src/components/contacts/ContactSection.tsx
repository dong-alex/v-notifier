import React from "react";
import { User } from "types/user";
import ContactList from "./ContactList";
import SectionWrapper from "@components/shared/SectionWrapper";

interface Props {
  name: string;
  contactArray: Array<User>;
  contactHandler: (number: string) => void;
  clearAllHandler?: () => void;
}

const ContactSection = ({
  name,
  contactArray,
  contactHandler,
  clearAllHandler,
}: Props) => {
  return (
    <SectionWrapper name={name}>
      <ContactList
        contactArray={contactArray}
        contactHandler={contactHandler}
      />
      {clearAllHandler && contactArray.length > 0 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => clearAllHandler()}
            className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
          >
            Clear all
          </button>
        </div>
      )}
    </SectionWrapper>
  );
};

export default ContactSection;
