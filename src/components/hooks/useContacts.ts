import React from "react";
import { useSession } from "next-auth/react";
import { User } from "types/user";
import { trpc } from "utils/trpc";
import { NO_SPREADSHEET_OPTION } from "@components/subheader/SpreadsheetDropdown";

interface IUseContacts {
  contacts: User[];
  loading: boolean;
  error: boolean;
}

export const useContacts = (
  schoolName: string,
  pendingPaySet: boolean,
): IUseContacts => {
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
    const nameSet = new Set()

    contactsData.forEach(({ name, phone }) => {
      let row;
      let pendingPay;
      let paid;

      if (!name) {
        return;
      }

      if (schoolData) {
        const [paymentData, attendance] = schoolData.bookingAttendance;
        if (!attendance.has(name)) {
          return;
        }

        if (paymentData) {
          pendingPay = paymentData[name]?.pendingPay;
          paid = paymentData[name]?.paid;
          row = paymentData[name]?.row;
        }
      }

      nameSet.add(name)

      result.push({
        name,
        phone,
        pendingPay,
        paid,
        row,
      });
    });

    if (schoolData) {
      const [paymentData, ] = schoolData.bookingAttendance;

      for (const name in paymentData) {
        if (name && !nameSet.has(name)) {
          result.push({
            name,
            paid: paymentData[name]?.paid,
            row: paymentData[name]?.row,
          })
        }
      }
    }

    return result;
  }, [contactsData, schoolData, pendingPaySet]);

  return {
    contacts,
    loading,
    error,
  };
};
