import React, { useEffect, useState } from "react";
import api from "../../services/api";
import AddCategory from "../Add Category/AddCategory";
import CategoryModal from "../Category Modal/CategoryModal";
import searchIcon from "../../assets/searchIcon.svg";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

function CatogeryBody() {
  const [categories, setCategories] = useState([]);
  const [addCategory, setAddCategory] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const [isUpdated, setIsUpdated ] = useState(false)
  const handleViewClick = (category) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCategory(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await api.getCatogory();
        console.log(result);
        if (!result.error) {
          setCategories(result.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [addCategory ,isUpdated]);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleDelete = async (entryId) => {
    const { value: password } = await Swal.fire({
        title: 'Confirm Deletion',
        input: 'password',
        inputLabel: 'Please enter your password',
        inputPlaceholder: 'Password',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
            if (!value) {
                return 'You need to enter a password!';
            }
            if (value !== '4321') {
                return 'Incorrect Password';
            }
        }
    });

    if (password === '4321') {
        try {
            // Send DELETE request with ID as a query parameter
            const result = await api.deleteCategory(entryId)
            if(result.error){
              Swal.fire('Error', 'There was an error deleting the Category.', 'error')
            }else {
              setIsUpdated(!isUpdated)
              Swal.fire('Deleted!', 'Your Category has been deleted.', 'success')
            }
        } catch (error) {
            console.error('Error deleting Category:', error);
            Swal.fire('Error', 'There was an error deleting the Category.', 'error');
        }
    }
};


const handleUpdate = async (entry) => {
  const { value: password } = await Swal.fire({
    title: 'Confirm Update',
    input: 'password',
    inputLabel: 'Please enter your password',
    inputPlaceholder: 'Password',
    showCancelButton: true,
    confirmButtonText: 'Continue',
    cancelButtonText: 'Cancel',
    inputValidator: (value) => {
      if (!value) {
        return 'You need to enter a password!';
      }
      if (value !== '4321') { // Replace with your actual password verification logic
        return 'Incorrect Password!';
      }
    }
  });

  // Only proceed if the password is correct
  if (password === '4321') {
    // Show the update modal for further edits
    const { value: name } = await Swal.fire({
      title: 'Update Category',
      html: `
        <div style="margin-bottom: 10px;">
          <label for="name" style="display: block; margin-bottom: 2px; font-weight: bold;">Category Name:</label>
          <input id="name" type="text" class="swal2-input" style="width: 250px; height: 36px; padding: 8px; box-sizing: border-box;" value="${entry.name}">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          name: document.getElementById('name').value,
        };
      }
    });
    

    // Check if the user confirmed the update
    if (name) {
      try {
        const result = await api.updateCategory(entry._id, name); 
        if(!result.error){
          setIsUpdated(!isUpdated)
          Swal.fire('Updated!', 'Your Category has been updated.', 'success');
        }else{
          Swal.fire('Error', 'There was an error updating the Category.', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'There was an error updating the Category.', 'error');
        console.error('Error updating expense:', error);
      }
    }
  }
};

  return (
    <>
      {addCategory && <AddCategory setAddCategoryModal={setAddCategory} />}
      <div className="min-h-screen bg-[#23346c] p-10 text-gray-100 relative">
        <div className="flex justify-end gap-4 items-center mb-8">
          <button
            onClick={() => setAddCategory(true)}
            className="bg-blue-500 px-4 py-2 rounded-md text-white hover:bg-blue-700"
          >
            Add Category
          </button>

          <div className="bg-[#00BDD6] bg-opacity-10 px-2 border border-[#00BDD6] rounded-lg">
            <div className="flex flex-row">
              <img src={searchIcon} alt="" />
              <input
                type="text"
                placeholder="Search category..."
                className="w-64 h-10 px-3 rounded bg-transparent text-white outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table-auto  w-full text-left">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Category Name</th>
                <th className="px-4 py-2">Total Items</th>
                <th className="px-4 py-2">View</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody className="bg-gray-700">
              {filteredCategories.map((cat, index) => (
                <tr key={index} className="border-b border-gray-600">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{cat.name}</td>
                  <td className="px-4 py-2">{cat.totalItems}</td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-green-500 px-3 py-1 rounded-md text-white hover:bg-green-700"
                      onClick={() => handleViewClick(cat)}
                    >
                      View
                    </button>
                  </td>
                  <td className="px-4 py-2 flex gap-3">
                    <FaTrash onClick={()=> handleDelete(cat._id)} className="text-red-600 cursor-pointer"/>
                    <FaEdit onClick={()=> handleUpdate(cat)} className="text-blue-700 cursor-pointer"/>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <CategoryModal category={selectedCategory} onClose={closeModal} />
      )}
    </>
  );
}

export default CatogeryBody;
