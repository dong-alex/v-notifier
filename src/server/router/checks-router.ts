import { AUTHORIZED_USERS, createRouter } from "./context";

export const checksRouter = createRouter()
  .query("validUser", {
    resolve: ({ ctx }) => {
      const email: string = ctx.session.user?.email ?? ""

      if (email === "") {
        return false;
      }

      return AUTHORIZED_USERS.has(email)
    }
  })