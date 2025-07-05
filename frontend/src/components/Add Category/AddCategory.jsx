import React, { useState } from "react";
import api from "../../services/api";
import swal from "sweetalert";
import LoadingSpinner from "../spinner/Spinner";

const AddCategory = ({ setAddCategoryModal }) => {
  // State for the category name
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to handle form validation
  const validate = () => {
    if (!categoryName.trim()) {
      setError("Category name is required.");
      return false;
    }
    setError(""); // Clear error if validation passes
    return true;
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    const formData = { categoryName };
    console.log(categoryName)

    try {
      const result = await api.addCategory(formData);
      if (result.error) {
        setError(result.message)
        return;
      }
      swal("Success!", "Category added successfully!", "success");
      setAddCategoryModal(false); // Close the modal after saving
    } catch (err) {
      console.error(err);
      swal("Error!", "Failed to add category.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-20"></div>

      {/* Popup Form */}
      <div className="fixed inset-0 flex items-center justify-center z-30">
        <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-auto">
          <h2 className="text-xl mb-4">Add Category</h2>

          {/* Category Name Input */}
          <div className="mb-6">
            <label className="block mb-2">Category Name</label>
            <input
              type="text"
              className={`p-2 ${error ? 'border-red-600 border-2':''} bg-gray-700 rounded w-full`}
              value={categoryName.toUpperCase()}
              onChange={(e) => setCategoryName(e.target.value.toUpperCase())}
              placeholder="Enter category name"
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end">
            <button
              onClick={() => setAddCategoryModal(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCategory;
