import { NextPage } from "next";
import Head from "next/head";
import React from "react";
import Nav from "@components/nav/Nav";
import MainContent from "./MainContent";

export const XPADDING = "px-4 sm:px-10"

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>V-Notifier</title>
        <link rel="icon" href="/volleyball-emoji.png" />
        <meta name="color-scheme" content="light only" />
      </Head>
      <Nav />
      <main>
        <MainContent />
      </main>
    </>
  );
};

export default Home;
