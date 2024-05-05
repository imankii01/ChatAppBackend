const mongoose = require("mongoose");
const UpdateUserSchema = require("../../models/UpdateUserSchema");
const dbUser = mongoose.model("dbUpdateUser", UpdateUserSchema, "users");

const updateUserDetails = async (req, res) => {
  try {
    const { user_id } = req.query;
    const data = req.body;
    const User = await dbUser.findOne({ user_id: user_id });

    if (!User) {
      return res.status(404).send("User not found");
    }

    const updatedUser = await dbUser.findOneAndUpdate(
      { user_id },
      {
        $set: data,
        $unset: {
          user_id: "",
          email: "",
        },
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).send("something went wrong");
    }

    return res.status(200).send({
      message: "updated Successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).send("Internal server error");
  }
};

module.exports = { updateUserDetails };
