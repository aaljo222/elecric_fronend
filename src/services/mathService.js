// services/mathService.js

import apiClient from "@/api/core/apiClient";

/**
 * 백엔드(FastAPI)에서 실시간 생성된 수학 문제를 가져옵니다.
 * @param {string} problemType - 강의 UID (예: "61b1ec56bcd7e87535d18c40bb9afb21")
 */
export const fetchRandomProblem = async (problemType) => {
  try {
    // 백엔드의 get_math_problem(problem_type) 엔드포인트 호출
    const response = await apiClient.get(`/api/quiz/${problemType}`);
    return response.data;
  } catch (error) {
    console.error(
      `[Quiz Error] ${problemType} 문제를 가져오는데 실패했습니다:`,
      error,
    );
    throw error;
  }
};
