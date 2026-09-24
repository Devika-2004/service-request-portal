const User = require("../models/User");

const getSupportUsers = async (req, res) => {
  try {
    const supportUsers = await User.find({
      role: "support",
    }).select("_id name email role");

    res.status(200).json({
      count: supportUsers.length,
      users: supportUsers,
    });
  } catch (error) {
    console.error("Get support users error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getSupportUsers,
};