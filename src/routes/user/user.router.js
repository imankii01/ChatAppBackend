const { Router } = require("express");
const { createNewUser } = require("../../controllers/user/signup");
const { login } = require("../../controllers/user/login.controller");
const { getUserDetails } = require("../../controllers/user/get-user-details");
const tokenMiddleware = require("../../middleware/tokenMiddleware ");
const {
  updateUserDetails,
} = require("../../controllers/user/update-user-details");
const {
  forgetPasswordLinkGenerator,
} = require("../../controllers/user/forget-Password-Link-Generator");
const { updatePassword } = require("../../controllers/user/update-password");
const { getAllUserDetails } = require("../../controllers/user/get-all-user");

const userRouter = Router();

userRouter.post("/signup", createNewUser);
userRouter.post("/login", login);
userRouter.post("/forget-password-link", forgetPasswordLinkGenerator);
userRouter.put("/update-password", updatePassword);
userRouter.get("/get-user-details", tokenMiddleware, getUserDetails);
userRouter.get("/get-all-user", tokenMiddleware, getAllUserDetails);
userRouter.put("/update-user-details", tokenMiddleware, updateUserDetails);

module.exports = { userRouter };
