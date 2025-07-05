import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import AddIncome from "../../components/Add Order/AddOrder";
import OrderBody from "../../components/OrderBody/OrderBody";

const Order = () => {
  const [addOrderModal, setAddOrderModal] = useState(false);
  return (
    <>
      <Navbar setAddOrderModal={setAddOrderModal} />
      <OrderBody addOrderModal={addOrderModal} />
      {addOrderModal && <AddOrder setAddOrderModal={setAddOrderModal} />}
    </>
  );
};

export default Order;
