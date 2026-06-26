const { StatusCodes } = require("http-status-codes");

const { prismaCli } = require("../utils/prismaCli");
const { HttpError } = require("../utils/HttpError");
const { hashPassword, verifyPassword } = require("../lib/bcrypt");
const { createJwt } = require("../lib/jwt");

module.exports = {
  registerService: async ({ username, email, password }) => {
    const existingEmail = await prismaCli.user.findUnique({
      where: {
        email,
      },
    });

    if (existingEmail) {
      throw new HttpError("Email already exists", StatusCodes.CONFLICT);
    }

    const existingUsername = await prismaCli.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUsername) {
      throw new HttpError("Username already exists", StatusCodes.CONFLICT);
    }

    const hashedPassword = await hashPassword(password);

    const user = await prismaCli.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...safeUser } = user;

    return {
      message: "User registered successfully",
      user: safeUser,
    };
  },

  loginService: async ({ email, password }) => {
    const user = await prismaCli.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpError("Invalid Email", StatusCodes.UNAUTHORIZED);
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      throw new HttpError("Invalid Password", StatusCodes.UNAUTHORIZED);
    }

    const token = createJwt(user);

    const { password: _, ...safeUser } = user;

    return {
      message: "Login successful",
      token,
      user: safeUser,
    };
  },

  saveFcmTokenService: async (userId, fcmToken) => {
    if (!fcmToken) {
      throw new HttpError("fcmToken required", StatusCodes.BAD_REQUEST);
    }

    await prismaCli.user.update({
      where: { id: userId },
      data: { fcmToken },
    });
  },
};
