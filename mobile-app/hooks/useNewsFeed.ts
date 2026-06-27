import { useCallback, useEffect, useRef, useState } from "react";
import { getPosts, likePost } from "@/services/post.service";
import { Comment, Post } from "@/types/post.types";
import { useGlobalContext } from "@/contextApis/GlobalContext";

const PAGE_LIMIT = 5;

export const useNewsFeed = () => {
  const { token, usernameFilter, feedRefreshKey } = useGlobalContext();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const fetchingRef = useRef(false);

  const fetchPosts = useCallback(
    async (pageNum: number, replace: boolean, username?: string) => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;
      try {
        const res = await getPosts(token!, pageNum, PAGE_LIMIT, username);
        setPosts((prev) => (replace ? res.posts : [...prev, ...res.posts]));
        setHasNextPage(res.hasNextPage);
        setPage(pageNum);
      } catch (error) {
        console.error("Fetch Posts Error:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
        fetchingRef.current = false;
      }
    },
    [token],
  );

  useEffect(() => {
    setLoading(true);
    setPosts([]);
    setPage(1);
    setHasNextPage(true);
    fetchPosts(1, true, usernameFilter);
  }, [usernameFilter, fetchPosts, feedRefreshKey]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts(1, true, usernameFilter);
  }, [fetchPosts, usernameFilter]);

  const onEndReached = useCallback(() => {
    if (!hasNextPage || loadingMore || fetchingRef.current) return;
    setLoadingMore(true);
    fetchPosts(page + 1, false, usernameFilter);
  }, [hasNextPage, loadingMore, page, fetchPosts, usernameFilter]);

  const handleLike = useCallback(
    async (postId: string) => {
      const original = posts.find((p) => p.id === postId);
      if (!original) return;

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                likedByMe: !p.likedByMe,
                likeCount: p.likedByMe ? p.likeCount - 1 : p.likeCount + 1,
              }
            : p,
        ),
      );

      try {
        await likePost(token!, postId);
      } catch {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  likedByMe: original.likedByMe,
                  likeCount: original.likeCount,
                }
              : p,
          ),
        );
      }
    },
    [token, posts],
  );

  const handleCommentAdded = useCallback((postId: string, comment: Comment) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              commentCount: p.commentCount + 1,
              comments: [...p.comments, comment],
            }
          : p,
      ),
    );

    setSelectedPost((prev) =>
      prev?.id === postId
        ? {
            ...prev,
            commentCount: prev.commentCount + 1,
            comments: [...prev.comments, comment],
          }
        : prev,
    );
  }, []);

  const openComments = useCallback((post: Post) => setSelectedPost(post), []);
  const closeComments = useCallback(() => setSelectedPost(null), []);

  return {
    posts,
    selectedPost,
    usernameFilter,
    loading,
    refreshing,
    loadingMore,
    onRefresh,
    onEndReached,
    handleLike,
    handleCommentAdded,
    openComments,
    closeComments,
  };
};
