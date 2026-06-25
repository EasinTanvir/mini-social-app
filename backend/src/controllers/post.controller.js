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
const errorHandler = require("../utils/errorHandler");

module.exports = {
  createPostController: async (req, res, next) => {
    try {
      const validatedData = createPostSchema.parse(req.body);

      const data = await createPostService(req.user.id, validatedData);

      return res.status(StatusCodes.CREATED).json({
        success: true,
        ...data,
      });
    } catch (error) {
      return errorHandler(error, req, res, next);
    }
  },

  getPostsController: async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const username = req.query.username;

      const data = await getPostsService(page, limit, username);

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
      const data = await toggleLikeService(req.user.id, req.params.id);

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
        req.user.id,
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
