import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    totalItems:{
        type:Number,
        default:0
    }
});

const CategoryDb = mongoose.model("CategoryDb", categorySchema);

export default CategoryDb;