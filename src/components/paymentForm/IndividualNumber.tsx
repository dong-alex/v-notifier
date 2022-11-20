import React from "react";
import { Label } from "../shared/label";

interface Props {
  register: any;
}

const IndividualNumber = ({ register }: Props) => {
  return (
    <div className="my-5">
      <Label id="individual-number" title={`Number of individuals`} />
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          type="number"
          step="1"
          id="individual-number"
          className="block w-full rounded-md border-gray-300 pl-7 pr-12 sm:text-sm"
          defaultValue="1"
          {...register("individualNumber")}
        />
      </div>
    </div>
  );
};

export default IndividualNumber;
