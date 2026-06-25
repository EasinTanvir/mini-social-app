export interface Author {
  id: string;
  username: string;
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  user: Author;
}

export interface Post {
  id: string;
  text: string;

  author: Author;

  createdAt: string;
  updatedAt: string;

  likeCount: number;
  commentCount: number;

  likedByMe: boolean;

  comments: Comment[];
}

export interface GetPostsResponse {
  success: boolean;

  page: number;
  limit: number;

  total: number;
  totalPages: number;
  hasNextPage: boolean;

  posts: Post[];
}
