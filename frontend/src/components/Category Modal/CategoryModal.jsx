import React, { useEffect, useState } from "react";
import api from "../../services/api";

const CategoryModal = ({ category, onClose }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      if (category && category.name) {
        setLoading(true);
        try {
          // Call the API to fetch items
          const response = await api.getItems();

          console.log("API Response:", response.data); // Log the response
          if (Array.isArray(response.data)) {
            // Filter items by category
            const filteredItems = response.data.filter(
              (item) => item.category === category.name
            );
            setItems(filteredItems);
          } else {
            console.error("Expected an array, but got:", response);
            setItems([]); // Reset items if the response is not valid
          }
        } catch (error) {
          console.error("Error fetching items:", error);
          setItems([]); // Reset items in case of an error
        } finally {
          setLoading(false);
        }
      }
    };

    fetchItems();
  }, [category]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#23346c] p-4 rounded-md w-1/3">
        <h2 className="text-lg items-center text-[#ffeda5] font-bold mb-4">
          {category.name} Category Items
        </h2>
        <ul>
          {loading ? (
            <div>Loading...</div>
          ) : items.length > 0 ? (
            items.map((item, index) => (
              <li key={index} className="py-2 text-[#ffeda5]">
                {index + 1}. {item.name} - ₹{item.price}
              </li>
            ))
          ) : (
            <li>No items found.</li>
          )}
        </ul>
        <button
          className="mt-4 bg-[#ffeda5] text-[#23346c] px-4 py-2 rounded-md"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CategoryModal;
