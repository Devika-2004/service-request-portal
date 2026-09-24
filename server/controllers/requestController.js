const ServiceRequest = require("../models/ServiceRequest");
const Comment = require("../models/Comment");
const User = require("../models/User");
const Counter = require("../models/Counter");
const sendNotification = require("../utils/notification");
const createRequest = async (req, res) => {
  try {
    const { title, description, category, priority, dueDate } = req.body;

    // Check required fields
    if (!title || !description || !category) {
      return res.status(400).json({
        message: "Please provide title, description and category",
      });
    }

    // Set priority
    const requestPriority = priority || "Medium";

    // Calculate automatic due date
    let calculatedDueDate = dueDate || null;

    if (!dueDate) {
      const daysToAdd = {
        Low: 5,
        Medium: 3,
        High: 2,
        Critical: 1,
      };

      const dueDateValue = new Date();

      dueDateValue.setDate(
        dueDateValue.getDate() +
          daysToAdd[requestPriority]
      );

      calculatedDueDate = dueDateValue;
    }

    // Generate unique request ID
    // Generate unique request ID using counter
const counter = await Counter.findOneAndUpdate(
  { name: "serviceRequest" },
  { $inc: { value: 1 } },
  {
    new: true,
    upsert: true,
  }
);

const requestId = `REQ-2026-${String(
  counter.value
).padStart(3, "0")}`;

    // Create request
    const request = await ServiceRequest.create({
      requestId,
      title,
      description,
      category,
      priority: requestPriority,
      dueDate: calculatedDueDate,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Service request created successfully",
      request,
    });
  } catch (error) {
    console.error(
      "Create request error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    let filter = {};

    // Employee sees only their own requests
    if (req.user.role === "employee") {
      filter.createdBy = req.user._id;
    }

    // Sorting option
    const sortBy = req.query.sortBy || "newest";

    let sortOption = { createdAt: -1 };

    if (sortBy === "oldest") {
      sortOption = { createdAt: 1 };
    }

    if (sortBy === "priority") {
      sortOption = { priority: -1 };
    }

    if (sortBy === "dueDate") {
      sortOption = { dueDate: 1 };
    }

    // Total requests for pagination
    const totalRequests = await ServiceRequest.countDocuments(filter);

    // Get requests for current page
    const requests = await ServiceRequest.find(filter)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalRequests / limit);

    res.status(200).json({
      count: requests.length,
      totalRequests,
      currentPage: page,
      totalPages,
      limit,
      sortBy,
      requests,
    });
  } catch (error) {
    console.error("Get requests error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getRequestById = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
  .populate("createdBy", "name email")
  .populate("assignedTo", "name email")
  .populate("statusHistory.changedBy", "name email");
    

    if (!request) {
      return res.status(404).json({
        message: "Service request not found",
      });
    }

    // Employee can view only their own request
    if (
      req.user.role === "employee" &&
      request.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not allowed to view this request",
      });
    }

    res.status(200).json({
      request,
    });
  } catch (error) {
    console.error("Get request error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const updateRequest = async (req, res) => {
  try {
    const { title, description, category, priority, dueDate } = req.body;

    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Service request not found",
      });
    }

    // Employee can update only their own request
    if (
      req.user.role === "employee" &&
      request.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not allowed to update this request",
      });
    }

    // Only New or Assigned requests can be updated
    if (!["New", "Assigned"].includes(request.status)) {
      return res.status(400).json({
        message: "Only New or Assigned requests can be updated",
      });
    }

    request.title = title || request.title;
    request.description = description || request.description;
    request.category = category || request.category;
   if (priority) {
    const allowedPriorities = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

if (!allowedPriorities.includes(priority)) {
  return res.status(400).json({
    message: "Invalid priority",
  });
}
  request.priority = priority;

  // Recalculate due date when priority changes
  const daysToAdd = {
    Low: 5,
    Medium: 3,
    High: 2,
    Critical: 1,
  };

  if (!dueDate) {
    const newDueDate = new Date();

    newDueDate.setDate(
      newDueDate.getDate() + daysToAdd[priority]
    );

    request.dueDate = newDueDate;
  }
} else if (dueDate) {
  request.dueDate = dueDate;
}

    const updatedRequest = await request.save();

    res.status(200).json({
      message: "Service request updated successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Update request error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const deleteRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Service request not found",
      });
    }

    // Employee can delete only their own request
    if (req.user.role !== "employee") {
  return res.status(403).json({
    message: "Only employees can cancel service requests",
  });
}
    if (
      req.user.role === "employee" &&
      request.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not allowed to delete this request",
      });
    }

    // Only New requests can be cancelled/deleted
    if (request.status !== "New") {
      return res.status(400).json({
        message: "Only New requests can be cancelled",
      });
    }

    await ServiceRequest.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Service request cancelled successfully",
    });
  } catch (error) {
    console.error("Delete request error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "New",
      "Assigned",
      "In Progress",
      "Resolved",
      "Closed",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    // Only support and admin users can change request status
    if (!["support", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Only support or admin users can update request status",
      });
    }

    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Service request not found",
      });
    }

    // Define allowed status transitions
    const allowedTransitions = {
      New: ["Assigned"],
      Assigned: ["In Progress"],
      "In Progress": ["Resolved"],
      Resolved: ["Closed"],
      Closed: [],
    };

    const currentStatus = request.status;

    if (!allowedTransitions[currentStatus].includes(status)) {
      return res.status(400).json({
        message: `Invalid status transition from ${currentStatus} to ${status}`,
      });
    }

    request.status = status;

    request.statusHistory.push({
  from: currentStatus,
  to: status,
  changedBy: req.user._id,
});

   const updatedRequest = await request.save();

res.status(200).json({
  message: "Request status updated successfully",
  request: updatedRequest,
});
  } catch (error) {
    console.error("Update status error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const assignRequest = async (req, res) => {
  try {
    const { assignedTo } = req.body;

    if (!assignedTo) {
      return res.status(400).json({
        message: "Please provide support user ID",
      });
    }

    // Only support and admin users can assign requests
    if (!["support", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Only support or admin users can assign requests",
      });
    }

    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Service request not found",
      });
    }

    // Resolved or Closed requests cannot be assigned
    if (["Resolved", "Closed"].includes(request.status)) {
      return res.status(400).json({
        message: "Resolved or Closed requests cannot be assigned",
      });
    }

    // Check whether assigned user exists
    const supportUser = await User.findById(assignedTo);

    if (!supportUser) {
      return res.status(404).json({
        message: "Support user not found",
      });
    }

    // Check whether assigned user is actually support/admin
    if (!["support", "admin"].includes(supportUser.role)) {
      return res.status(400).json({
        message: "Request can only be assigned to a support or admin user",
      });
    }
    const previousStatus = request.status;
    request.assignedTo = supportUser._id;

    if (request.status === "New") {
      request.status = "Assigned";

        request.statusHistory.push({
        from: previousStatus,
        to: "Assigned",
        changedBy: req.user._id,
  });
    }

   const updatedRequest = await request.save();

sendNotification({
  type: "Request Assignment",
  requestId: request.requestId,
  message: `Request ${request.requestId} has been assigned to ${supportUser.name}`,
});

res.status(200).json({
  message: "Request assigned successfully",
  request: updatedRequest,
});
  } catch (error) {
    console.error("Assign request error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const escalateRequest = async (req, res) => {
  try {
    if (!["support", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Only support or admin users can escalate requests",
      });
    }

    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Service request not found",
      });
    }

    if (request.status === "Closed") {
      return res.status(400).json({
        message: "Closed requests cannot be escalated",
      });
    }

    request.escalated = true;

    const updatedRequest = await request.save();

    res.status(200).json({
      message: "Request escalated successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Escalate request error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const addComment = async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        message: "Please provide a comment",
      });
    }

    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Service request not found",
      });
    }

    // Employee can comment only on their own request
    if (req.user.role !== "employee") {
  return res.status(403).json({
    message: "Only employees can update service requests",
  });
}

    if (
      req.user.role === "employee" &&
      request.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not allowed to comment on this request",
      });
    }

    const newComment = await Comment.create({
      requestId: request._id,
      userId: req.user._id,
      comment: comment.trim(),
    });

    const populatedComment = await Comment.findById(newComment._id)
      .populate("userId", "name email role");

    res.status(201).json({
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (error) {
    console.error("Add comment error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getComments = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Service request not found",
      });
    }

    // Employee can view comments only on their own request
    if (
      req.user.role === "employee" &&
      request.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not allowed to view comments for this request",
      });
    }

    const comments = await Comment.find({
      requestId: request._id,
    })
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: comments.length,
      comments,
    });
  } catch (error) {
    console.error("Get comments error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const addResolutionNotes = async (req, res) => {
  try {
    const { resolutionNotes } = req.body;

    if (!resolutionNotes || !resolutionNotes.trim()) {
      return res.status(400).json({
        message: "Please provide resolution notes",
      });
    }

    // Only support and admin can add resolution notes
    if (!["support", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Only support or admin users can add resolution notes",
      });
    }

    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Service request not found",
      });
    }

    if (request.status !== "In Progress") {
      return res.status(400).json({
        message:
          "Resolution notes can only be added to In Progress requests",
      });
    }

    request.resolutionNotes = resolutionNotes.trim();

    const updatedRequest = await request.save();

    res.status(200).json({
      message: "Resolution notes added successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Add resolution notes error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getRequestStats = async (req, res) => {
  try {
    const totalRequests = await ServiceRequest.countDocuments();

    const newRequests = await ServiceRequest.countDocuments({
      status: "New",
    });

    const assignedRequests = await ServiceRequest.countDocuments({
      status: "Assigned",
    });

    const inProgressRequests = await ServiceRequest.countDocuments({
      status: "In Progress",
    });

    const resolvedRequests = await ServiceRequest.countDocuments({
      status: "Resolved",
    });

    const closedRequests = await ServiceRequest.countDocuments({
      status: "Closed",
    });

    const highPriorityRequests = await ServiceRequest.countDocuments({
      priority: { $in: ["High", "Critical"] },
    });

    // Overdue requests:
    // Due date has passed and request is not yet Resolved or Closed
    const overdueRequests = await ServiceRequest.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $nin: ["Resolved", "Closed"] },
    });

    const categoryStats = await ServiceRequest.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const statusStats = await ServiceRequest.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const priorityStats = await ServiceRequest.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      totalRequests,
      newRequests,
      assignedRequests,
      inProgressRequests,
      resolvedRequests,
      closedRequests,
      highPriorityRequests,
      overdueRequests,
      categoryStats,
      statusStats,
      priorityStats,
    });
  } catch (error) {
    console.error("Get request stats error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};
module.exports = {
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
};