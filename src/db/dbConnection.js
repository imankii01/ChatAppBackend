const mongoose = require("mongoose");
require('dotenv').config()
const mongodbConnection = mongoose.connect(`${process.env.MONGODB_URL}`)

module.exports = mongodbConnection