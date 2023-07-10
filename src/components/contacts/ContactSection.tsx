import React from "react";
import { User } from "types/user";
import ContactList from "./ContactList";
import SectionWrapper from "@components/shared/SectionWrapper";
import Loader from "@components/shared/Loader";

interface Props {
  name: string;
  contactArray: Array<User>;
  contactHandler: (name: string, phone?: string) => void;
  clearAllHandler?: () => void;
  isLoading?: boolean;
  type?: "all" | "selected"
}

const ContactSection = ({
  name,
  contactArray,
  contactHandler,
  clearAllHandler,
  isLoading,
  type = 'all'
}: Props) => {
  return (
    <SectionWrapper name={name}>
      {isLoading && type != "selected" ? <div className="my-8"><Loader /></div> : 
        <ContactList
        contactArray={contactArray}
        contactHandler={contactHandler}
        type={type} />
      }
      {clearAllHandler && contactArray.length > 0 && (
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={() => clearAllHandler()}
            className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2"
          >
            Clear all
          </button>
        </div>
      )}
    </SectionWrapper>
  );
};

export default ContactSection;
