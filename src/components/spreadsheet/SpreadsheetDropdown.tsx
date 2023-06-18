import React from "react";
import { useSpreadsheets } from "components/hooks/useSpreadsheets";

interface ISpreadsheetDropdown {
  register: any;
}

export const NO_SPREADSHEET_OPTION = "No booking selected";

export const SpreadsheetDropdown: React.FC<ISpreadsheetDropdown> = ({
  register,
}) => {
  const { spreadsheets, loading } = useSpreadsheets();

  const options = React.useMemo(() => {
    if (!spreadsheets) {
      return [];
    }

    return spreadsheets.map(({ title }, i: number) => {
      return (
        <option value={title} key={i}>
          {title}
        </option>
      );
    });
  }, [spreadsheets]);

  return (
    <div id="spreadsheet-dropdown" className="w-full md:w-64 mb-5">
      <select
        id="spreadsheet-name"
        defaultValue={""}
        disabled={loading}
        {...register("schoolName")}
        className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      >
        {loading ? (
          <option disabled value={""}>
            Loading previous bookings... ✨
          </option>
        ) : (
          <>
            <option value={""}>{NO_SPREADSHEET_OPTION}</option>
            {options}
          </>
        )}
      </select>
    </div>
  );
};
