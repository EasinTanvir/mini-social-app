const { z } = require("zod");

module.exports = {
  createPostSchema: z.object({
    text: z.string().trim().min(1).max(500),
  }),

  commentSchema: z.object({
    text: z.string().trim().min(1).max(500),
  }),
};
