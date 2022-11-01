import React from "react";

interface TestNumberCheckboxProps {
  useTestNumber: boolean;
  handleTestNumberChange: () => void;
}

export const TEST_RECIPIENT = "780-850-8369";

export const TestNumberCheckbox = ({
  useTestNumber,
  handleTestNumberChange,
}: TestNumberCheckboxProps) => (
  <div className="flex">
    <input
      type={"checkbox"}
      checked={useTestNumber}
      onChange={handleTestNumberChange}
      className="mr-2"
    />
    <span className="leading-none text-sm">
      Use Test Number: {TEST_RECIPIENT}
    </span>
  </div>
);
