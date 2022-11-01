import React, { LegacyRef } from "react";
import { Label } from "@components/shared/label";

interface TextMessageBoxProps {
  textareaRef: LegacyRef<HTMLTextAreaElement>;
  messagePlaceholder: string;
}

export const TextMessageBox = ({
  textareaRef,
  messagePlaceholder,
}: TextMessageBoxProps) => (
  <div className="flex flex-col">
    <div className="mb-3">
      <Label id="text-message" title="Text Message" />
      <textarea
        className="
form-control
block
w-full
px-3
py-1.5
text-base
font-normal
text-gray-700
bg-white bg-clip-padding
border border-solid border-gray-300
rounded
transition
ease-in-out
m-0
focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
"
        id="exampleFormControlTextarea1"
        rows={3}
        ref={textareaRef}
        defaultValue={messagePlaceholder}
      />
    </div>
  </div>
);
