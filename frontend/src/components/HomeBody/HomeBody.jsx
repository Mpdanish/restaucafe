import { useEffect, useState } from "react";
import { useSpring, animated, useTransition } from "@react-spring/web";
import api from "../../services/api";
import revenueIcon from "../../assets/revenueIcon.svg";
import expenseIcon from "../../assets/expenseIcon.svg";
import customersIcon from "../../assets/customersIcon.svg";
import { Navigate, useNavigate } from "react-router-dom";
import SpinnerOnly from "../spinnerOnly/SpinnerOnly";

function HomeBody() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    todayIncome: undefined,
    todayExpense: undefined,
    todayCustomerCount: undefined,
    yesterdayIncome: undefined,
    topSoldItems: [],
  });
  const [showShade, setShowShade] = useState(false);
  const [latestIncome, setLatestIncome] = useState([]);
  const [loading, setLoading] = useState(false);
  // Spring animations for numbers with scaling effect
  const todayIncomeSpring = useSpring({
    from: { number: 0, scale: 0.9 },
    to: { number: data.todayIncome, scale: 1 },
    config: { tension: 170, friction: 26 },
    reset: true,
  });

  const todayExpenseSpring = useSpring({
    from: { number: 0, scale: 0.9 },
    to: { number: data.todayExpense, scale: 1 },
    config: { tension: 170, friction: 26 },
    reset: true,
  });

  const todayCustomerCountSpring = useSpring({
    from: { number: 0, scale: 0.9 },
    to: { number: data.todayCustomerCount, scale: 1 },
    config: { tension: 170, friction: 26 },
    reset: true,
  });

  const yesterdayIncomeSpring = useSpring({
    from: { number: 0, scale: 0.9 },
    to: { number: data.yesterdayIncome, scale: 1 },
    config: { tension: 170, friction: 26 },
    reset: true,
  });

  // Transition effect for shading
  const transitions = useTransition(showShade, {
    from: { backgroundColor: "transparent" },
    enter: { backgroundColor: "rgba(255, 255, 255, 0.1)" },
    leave: { backgroundColor: "transparent" },
    config: { duration: 500 },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await api.getHomeData();
        if (!result.error) {
          setData(result.data);
          setShowShade(true); // Trigger shading effect
          setTimeout(() => setShowShade(false), 500); // Reset shading after animation
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    console.log(data);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await api.getLatestIncome();
        if (!result.error) {
          setLatestIncome(result.data);
        }
      } catch (error) {}
    };
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white p-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 mb-6 items-stretch">
        {/* Card 1 - Today's Revenue */}
        <div className="bg-[#2A2A2A] p-6 rounded-xl flex flex-col justify-between relative overflow-hidden">
          {transitions(
            (styles, item) =>
              item && (
                <animated.div
                  style={styles}
                  className="absolute inset-0 rounded-xl"
                />
              )
          )}
          <div className="flex flex-row justify-between">
            <h2 className="text-lg text-[#FFEDA5] mb-2">Today's Revenue</h2>
            <div className="px-0.5 py-0.5 border border-[#ffeda5] rounded-md">
              <img src={revenueIcon} alt="" />
            </div>
          </div>
          {data.todayIncome || data.todayIncome == 0 ? (
            <p className="text-2xl font-bold">
              <animated.span
                style={{
                  transform: todayIncomeSpring.scale.to((s) => `scale(${s})`),
                  position: "relative",
                  display: "inline-block",
                  overflow: "hidden",
                }}
                className="number-glance-effect"
              >
                {todayIncomeSpring.number.to((n) =>
                  new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(n.toFixed(0))
                )}
              </animated.span>
            </p>
          ) : (
            <SpinnerOnly />
          )}

          {/* Graph */}
          <div className="flex justify-between items-end mt-4 h-[135px]">
            <div className="bg-gradient-to-b from-teal-500 via-teal-200 to-sky-200 h-[135px] w-[35px] rounded-3xl"></div>
            <div className="bg-gradient-to-b from-teal-500 via-teal-200 to-sky-200 h-[91px] w-[35px] rounded-3xl"></div>
            <div className="bg-gradient-to-b from-teal-500 via-teal-200 to-sky-200 h-[74px] w-[35px] rounded-3xl"></div>
            <div className="bg-gradient-to-b from-teal-500 via-teal-200 to-sky-200 h-[91px] w-[35px] rounded-3xl"></div>
            <div className="bg-gradient-to-b from-teal-500 via-teal-200 to-sky-200 h-[135px] w-[35px] rounded-3xl"></div>
            <div className="bg-gradient-to-b from-teal-500 via-teal-200 to-sky-200 h-[83px] w-[35px] rounded-3xl"></div>
            <div className="bg-gradient-to-b from-teal-500 via-teal-200 to-sky-200 h-[118px] w-[35px] rounded-3xl"></div>
          </div>
        </div>

        {/* Card 2 - Today's Expenses */}
        <div className="bg-[#2A2A2A] p-6 rounded-xl flex flex-col justify-between relative overflow-hidden">
          {transitions(
            (styles, item) =>
              item && (
                <animated.div
                  style={styles}
                  className="absolute inset-0 rounded-xl"
                />
              )
          )}
          <div className="flex flex-row justify-between">
            <h2 className="text-lg text-[#ffeda5] mb-2">Today's Expenses</h2>
            <div className="px-0.5 py-0.5 border border-[#ffeda5] rounded-md">
              <img src={expenseIcon} alt="" />
            </div>
          </div>
          {data.todayExpense || data.todayExpense == 0 ? (
            <p className="text-2xl font-bold">
              <animated.span
                style={{
                  transform: todayExpenseSpring.scale.to((s) => `scale(${s})`),
                  position: "relative",
                  display: "inline-block",
                  overflow: "hidden",
                }}
                className="number-glance-effect"
              >
                {todayExpenseSpring.number.to((n) =>
                  new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(n.toFixed(0))
                )}
              </animated.span>
            </p>
          ) : (
            <SpinnerOnly />
          )}

          {/* Graph */}
          <div className="flex justify-between items-end mt-4 h-[135px]">
            <div className="bg-gradient-to-b from-amber-400 via-amber-300 to-amber-100 h-[87px] w-[35px] rounded-3xl"></div>
            <div className="bg-gradient-to-b from-amber-400 via-amber-300 to-amber-100 h-[129px] w-[35px] rounded-3xl"></div>
            <div className="bg-gradient-to-b from-amber-400 via-amber-300 to-amber-100 h-[70px] w-[35px] rounded-3xl"></div>
            <div className="bg-gradient-to-b from-amber-400 via-amber-300 to-amber-100 h-[119px] w-[35px] rounded-3xl"></div>
            <div className="bg-gradient-to-b from-amber-400 via-amber-300 to-amber-100 h-[87px] w-[35px] rounded-3xl"></div>
            <div className="bg-gradient-to-b from-amber-400 via-amber-300 to-amber-100 h-[79px] w-[35px] rounded-3xl"></div>
            <div className="bg-gradient-to-b from-amber-400 via-amber-300 to-amber-100 h-[112px] w-[35px] rounded-3xl"></div>
          </div>
        </div>

        {/* On large screen start*/}
        <div className="space-y-4 sm:flex-row">
          {/* Card 3 - Today's Customers */}
          <div className="bg-[#2A2A2A] p-6 rounded-xl flex flex-col justify-between relative overflow-hidden">
            {transitions(
              (styles, item) =>
                item && (
                  <animated.div
                    style={styles}
                    className="absolute inset-0 rounded-xl"
                  />
                )
            )}
            <div className="flex flex-row justify-between">
              <h2 className="text-lg text-[#ffeda5] mb-2">Today's Customers</h2>
              <div className="px-0.5 py-0.5 border border-[#ffeda5] rounded-md">
                <img src={customersIcon} alt="" />
              </div>
            </div>
            {data.todayCustomerCount || data.todayCustomerCount == 0 ? (
              <p className="text-2xl font-bold">
                <animated.span
                  style={{
                    transform: todayCustomerCountSpring.scale.to(
                      (s) => `scale(${s})`
                    ),
                    position: "relative",
                    display: "inline-block",
                    overflow: "hidden",
                  }}
                  className="number-glance-effect"
                >
                  {todayCustomerCountSpring.number.to((n) => n.toFixed(0))}
                </animated.span>
              </p>
            ) : (
              <SpinnerOnly />
            )}

            <p className="invisible">hello</p>
          </div>

          {/* Card 4 - Yesterday's Revenue */}
          <div className="bg-[#2A2A2A] p-6 rounded-xl flex flex-col justify-between relative overflow-hidden sm:hidden lg:flex">
            {transitions(
              (styles, item) =>
                item && (
                  <animated.div
                    style={styles}
                    className="absolute inset-0 rounded-xl"
                  />
                )
            )}
            <div className="flex flex-row justify-between">
              <h2 className="text-lg text-[#ffeda5] mb-2">
                Yesterday's Revenue
              </h2>
              <div className="px-0.5 py-0.5 border border-[#ffeda5] rounded-md">
                <img src={revenueIcon} alt="" />
              </div>
            </div>
            {data.yesterdayIncome || data.yesterdayIncome == 0 ? (
              <p className="text-2xl font-bold">
                <animated.span
                  style={{
                    transform: yesterdayIncomeSpring.scale.to(
                      (s) => `scale(${s})`
                    ),
                    position: "relative",
                    display: "inline-block",
                    overflow: "hidden",
                  }}
                  className="number-glance-effect"
                >
                  {yesterdayIncomeSpring.number.to((n) =>
                    new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(n.toFixed(0))
                  )}
                </animated.span>
              </p>
            ) : (
              <SpinnerOnly />
            )}

            <p className="invisible">hello</p>
          </div>
        </div>
        {/* On large screen end */}

        {/* On small screen start */}
        {/* <div className="bg-[#2A2A2A] p-6 rounded-xl flex flex-col justify-between relative overflow-hidden">
            {transitions(
              (styles, item) =>
                item && (
                  <animated.div
                    style={styles}
                    className="absolute inset-0 rounded-xl"
                  />
                )
            )}
            <div className="flex flex-row justify-between">
              <h2 className="text-lg text-[#ffeda5] mb-2">Today's Customers</h2>
              <div className="px-0.5 py-0.5 border border-[#ffeda5] rounded-md">
                <img src={customersIcon} alt="" />
              </div>
            </div>
            {data.todayCustomerCount || data.todayCustomerCount == 0 ? <p className="text-2xl font-bold">
              <animated.span
                style={{
                  transform: todayCustomerCountSpring.scale.to(
                    (s) => `scale(${s})`
                  ),
                  position: "relative",
                  display: "inline-block",
                  overflow: "hidden",
                }}
                className="number-glance-effect"
              >
                {todayCustomerCountSpring.number.to((n) => n.toFixed(0))}
              </animated.span>
            </p> : <SpinnerOnly />}

            <p className="invisible">hello</p>
          </div> */}

        {/* Card 4 - Yesterday's Revenue */}
        <div className="hidden bg-[#00144c] p-6 rounded-xl flex-col justify-between relative overflow-hidden lg:hidden xl:hidden sm:flex">
          {transitions(
            (styles, item) =>
              item && (
                <animated.div
                  style={styles}
                  className="absolute inset-0 rounded-xl"
                />
              )
          )}
          <div className="flex flex-row justify-between">
            <h2 className="text-lg text-[#ffeda5] mb-2">Yesterday's Revenue</h2>
            <div className="px-0.5 py-0.5 border border-[#ffeda5] rounded-md">
              <img src={revenueIcon} alt="" />
            </div>
          </div>
          {data.yesterdayIncome || data.yesterdayIncome == 0 ? (
            <p className="text-2xl font-bold">
              <animated.span
                style={{
                  transform: yesterdayIncomeSpring.scale.to(
                    (s) => `scale(${s})`
                  ),
                  position: "relative",
                  display: "inline-block",
                  overflow: "hidden",
                }}
                className="number-glance-effect"
              >
                {yesterdayIncomeSpring.number.to((n) =>
                  new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(n.toFixed(0))
                )}
              </animated.span>
            </p>
          ) : (
            <SpinnerOnly />
          )}

          <p className="invisible">hello</p>
        </div>
        {/* On small screen end */}
      </div>

      <div className="bg-[#00144c] p-6 rounded-xl flex flex-col justify-between relative overflow-hidden">
        <h2 className="text-lg text-[#ffeda5] mb-4">Top Sold Items</h2>
        {data.topSoldItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-[#00144c] text-white">
              <thead>
                <tr className="border-b border-[#ffeda5]">
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Item Name</th>
                  <th className="px-4 py-2 text-left">Total Sold</th>
                </tr>
              </thead>
              <tbody>
                {data.topSoldItems.map((item, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="px-4 py-2">{index + 1}</td>{" "}
                    
                    <td className="px-4 py-2">{item._id}</td> 
                    <td className="px-4 py-2">{item.totalQuantity}</td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : loading ? (
          <SpinnerOnly />
        ) : (
          <div className="text-gray-500">No Datas Founded</div>
        )}
      </div>

      <div className="mt-8">
        <div className="flex justify-between px-3">
          <h2 className="text-lg text-[#ffeda5] mb-4">Recent Income</h2>
          <button className="text-[#ffeda5]" onClick={() => navigate("/order")}>
            View All
          </button>
        </div>
        <div className="bg-[#00144c] p-6 rounded-xl">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="text-[#ffeda5]">Date</th>
                <th className="text-[#ffeda5]">Reference</th>
                <th className="text-[#ffeda5]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {!latestIncome ? (
                <td colSpan="7" className="py-4 text-center text-gray-500">
                  <SpinnerOnly />
                </td>
              ) : (
                Array.isArray(latestIncome) &&
                latestIncome.map((income, index) => (
                  <tr key={index} className="border-t border-gray-700">
                    <td>{formatDate(income.Date)}</td>
                    <td>{income.referenceNumber}</td>
                    <td>
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(income.totalAmount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HomeBody;
