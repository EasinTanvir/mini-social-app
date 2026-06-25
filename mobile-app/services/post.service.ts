import { GetPostsResponse } from "@/types/post.types";
import api from "./api";

export const getPosts = async (
  token: string,
  page = 1,
  limit = 10,
): Promise<GetPostsResponse> => {
  const { data } = await api.get<GetPostsResponse>(
    `/post?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
};
