import React from 'react';
import SectionHeader from "../SectionHeader"
import ContactList from "../contacts/ContactList"

interface Props {
  name: string;
  contactArray: Array<{name: string, phone: string}>;
  contactHandler: (number: string) => void;
}

const ContactSection = ({ name, contactArray, contactHandler }: Props) => {
  return (
    <section id={name} className="w-96">
      <SectionHeader name={name} />
      <ContactList contactArray={contactArray} contactHandler={contactHandler} />
    </section>
  )
};

export default ContactSection