"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import DataContext from "../context";

// const withAuth = dynamic(() => import("./withAuth"), {
//   ssr: false,
// });
const WalletConnect = () => {
  const [data, setdata] = useState({
    address: "",
    Balance: null,
  });

  const [userName, setUserName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setData: setToken, fetchNFTs, generatePersona } = useContext(DataContext);

  const [walletAddress, setWalletAddress] = useState(null);
  const [isUserExist, setIsUserExist] = useState(false);

  const router = useRouter();

  const login = async (wallet_address) => {
    // if (!userName) return setError(true);
    setLoading(true);
    try {
      const response = await axios.post("/api/user", {
        wallet_address: wallet_address,
      });

      const user = response?.data?.data;

      sessionStorage.setItem("token", wallet_address);

      setToken((prevState) => ({ ...prevState, token: wallet_address }));

      if (!user.is_nft_fetched) {
        fetchNFTs(wallet_address);
      }
      if (!user.is_persona_analysed) {
        generatePersona(wallet_address);
      }

      if (user?.name && user?.avatar_url) {
        router.push("/profile");
      } else if (user?.name && !user?.avatar_url) {
        router.push("/avatar");
      } else if (!user?.name) {
        setIsUserExist(false);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (!userName) return setError(true);
    setLoading(true);
    try {
      const response = await axios.put(`/api/user`, {
        wallet_address: data?.address,
        name: userName,
      });

      const user = response?.data?.data;

      if (user?.name && user?.avatar_url) {
        router.push("/profile");
      } else if (user?.name && !user?.avatar_url) {
        router.push("/avatar");
      } else if (!user?.name) {
        setIsUserExist(false);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const accountChangeHandler = (account) => {
    // getUser(account);
    login(account);
    setdata({
      address: account,
    });
  };

  const handleWalletConnect = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((res) => accountChangeHandler(res[0]));
    } else {
      alert("install metamask extension!!");
    }
  };

  const handleChange = (e) => {
    if (e.target.value) setError(null);
    setUserName(e.target.value);
  };

  const handleChangeWallet = (e) => {
    setWalletAddress(e.target?.value?.trim());
    setdata((prevState) => ({ ...prevState, address: "" }));
  };

  const handleLogin = () => {
    login(walletAddress);
    setdata({
      address: walletAddress,
    });
  };

  return (
    <>
      <div className="text-[50px] font-bold mt-32 mb-12 text-center bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        <img src="/assets/images/logo.png" className="w-56 mx-auto" />
        <p className="mt-2 text-[26px]">Web3 Persona Builder</p>
      </div>

      <div className="my-auto text-center mt-4">
        {data?.address && !isUserExist ? (
          <>
            <div className="text-[16px] mt-4 p-2 rounded-lg text-gray-400">
              {data?.address}
            </div>

            <input
              onChange={handleChange}
              value={userName}
              className="bg-transparent border-[1px] w-full border-gray-500 rounded-xl p-3 focus:outline-none mt-4"
              placeholder="Choose your name"
            />

            {error ? (
              <span className="text-xs text-red-600">Invalid Username</span>
            ) : null}

            {loading ? (
              <div className="w-full flex justify-center mt-8">
                <div class="loading-bar">Loading</div>
              </div>
            ) : (
              <button
                className="border-gray-400 mx-auto flex mt-8 border-[1px] rounded-xl p-3"
                onClick={handleNext}
              >
                Next
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 ml-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                  />
                </svg>
              </button>
            )}
          </>
        ) : (
          <div className="relative">
            <button
              className="border-gray-400 w-[300px] border-[1px] text-lg rounded-xl p-3 hover:bg-purple-500 duration-100"
              onClick={handleWalletConnect}
            >
              Connect Wallet
            </button>
            <p className="mt-4 text-gray-400">-OR-</p>

            <input
              onChange={handleChangeWallet}
              value={walletAddress}
              className="bg-transparent border-[1px] w-full border-gray-500 rounded-xl pr-10 p-3 focus:outline-none  duration-80 mt-4"
              placeholder="Enter your Wallet Address"
            />
            <button
              className="absolute right-0 bottom-0 w-8"
              onClick={handleLogin}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 absolute right-2 bottom-3 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                />
              </svg>
            </button>
          </div>
        )}
        {!data?.address ? (
          <div className="text-[12px] mt-4  text-gray-400">
            Connect your wallet address to proceed.
          </div>
        ) : null}
      </div>
    </>
  );
};

export default WalletConnect;
