const { StatusCodes } = require("http-status-codes");
const { HttpError } = require("./HttpError");
const { ZodError } = require("zod");

module.exports = {
  errorHandler: (error, req, res, next) => {
    if (error instanceof ZodError) {
      const formattedErrors = error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      const message = formattedErrors
        .map((e) => `${e.field}: ${e.message}`)
        .join(", ");

      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        status: StatusCodes.BAD_REQUEST,
        message,
        errors: formattedErrors,
      });
    }

    next(error);
  },

  // root page
  errorMethod: (error, req, res, next) => {
    if (res.headerSent) {
      return next(error);
    }
    res.status(error.code || 500).json({
      success: false,
      message: error.message || "Unknown error occurred",
    });
  },
  invalidRoutes: (req, res, next) => {
    const errors = new HttpError("no routes found for this endpoint", 404);
    return next(errors);
  },
};
