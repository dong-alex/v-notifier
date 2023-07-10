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
  maxMdWidth = "md:w-80",
}: SectionWrapperProps) => (
  <section id={name} className={`w-full ${maxMdWidth}`}>
    <SectionHeader name={name} />
    {children}
  </section>
);

export default SectionWrapper;
