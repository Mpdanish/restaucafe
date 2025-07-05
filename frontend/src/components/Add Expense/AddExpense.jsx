import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import api from "../../services/api";

const AddExpense = ({ setAddExpenseModal }) => {


  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; // For input
  };
  const [date, setDate] = useState(formatDate(new Date()));
  const [expenseDetail, setExpenseDetail] = useState("");
  const [totalExpense, setTotalExpense] = useState(0);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    // Set the default date to today in YYYY-MM-DD format
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Format to YYYY-MM-DD
    setDate(formattedDate);
  }, []);

  // Function to validate the form before submission
  const validateForm = () => {
    if (!date || !expenseDetail || !totalExpense) {
      swal("Error!", "Please fill out all required fields", "error");
      return false;
    }
    return true;
  };

  // Function to handle form submission and call API
  const handleSave = async () => {
    const formData = {
      date: new Date(date), // Ensure date is a Date object
      expenseDetail,
      totalExpense,
    };

    if (validateForm()) {
      try {
        setLoading(true);
        const data = await api.addExpense(formData);

        if (data.error) {
          swal("Error!", data.errors[0], "error");
          return;
        }

        swal("Success!", "Expense added successfully!", "success");
        setAddExpenseModal(false); // Close modal after saving
      } catch (err) {
        console.error(err);
        swal("Error!", "Failed to add expense.", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold mb-4 text-white">Add Expense</h2>
          <p className="cursor-pointer" onClick={() => setAddExpenseModal(false)}>X</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="form-group">
            <label className="block text-sm font-medium mb-1 text-white">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-400 rounded-md p-2 w-full bg-gray-700 text-white"
              max={date} // Set max date to today
              required
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-1 text-white">Expense Detail</label>
            <input
              type="text"
              value={expenseDetail}
              onChange={(e) => setExpenseDetail(e.target.value)}
              className="border border-gray-400 rounded-md p-2 w-full bg-gray-700 text-white"
              required
            />
          </div>
        </div>

        <div className="form-group mb-4">
          <label className="block text-sm font-medium mb-1 text-white">Total Expense</label>
          <input
            type="number"
            value={totalExpense}
            onChange={(e) => setTotalExpense(parseFloat(e.target.value))}
            className="border border-gray-400 rounded-md p-2 w-full bg-gray-700 text-white"
            required
          />
        </div>

        <div className="form-group">
          <button onClick={handleSave} disabled={loading} className="bg-blue-600 text-white rounded-md p-2 w-full">
            {loading ? "Saving..." : "Save Expense"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
