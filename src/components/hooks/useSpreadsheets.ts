import React from "react";
import { useSession } from "next-auth/react";
import { trpc } from "utils/trpc";

export const useSpreadsheets = () => {
  const { data: sessionData } = useSession();

  const { data: valid } = trpc.useQuery(["checks.validUser"], {
    enabled: !!sessionData?.user,
  });

  const {
    data: sheetsData,
    isLoading: loading,
    isError: error,
  } = trpc.useQuery(["sheets.getSheetData"], {
    enabled: !!valid,
  });

  const spreadsheets = React.useMemo(() => {
    return sheetsData ?? [];
  }, [sheetsData]);

  return {
    spreadsheets,
    loading,
    error,
  };
};
