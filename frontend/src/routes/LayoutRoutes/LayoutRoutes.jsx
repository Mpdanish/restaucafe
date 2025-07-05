import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import LoadingSpinner from "../../components/spinner/Spinner";

// Lazy import components
const Login = React.lazy(() => import("../../pages/Login/Login"));
const Home = React.lazy(() => import("../../pages/Home/Home"));
const Income = React.lazy(() => import("../../pages/Order/Order"));
const Expense = React.lazy(() => import("../../pages/Expense/Expense"));
const Category = React.lazy(()=> import("../../pages/catogory/Catogery"))
const Items = React.lazy(()=> import("../../pages/Items/Items"))

function LayoutRoutes() {

  return (
    <Router>
      {/* Suspense with fallback UI while components are loading */}
      <Suspense
        fallback={
          <div
            className="flex items-center justify-center h-screen bg-gray-900 text-white"
            style={{ backgroundColor: "#1a202c", height: "100vh" }} // Tailwind + inline style fallback
          >
            <LoadingSpinner/>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/home" element={<Home />} />
            <Route path="/items" element={< Items/>} />
            <Route path="/order" element={<Income />} />
            <Route path="/expense" element={<Expense />} />
            <Route path="/category" element={<Category />} />
          </Route>
          <Route path="*" element={<Login />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default LayoutRoutes;
