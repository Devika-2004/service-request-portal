const express = require("express");

const {
  getSupportUsers,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/support", protect, (req, res, next) => {
  if (!["support", "admin"].includes(req.user.role)) {
    return res.status(403).json({
      message: "Only support or admin users can view support users",
    });
  }

  next();
}, getSupportUsers);

module.exports = router;