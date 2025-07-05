// PDFDownloadModal.js
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import styles

const months = Array.from({ length: 12 }, (v, i) => ({
  label: new Date(0, i).toLocaleString("default", { month: "long" }),
  value: i + 1,
}));

const PDFDownloadModal = ({ setIsModalOpen, generatePDF }) => {
  const [selectedOption, setSelectedOption] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);

  const handleDownload = () => {
    let startDate, endDate;

    if (selectedOption === "monthly") {
      startDate = new Date(selectedYear, selectedMonth - 1, 1);
      endDate = new Date(selectedYear, selectedMonth, 0); // Last day of the month
    } else if (selectedOption === "yearly") {
      startDate = new Date(selectedYear, 0, 1); // January 1st
      endDate = new Date(selectedYear, 12, 0); // December 31st
    } else if (
      selectedOption === "custom" &&
      customStartDate &&
      customEndDate
    ) {
      startDate = customStartDate;
      endDate = customEndDate;
    }

    generatePDF(
      startDate,
      endDate,
      selectedOption,
      selectedMonth,
      selectedYear
    );
    setIsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 flex z-40 items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl mb-4 text-cyan-400">Download PDF</h3>

        <div className="mb-4">
          <select
            value={selectedOption}
            onChange={(e) => {
              setSelectedOption(e.target.value);
              if (e.target.value !== "custom") {
                setCustomStartDate(null);
                setCustomEndDate(null);
              }
            }}
            className="bg-gray-700 text-gray-100 rounded-lg px-4 py-2"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {selectedOption === "monthly" && (
          <div className="flex space-x-2 mb-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-gray-700 text-gray-100 rounded-lg px-4 py-2"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-gray-700 text-gray-100 rounded-lg px-4 py-2"
              placeholder="Year"
              min="2000"
              max={new Date().getFullYear()}
            />
          </div>
        )}

        {selectedOption === "yearly" && (
          <div className="mb-4">
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-gray-700 text-gray-100 rounded-lg px-4 py-2"
              placeholder="Year"
              min="2000"
              max={new Date().getFullYear()}
            />
          </div>
        )}

        {selectedOption === "custom" && (
          <div className="flex space-x-2 mb-4">
            <DatePicker
              selected={customStartDate}
              onChange={(date) => setCustomStartDate(date)}
              className="bg-gray-700 text-gray-100 rounded-lg px-4 py-2"
              placeholderText="From Date"
              dateFormat="dd/MM/yyyy"
            />
            <DatePicker
              selected={customEndDate}
              onChange={(date) => setCustomEndDate(date)}
              className="bg-gray-700 text-gray-100 rounded-lg px-4 py-2"
              placeholderText="To Date"
              dateFormat="dd/MM/yyyy"
            />
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-gray-600 text-gray-100 px-4 py-2 rounded-lg mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            className="bg-cyan-500 text-white px-4 py-2 rounded-lg"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFDownloadModal;
