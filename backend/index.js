import express from "express";
import cors from "cors";
import 'dotenv/config';
import router from "./Router.js";
import connectDB from "./database/connection.js";

const app = express();

// CORS options
const corsOptions = {
  origin: ["http://localhost:5173", "https://restaucafe.vercel.app"], // Specific frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

// Use CORS middleware with options
app.use(cors(corsOptions));

// Preflight requests handler
app.options('*', cors(corsOptions));

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Connect to the database
connectDB();

// Health check route
app.get("/", async (req, res) => {
  try {
    res.status(200).json("Hello, working fine");
  } catch (error) {
    console.error("Error initializing app:", error);
    res.status(500).json({ error: "Initialization error" });
  }
});

// API routes
app.use('/api', router);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
