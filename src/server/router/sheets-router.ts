import { z } from "zod";
import { createProtectedRouter } from "./context";
import { getBaseUrl } from "../../pages/_app";
import { convertSheetNames } from "../util/convertSheetNames";
import { convertContacts, User } from "../util/convertContacts";
import { convertSchoolData } from "../util/convertSchoolData";

export const sheetsRouter = createProtectedRouter()
  .query("getContacts", {
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
  })
  .query("getSheetData", {
    resolve: async () => {
      try {
        const response = await fetch(`${getBaseUrl()}/api/sheet-data`);
        const data = await response.json();

        return convertSheetNames(data);
      } catch (err) {
        throw err;
      }
    },
  })
  .query("getSchoolData", {
    input: z.string(),
    resolve: async ({ input }: { input: string }) => {
      try {
        const response = await fetch(
          `${getBaseUrl()}/api/school-data?schoolName=${input}`,
        );
        const data = await response.json();

        return convertSchoolData(data);
      } catch (err) {
        throw err;
      }
    },
  })
  .mutation("setPendingPay", {
    input: z.object({
      name: z.string(),
      row: z.string(),
    }),
    resolve: async ({ input }) => {
      try {
        const { name, row } = input;

        // todo: handle proper method for pending pay if more endpoints required to edit sheet
        const response = await fetch(
          `${getBaseUrl()}/api/sheet-data/${name}/${row}`,
        );

        const data = await response.json();

        return data;
      } catch (err) {
        throw err;
      }
    },
  });
