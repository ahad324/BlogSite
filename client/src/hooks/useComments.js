import { useState, useCallback } from 'react';
import { getComments, createComment, updateComment, deleteComment } from '../utils/api';

export const useComments = (postId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const fetchComments = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const response = await getComments(postId, { page: 1, limit: 10, sort: 'createdAt', order: 'desc', ...params });
      if (response.status === 304) {
        setLoading(false);
        return;
      }
      setComments(response.data.docs);
      setPagination({
        page: response.data.page,
        totalPages: response.data.totalPages,
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const addComment = async (data) => {
    try {
      const response = await createComment(data);
      setComments([response.data.comment, ...comments]);
      setError(null);
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create comment');
    }
  };

  const editComment = async (id, data) => {
    try {
      const response = await updateComment(id, data);
      setComments(comments.map((comment) => (comment._id === id ? response.data.comment : comment)));
      setError(null);
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update comment');
    }
  };

  const removeComment = async (id) => {
    try {
      await deleteComment(id);
      setComments(comments.filter((comment) => comment._id !== id));
      setError(null);
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  return { comments, loading, error, pagination, fetchComments, addComment, editComment, removeComment };
};