import React from "react";

interface SubmitButtonProps {
  contactsSelected: boolean;
  useTestNumber: boolean;
}

export const SubmitButton = ({
  contactsSelected,
  useTestNumber,
}: SubmitButtonProps) => (
  <button
    className="border-2 border-indigo-400 py-2 px-4 mt-4 rounded-3xl shadow-lg min-w-full disabled:opacity-50"
    type="submit"
    disabled={!contactsSelected && !useTestNumber}
  >
    Send
  </button>
);