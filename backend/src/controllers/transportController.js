const asyncHandler = require("express-async-handler");
const axios = require("axios");

const getRoutes = asyncHandler(async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.EXTERNAL_TRANSPORT_BASE_URL}/api/external/routes`,{},{
        //   headers: {
        //     "x-api-key": process.env.INTERNAL_API_KEY,
        //   },
        //   timeout: 10000,
        }
    );
    const routes = response.data;
    res.status(200).json(routes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching routes", error: error.message });
  }
});

module.exports = {
  getRoutes,
};