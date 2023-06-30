import { z } from "zod";
import { createProtectedRouter } from "./context";
import { getBaseUrl } from "../../pages/_app";
import { convertSheetNames } from "../util/convertSheetNames";
import { convertContacts, User } from "../util/convertContacts";
import { convertSchoolData, convertFullAttendanceData } from "../util/convertSchoolData";
import { convertStringToBoolean } from "server/util/convertStringToBoolean";

export const sheetsRouter = createProtectedRouter()
  .query("getContacts", {
    output: User.array(),
    resolve: async () => {
      try {
        const response = await fetch(`${getBaseUrl()}/api/sheets`);
        const data = await response.json();

        return convertContacts(data);
      } catch (err) {
        throw `Error trying to getContacts: ${err}`;
      }
    },
  })
  .query("getSheetData", {
    // should match the typing specified in the api
    output: z.array(
      z.object({
        sheetId: z.string(),
        title: z.string(),
      }),
    ),
    resolve: async () => {
      try {
        const response = await fetch(`${getBaseUrl()}/api/sheet-data`);
        const data = await response.json();

        return convertSheetNames(data);
      } catch (err) {
        throw `Error trying to getSheetData: ${err}`;
      }
    },
  })
  .query("getSchoolData", {
    input: z.string(),
    // should match the typing specified in the api
    resolve: async ({ input }: { input: string }) => {
      try {
        const response = await fetch(
          `${getBaseUrl()}/api/school-data?schoolName=${input}`,
        );
        const { attendanceData, costData, fullAttendanceData, attendanceLock } = await response.json();

        const bookingAttendance = convertSchoolData(attendanceData);
        const bookingCost = costData.pop() || [];
        const bookingFullAttendance = convertFullAttendanceData(bookingAttendance?.[1], fullAttendanceData)
        const bookingAttendanceLock = convertStringToBoolean(attendanceLock.pop())

        return {
          bookingAttendance, 
          bookingCost,
          bookingFullAttendance,
          bookingAttendanceLock
        };
      } catch (err) {
        throw `Error trying to getSchoolData: ${err}`;
      }
    },
  })
  .mutation("addAttendingRows", {
    input: z.object({
      names: z.string(), // names to add to end of sheet
      schoolName: z.string(), // name for the specific booking
    }),
    resolve: async ({ input }) => {
      try {
        const { names, schoolName } = input;
        const response = await fetch(
          `${getBaseUrl()}/api/sheet-data/add-attending-rows`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              names,
              schoolName,
            }),
          },
        );

        const data = await response.json();

        return data;
      } catch (err) {
        throw `Error trying to add additional rows: ${err}`;
      }
    },
  })
  .mutation("setPendingPay", {
    input: z.object({
      rows: z.string(), // all row numbers to set the pending pay to 'true'
      sheetId: z.string(), // sheet id for the specific booking
    }),
    resolve: async ({ input }) => {
      try {
        const { rows, sheetId } = input;

        // todo: handle proper method for pending pay if more endpoints required to edit sheet
        const response = await fetch(
          `${getBaseUrl()}/api/sheet-data/pending-pay`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              rows,
              sheetId,
            }),
          },
        );

        const data = await response.json();

        return data;
      } catch (err) {
        throw `Error trying to set pending payment: ${err}`;
      }
    },
  })
  .mutation("setPaid", {
    input: z.object({
      rows: z.string(), // all row numbers to set the pending pay to 'true'
      sheetId: z.string(), // sheet id for the specific booking
    }),
    resolve: async ({ input }) => {
      try {
        const { rows, sheetId } = input;

        // todo: handle proper method for pending pay if more endpoints required to edit sheet
        const response = await fetch(`${getBaseUrl()}/api/sheet-data/paid`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rows,
            sheetId,
          }),
        });

        const data = await response.json();

        return data;
      } catch (err) {
        throw `Error trying to set paid status: ${err}`;
      }
    },
  });
