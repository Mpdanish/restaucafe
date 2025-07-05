import React from "react";

const ViewOrder = ({ entry = { orderDetails: [] }, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-20"></div>

      {/* Popup Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-30">
        <div className="bg-[#23346c] text-[#ffeda5] rounded-lg shadow-lg p-6 w-full max-w-4xl mx-auto">
          <h2 className="text-xl mb-4 text-center">Order Details</h2>

          {/* Income Information */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <span className="text-[#ffeda5] block">Order Date:</span>
              <p className="text-gray-300">
                {new Date(entry.Date).toLocaleDateString()}
              </p>
            </div>

            <div>
              <span className="text-[#ffeda5] block">Reference Number</span>
              <p className="text-gray-300">{entry.referenceNumber}</p>
            </div>

            <div>
              <span className="text-[#ffeda5] block">Total Amount:</span>
              <p className="text-gray-300">
                ₹ {parseFloat(entry.totalAmount).toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-[#ffeda5] block">Payment Method</span>
              <p className="text-gray-300">
                {entry.paymentMethod}
              </p>
            </div>
          </div>

          {/* Work Descriptions */}
          <h3 className="text-lg mb-4">Order Details</h3>
          <table className="w-full mb-4">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-center">#</th>
                <th className="text-center">Item</th>
                <th className="text-center">Quantity</th>
                <th className="text-center">Unit Price</th>
                <th className="text-center">Total</th>
              </tr>
            </thead>
            {/* <tbody>
              {entry.orderDetails.map((order, index) => (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td className="text-center">{order.item}</td>
                  <td className="text-center">
                    ₹ {parseFloat(order.quantity).toLocaleString()}
                  </td>
                  <td className="text-center">
                    ₹ {parseFloat(order.total).toLocaleString()}
                  </td>
                  <td className="text-center">
                    ₹{" "}
                    {parseFloat(order.quantity * order.total).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody> */}
            <tbody>
              {entry.orderDetails && entry.orderDetails.length > 0 ? (
                entry.orderDetails.map((order, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center">{order.item}</td>
                    <td className="text-center">
                      {order.quantity}
                    </td>
                    <td className="text-center">
                      ₹ {parseFloat(order.total).toLocaleString()}{" "}
                      {/* Use unitPrice if this is the price per item */}
                    </td>
                    <td className="text-center">
                      ₹{" "}
                      {parseFloat(
                        order.quantity * order.total
                      ).toLocaleString()}{" "}
                      {/* Correct total calculation */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-gray-300">
                    No order found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewOrder;
