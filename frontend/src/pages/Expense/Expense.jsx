import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import ExpenseBody from "../../components/Expense Body/ExpenseBody";
import AddExpense from "../../components/Add Expense/AddExpense";


const Expense = () => {
    const [addExpenseModal, setAddExpenseModal] = useState(false);

  return (
    <>
      <Navbar setAddExpenseModal={setAddExpenseModal} />
      <ExpenseBody addExpenseModal={addExpenseModal} />
      {addExpenseModal && <AddExpense setAddExpenseModal={setAddExpenseModal} />}
    </>
  );
};

export default Expense;
