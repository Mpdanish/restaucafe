import React, { Suspense } from "react";

// Lazy load the components
const Navbar = React.lazy(() => import("../../components/Navbar/Navbar"));
const HomeBody = React.lazy(() => import("../../components/HomeBody/HomeBody"));

const Home = () => {
  console.log('this is home page working fine')
  return (
    <>
      {/* Suspense wrapper with a fallback UI for loading state */}
      <Suspense fallback={<div className="bg-gray-900">Loading Navbar...</div>}>
        <Navbar />
      </Suspense>

      <Suspense fallback={<div className="bg-gray-900">Loading Content...</div>}>
        <HomeBody />
      </Suspense>
    </>
  );
};

export default Home;
