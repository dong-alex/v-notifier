import { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../../env/server.mjs";
import twilio from "twilio";

const sendMessage = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = twilio(env.TWILIO_SID, env.TWILIO_AUTH_TOKEN);
  const { phone, message } = req.body;

  try {
    const phoneList = JSON.parse(phone) as string[];

    phoneList.forEach(async (number) => {
      await client.messages.create({
        body: message,
        from: "+18647138420",
        to: number,
      });
    });

    return res.status(200);
  } catch (err) {
    return res.status(500).send({
      error: err,
    });
  }
};

export default sendMessage;
