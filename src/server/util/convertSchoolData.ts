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

const convertStringToBoolean = (boolString = "FALSE") => {
  return boolString === "TRUE" ? true : false;
};

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
    const [
      rowNumber,
      name,
      ,
      attending,
      ,
      pendingPay,
      paid,
    ] = row;

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
