import React from "react";

interface TestNumberCheckboxProps {
  register: any;
}

export const TEST_RECIPIENT = "780-850-8369";

export const TestNumberCheckbox = ({ register }: TestNumberCheckboxProps) => (
  <div className="flex">
    <input type="checkbox" className="mr-2" {...register("useTestNumber")} />
    <span className="leading-none text-sm">
      Use Test Number: {TEST_RECIPIENT}
    </span>
  </div>
);
