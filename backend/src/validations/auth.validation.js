const { z } = require("zod");

const registerSchema = z.object({
  username: z.string().trim().min(3).max(30),

  email: z.string().trim().email(),

  password: z.string().min(6).max(100),
});

const loginSchema = z.object({
  email: z.string().trim().email(),

  password: z.string().min(1),
});

module.exports = {
  registerSchema,
  loginSchema,
};
