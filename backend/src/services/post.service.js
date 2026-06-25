const { StatusCodes } = require("http-status-codes");

const { prismaCli } = require("../utils/prismaCli");
const { HttpError } = require("../utils/HttpError");

module.exports = {
  createPostService: async (userId, { text }) => {
    await prismaCli.post.create({
      data: {
        text,
        authorId: userId,
      },
    });

    return {
      message: "Post created successfully",
    };
  },

  getPostsService: async (userId, page, limit, username) => {
    const safePage = Math.max(1, parseInt(page) || 1);
    const safeLimit = Math.max(1, Math.min(50, parseInt(limit) || 10));
    const skip = (safePage - 1) * safeLimit;

    const where = username
      ? {
          author: {
            username: {
              equals: username,
              mode: "insensitive",
            },
          },
        }
      : {};

    const [posts, total] = await prismaCli.$transaction([
      prismaCli.post.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
          likes: {
            where: {
              userId,
            },
            select: {
              id: true,
            },
          },
          comments: {
            orderBy: {
              createdAt: "asc",
            },
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          },
        },
      }),
      prismaCli.post.count({ where }),
    ]);

    const formattedPosts = posts.map((post) => ({
      id: post.id,
      text: post.text,
      author: post.author,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likeCount: post._count.likes,
      commentCount: post._count.comments,
      likedByMe: post.likes.length > 0,
      comments: post.comments,
    }));

    return {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
      hasNextPage: safePage < Math.ceil(total / safeLimit),
      posts: formattedPosts,
    };
  },

  toggleLikeService: async (userId, postId) => {
    const post = await prismaCli.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new HttpError("Post not found", StatusCodes.NOT_FOUND);
    }

    const existingLike = await prismaCli.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingLike) {
      await prismaCli.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      return {
        liked: false,
        message: "Post unliked successfully",
      };
    }

    await prismaCli.like.create({
      data: {
        userId,
        postId,
      },
    });

    return {
      liked: true,
      message: "Post liked successfully",
    };
  },

  createCommentService: async (userId, postId, { text }) => {
    const post = await prismaCli.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new HttpError("Post not found", StatusCodes.NOT_FOUND);
    }

    const comment = await prismaCli.comment.create({
      data: {
        text,
        userId,
        postId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return {
      message: "Comment added successfully",
      comment,
    };
  },
};
