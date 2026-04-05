import apiClient from "./apiClient";

// 실기 합격 확률
export const fetchPassProbability = async () => {
  const res = await apiClient.get("/career/pass-probability");
  return res.data;
};

// 개인 실기 요약
export const fetchPersonalSummary = async () => {
  const res = await apiClient.get("/career/personal-summary");
  return res.data;
};

// 수강생 성적 변화
export const fetchCaseStats = async () => {
  const res = await apiClient.get("/career/case-stats");
  return res.data;
};
