const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongodbConnection = require("./src/db/dbConnection");
const { userRouter } = require("./src/routes/user/user.router");
const { publicRouter } = require("./src/routes/public/public.router");

const app = express();
const PORT = `${process.env.PORT}` || 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes

app.use("/auth", userRouter);
app.use("/public", publicRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start server
app.listen(PORT, async () => {
  try {
    await mongodbConnection;
    console.log("MongoDB connected");
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit the process if MongoDB connection fails
  }
});
