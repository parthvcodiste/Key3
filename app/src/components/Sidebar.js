import { useState } from "react";

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

const Sidebar = ({
  showSidebar,
  setShowSidebar,
  handleChange,
  profileData,
  handleSave,
  handleSelectAvatar,
  selectedAvatar,
}) => {
  return (
    <>
      {showSidebar ? (
        <button
          className="flex text-4xl text-white items-center cursor-pointer fixed right-10 top-6 z-50"
          onClick={() => setShowSidebar(!showSidebar)}
        >
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
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      ) : null}

      <div
        className={`top-0 right-0 w-[35vw] flex justify-center text-center flex-col bg-gradient-to-r from-purple-800  to-pink-900  p-10 pl-20 text-white fixed h-full z-40  ease-in-out duration-300 ${
          showSidebar ? "translate-x-0 " : "translate-x-full"
        }`}
      >
        <div className="my-auto">
          <div className="text-[40px] font-bold top-10 absolute bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Edit Profile
          </div>

          <img
            src={`/assets/images/avatars/${selectedAvatar}`}
            className="w-28 h-28 rounded-full mx-auto bg-white mb-2"
          />

          <div className="">
            <input
              onChange={handleChange}
              value={profileData?.name}
              className="bg-transparent border-[1px] w-full border-gray-500 rounded-xl p-3 focus:outline-none mt-4"
              placeholder="Enter your Name"
              name="name"
            />
          </div>

          <div className="mt-6">
            <input
              onChange={handleChange}
              value={profileData?.bio}
              className="bg-transparent border-[1px] w-full border-gray-500 rounded-xl p-3 focus:outline-none mt-4"
              placeholder="Enter your BIO"
              name="bio"
            />
          </div>

          <div className="flex justify-center mt-16 gap-[10px] flex-wrap h-[300px] overflow-auto">
            {avatars?.map((avatar, index) => {
              return (
                <div
                  key={index}
                  className="w-40 h-40"
                  onClick={() => handleSelectAvatar(avatar)}
                >
                  <img
                    className="w-32 h-32 cursor-pointer rounded-xl bg-white hover:scale-105 duration-300 object-cover"
                    src={`/assets/images/avatars/${avatar}`}
                  />
                </div>
              );
            })}
          </div>

          <div className=" font-bold bottom-10 absolute flex justify-between left-6 w-full  bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            <button
              className="border-gray-400 w-[100px] mx-auto justify-center bg-purple-500 flex mt-8 border-[1px] rounded-xl p-3"
              onClick={handleSave}
            >
              Save
            </button>

            <button
              className="border-gray-400 w-[100px] mx-auto justify-center bg-pink-500 flex mt-8 border-[1px] rounded-xl p-3"
              onClick={() => setShowSidebar(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
