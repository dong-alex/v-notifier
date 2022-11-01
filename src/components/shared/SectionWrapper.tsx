import React, { ReactNode } from "react";
import SectionHeader from "@components/SectionHeader";

interface SectionWrapperProps {
  name: string;
  maxMdWidth?: string;
  children: ReactNode;
}

const SectionWrapper = ({
  name,
  children,
  maxMdWidth = "md:w-96",
}: SectionWrapperProps) => (
  <section id={name} className={`w-full ${maxMdWidth} mb-8 mr-8`}>
    <SectionHeader name={name} />
    {children}
  </section>
);

export default SectionWrapper;
