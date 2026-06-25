const { StatusCodes } = require("http-status-codes");

const prismaCli = require("../utils/prismaCli");
const { verifyJwt } = require("../lib/jwt");
const { HttpError } = require("../utils/HttpError");

module.exports = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new HttpError("Unauthorized", StatusCodes.UNAUTHORIZED);
    }

    const token = authorization.split(" ")[1];

    const decoded = verifyJwt(token);

    if (!decoded) {
      throw new HttpError("Invalid or expired token", StatusCodes.UNAUTHORIZED);
    }

    req.userId = decoded.id;

    next();
  } catch (error) {
    next(error);
  }
};
