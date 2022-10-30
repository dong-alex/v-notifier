import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../../env/server.mjs";

const getSheetData = async (req: NextApiRequest, res: NextApiResponse) => {
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

      console.log("Attempting to retrieve sheet data");
      const response = await sheetsAPI.spreadsheets.get({
        spreadsheetId: env.GOOGLE_SHEETS_ID,
      });

      console.log("Sheet data obtained");

      res.status(200).json(response?.data?.sheets);

      return;
    });
  } catch (err) {
    res.status(500).json(err);

    return;
  }
};

export default getSheetData;
