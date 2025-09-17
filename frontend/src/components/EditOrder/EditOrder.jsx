import React, { useEffect, useState } from "react";
import api from "../../services/api";
import swal from "sweetalert";
import LoadingSpinner from "../spinner/Spinner";

const EditOrder = ({ setEditOrderModal, existingOrder, isUpdated, setIsUpdated }) => {
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

  const normalizeDetails = (details) => {
    if (!Array.isArray(details)) return [];
    return details.map((d) => {
      const qty = Math.max(1, Number(d.quantity) || 1);
      const rawPrice = Number(d.price);
      const derivedPrice = !Number.isNaN(rawPrice)
        ? rawPrice
        : (Number(d.total) || 0) / qty;
      const price = Number.isFinite(derivedPrice) ? derivedPrice : 0;
      const total = price * qty;
      return { ...d, quantity: qty, price, total };
    });
  };

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
    const incomingDate = existingOrder?.Date || existingOrder?.date;
    if (incomingDate) {
      const parsed = new Date(incomingDate);
      if (!isNaN(parsed)) {
        setDate(formatDate(parsed));
      } else {
        setDate(formatDate(new Date()));
      }
    } else {
      setDate(formatDate(new Date()));
    }
    setOrderDetails(normalizeDetails(existingOrder.orderDetails || []));
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
      const qty = Number(detail.quantity) || 0;
      const price = Number(detail.total) || 0;
      return total + price;
    }, 0);
  };

  const handleAddItem = () => {
    if (!selectedItem) {
      setErrors({ ...errors, itemError: "Please select an item." });
      return;
    }
    // Prevent duplicate items
    const isDuplicate = orderDetails.some(
      (d) => String(d.item).toUpperCase() === String(selectedItem.name).toUpperCase()
    );
    if (isDuplicate) {
      setErrors({ ...errors, itemError: "Item already added." });
      return;
    }
    const parsedQty = Math.max(1, Number(quantity) || 1);
    const newOrderDetail = {
      item: selectedItem.name,
      quantity: parsedQty,
      price: selectedItem.price,
      total: selectedItem.price * parsedQty, // Calculate total based on quantity
    };
    setOrderDetails([...orderDetails, newOrderDetail]);
    setSelectedItem(null);
    setQuantity(1);
    setInputName("");
  };

  const handleRowQuantityChange = (index, value) => {
    // Avoid empty string causing zero totals while typing
    if (value === "") return;
    const parsed = Math.max(1, parseInt(value, 10) || 1);
    setOrderDetails((prev) =>
      prev.map((d, i) =>
        i === index
          ? { ...d, quantity: parsed, total: (Number(d.price) || 0) * parsed }
          : d
      )
    );
  };

  const incrementQuantity = (index) => {
    setOrderDetails((prev) =>
      prev.map((d, i) =>
        i === index
          ? {
              ...d,
              quantity: Number(d.quantity) + 1,
              total: (Number(d.price) || 0) * (Number(d.quantity) + 1),
            }
          : d
      )
    );
  };

  const decrementQuantity = (index) => {
    setOrderDetails((prev) =>
      prev.map((d, i) => {
        if (i !== index) return d;
        const nextQty = Math.max(1, Number(d.quantity) - 1);
        return { ...d, quantity: nextQty, total: (Number(d.price) || 0) * nextQty };
      })
    );
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
      const orderId = existingOrder?._id || existingOrder?.id;
      const result = await api.updateOrder(orderId, formData);
      if (result.error) {
        swal("Error!", result.message, "error");
        
        return;
      }
      swal("Success!", "Order updated successfully!", "success");
      if (typeof setIsUpdated === 'function') {
        setIsUpdated(!isUpdated);
      }
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
                    <td className="p-2">₹{Number(Number(detail.price).toFixed(2))}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <button
                          className="bg-gray-600 hover:bg-gray-700 text-white px-2 rounded"
                          onClick={() => decrementQuantity(index)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={1}
                          className="p-1 bg-gray-700 rounded w-16 text-center"
                          value={detail.quantity}
                          onChange={(e) => handleRowQuantityChange(index, e.target.value)}
                        />
                        <button
                          className="bg-gray-600 hover:bg-gray-700 text-white px-2 rounded"
                          onClick={() => incrementQuantity(index)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-2">₹{Number(((Number(detail.price) || 0) * (Number(detail.quantity) || 0)).toFixed(2))}</td>
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
