"use client";
import React, { useState } from "react";

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].label);

  return (
    <div className="px-2 ">
      <div className="flex p-1 space-x-4 justify-center ">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`px-4 py-2 text-lg mt-2 leading-5   focus:outline-none  ${
              activeTab === tab.label
                ? "border-b-[2px] border-white "
                : "text-blue-100 hover:text-white/[0.12] hover:text-white"
            }`}
            onClick={() => setActiveTab(tab.label)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4  rounded-lg mt-4">
        {tabs.map((tab) => {
          if (tab.label !== activeTab) return null;
          return <div key={tab.label}>{tab.content}</div>;
        })}
      </div>
    </div>
  );
};

export default Tabs;
