const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      unique: true,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "IT Support",
        "Hardware",
        "Software",
        "Access Request",
        "Network",
        "HR/Admin",
      ],
      required: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: [
        "New",
        "Assigned",
        "In Progress",
        "Resolved",
        "Closed",
      ],
      default: "New",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    resolutionNotes: {
      type: String,
      default: "",
    },

    dueDate: {
      type: Date,
      default: null,
    },
    statusHistory: [
  {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
],
    escalated: {
  type: Boolean,
  default: false,
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);