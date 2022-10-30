import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../../env/server.mjs";

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
        range: `${req.query?.schoolName}!A7:F`,
      };

      console.log("Attempting to retrieve school sheet values");
      const response = await sheetsAPI.spreadsheets.values.get(opt);

      // initial row
      let row = 7;

      const r = response.data.values?.map((v) => {
        return [row++, ...v];
      });

      res.status(200).json(r);

      return;
    });
  } catch (err) {
    res.status(500).json(err);

    return;
  }
};

export default getSchoolData;
