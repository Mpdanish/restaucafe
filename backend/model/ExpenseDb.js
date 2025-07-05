import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    date:{
        type:Date,
        required:true
    },
    expenseDetail:{
        type:String,
        required:true
    },
    totalExpense:{
        type:Number,
        required:true
    },
});

const ExpenseDb = mongoose.model("Expense", expenseSchema);

export default ExpenseDb;
