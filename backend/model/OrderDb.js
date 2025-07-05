import mongoose from "mongoose";
import moment from "moment"; // Ensure moment is installed: npm install moment

// Define the counter schema
const counterSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    sequence_value: {
        type: Number,
        default: 0,
    },
    lastReset: {
        type: Date, // Store the last reset date
        default: Date.now,
    },
});

const Counter = mongoose.model('Counter', counterSchema);

// Define order schema
const orderSchema = new mongoose.Schema({
    Date: {
        type: Date,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    orderDetails: [
        {
            item: {
                type: String,
            },
            quantity: {
                type: Number,
            },
            total: {
                type: Number,
            },
        },
    ],
    referenceNumber: {
        type: String,
        unique: true,
    },
    paymentMethod:{
        type: String,
        default: "Pending"
    }
});

// Pre-save hook to generate unique reference number
orderSchema.pre('save', async function (next) {
    const order = this;

    // Only generate reference number if it's not already set
    if (!order.referenceNumber) {
        try {
            // Find the counter document and increment the sequence value atomically
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'orderReference' },
                { $inc: { sequence_value: 1 } },
                { new: true, upsert: true }  // Create the document if it doesn't exist
            );

            // Check if the date has changed
            const currentDate = moment().startOf('day'); // Get the current date at start of the day
            const lastResetDate = moment(counter.lastReset).startOf('day'); // Get the last reset date at start of the day

            if (!currentDate.isSame(lastResetDate)) {
                counter.sequence_value = 0; 
                counter.lastReset = Date.now(); 
                await counter.save(); 
            }


            const newReferenceNumber = `#${currentDate.format('YYYYMMDD')}${counter.sequence_value.toString().padStart(5, '0')}`;
            order.referenceNumber = newReferenceNumber;

        } catch (error) {
            return next(error); 
        }
    }

    next(); // Proceed to the next middleware
});

// Create and export order model
const orderDb = mongoose.model("Order", orderSchema);

export default orderDb;
