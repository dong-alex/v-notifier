import React, { useEffect } from "react";
import { trpc } from "utils/trpc";
import { MoneySymbol, CurrencyDisplay } from "../currencyUtil/currency";
import { Label } from "../shared/label";

interface Props {
  title?: string;
  register: any;
  setValue: any;
}

const IndividualCost = ({ title, register, setValue }: Props) => {
  const { data, error } = trpc.useQuery(["sheets.getUnitCost", title], {
    enabled: !!title,
  });

  useEffect(() => {
    if (error || !data || data?.length === 0) {
      setValue('individualCost', "0.00");
    } else {
      setValue('individualCost', data[0]?.slice(1) ?? "0.00");
    }
  }, [data, title, error]);
  
  return (
  <div className="my-5">
    <Label
      id="price"
      title={`Individual price per person`}
    />
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
)};

export default IndividualCost;
