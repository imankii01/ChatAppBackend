const { default: mongoose } = require("mongoose");
const dbUserDetails = mongoose.connection.collection("users");

const getAllUserDetails = async (req, res) => {
  try {
    const userData = await dbUserDetails
      .find({}, { projection: { _id: 0, created_at: 0, password: 0, __v: 0 } })
      .toArray();

    if (userData && userData.length > 0) {
      res.status(200).json(userData);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  getAllUserDetails,
};
