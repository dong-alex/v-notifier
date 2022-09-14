import { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../../env/server.mjs";
import twilio from "twilio";

const sendMessage = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = twilio(env.TWILIO_SID, env.TWILIO_AUTH_TOKEN);
  const { phone, message } = req.body;

  try {
    const phoneList = JSON.parse(phone) as string[];

    const requests = phoneList.map(async (number) => {
      await client.messages.create({
        body: message,
        from: "+18647138420",
        to: number,
      });
    });

    await Promise.all(requests);

    return res.status(200).send({});
  } catch (err) {
    return res.status(500).send({
      error: err,
    });
  }
};

export default sendMessage;
