const express = require("express");

const {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  updateRequestStatus,
  assignRequest,
  escalateRequest,
  addComment,
  getComments,
  addResolutionNotes,
  getRequestStats,
} = require("../controllers/requestController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createRequest);

router.get("/", protect, getRequests);

router.get(
  "/stats",
  protect,
  (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin users can view request statistics",
      });
    }

    next();
  },
  getRequestStats
);

router.get("/:id", protect, getRequestById);

router.put("/:id", protect, updateRequest);

router.delete("/:id", protect, deleteRequest);

router.patch("/:id/status", protect, updateRequestStatus);

router.patch("/:id/assign", protect, assignRequest);

router.patch("/:id/escalate", protect, escalateRequest);

router.post("/:id/comments", protect, addComment);

router.get("/:id/comments", protect, getComments);

router.patch("/:id/resolution", protect, addResolutionNotes);

module.exports = router;