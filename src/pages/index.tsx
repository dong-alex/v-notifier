import { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import AuthShowcase from "./AuthShowcase";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>V Notifier</title>
        <link rel="icon" href="/volleyball-emoji.png" />
      </Head>
      <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900 border-y dark:bg-gray-800 dark:border-gray-600">
        <div className="container flex flex-wrap justify-between items-center mx-auto">
          <div className="flex items-center">
            <img src="/volleyball-emoji.png" className="mr-3 h-6 sm:h-9" alt="Volleyball Emoji" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"><span className="text-purple-300">V</span> Notifier</span>
          </div>
         <div className="space-x-2">
          {sessionData && (
            <span>
              👋 Welcome {" "}
              <span className="text-blue-500">{sessionData.user?.name || sessionData.user?.email}</span>
              !
            </span>
          )}

            <button
              type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
              onClick={sessionData ? () => signOut() : () => signIn()}
            >
              {sessionData ? "Sign out" : "Sign in"}
            </button>
          </div>
        </div>
      </nav>

      <main className="container flex mx-auto flex-col p-4">
        <section id="users" className="items-start h-full">
          <AuthShowcase />
        </section>
      </main>
    </>
  );
};

export default Home;