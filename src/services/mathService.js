import apiClient from "@/api/core/apiClient";

/**
 * 백엔드(FastAPI)에서 실시간 생성된 수학/회로 문제를 가져옵니다.
 * @param {string} problemType - 강의 ID (예: "math_radian", "circuit_ohm_law_equivalent")
 */
export const fetchRandomProblem = async (problemType) => {
  try {
    // 1. 회로이론인지 기초수학인지 파악하여 정확한 백엔드 엔드포인트 할당
    const endpoint = problemType.includes("circuit")
      ? "/api/circuit/random"
      : "/api/math/random";

    // 2. ❌ 기존의 `/api/quiz/...` 가 아닌, 올바른 주소로 요청!
    const response = await apiClient.get(`${endpoint}?type=${problemType}`);

    return response.data;
  } catch (error) {
    console.error(`[Quiz Error] ${problemType} API 호출 실패:`, error);
    throw error;
  }
};
