import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Logo from "@components/nav/Logo";
import { XPADDING } from "pages";

const Nav = () => {
  const { data: sessionData } = useSession();

  return (
    <nav className={`bg-white border-gray-200 py-2.5 ${XPADDING} rounded border-y`}>
      <div className="flex justify-between items-center">
        <Logo />
        <div>
          {sessionData && (
              <span className="mr-4">{`👋 Welcome ${sessionData.user?.name || sessionData.user?.email}!`}</span>
            )}
          <button
            type="button"
            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            onClick={sessionData ? () => signOut() : () => signIn()}
          >
            {sessionData ? "Sign out" : "Sign in"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
