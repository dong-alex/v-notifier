import { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../../env/server.mjs";
import twilio from "twilio";

const getMessages = async (_: NextApiRequest, res: NextApiResponse) => {
  const client = twilio(env.TWILIO_SID, env.TWILIO_AUTH_TOKEN);

  const response = await client.messages.list();

  const messages = response.map((instance) => {
    return {
      from: instance.from,
      body: instance.body,
    };
  });

  return res.status(200).send(messages);
};

export default getMessages;
