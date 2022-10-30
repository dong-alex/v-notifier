import { z } from "zod";

export const User = z.object({
  name: z.string().nullish(),
  phone: z.string().nullish(),
});

type User = z.infer<typeof User>;

export const convertContacts = (data: any): User[] => {
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