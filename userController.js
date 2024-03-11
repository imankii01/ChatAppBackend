// userController.js
const { v4: uuidv4 } = require('uuid');
const User = require('./user');

const saveUserDetails = async (userData) => {
  const { email, name, phoneNumber, age, address } = userData;
  const user_id = uuidv4();
  const user = new User({ email, name, phoneNumber, age, address, user_id });

  await user.validate();
  const savedUser = await user.save();

  return { user_id: savedUser.user_id };
};

const getUserDetails = async (user_id) => {
  try {
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
