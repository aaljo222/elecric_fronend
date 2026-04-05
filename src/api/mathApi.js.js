import apiClient from "./apiClient";

// 특정 동영상의 분수 풀이 단계 조회 (비용 0원 API)
export const getFractionSteps = async (videoId) => {
  try {
    const res = await apiClient.get(`/api/fraction/steps/${videoId}`);
    return res.data;
  } catch (error) {
    console.error("풀이 과정을 불러오는 중 오류 발생:", error);
    return null;
  }
};

// 퀴즈 결과 기록 API
export const recordQuizResult = async (payload) => {
  try {
    const res = await apiClient.post(`/api/math/record`, payload);
    return res.data;
  } catch (error) {
    console.error("퀴즈 결과 기록 중 오류 발생:", error);
    return null;
  }
};