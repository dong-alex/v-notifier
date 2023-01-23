import React from "react";
import { useSession } from "next-auth/react";
import { User } from "types/user";
import { trpc } from "utils/trpc";
import { NO_SPREADSHEET_OPTION } from "@components/spreadsheet/SpreadsheetDropdown";

interface IUseContacts {
  contacts: User[];
  loading: boolean;
  error: boolean;
}

export const useSchoolData = (schoolName: string, pendingPaySet: boolean) => {
  const { data: sessionData } = useSession();

  const { data: valid } = trpc.useQuery(["checks.validUser"], {
    enabled: !!sessionData?.user,
  });

  const { data: schoolData, isLoading: schoolDataLoading, isError: error, refetch } = trpc.useQuery(
    ["sheets.getSchoolData", schoolName],
    {
      enabled: !!valid && !!schoolName && schoolName !== NO_SPREADSHEET_OPTION
    },
  );

  return {
    schoolData,
    refetch,
    schoolDataLoading,
    error,
  };
};
