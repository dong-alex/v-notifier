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

export const useContacts = (schoolName: string, pendingPaySet: boolean): IUseContacts => {
  const { data: sessionData } = useSession();

  const { data: valid } = trpc.useQuery(["checks.validUser"], {
    enabled: !!sessionData?.user,
  });

  const {
    data: contactsData,
    isLoading: loading,
    isError: error,
  } = trpc.useQuery(["sheets.getContacts"], {
    enabled: !!valid,
  });

  const { data: schoolData } = trpc.useQuery(
    ["sheets.getSchoolData", schoolName],
    {
      enabled: !!valid && !!schoolName && schoolName !== NO_SPREADSHEET_OPTION,
    },
  );

  const contacts = React.useMemo(() => {
    if (!contactsData) {
      return [];
    }

    const result: User[] = [];

    contactsData.forEach(({ name, phone }) => {
      let row;
      let pendingPay;
      let paid;

      if (!phone || !name) {
        return;
      }

      if (schoolData) {
        const [paymentData, attendance] = schoolData;
        if (!attendance.has(name)) {
          return;
        }

        if (paymentData) {
          pendingPay = paymentData[name]?.pendingPay;
          paid = paymentData[name]?.paid;
          row = paymentData[name]?.row;
        }
      }

      result.push({
        name,
        phone,
        pendingPay,
        paid,
        row,
      });
    });

    return result;
  }, [contactsData, schoolData, pendingPaySet]);

  return {
    contacts,
    loading,
    error,
  };
};
