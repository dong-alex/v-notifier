import { convertStringToBoolean } from "./convertStringToBoolean";

interface SchoolData {
  name: string;
  asked?: boolean;
  attending?: boolean;
  unableToAttend?: boolean;
  pendingPay: boolean;
  paid: boolean;
}

interface SchoolDatum {
  [name: string]: {
    row: string;
    pendingPay: boolean;
    paid: boolean;
  };
}

export const convertSchoolData = (
  data: Array<string[]>,
): [SchoolDatum, Set<string>] => {
  const results: SchoolDatum = {};
  // TODO: no more attending set, use object.keys in auth showcase instead?
  const attendingSet: Set<string> = new Set();

  if (!data || data?.length < 1) {
    return [results, attendingSet];
  }

  data.forEach((row: string[]) => {
    const [rowNumber, name, , attending, , pendingPay, paid] = row;

    if (!convertStringToBoolean(attending)) {
      return;
    }

    if (name) {
      attendingSet.add(name);

      results[name] = {
        row: rowNumber ?? "no row",
        pendingPay: convertStringToBoolean(pendingPay),
        paid: convertStringToBoolean(paid),
      };
    }
  });

  return [results, attendingSet];
};

export const convertFullAttendanceData = (
  bookingAttendanceData: Set<string>,
  fullAttendanceData: Array<string[]>,
): String[] => {
  const fullAttendingList: Array<string> = []

  if (!fullAttendanceData || fullAttendanceData?.length < 1) {
    return fullAttendingList;
  }

  fullAttendanceData.forEach((row: string[]) => {
    row.forEach((name) => {
      if (!bookingAttendanceData.has(name) && name.length > 0) {
        fullAttendingList.push(name)
      }
    })
  });

  return fullAttendingList;
};