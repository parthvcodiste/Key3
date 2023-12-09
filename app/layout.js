"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import DataContext from "./src/context";
import { useState } from "react";
import axios from "axios";

export default function RootLayout({ children }) {
  const [data, setData] = useState({
    nfts: [],
    aiPersona: [],
    token: "",
  });

  const [aiPersonaLoading, setAIPersonaLoading] = useState(false)

  const [loading, setLoading] = useState(false);

  const fetchNFTs = async (wallet_address) => {
    setAIPersonaLoading(true)
    try {
      const response = await axios.post(`/api/fetch-nft`, {
        wallet_address: wallet_address,
      });
      setData((prevState) => ({
        ...prevState,
        nfts: response?.data?.data,
      }));
    } catch (error) {
      console.error("Error:", error);
    } finally {
      // setAIPersonaLoading(false);
      setLoading(false);
    }
  };

  const generatePersona = async (wallet_address) => {
    setAIPersonaLoading(true);
    try {
      await axios.post(`/api/analyse-nft`, {
        wallet_address: wallet_address,
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      // setAIPersonaLoading(false);
      setLoading(false);
    }
  };

  return (
    <html lang="en">
      <head>
        <title>KEY 3</title>
        <meta
          name="description"
          content="Key3 builds your Web3 identity fingerprint and allows you to share your data with 3rd parties and dapps - and keeps you in control."
        />
      </head>
      <body className="background">
        <main className="flex text-white relative max-w-screen-2xl	 mx-auto text-center h-screen  flex-col items-center my-auto justify-between p-24">
          <DataContext.Provider value={{ data, setData, fetchNFTs, aiPersonaLoading, generatePersona }}>
            {children}
          </DataContext.Provider>
        </main>
      </body>
    </html>
  );
}
