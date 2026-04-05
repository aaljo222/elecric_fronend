// api/statisticsApi.js
import apiClient from "./apiClient";

// 📊 전체 통계
export const getMyStats = async () => {
  const res = await apiClient.get("/stats/me");
  return res.data;
};

// ❌ 오답노트 목록
export const getMyWrongStats = async () => {
  const res = await apiClient.get("/stats/wrong/me");
  return res.data;
};

// 📈 최근 7일
export const getRecentStats = async () => {
  const res = await apiClient.get("/stats/recent/me");
  console.log("res", res);
  return res.data;
};

// 📈 최근 30일 (새로 추가)
export const getRecent30DaysStats = async () => {
  const res = await apiClient.get("/stats/recent/me?days=30"); // 30일 요청
  return res.data;
};
// (선택) 다음 복습할 오답 1개
export const getNextWrongQuestion = async () => {
  const res = await apiClient.get("/stats/wrong/next");
  return res.data;
};

// 🔥 데모 전용 API
export const getDemoStats = async () => {
  const res = await apiClient.get("/stats/demo");
  return res.data;
};

export const getDemoWrongStats = async () => {
  const res = await apiClient.get("/stats/wrongbook/demo");
  return res.data;
};

export const getDemoRecentStats = async () => {
  const res = await apiClient.get("/stats/recent/demo");
  return res.data;
};

// 📈 데모 최근 30일 (새로 추가)
export const getDemoRecent30DaysStats = async () => {
  const res = await apiClient.get("/stats/recent/demo?days=30");
  return res.data;
};
