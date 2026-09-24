const sendNotification = ({
  type,
  requestId,
  message,
}) => {
  console.log("📧 Email Notification Simulation");
  console.log("Type:", type);
  console.log("Request:", requestId);
  console.log("Message:", message);
};

module.exports = sendNotification;