import React from "react";
import { MoneySymbol, CurrencyDisplay } from "./currencyUtil/currency";

interface Props {
  unitPrice: string;
}

const IndividualCost = ({ unitPrice }: Props) => (
  <div className="relative mt-1 rounded-md shadow-sm">
    <MoneySymbol />
    <input
      type="number"
      step="0.01"
      id="price"
      className="block w-full rounded-md border-gray-300 pl-7 pr-12 sm:text-sm"
      value={unitPrice}
      pattern="^\d*(\.\d{0,2})?$"
      placeholder="0.00"
      readOnly
    />
    <CurrencyDisplay />
  </div>
);

export default IndividualCost;
