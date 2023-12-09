"use client";

import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import Tabs from "./Tabs";
import axios from "axios";
import Sidebar from "./Sidebar";
import ConfettiExplosion from "react-confetti-explosion";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

import DataContext from "../context";

const NFTCollection = () => {
  const [nfts, setNFTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // If your API provides this information

  const wallet_address = sessionStorage.getItem("token");

  const fetchNFTs = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/nft?wallet_address=${wallet_address}&page=${page}&limit=100`
      );
      setNFTs(response.data.data.records);
      setTotalPages(response.data.data.total);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTs(currentPage);
  }, [currentPage, wallet_address]);

  // Handlers for pagination
  const goToNextPage = () => setCurrentPage((page) => page + 1);
  const goToPreviousPage = () => setCurrentPage((page) => page - 1);

  return (
    <div>
      {!loading ? (
        <>
          <div className="w-full flex mt-4 flex-wrap">
            {nfts?.length ? (
              nfts?.map((nft) => {
                return (
                  <div>
                    <div className="bg-gradient-to-r px-3 pt-4 pb-4 relative m-3 w-[300px] hover:scale-105 duration-150 flex justify-center flex-col items-center rounded-2xl h-[320px] from-[#c084fc40] to-[#db277747]">
                      <img
                        src={nft?.image}
                        className="h-[280px] w-[280px] mt-4 rounded-xl object-cover "
                      />
                      <div className="rounded-b-xl  bg-pink-500 -mt-2 mb-3 bottom-1  py-1 text-sm w-full">
                        {nft?.name}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="w-full  text-[30px] text-center mt-4 bg-gradient-to-r from-[#c084fc40] to-[#db277747] p-10 py-28 rounded-3xl">
                No NFTs Found
              </div>
            )}
          </div>
          {nfts.length < totalPages ? (
            <div className="mt-8">
              {currentPage > 1 && (
                <button
                  onClick={goToPreviousPage}
                  className="bg-purple-500 mx-4 px-4 py-2 rounded-lg"
                >
                  {"< Previous"}
                </button>
              )}
              {currentPage < totalPages && (
                <button
                  onClick={goToNextPage}
                  className="bg-purple-500 mx-4 px-4 py-2 rounded-lg"
                >
                  {"Next >"}
                </button>
              )}
            </div>
          ) : (
            <></>
          )}
        </>
      ) : (
        <div className="w-full flex justify-center mt-28">
          <div class="loading-bar">Loading</div>
        </div>
      )}
    </div>
  );
};

const AIPersona = ({ setPersonaList, setMintSuccess }) => {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [mintLoading, setMintLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0); // If your API provides this information

  const { aiPersonaLoading } = useContext(DataContext);

  const wallet_address = sessionStorage.getItem("token");

  const fetchAIPersona = async (page) => {
    setLoading(true);
    // setMintSuccess(true);

    try {
      const response = await axios.get(
        `/api/persona?wallet_address=${wallet_address}&page=${page}&limit=100`
      );
      setPersonas(response.data.data.records);
      setPersonaList(
        response.data.data.records?.map((persona) => persona?.persona_name)
      );
      setTotalPages(response.data.data.total);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setMintSuccess(false);
    }
  };

  useEffect(() => {
    fetchAIPersona(currentPage);
  }, [currentPage, wallet_address]);

  const intervalRef = useRef();

  const fetchData = async (persona_id) => {
    try {
      const response = await axios.get(`/api/nft-minter?id=${persona_id}`);
      if (response?.data?.data?.result?.onChain?.status === "success") {
        setMintLoading(false);
        setMintSuccess(true);
        fetchAIPersona(currentPage);
        clearInterval(intervalRef.current);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClaim = async (persona_id) => {
    // return setMintSuccess(true)
    setMintLoading(true);
    try {
      const response = await axios.post(`/api/nft-minter`, {
        persona_id: persona_id,
      });

      if (response?.data?.data === "pending") {
        intervalRef.current = setInterval(() => fetchData(persona_id), 3000);

        return () => clearInterval(interval);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Handlers for pagination
  const goToNextPage = () => setCurrentPage((page) => page + 1);
  const goToPreviousPage = () => setCurrentPage((page) => page - 1);

  return (
    <div className="relative w-full">
      {mintLoading ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="loading-bar">Minting</div>
        </div>
      ) : null}

      {!loading ? (
        <>
          <div className="w-full flex mt-4 flex-wrap">
            {personas?.length ? (
              personas?.map((persona) => {
                return (
                  <div className="relative">
                    <div className="bg-gradient-to-r px-3 pt-3 relative m-3 w-[300px]  duration-150 flex justify-center flex-col items-center rounded-2xl  from-[#c084fc40] to-[#db277747]">
                      <img
                        src={persona?.image_url}
                        className="h-[280px] w-[300px] mt-2 rounded-xl object-cover "
                      />

                      <div className="flex justify-between py-2 items-center w-full">
                        <p className="">{persona?.persona_name}</p>
                        {!persona?.is_claimed ? (
                          <button
                            className="bg-purple-500 px-2 h-[30px]  rounded-3xl"
                            onClick={() => handleClaim(persona?._id)}
                            disabled={mintLoading}
                          >
                            Claim
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : aiPersonaLoading ? (
              <div className="w-full  text-[30px] text-center mt-4 bg-gradient-to-r from-[#c084fc40] to-[#db277747] p-10 py-28 rounded-3xl">
                Hang On..., We are building your personas.
              </div>
            ) : (
              <div className="w-full  text-[30px] text-center mt-4 bg-gradient-to-r from-[#c084fc40] to-[#db277747] p-10 py-28 rounded-3xl">
                No Persona Found
              </div>
            )}
          </div>
          {personas.length < totalPages ? (
            <div className="mt-8">
              {currentPage > 1 && (
                <button
                  onClick={goToPreviousPage}
                  className="bg-purple-500 mx-4 px-4 py-2 rounded-lg"
                >
                  {"< Previous"}
                </button>
              )}
              {currentPage < totalPages && (
                <button
                  onClick={goToNextPage}
                  className="bg-purple-500 mx-4 px-4 py-2 rounded-lg"
                >
                  {"Next >"}
                </button>
              )}
            </div>
          ) : (
            <></>
          )}
        </>
      ) : (
        <div className="w-full flex justify-center mt-28">
          <div class="loading-bar">Loading</div>
        </div>
      )}
    </div>
  );
};

const Activities = () => {
  return (
    <div>
      <div className="w-full  text-[30px] text-center mt-4 bg-gradient-to-r from-[#c084fc40] to-[#db277747] p-10 py-28 rounded-3xl">
        No Activities Found
      </div>
    </div>
  );
};

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const [mintSuccess, setMintSuccess] = useState(false);

  const [personas, setPersonaList] = useState([]);

  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const [profileData, setProfileData] = useState({});

  const [user, setUser] = useState(null);
  const fileInputRef = React.createRef();

  const wallet_address = sessionStorage.getItem("token");

  const { width, height } = useWindowSize();

  const router = useRouter();

  const getUser = async () => {
    try {
      const response = await axios.get(
        `/api/user?wallet_address=${wallet_address}`
      );

      if (response?.data?.data?._id) {
        setUser(response?.data?.data);
        setProfileData(response?.data?.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { label: "NFTs", content: <NFTCollection /> },
    {
      label: "AI Personas",
      content: (
        <AIPersona
          setPersonaList={setPersonaList}
          setMintSuccess={setMintSuccess}
        />
      ),
    },
    { label: "Activity", content: <Activities /> },
  ];

  useEffect(() => {
    getUser();
  }, [wallet_address]);

  const handleChange = (e) => {
    setProfileData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = profileData;
      if (selectedAvatar) data["avatar_url"] = selectedAvatar;
      const response = await axios.put(`/api/user`, {
        ...data,
        wallet_address: wallet_address,
      });

      if (response?.data?.data?._id) {
        setUser(response?.data?.data);
        setProfileData(response?.data?.data);
        setShowSidebar(false);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prevState) => ({ ...prevState, avatar_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectAvatar = (url) => {
    setSelectedAvatar(url);
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    router.push("/");
  };

  return (
    <>
      {mintSuccess ? <Confetti width={width} height={height} /> : null}

      <Sidebar
        handleSelectAvatar={handleSelectAvatar}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        handleChange={handleChange}
        profileData={profileData}
        handleSave={handleSave}
        selectedAvatar={selectedAvatar}
      />
      <div className="w-full">
        <div className="w-full pb-8 h-[650px] mt-[-100px] rounded-b-[100px] bg-gradient-to-r from-[#c084fc40] to-[#db277747] relative">
          <img
            src="https://pbs.twimg.com/media/FARoZkuVUAAuk50.jpg:large"
            className=" h-[330px] w-full object-cover"
          />

          <img
            src={
              user?.avatar_url
                ? `/assets/images/avatars/${user?.avatar_url}`
                : "https://st3.depositphotos.com/9998432/13335/v/450/depositphotos_133351928-stock-illustration-default-placeholder-man-and-woman.jpg"
            }
            className="rounded-[50%] border-[10px] bg-white border-green-300 z-20 ml-16  w-40 xl:w-56 h-40 xl:h-56 xl:bottom-[200px] bottom-[230px] absolute object-cover"
          />

          <input
            type="file"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <div className="grid grid-cols-4 gap-4">
            <div className="...">06</div>
            <div className="col-span-3 ">
              <div className="mx-auto text-left mt-4 pr-8">
                <div className="flex justify-between items-center">
                  <p className="text-[50px] text-gradient font-bold">
                    {user?.name}
                  </p>
                  <div className="flex space-x-10">
                    <button
                      className="flex space-x-4 "
                      onClick={() => setShowSidebar(true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 mr-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                      Edit
                    </button>

                    <button className="flex space-x-4 " onClick={handleLogout}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
                <p className="font-semibold mt-3 text-gray-300">{user?.bio}</p>
              </div>
              <div className="mt-10 flex flex-wrap ">
                {personas?.map((per, index) => {
                  if (index > 10) return;
                  return (
                    <p className="bg-gray-600 p-3 mx-2 my-1 rounded-3xl">
                      {per}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <Tabs tabs={tabs} />
        </div>
      </div>
    </>
  );
};

export default Profile;
