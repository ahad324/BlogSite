import { useState, useEffect } from 'react';
import { getPosts, createPost, updatePost, deletePost } from '../utils/api';

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const fetchPosts = async (params = {}) => {
    setLoading(true);
    try {
      const response = await getPosts({ page: 1, limit: 10, ...params });
      setPosts(response.data.docs);
      setPagination({
        page: response.data.page,
        totalPages: response.data.totalPages,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const addPost = async (data) => {
    try {
      const response = await createPost(data);
      setPosts([response.data.post, ...posts]);
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create post');
    }
  };

  const editPost = async (id, data) => {
    try {
      const response = await updatePost(id, data);
      setPosts(posts.map((post) => (post._id === id ? response.data.post : post)));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update post');
    }
  };

  const removePost = async (id) => {
    try {
      await deletePost(id);
      setPosts(posts.filter((post) => post._id !== id));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete post');
    }
  };

  return { posts, loading, error, pagination, fetchPosts, addPost, editPost, removePost };
};