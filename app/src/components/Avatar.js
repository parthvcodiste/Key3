"use client";

import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import DataContext from "../context";

// const withAuth = dynamic(() => import("./withAuth"), {
//   ssr: false,
// });

const avatars = [
  "1.png",
  "2.png",
  "3.png",
  "4.png",
  "5.png",
  "6.png",
  "7.png",
  "8.png",
  "9.png",
];

const Avatar = () => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { aiPersonaLoading } = useContext(DataContext);

  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `/api/user?wallet_address=${sessionStorage.getItem("token")}`
      );

      if (
        response?.data?.data?._id &&
        (response?.data?.data?.is_persona_analysed || response?.data?.data?.is_nft_fetched)
      ) {
        router.push("/profile");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchUserData();
    }, 5000);
    return () => clearInterval(interval); // Clear the interval when the component unmounts
  }, []);

  const handleSelectAvatar = (url) => {
    setSelectedAvatar(url);
  };

  const handleAvatar = async () => {
    if (!selectedAvatar) return setError(true);
    setLoading(true);
    try {
      const response = await axios.put("/api/user", {
        avatar_url: selectedAvatar,
        wallet_address: sessionStorage.getItem("token"),
      });

      if (response?.data?.data?.is_persona_analysed || response?.data?.data?.is_nft_fetched) {
        // sessionStorage.setItem("token",data?.address)
        router.push("/profile");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <>
      {loading && aiPersonaLoading ? (
        <>
          <div className="pyramid-loader my-auto">
            <div className="wrapper">
              <span className="side side1"></span>
              <span className="side side2"></span>
              <span className="side side3"></span>
              <span className="side side4"></span>
              <span className="shadow"></span>
            </div>
          </div>

          <div class="spinnerContainer -mt-10">
            {/* <div class="spinner"></div> */}
            <div class="loader">
              {/* <p>Generating</p> */}
              <div class="words">
                <span class="word">Hang On...</span>
                <span class="word">Generating Metadata...</span>
                <span class="word">Collecting wallet information...</span>
                <span class="word">Almost there...</span>
                <span class="word">Loading...</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* <button onClick={() => router.push("/")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 absolute left-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
              />
            </svg>
          </button> */}
          <div className="text-[50px] -mt-16  font-bold  bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Choose Avatar
          </div>
          <div className="my-auto mt-8 flex flex-col items-center">
            {selectedAvatar ? (
              <img
                src={`/assets/images/avatars/${selectedAvatar}`}
                className="w-80 h-80 opacity-100 rounded-xl bg-white object-cover"
              />
            ) : (
              <div className="rounded-xl flex items-center justify-center bg-gray-600 w-80 h-80 opacity-30">
                <p className="my-auto">Select from below</p>
              </div>
            )}
            <div className="flex justify-center mt-16 gap-[40px] flex-wrap">
              {avatars?.map((avatar, index) => {
                return (
                  <div
                    key={index}
                    className="w-40 h-40"
                    onClick={() => handleSelectAvatar(avatar)}
                  >
                    <img
                      className="w-40 h-40 cursor-pointer rounded-xl bg-white hover:scale-105 duration-300 object-cover"
                      src={`/assets/images/avatars/${avatar}`}
                    />
                  </div>
                );
              })}
            </div>
            <button
              className="border-gray-400 w-[300px] flex justify-center text-lg hover:bg-purple-500  disabled:cursor-not-allowed mt-16 border-[1px] rounded-xl p-3 flex hover:scale-105 duration-200"
              onClick={handleAvatar}
              disabled={!selectedAvatar}
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
          </div>
        </>
      )}

      {/* <div className="hourglass"></div> */}
    </>
  );
};

export default Avatar;
