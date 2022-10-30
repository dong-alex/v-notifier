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
    pendingPay: boolean;
    paid: boolean;
  }
}

const convertStringToBoolean = (boolString: string) => {
  return boolString === "TRUE" ? true : false
}

export const convertSchoolData = (data: Array<string[]>): [SchoolDatum, Set<string>] => {
  const results: SchoolDatum = {};
  // TODO: no more attending set, use object.keys in auth showcase instead? 
  const attendingSet: Set<string> = new Set()

  if (!data || data?.length < 1) {
    return [results, attendingSet];
  }

  data.forEach((row: string[]) => {
    const [name, asked, attending, unableToAttend, pendingPay, paid] = row;

    if (!convertStringToBoolean(attending)) {
      return;
    }

    attendingSet.add(name)

    results[name] = {
      pendingPay: convertStringToBoolean(pendingPay),
      paid: convertStringToBoolean(paid),
    };
  });

  return [results, attendingSet];
};