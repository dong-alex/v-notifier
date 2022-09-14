import { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../../env/server.mjs";
import twilio from "twilio";

const sendMessage = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = twilio(env.TWILIO_SID, env.TWILIO_AUTH_TOKEN);
  const { phone, message } = req.body;

  try {
    const response = await client.messages.create({
      body: message,
      from: "+18647138420",
      to: phone,
    });

    const data = response.toJSON();

    res.status(200).send(data);
  } catch (err) {
    res.status(500).send({
      error: err,
    });
  }
};

export default sendMessage;
