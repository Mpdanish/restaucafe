import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ExpenseDownloadButton from "./ExpenseDownloadButton";
import SpinnerOnly from "../spinnerOnly/SpinnerOnly";

// Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  PointElement,
  LinearScale,
  Tooltip,
  Legend
);

const currentDate = new Date();
const currentMonth = currentDate.getMonth(); // 0-11
const currentYear = currentDate.getFullYear();

function ExpenseChart({ expenseHistoryData, setPdfModalOpen, isLoading, setAddExpenseModal }) {
  const [timePeriod, setTimePeriod] = useState("Monthly");
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [totalExpense, setTotalExpense] = useState("");
  const [totalExpensemonth, setTotalExpensemonth] = useState("");

  useEffect(() => {
    const total = expenseHistoryData.reduce((accumulator, entry) => {
      return accumulator + (entry.totalExpense);
    }, 0);

    let totalExpenseThisPeriod = 0;

    if (timePeriod === "Monthly") {
      totalExpenseThisPeriod = expenseHistoryData.reduce((total, entry) => {
        const workDate = new Date(entry.date);
        if (
          workDate.getMonth() === currentMonth &&
          workDate.getFullYear() === currentYear
        ) {
          return total + (entry.totalExpense || 0);
        }
        return total;
      }, 0);
    } else if (timePeriod === "Daily") {
      const today = new Date();
      totalExpenseThisPeriod = expenseHistoryData.reduce((total, entry) => {
        const workDate = new Date(entry.date);
        if (workDate.toDateString() === today.toDateString()) {
          return total + (entry.totalExpense || 0);
        }
        return total;
      }, 0);
    } else if (timePeriod === "Yearly") {
      const currentYearData = expenseHistoryData.filter(
        (entry) => new Date(entry.date).getFullYear() === currentYear
      );
      totalExpenseThisPeriod = currentYearData.reduce((total, entry) => {
        return total + (entry.totalExpense || 0);
      }, 0);
    }

    setTotalExpensemonth(totalExpenseThisPeriod);
    setTotalExpense(total);
  }, [expenseHistoryData, timePeriod, currentYear]);

  const handleTimePeriodChange = (event) => {
    const period = event.target.value;
    setTimePeriod(period);
    if (period !== "Monthly") {
      setCurrentYear(new Date().getFullYear()); // Reset to current year when switching from Monthly
    }
  };

  const getMonthlyData = () => {
    const monthlyExpense = Array(12).fill(0);
    const currentYearData = expenseHistoryData.filter(
      (entry) => new Date(entry.date).getFullYear() === currentYear
    );

    currentYearData.forEach((entry) => {
      const entryDate = new Date(entry.date);
      const month = entryDate.getMonth();
      monthlyExpense[month] += entry.totalExpense || 0; // Parse amount correctly
    });

    return monthlyExpense.map((expense, index) => ({
      name: new Date(0, index).toLocaleString("default", { month: "short" }),
      expense,
    }));
  };

  const getDailyData = () => {
    const today = new Date();
    const last7Days = Array(7).fill(0);
    const labels = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayName = date.toLocaleString("default", { weekday: "short" });
      labels.push(dayName);
    }

    expenseHistoryData.forEach((entry) => {
      const entryDate = new Date(entry.date);
      const dayIndex = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));
      if (dayIndex >= 0 && dayIndex < 7) {
        last7Days[6 - dayIndex] += entry.totalExpense || 0; // Parse amount correctly
      }
    });

    return labels.map((label, index) => ({
      name: label,
      expense: last7Days[index],
    }));
  };

  const getYearlyData = () => {
    const yearlyexpense = Array(5).fill(0);
    const labels = [];

    for (let i = 0; i < 5; i++) {
      const year = currentYear - 4 + i; // Generate years from currentYear - 4 to currentYear
      labels.push(year);
    }

    expenseHistoryData.forEach((entry) => {
      const entryDate = new Date(entry.date);
      const yearIndex = entryDate.getFullYear() - (currentYear - 4);
      if (yearIndex >= 0 && yearIndex < 5) {
        yearlyexpense[yearIndex] += entry.totalExpense || 0;
      }
    });

    return labels.map((label, index) => ({
      name: label,
      expense: yearlyexpense[index],
    }));
  };

  const graphData =
    timePeriod === "Monthly"
      ? getMonthlyData()
      : timePeriod === "Daily"
        ? getDailyData()
        : getYearlyData();

  const labels = graphData.map((data) => data.name);
  const expenseValues = graphData.map((data) => data.expense);

  const data = {
    labels,
    datasets: [
      {
        label: "expense",
        data: expenseValues,
        borderColor: "#00d8ff",
        backgroundColor: "rgba(0, 216, 255, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const handlePrevYear = () => {
    if (currentYear > new Date().getFullYear() - 5) {
      setCurrentYear((prevYear) => prevYear - 1);
    }
  };

  const handleNextYear = () => {
    if (currentYear < new Date().getFullYear()) {
      setCurrentYear((prevYear) => prevYear + 1);
    }
  };
  console.log(totalExpense, 'totalexp')
  return (
    <>
      <div className="bg-[#00144c] p-4 lg:p-8 rounded-xl flex flex-row justify-between items-center mb-8">
        <div className="text-left space-y-3 w-full lg:w-1/3 mb-6 lg:mb-0">
          <h2 className="text-lg lg:text-4xl font-bold text-[#ffeda5]">Total expense</h2>
          <h3 className="text-sm lg:text-2xl text-green-300 font-bold">
            {!isLoading ? new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(totalExpense) : <SpinnerOnly />}
          </h3>
          <p className="text-xs lg:text-base text-gray-500">{new Date().toLocaleDateString()}</p>
          <h2 className="text-sm lg:text-3xl font-bold text-[#ffeda5]">
            {timePeriod} expense
          </h2>
          <h3 className="text-sm lg:text-2xl text-green-300 font-bold">
            {!isLoading ? new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(totalExpensemonth) : <SpinnerOnly />}
          </h3>
          {/* Download Button Here */}
          <ExpenseDownloadButton setPdfModalOpen={setPdfModalOpen} />
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-2/4 flex flex-col justify-center items-center">

          {/* Time Period Selector */}
          <div className="flex justify-between mb-4 w-full">
            <div className="bg-gray-700 px-1 py-0.5 rounded-full text-[#ffeda5]">
              <select
                value={timePeriod}
                onChange={handleTimePeriodChange}
                className="text-xs lg:text-sm cursor-pointer bg-gray-700 rounded-full text-[#ffeda5] outline-none"
              >
                <option value="Daily" className="cursor-pointer">
                  Daily
                </option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
            {/* Chart Header */}
            <div className="text-gray-300 text-center mb-2">
              {timePeriod === "Daily" ? (
                <span className="text-sm lg:text-base font-semibold">Last 7 Days</span>
              ) : timePeriod === "Monthly" ? (
                <span className="text-sm lg:text-base font-semibold">{currentYear}</span>
              ) : (
                <span className="text-sm lg:text-base font-semibold">Last 5 Years</span>
              )}
            </div>
            <div className="w-[15%]"></div>
            <div className="flex justify-end">
              <button onClick={() => setAddExpenseModal(true)} className="cursor-pointer border border-[#ffeda5] bg-[#23346c] text-[#ffeda5] font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-[#00144c] hover:bg-opacity-30 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2">
                Add Expense +
              </button>
            </div>
          </div>



          {/* Chart with Navigation */}
          <div className="flex items-center justify-between w-full">
            {/* Left Arrow */}
            {timePeriod === "Monthly" && (
              <button
                onClick={handlePrevYear}
                className="bg-gray-700 p-2 rounded-full text-cyan-400 hover:bg-gray-600 transition hidden sm:flex"
              >
                <FaChevronLeft />
              </button>
            )}

            {/* Line Chart */}
            <div className="flex-1 mx-2 lg:mx-4" style={{ height: "250px", width: "100%" }}>
              <Line
                data={data}
                options={{
                  elements: {
                    point: {
                      hitRadius: 20,
                      radius: 4,
                      drawActiveElementsOnTop: true,
                    },
                  },
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      backgroundColor: "#333",
                      titleColor: "#fff",
                      bodyColor: "#fff",
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        font: {
                          size: 10,
                        },
                        color: "#999", // X-axis label color
                      },
                    },
                    y: {
                      display: true, // Hide the entire y-axis including labels
                      grid: {
                        display: true,
                      },
                    },
                  },
                }}
              />
            </div>

            {/* Right Arrow */}
            {timePeriod === "Monthly" && (
              <button
                onClick={handleNextYear}
                className="bg-gray-700 p-2 rounded-full text-cyan-400 hover:bg-gray-600 transition hidden sm:flex"
              >
                <FaChevronRight />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ExpenseChart;
