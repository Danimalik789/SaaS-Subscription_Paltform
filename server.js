const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables first
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB Atlas", err);
  });

const app = express();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
