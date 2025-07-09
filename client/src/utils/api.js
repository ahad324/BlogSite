import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

export const register = async (data) => await api.post('/users/register', data);
export const login = async (data) => await api.post('/users/login', data);
export const logout = async () => await api.post('/users/logout');
export const getCurrentUser = async () => await api.get('/users/me');
export const getUser = async (id) => await api.get(`/users/${id}`);
export const createPost = async (data) => await api.post('/posts', data);
export const getPosts = async (params) => await api.get('/posts', { params });
export const getPost = async (id) => await api.get(`/posts/${id}`);
export const updatePost = async (id, data) => await api.put(`/posts/${id}`, data);
export const deletePost = async (id) => await api.delete(`/posts/${id}`);
export const createComment = async (data) => await api.post('/comments', data);
export const getComments = async (postId, params) => await api.get(`/comments/post/${postId}`, { params });
export const updateComment = async (id, data) => await api.put(`/comments/${id}`, data);
export const deleteComment = async (id) => await api.delete(`/comments/${id}`);