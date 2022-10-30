import { NextApiResponse, NextApiRequest } from "next";
import { google } from "googleapis";
import { env } from "../../../../../env/server.mjs";

// todo: pull all of the sheet config into one file and adjust on per sheet basis if required
const PENDING_PAY_COLUMN_ID = "E";

const setPendingPay = (req: NextApiRequest, res: NextApiResponse) => {
  console.log("looking at query values", req.query);

  try {
    const { row, name } = req.query;

    const cell = `${PENDING_PAY_COLUMN_ID}${row}`;

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

      console.log("Attempting to set pending pay cell");
      // todo: update all at once with all users that have been set
      await sheetsAPI.spreadsheets.batchUpdate({
        spreadsheetId: env.GOOGLE_SHEETS_ID,
        requestBody: {
          requests: [
            {
              updateCells: {
                rows: [
                  {
                    values: [
                      {
                        dataValidation: {
                          condition: {
                            type: "BOOLEAN",
                          },
                        },
                        userEnteredValue: {
                          boolValue: true,
                        },
                      },
                    ],
                  },
                ],
                fields: "userEnteredValue",
                start: {
                  rowIndex: 7, // inclusive
                  columnIndex: 4, // exclusive
                  sheetId: 1008040339, // st jeanne darc 10/28/22
                },
              },
            },
          ],
        },
      });

      console.log("Successfully set pending pay for contact:", name);

      res.status(200).json({});

      return;
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

export default setPendingPay;
