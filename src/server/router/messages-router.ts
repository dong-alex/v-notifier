import { z } from "zod";
import { getBaseUrl } from "../../pages/_app";
import { createProtectedRouter } from "./context";

interface MessageBody {
  from: string;
  body: string;
}

const convertMessages = (data: any): MessageBody[] => {
  if (!data) {
    return [];
  }

  if (!data.forEach) {
    return [];
  }

  const results: MessageBody[] = [];

  data.forEach((values: any) => {
    const { from, body } = values;

    if (from === "+18647138420") {
      return;
    }

    results.push({
      from: from ?? "Unknown receiver",
      body: body ?? "Unknown Body",
    });
  });

  return results;
};

export const messagesRouter = createProtectedRouter()
  .mutation("send", {
    input: z.object({
      phone: z.string(),
      message: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      try {
        await fetch(`${getBaseUrl()}/api/message`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: input.phone,
            message: input.message,
          }),
        });
        return {
          message: input.message,
          error: null,
        };
      } catch (err) {
        return {
          message: input.message,
          error: err,
        };
      }
    },
  })
  .query("getMessages", {
    output: z.array(
      z.object({
        from: z.string(),
        body: z.string(),
      }),
    ),
    resolve: async () => {
      const response = await fetch(`${getBaseUrl()}/api/messages`);
      const data = await response.json();

      return convertMessages(data);
    },
  });
