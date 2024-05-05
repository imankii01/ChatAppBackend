
const { Router } = require("express");
const publicRouter = Router()
const { checkIsServerLive } = require("../../controllers/LiveServer/check-isServer-live");
publicRouter.get("/check-server", checkIsServerLive);

module.exports = { publicRouter };
