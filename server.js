const express = require("express");
const dotenv = require("dotenv");
const db = require("./db");
const User = require("./models/User");

dotenv.config();

const app = express();
const port = process.env.PORT || 6222;

app.use(express.json());
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to database"));

app.get("/api/v1/getUsers", async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
        return res.status(404).json({
          status: "fail",
          message: "User not found",
        });
      }
    res.status(200).json({
      status: "success",
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Error retrieving users",
    });
  }
});

app.get("/api/v1/getUser/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // Check if user exists
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "User retrieved successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Error retrieving user",
      error: err.message,
    });
  }
});

app.post("api/v1/createUser", async (req, res) => {
  const body = req.body;
  try {
    const user = new User(body);
    await user.save();
    res.status(200).send({
      status: "success",
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error creating user",
      error: error,
    });
  }
});

app.put("/api/v1/update/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error updating user",
      error: err.message,
    });
  }
});

app.delete("/api/v1/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Error deleting user",
      error: err.message,
    });
  }
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
