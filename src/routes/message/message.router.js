const { sendMessage } = require("../../controllers/message/send-message");
const { getMessage } = require("../../controllers/message/get-message");
const tokenMiddleware = require("../../middleware/tokenMiddleware ");
const { Router } = require("express");




const messageRouter = Router();
messageRouter.post("/send-message", tokenMiddleware, sendMessage);
messageRouter.get("/get-message", tokenMiddleware, getMessage);

module.exports = { messageRouter };
