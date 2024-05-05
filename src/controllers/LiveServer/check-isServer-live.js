const checkIsServerLive = async (req, res) => {
  try {
    return res.status(200).send({
      status: 200,
      message: "Server is live.",
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  checkIsServerLive,
};
