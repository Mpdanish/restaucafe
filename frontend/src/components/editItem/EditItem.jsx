import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import api from '../../services/api';
import LoadingSpinner from '../spinner/Spinner';
import swal from 'sweetalert';

const EditModal = ({ isOpen, onClose, item }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [price, setPrice] = useState('');
  const [loading , setLoading ] = useState(false)
  // Effect to fetch categories when the modal opens
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const result = await api.getCatogory();
        console.log("result: ", result);
        if (!result.error) {
          setCategories(result.data);
          if (item) {
            setName(item.name || '');
            setCategory(item.category || '');
            setPrice(item.price || '');
          }
        } else {
          swal("Error", "Something went wrong!", "error");
        }
      } catch (error) {
        console.log(error);
        swal("Error", "Could not fetch categories!", "error");
      } finally {
        setLoading(false)
      }
    };
    fetchCategories();
  }, [item]); // Run this effect whenever the item changes

  const handleSubmit = async (e) => {
    console.log('submited')
    e.preventDefault();

    try {
        setLoading(true)
        const result = await api.updateItem({ price, name, category ,id:item._id });
        
        if (result.error) {
          swal("Error", result.error.message || "An error occurred while updating the item.", "error");
        } else {
            swal("Success", "Item updated successfully!", "success");
            onClose();
        }
        
    } catch (error) {
        console.log(error)
    } finally {
        setLoading(false)
    }
    

  };
  

  return (
    <>
    {loading && <LoadingSpinner/>}
    <Modal
      isOpen={isOpen && !loading}
      onRequestClose={onClose}
      contentLabel="Edit Item"
      className="fixed inset-0 flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-semibold text-blue-600 mb-4">Edit Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name:</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Category:</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Price:</label>
            <input 
              type="number" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              required 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end">
            <button 
              type="submit" 
              className="mr-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
              Save
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
      </>
  );
};

export default EditModal;
