import { z } from "zod";
import { getBaseUrl } from "../../pages/_app";
import { createProtectedRouter } from "./context";

export const messagesRouter = createProtectedRouter().mutation("send", {
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
});
