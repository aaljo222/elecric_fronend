// src/api/boardApi.js
import apiClient from "./apiClient";

// 목록
export const getBoardList = async ({ page = 1, size = 10 } = {}) => {
  const res = await apiClient.get(`/board?page=${page}&size=${size}`);
  return res.data;
};

// 단일
export const getBoardById = async (id) => {
  const res = await apiClient.get(`/board/${id}`);
  return res.data;
};

// 작성 (로그인 필요)
export const createBoardPost = async ({ title, content }) => {
  const res = await apiClient.post(`/board`, { title, content });
  return res.data;
};

export const deleteBoard = async (id) => {
  const res = await apiClient.delete(`/board/${id}`);
  return res.data;
};
