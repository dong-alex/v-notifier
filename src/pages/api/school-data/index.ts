import { google } from "googleapis";
import spreadsheetConfig from "../../../config/spreadsheet";
import { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../../env/server.mjs";

enum BOOKING_VALUE_RANGE {
  ATTENDANCE = 0,
  COST = 1, 
  FULL_ATTENDANCE = 2,
  ATTENDANCE_LOCK = 3,
}

const getSchoolData = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = new google.auth.JWT(
      env.SHEETS_READER_ID,
      undefined,
      env.SHEETS_READER_SECRET,
      ["https://www.googleapis.com/auth/spreadsheets"],
    );

    client.authorize(async (err, _) => {
      if (err) {
        console.error("Error occurred in authorization", err);
        return res.status(400).send(JSON.stringify({ error: true }));
      }

      const sheetsAPI = google.sheets({ version: "v4", auth: client });

      const opt = {
        spreadsheetId: env.GOOGLE_SHEETS_ID,
        ranges: [
          `${req.query?.schoolName}!A7:F`, // names
          `${req.query?.schoolName}!J6`, // cost per person
          `${req.query?.schoolName}!I16:M24`, // player assignment
          `${req.query?.schoolName}!M1`, // attendance lock
        ],
      };

      console.log("Attempting to retrieve school sheet values");
      const response = await sheetsAPI.spreadsheets.values.batchGet(opt);

      // initial row (header)
      let row = spreadsheetConfig.INITIAL_ROW;

      const valueRangeData = response?.data?.valueRanges;

      const attendanceData = valueRangeData?.[
        BOOKING_VALUE_RANGE.ATTENDANCE
      ]?.values?.map((v) => {
        return [row++, ...v];
      });

      const costData = valueRangeData?.[BOOKING_VALUE_RANGE.COST]?.values;

      const fullAttendanceData = valueRangeData?.[BOOKING_VALUE_RANGE.FULL_ATTENDANCE]?.values

      const attendanceLock = valueRangeData?.[BOOKING_VALUE_RANGE.ATTENDANCE_LOCK]?.values;

      return res.status(200).send({
        attendanceData,
        costData,
        fullAttendanceData,
        attendanceLock,
      });
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

export default getSchoolData;
