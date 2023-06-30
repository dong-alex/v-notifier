import { NextApiResponse, NextApiRequest } from "next";
import { google } from "googleapis";
import { env } from "../../../../env/server.mjs";

const addAttendingRows = (req: NextApiRequest, res: NextApiResponse) => {
  const { names, schoolName } = req.body;

  const newNames = JSON.parse(names) as string[];

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

      console.log("Attempting to add additional rows");

      const values: Array<[string, boolean, boolean]> = newNames.map((name) => {
        return [
          name, true, true,
        ];
      });

      await sheetsAPI.spreadsheets.values.append({
        spreadsheetId: env.GOOGLE_SHEETS_ID,
        valueInputOption: "USER_ENTERED",
        range: `${schoolName}!A7:F7`,
        requestBody: {
          range: `${schoolName}!A7:F7`,
          majorDimension: "ROWS",
          values
        }
      });

      return res.status(200).send({});
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

export default addAttendingRows;
