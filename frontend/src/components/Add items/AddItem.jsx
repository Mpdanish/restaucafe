import React, { useEffect, useState } from "react";
import api from "../../services/api";
import swal from 'sweetalert';
import LoadingSpinner from "../spinner/Spinner";

const AddItem = ({ setAddItemModal }) => {
  // State for form fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories , setCategories] = useState([])

  // State for validation errors
  const [errors, setErrors] = useState({
    name: "",
    category: "",
    price: "",
  });

  useEffect(()=>{
    const fetchCategories = async ()=>{
        try {
            const result = await api.getCatogory()
            console.log("result : " ,result)
            if(!result.error){
                setCategories(result.data)
            }else{
                swal("!error","something went wrong!","error")
            }
        } catch (error) {
            console.log(error)
        }
    }
    fetchCategories()
    console.log("categories : ",categories)
  },[])

  // Handle input changes
  const handleFieldChange = (setter, fieldName) => (event) => {
    setter(event.target.value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: event.target.value === "" ? "This field is required." : "",
    }));
  };

  // Validation function
  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", category: "", price: "" };

    if (!name) {
      newErrors.name = "Name is required.";
      isValid = false;
    }
    if (!category) {
      newErrors.category = "Category is required.";
      isValid = false;
    }
    if (!price) {
      newErrors.price = "Price is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle Save button click
  const handleSave = async () => {
    const formData = { name, category, price };
    if (validateForm()) {
      try {
        setLoading(true);
        const data = await api.addItem(formData);
        if (data.error) {
          setErrors({name:data.message})
          return;
        }
        swal("Success!", "Item added successfully!", "success");
        setAddItemModal(false); // Close the modal after saving
      } catch (err) {
        console.error(err);
        swal("Error!", "Failed to add item.", "error");
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Form has errors.");
    }
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-20"></div>
      <div className="fixed inset-0 flex items-center justify-center z-30">
        <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-auto">
          <h2 className="text-xl mb-4">Add Item</h2>

          <div className="mb-4">
            <label className="block">
              <span className="text-white">Name</span>
              <input
                type="text"
                value={name.toUpperCase()}
                onChange={(e)=> setName(e.target.value.toUpperCase())}
                placeholder="Enter Name"
                className="p-2 bg-gray-700 rounded w-full"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </label>
          </div>

          <div className="mb-4">
            <label className="block">
              <span className="text-white">Category</span>
              <select
                value={category}
                onChange={handleFieldChange(setCategory, "category")}
                className="p-2 bg-gray-700 rounded w-full"
              >
                <option value="">Select Category</option>
                {categories.map((cat,i)=>(
                <option id={i} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
            </label>
          </div>

          <div className="mb-4">
            <label className="block">
              <span className="text-white">Price</span>
              <input
                type="number"
                value={price}
                onChange={handleFieldChange(setPrice, "price")}
                placeholder="Enter Price"
                className="p-2 bg-gray-700 rounded w-full"
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
            </label>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setAddItemModal(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-teal-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddItem;
