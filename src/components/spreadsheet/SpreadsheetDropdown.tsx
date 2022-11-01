import React from "react";
import { useSpreadsheets } from "components/hooks/useSpreadsheets";

interface ISpreadsheetDropdown {
  school: string;
  onSchoolChange: (school: string) => void;
}

export const SpreadsheetDropdown: React.FC<ISpreadsheetDropdown> = ({
  onSchoolChange,
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

  if (loading) {
    // TODO: update loader to be cute
    return <div>Loading school names ...</div>;
  }

  return (
    <div id="spreadsheet-dropdown" className="w-full md:w-64 mb-5">
      <select
        id="spreadsheet-name"
        onChange={(e) => onSchoolChange(e.target.value)}
        className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option selected>No school selected</option>
        {options}
      </select>
    </div>
  );
};
