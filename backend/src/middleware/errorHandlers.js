export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

export const errorHandler = (error, req, res, next) => {
  if (error?.code === "P2002") {
    return res.status(409).json({ message: `A record with this ${error.meta?.target?.join(", ") || "value"} already exists.` });
  }

  if (error?.code === "P2025") {
    return res.status(404).json({ message: "Record not found." });
  }

  if (error?.name === "MulterError") {
    return res.status(400).json({ message: error.message });
  }

  const statusCode = error.statusCode || 500;

  if (statusCode >= 500) {
    console.error("Unhandled error:", error);
  }

  res.status(statusCode).json({
    message: statusCode >= 500 ? "Something went wrong. Please try again." : error.message,
  });
};
