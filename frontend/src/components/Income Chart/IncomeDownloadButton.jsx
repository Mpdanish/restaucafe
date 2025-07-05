import React, { useState } from "react";
import downloadIcon from "../../assets/downloadIcon.png"; // Update this path

const IncomeDownloadButton = ({ setIsModalOpen }) => {
  return (
    <button
      className="mt-10 cursor-pointer border border-cyan-600 bg-opacity-20 bg-cyan-600 text-white font-semibold py-2 px-3 rounded-lg shadow-md hover:bg-cyan-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 flex"
      onClick={() => setIsModalOpen(true)}
    >
      Download
      <div
        className={`ml-2 w-6 h-6 transition-opacity duration-300 ${
           "opacity-100" 
        }`}
      >
        <img src={downloadIcon} alt="Download Icon" />
      </div>
    </button>
  );
};

export default IncomeDownloadButton;
