const { StatusCodes } = require("http-status-codes");

const {
  commentSchema,
  createPostSchema,
} = require("../validations/post.validation");

const {
  createPostService,
  getPostsService,
  toggleLikeService,
  createCommentService,
} = require("../services/post.service");
const { errorHandler } = require("../utils/errorHandler");

module.exports = {
  createPostController: async (req, res, next) => {
    try {
      const validatedData = createPostSchema.parse(req.body);

      const data = await createPostService(req.userId, validatedData);

      return res.status(StatusCodes.CREATED).json({
        success: true,
        ...data,
      });
    } catch (error) {
      console.log("create post error", error);
      return errorHandler(error, req, res, next);
    }
  },

  getPostsController: async (req, res, next) => {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.max(1, Math.min(50, parseInt(req.query.limit) || 5));
      const username = req.query.username?.trim() || undefined;

      const data = await getPostsService(req.userId, page, limit, username);

      return res.status(StatusCodes.OK).json({
        success: true,
        ...data,
      });
    } catch (error) {
      return errorHandler(error, req, res, next);
    }
  },

  likePostController: async (req, res, next) => {
    try {
      const data = await toggleLikeService(req.userId, req.params.id);

      return res.status(StatusCodes.OK).json({
        success: true,
        ...data,
      });
    } catch (error) {
      return errorHandler(error, req, res, next);
    }
  },

  commentController: async (req, res, next) => {
    try {
      const validatedData = commentSchema.parse(req.body);

      const data = await createCommentService(
        req.userId,
        req.params.id,
        validatedData,
      );

      return res.status(StatusCodes.CREATED).json({
        success: true,
        ...data,
      });
    } catch (error) {
      return errorHandler(error, req, res, next);
    }
  },
};
