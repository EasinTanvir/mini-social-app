const { StatusCodes } = require("http-status-codes");

const {
  registerService,
  loginService,
  saveFcmTokenService,
} = require("../services/auth.service");
const {
  registerSchema,
  loginSchema,
} = require("../validations/auth.validation");
const { errorHandler } = require("../utils/errorHandler");

module.exports = {
  registerController: async (req, res, next) => {
    try {
      const validatedData = registerSchema.parse(req.body);

      await registerService(validatedData);

      return res.status(StatusCodes.CREATED).json({
        success: true,
        message: "User registered successfully",
      });
    } catch (error) {
      return errorHandler(error, req, res, next);
    }
  },

  loginController: async (req, res, next) => {
    try {
      const validatedData = loginSchema.parse(req.body);

      const data = await loginService(validatedData);

      return res.status(StatusCodes.OK).json({
        success: true,
        ...data,
      });
    } catch (error) {
      return errorHandler(error, req, res, next);
    }
  },

  saveFcmTokenController: async (req, res, next) => {
    try {
      const { fcmToken } = req.body;

      await saveFcmTokenService(req.userId, fcmToken);

      return res.json({
        success: true,
        message: "FCM token updated",
      });
    } catch (error) {
      return errorHandler(error, req, res, next);
    }
  },
};
