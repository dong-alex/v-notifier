import React from "react";
import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";
import SectionHeader from "../SectionHeader";

interface ISpreadsheetDropdown {
  school: string;
  onSchoolChange: (school: string) => void;
}

export const SpreadsheetDropdown: React.FC<ISpreadsheetDropdown> = ({
  onSchoolChange,
}) => {
  const { data: sessionData } = useSession();

  const { data: valid } = trpc.useQuery(["checks.validUser"], {
    enabled: !!sessionData?.user,
  });

  const { data: sheetsData, isLoading: sheetsDataLoading } = trpc.useQuery(
    ["sheets.getSheetData"],
    {
      enabled: !!valid,
      select: (response): string[] => {
        return response.map(({ title }) => title);
      },
    },
  );

  const options = React.useMemo(() => {
    if (!sheetsData) {
      return [];
    }

    return sheetsData.map((sheetSchool: string, i: number) => {
      return (
        <option value={sheetSchool} key={i}>
          {sheetSchool}
        </option>
      );
    });
  }, [sheetsData]);

  const handleSchool = (s: string) => {
    onSchoolChange(s);
  };

  if (sheetsDataLoading) {
    // TODO: update loader to be cute
    return <div>Loading school names ...</div>;
  }

  return (
    <div id="spreadsheet-dropdown" className="my-5">
      <SectionHeader name={"Spreadsheet"} />
      <p>Select a specific booking to match all contacts who attended.</p>
      <select
        id="spreadsheet-name"
        onChange={(e) => handleSchool(e.target.value)}
        className="w-64 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option selected>
          No school selected
        </option>
        {options}
      </select>
    </div>
  );
};
