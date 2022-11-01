import React from "react";
import { MoneySymbol, CurrencyDisplay } from "./currencyUtil/currency";
import { Label } from "./shared/label";

interface Props {
  unitPrice: string;
  individualCount: number;
}

const IndividualCost = ({ unitPrice, individualCount }: Props) => (
  <div className="my-5">
    <Label
      id="price"
      title={`Individual price for ${individualCount} persons`}
    />
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
  </div>
);

export default IndividualCost;
