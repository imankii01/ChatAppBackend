const { default: mongoose } = require("mongoose");
const dbUserDetails = mongoose.connection.collection("users");
const getUserDetails = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).send("user ID is missing");
    }
    const UserData = await dbUserDetails.findOne(
      { user_id },
      {
        projection: {
          _id: 0,
          created_at: 0,
          password: 0,
          email: 0,
          __v: 0,
        },
      }
    );

    if (UserData) {
      return res.status(200).send(UserData);
    } else {
      return res.status(404).send("user details not found");
    }
  } catch (error) {
    console.error(error);

    return res.status(500).send("Internal server error");
  }
};

module.exports = {
  getUserDetails,
};
