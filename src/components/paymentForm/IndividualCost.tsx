import React, { useEffect } from "react";
import { MoneySymbol, CurrencyDisplay } from "../currencyUtil/currency";
import { Label } from "../shared/label";

interface Props {
  title: string;
  register: any;
  setValue: any;
  data: string;
}

const IndividualCost = ({ title, register, setValue, data }: Props) => {
  useEffect(() => {
    if (!data || data?.length === 0) {
      setValue("individualCost", "0.00");
    } else {
      setValue("individualCost", data[0]?.slice(1) ?? "0.00");
    }
  }, [data, title]);

  return (
    <div className="my-5">
      <Label id="price" title={`Individual price per person`} />
      <div className="relative mt-1 rounded-md shadow-sm">
        <MoneySymbol />
        <input
          type="number"
          step="0.01"
          id="price"
          className="block w-full rounded-md border-gray-300 pl-7 pr-12 sm:text-sm"
          defaultValue="0.00"
          pattern="^\d*(\.\d{0,2})?$"
          {...register("individualCost")}
        />
        <CurrencyDisplay />
      </div>
    </div>
  );
};

export default IndividualCost;
