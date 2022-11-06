import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../../env/server.mjs";

const getContacts = async (req: NextApiRequest, res: NextApiResponse) => {
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

      // TODO: take in name of sheet and range
      const opt = {
        spreadsheetId: env.GOOGLE_SHEETS_ID,
        range: "Contacts and Info!A4:B",
      };

      console.log("Attempting to retrieve sheet values");
      const response = await sheetsAPI.spreadsheets.values.get(opt);

      console.log("Sheet values obtained");
      return res.status(200).send(response.data.values);
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

export default getContacts;
