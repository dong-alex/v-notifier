import { z } from "zod";

export const User = z.object({
  name: z.string(),
  phone: z.string(),
});

type User = z.infer<typeof User>;

export const convertContacts = (data: Array<string[]>): User[] => {
  const results: User[] = [];

  if (!data) {
    return [];
  }

  data?.forEach((values: Array<string>) => {
    const [name, phone] = values;

    if (!name) {
      return;
    }

    // TODO: handle formatting of the phone numbers
    results.push({
      name: name,
      phone: phone || "",
    });
  });

  return results;
};
