import React, { Dispatch, SetStateAction } from "react";

interface Props {
  isPaymentMode: boolean;
  setPaymentMode: Dispatch<SetStateAction<boolean>>;
  handleClearAll: () => void;
}

const TogglePaymentOrPaidMode = ({ isPaymentMode, setPaymentMode, handleClearAll }: Props) => {

  const handleToggleMode = () => {
    setPaymentMode(!isPaymentMode)
    handleClearAll();
  }

  const toggleDescription = isPaymentMode ? "Payment Mode" : "Set Paid Mode"

  return (
    <label className="w-3/5 relative inline-flex cursor-pointer mt-2.5 ml-8">
      <input onClick={handleToggleMode} type="checkbox" checked={isPaymentMode} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{toggleDescription}</span>
    </label>
  );
};

export default TogglePaymentOrPaidMode;
