import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    
    console.log("MongoDB Connected Successfully");
    console.log("Database:", mongoose.connection.db.databaseName);
    console.log("Connection:", process.env.MONGO_URI?.replace(/\/\/.*@/, '//***:***@'));
  })
  .catch(err => {
    
    console.error("MongoDB Connection Failed:", err.message);
    console.log("Make sure MongoDB is running and connection string is correct");
  });

// Routes
app.use("/api/users", userRoutes);

// Example route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// 404 handler for API routes 
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    error: "Not Found",
    availableEndpoints: {
      "GET /api/users": "Get all users",
      "GET /api/users/:id": "Get user by ID", 
      "POST /api/users/add": "Create new user",
      "PUT /api/users/:id": "Update user by ID",
      "DELETE /api/users/:id": "Delete user by ID"
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);
  console.log(`Local: http://localhost:${PORT}`);
  console.log(`API Base: http://localhost:${PORT}/api`);
  console.log("Status: Ready to accept requests");

});
