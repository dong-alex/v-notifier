import React from "react";

export const MoneySymbol = () => {
  return (
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
      <span className="text-gray-500 sm:text-sm">$</span>
    </div>
  );
};

export const CurrencyDisplay = () => (
  <div className="absolute inset-y-0 right-0 flex items-center">
    <label htmlFor="currency" className="sr-only">
      Currency
    </label>
    <span
      id="currency"
      className="h-full rounded-md border-transparent bg-transparent py-2 pl-2 pr-3 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
    >
      CAD
    </span>
  </div>
);
