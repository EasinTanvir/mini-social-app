import { GetPostsResponse } from "@/types/post.types";
import api from "./api";

const authHeader = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getPosts = async (
  token: string,
  page = 1,
  limit = 10,
  username?: string,
): Promise<GetPostsResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(username ? { username } : {}),
  });

  const { data } = await api.get<GetPostsResponse>(
    `/posts?${params}`,
    authHeader(token),
  );
  return data;
};

export const createPost = async (
  token: string,
  text: string,
): Promise<{ message: string }> => {
  const { data } = await api.post<{ message: string }>(
    "/posts",
    { text },
    authHeader(token),
  );
  return data;
};

export const likePost = async (token: string, postId: string) => {
  const { data } = await api.post(
    `/posts/${postId}/like`,
    {},
    authHeader(token),
  );
  return data;
};

export const commentOnPost = async (
  token: string,
  postId: string,
  text: string,
) => {
  const { data } = await api.post(
    `/posts/${postId}/comment`,
    { text },
    authHeader(token),
  );
  return data;
};
