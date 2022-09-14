import { createProtectedRouter } from "./context";
import { z } from "zod";
import { getBaseUrl } from "../../pages/_app";

const User = z.object({
  name: z.string().nullish(),
  phone: z.string().nullish(),
});

type User = z.infer<typeof User>;

const convertContacts = (data: any): User[] => {
  const results: User[] = [];

  if (!data) {
    return [];
  }

  if (!data.forEach) {
    return [];
  }

  data.forEach((values: any[]) => {
    const [name, phone] = values;

    // ignore contacts without a number
    if (!phone) {
      return;
    }

    // TODO: handle formatting of the phone numbers

    results.push({
      name: name ?? "Unknown name",
      phone: phone ?? "Unknown phone #",
    });
  });

  return results;
};

export const sheetsRouter = createProtectedRouter().query("getContacts", {
  output: User.array(),
  resolve: async () => {
    try {
      const response = await fetch(`${getBaseUrl()}/api/sheets`);
      const data = await response.json();

      return convertContacts(data);
    } catch (err) {
      throw err;
    }
  },
});
