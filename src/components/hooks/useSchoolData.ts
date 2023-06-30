
import { useSession } from "next-auth/react";
import { trpc } from "utils/trpc";
import { NO_SPREADSHEET_OPTION } from "@components/subheader/SpreadsheetDropdown";

export const useSchoolData = (schoolName: string) => {
  const { data: sessionData } = useSession();

  const { data: valid } = trpc.useQuery(["checks.validUser"], {
    enabled: !!sessionData?.user,
  });

  const {
    data: schoolData,
    isLoading: schoolDataLoading,
    isError: error,
    refetch,
  } = trpc.useQuery(["sheets.getSchoolData", schoolName], {
    enabled: !!valid && !!schoolName && schoolName !== NO_SPREADSHEET_OPTION,
  });

  return {
    schoolData,
    refetch,
    schoolDataLoading,
    error,
  };
};
