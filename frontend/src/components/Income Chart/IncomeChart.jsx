import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import IncomeDownloadButton from "./IncomeDownloadButton";
import SpinnerOnly from "../spinnerOnly/SpinnerOnly";

// Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

function IncomeChart({
  incomeHistoryData,
  setIsModalOpen,
  isLoading,
  setAddOrderModal,
}) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-11
  const currentYear = currentDate.getFullYear();

  const [timePeriod, setTimePeriod] = useState("Monthly");
  const [totalIncome, setTotalIncome] = useState(0);
  const [periodIncome, setPeriodIncome] = useState(0);


  useEffect(() => {
    if (incomeHistoryData && incomeHistoryData.length > 0) {
      const total = incomeHistoryData.reduce(
        (acc, order) => acc + order.totalAmount,
        0
      );
      setTotalIncome(total);

      const calculatePeriodIncome = () => {
        if (timePeriod === "Daily") {
          const today = new Date();
          return incomeHistoryData.reduce((total, entry) => {
            const date = new Date(entry.Date);
            if (
              date.getDate() === today.getDate() &&
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear()
            ) {
              return total + entry.totalAmount;
            }
            return total;
          }, 0);
        } else {
          return incomeHistoryData.reduce((total, entry) => {
            const date = new Date(entry.Date);
            const isCurrentYear = date.getFullYear() === currentYear;

            if (
              timePeriod === "Monthly" &&
              isCurrentYear &&
              date.getMonth() === currentMonth
            ) {
              return total + entry.totalAmount;
            } else if (timePeriod === "Yearly" && isCurrentYear) {
              return total + entry.totalAmount;
            }
            return total;
          }, 0);
        }
      };

      setPeriodIncome(calculatePeriodIncome());
    }
  }, [incomeHistoryData, timePeriod, currentMonth, currentYear]);

  const getMonthlyData = () => {
    const monthlyIncome = Array(12).fill(0);
    const currentYearData = incomeHistoryData.filter(
      (entry) => new Date(entry.Date).getFullYear() === currentYear
    );

    currentYearData.forEach((entry) => {
      const month = new Date(entry.Date).getMonth();
      monthlyIncome[month] += entry.totalAmount || 0;
    });

    return monthlyIncome.map((income, index) => ({
      name: new Date(0, index).toLocaleString("default", { month: "short" }),
      income,
    }));
  };

  const getDailyData = () => {
    const today = new Date();
    const last7Days = Array(7).fill(0);
    const labels = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      labels.push(date.toLocaleString("default", { weekday: "short" }));
    }

    incomeHistoryData.forEach((entry) => {
      const entryDate = new Date(entry.Date);
      const dayIndex = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));
      if (dayIndex >= 0 && dayIndex < 7) {
        last7Days[6 - dayIndex] += entry.totalAmount || 0;
      }
    });

    return labels.map((label, index) => ({
      name: label,
      income: last7Days[index],
    }));
  };

  const getYearlyData = () => {
    const yearlyIncome = Array(5).fill(0);
    const labels = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);

    incomeHistoryData.forEach((entry) => {
      const entryYear = new Date(entry.Date).getFullYear();
      const yearIndex = entryYear - (currentYear - 4);
      if (yearIndex >= 0 && yearIndex < 5) {
        yearlyIncome[yearIndex] += entry.totalAmount || 0;
      }
    });

    return labels.map((label, index) => ({
      name: label,
      income: yearlyIncome[index],
    }));
  };

  const graphData =
    timePeriod === "Monthly"
      ? getMonthlyData()
      : timePeriod === "Daily"
      ? getDailyData()
      : getYearlyData();

  const labels = graphData.map((data) => data.name);
  const incomeValues = graphData.map((data) => data.income);

  const data = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeValues,
        borderColor: "#00d8ff",
        backgroundColor: "rgba(0, 216, 255, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const handleTimePeriodChange = (event) => {
    setTimePeriod(event.target.value);
  };

  return (
    <div className="bg-[#00144c] p-4 lg:p-8 rounded-xl flex flex-row justify-between items-center mb-8">
      <div className="text-left space-y-3 w-full lg:w-1/3 mb-6 lg:mb-0">
        <h2 className="text-lg lg:text-4xl font-bold text-[#ffeda5]">
          Total income
        </h2>
        <h3 className="text-sm lg:text-2xl text-green-300 font-bold">
          {!isLoading ? (
            new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(totalIncome)
          ) : (
            <SpinnerOnly />
          )}
        </h3>
        <h2 className="text-sm lg:text-3xl font-bold text-[#ffeda5]">
          {timePeriod} income
        </h2>
        <h3 className="text-sm lg:text-2xl text-green-300 font-bold">
          {!isLoading ? (
            new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(periodIncome)
          ) : (
            <SpinnerOnly />
          )}
        </h3>
        <IncomeDownloadButton setIsModalOpen={setIsModalOpen} />
      </div>
      <div className="w-full lg:w-2/4 flex flex-col justify-center items-center">
        <div className="flex justify-between mb-4 w-full">
          <div className="bg-gray-700 px-1 py-0.5 rounded-full text-cyan-500">
            <select
              value={timePeriod}
              onChange={handleTimePeriodChange}
              className="text-xs lg:text-sm cursor-pointer bg-gray-700 rounded-full text-[#ffeda5] outline-none"
            >
              <option value="Daily">Daily</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
          <div className="text-gray-300 text-center mb-2">
            {timePeriod === "Daily"
              ? "Last 7 Days"
              : timePeriod === "Monthly"
              ? currentYear
              : "Last 5 Years"}
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setAddOrderModal(true)}
              className="cursor-pointer border border-[#ffeda5] bg-[#23346c] text-[#ffeda5] font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-[#00144c] hover:bg-opacity-30 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2"
            >
              Add Order +
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between w-full">
          <div
            className="flex-1 mx-2 lg:mx-4"
            style={{ height: "250px", width: "100%" }}
          >
            <Line
              data={data}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: "#333",
                    titleColor: "#fff",
                    bodyColor: "#fff",
                  },
                },
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: { font: { size: 10 }, color: "#999" },
                  },
                  y: { display: true, grid: { display: false } }, // Enable Y-axis display for better visibility
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncomeChart;
