import React, { useEffect, useState } from "react";
import api from "../../services/api";
import swal from "sweetalert";
import LoadingSpinner from "../spinner/Spinner";

const EditOrder = ({ setEditOrderModal, existingOrder }) => {
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState(formatDate(new Date()));
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ date: "", itemError: "" });
  const [inputName, setInputName] = useState("");
  const [orderDetails, setOrderDetails] = useState(existingOrder.orderDetails || []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const result = await api.getItems();
        if (!result.error) {
          setItems(result.data);
        } else {
          swal("Error!", "Something went wrong!", "error");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchItems();
    setDate(existingOrder.date || formatDate(new Date()));
    setOrderDetails(existingOrder.orderDetails || []);
  }, [existingOrder]);

  const handleSearchChange = (event) => {
    const inputValue = event.target.value;
    if (selectedItem) {
      setSelectedItem(null);
    }
    setInputName(inputValue.toUpperCase());
    filterSuggestions(inputValue);
  };

  const filterSuggestions = (inputValue) => {
    if (!inputValue) {
      setShowSuggestions(false);
      return;
    }
    const suggestions = items.filter((item) =>
      item.name.toUpperCase().includes(inputValue.toUpperCase())
    );
    setFilteredItems(suggestions);
    setShowSuggestions(true);
  };

  const selectSuggestion = (suggestion) => {
    setSelectedItem(suggestion);
    setShowSuggestions(false);
    setQuantity(1);
    setErrors({ ...errors, itemError: "" });
    setInputName(suggestion.name);
  };

  const calculateTotal = () => {
    return orderDetails.reduce((total, detail) => {
      const itemTotal = (parseFloat(detail.price) || 0) * (detail.quantity || 1);
      return total + itemTotal;
    }, 0);
  };

  const handleAddItem = () => {
    if (!selectedItem) {
      setErrors({ ...errors, itemError: "Please select an item." });
      return;
    }
    const newOrderDetail = {
      item: selectedItem.name,
      quantity,
      price: selectedItem.price,
      total: selectedItem.price * quantity, // Calculate total based on quantity
    };
    setOrderDetails([...orderDetails, newOrderDetail]);
    setSelectedItem(null);
    setQuantity(1);
    setInputName("");
  };

  const removeItem = (index) => {
    const updatedOrderDetails = orderDetails.filter((_, i) => i !== index);
    setOrderDetails(updatedOrderDetails);
  };

  const validate = () => {
    let isValid = true;

    if (!date) {
      setErrors({ ...errors, date: "Date is required." });
      isValid = false;
    }

    if (orderDetails.length === 0) {
      swal("Error!", "Please add at least one item.", "error");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    const formData = {
      date,
      totalAmount: calculateTotal(),
      orderDetails,
    };
    try {
      const result = await api.updateOrder(existingOrder.id, formData); // Assuming the API endpoint takes an order ID for updates
      if (result.error) {
        swal("Error!", result.message, "error");
        return;
      }
      swal("Success!", "Order updated successfully!", "success");
      setEditOrderModal(false);
    } catch (err) {
      console.error(err);
      swal("Error!", "Failed to update order.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-20"></div>

      <div className="fixed inset-0 flex items-center justify-center z-30">
        <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-full max-w-4xl mx-auto">
          <h2 className="text-xl mb-4">Edit Order</h2>

          <div className="flex justify-between mb-4">
            <div className="w-1/3 mr-2">
              <label className="block mb-2">
                <span className="text-white">Order Date</span>
              </label>
              <input
                type="date"
                className="p-2 bg-gray-700 rounded w-full"
                value={date}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
              />
              {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
            </div>

            <div className="flex-1 mr-2">
              <label className="block mb-2">
                <span className="text-white">Item Search</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="p-2 bg-gray-700 rounded w-full h-10"
                  placeholder="Search for an item"
                  value={inputName}
                  onChange={handleSearchChange}
                  autoComplete="off"
                  onFocus={() => setShowSuggestions(true)}
                />

                {showSuggestions && filteredItems.length > 0 && (
                  <ul className="absolute bg-gray-700 border border-gray-600 max-h-40 overflow-y-auto mt-2 w-full">
                    {filteredItems.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => selectSuggestion(suggestion)}
                        className="cursor-pointer p-2 hover:bg-gray-600"
                      >
                        {suggestion.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {errors.itemError && <p className="text-red-500 text-sm">{errors.itemError}</p>}
            </div>

            <div className="w-1/4 flex items-center">
              <div className="flex items-center w-full">
                <div className="w-1/2 mr-2">
                  <label className="block mb-2">
                    <span className="text-white">Quantity</span>
                  </label>
                  <input
                    type="number"
                    className="p-2 bg-gray-700 rounded w-full"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <button
                  className="bg-green-600 hover:bg-green-700 mt-7 text-white py-2 px-4 rounded"
                  onClick={handleAddItem}
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {selectedItem && (
            <div className="mb-4">
              <span className="text-white">Selected Item Price: ₹{selectedItem.price}</span>
            </div>
          )}

          {orderDetails.length > 0 && (
            <table className="w-full mb-4 border-collapse">
              <thead>
                <tr className="bg-gray-600">
                  <th className="p-2 border-b-2 text-left">#</th>
                  <th className="p-2 border-b-2 text-left">Item</th>
                  <th className="p-2 border-b-2 text-left">Price</th>
                  <th className="p-2 border-b-2 text-left">Quantity</th>
                  <th className="p-2 border-b-2 text-left">Total</th>
                  <th className="p-2 border-b-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.map((detail, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{detail.item}</td>
                    <td className="p-2">₹{detail.price}</td>
                    <td className="p-2">{detail.quantity}</td>
                    <td className="p-2">₹{detail.price * detail.quantity}</td>
                    <td className="p-2">
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded"
                        onClick={() => removeItem(index)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="flex justify-between items-center">
            <h3 className="text-lg">Total Amount: ₹{calculateTotal()}</h3>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              onClick={handleSubmit}
            >
              Save Changes
            </button>
          </div>

          <button
            className="mt-4 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
            onClick={() => setEditOrderModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default EditOrder;
