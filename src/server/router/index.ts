// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { checksRouter } from "./checks-router";
import { sheetsRouter } from "./sheets-router";
import { messagesRouter } from "./messages-router";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("checks.", checksRouter)
  .merge("sheets.", sheetsRouter)
  .merge("messages.", messagesRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
