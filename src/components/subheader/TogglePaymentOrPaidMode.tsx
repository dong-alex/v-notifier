import React, { Dispatch, SetStateAction } from "react";

interface Props {
  isPaymentMode: boolean;
  setPaymentMode: Dispatch<SetStateAction<boolean>>;
  handleClearAll: () => void;
}

const TogglePaymentOrPaidMode = ({
  isPaymentMode,
  setPaymentMode,
  handleClearAll,
}: Props) => {
  const handleToggleMode = () => {
    setPaymentMode(!isPaymentMode);
    handleClearAll();
  };

  return (
    <label className="w-2/5 relative inline-flex cursor-pointer mt-2.5 ml-4">
      <input
        onClick={handleToggleMode}
        type="checkbox"
        checked={!isPaymentMode}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
      <span className="ml-3 text-xl font-medium text-gray-900 dark:text-gray-300">
        {"💸"}
      </span>
    </label>
  );
};

export default TogglePaymentOrPaidMode;
