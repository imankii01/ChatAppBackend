// userController.js
const { v4: uuidv4 } = require('uuid');
const User = require('./user');

const saveUserDetails = async (userData) => {
  console.log("userData", userData);
  const { email, name, phoneNumber, age, address } = userData;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log(`User with email ${email} already exists. Not saving the data.`);
      return existingUser;
    }

    // Define the user schema
    const userSchema = new User({
      email,
      name,
      phoneNumber,
      age,
      address
    });

    // Validate the user data against the schema
    await userSchema.validate();

    // Generate a unique user_id
    const user_id = uuidv4();
    console.log("user_id", user_id);

    // Create a new user instance with the generated user_id
    const user = new User({ email, name, phoneNumber, age, address, user_id });

    // Save the user to the database
    const savedUser = await user.save();

    return { user_id: savedUser.user_id };
  } catch (error) {
    console.error("Error saving user:", error);
    return null; // Return null if there's an error saving the user
  }
};

const getUserDetails = async (user_id) => {
  console.log("user_id",user_id)
  try {
    // Validate user_id format
    if (!user_id || typeof user_id !== 'string' || user_id.trim() === '') {
      throw new Error('Invalid user_id');
    }

    const user = await User.findOne({ user_id });

    return user
      ? { success: true, user }
      : { success: false, message: 'User not found' };
  } catch (error) {
    console.error('Error fetching user details:', error);
    return { success: false, error: 'Internal Server Error' };
  }
};



const updateUserDetails = async (user_id, userData) => {
  try {
    const { email, name, phoneNumber, age, address } = userData;
    const updatedUser = await User.findOneAndUpdate(
      { user_id },
      { email, name, phoneNumber, age, address },
      { new: true }
    );

    return updatedUser
      ? { success: true, user_id: updatedUser.user_id }
      : { success: false, message: 'User not found' };
  } catch (error) {
    console.error('Error updating user details:', error);
    return { success: false, error: 'Internal Server Error' };
  }
};

module.exports = { saveUserDetails, getUserDetails, updateUserDetails };
