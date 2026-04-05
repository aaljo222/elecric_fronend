import apiClient from "@/api/core/apiClient";

/**
 * 백엔드(FastAPI)에서 실시간 생성된 수학/회로 문제를 가져옵니다.
 * @param {string} problemType - 강의 고유 ID (예: "math_derivative", "circuit_series_capacitor")
 */
export const fetchRandomProblem = async (problemType) => {
  try {
    // 🚧 안전장치: DB 정리가 덜 된 노드(circuit이나 math가 없는 잘못된 ID) 차단
    if (
      !problemType ||
      (!problemType.includes("circuit") && !problemType.includes("math"))
    ) {
      console.warn(`[API 방어] 올바르지 않은 문제 ID 요청: ${problemType}`);
      // 화면이 터지지 않도록 임시 데이터를 내려줍니다.
      return {
        problem:
          "해당 개념의 맞춤형 문제는 현재 AI와 함께 열심히 빚어내는 중입니다! 🛠️",
        answer: "-",
        steps: [
          {
            text: "조금만 기다려 주시면 완벽한 문제로 업데이트하겠습니다.",
            math: "",
          },
        ],
      };
    }

    // 1. 회로이론인지 기초수학인지 파악하여 정확한 백엔드 엔드포인트 할당
    const endpoint = problemType.includes("circuit")
      ? "/api/circuit/random"
      : "/api/math/random";

    // 2. 올바른 주소로 요청을 보냅니다.
    const response = await apiClient.get(`${endpoint}?type=${problemType}`);

    return response.data;
  } catch (error) {
    console.error(`[Quiz Error] ${problemType} API 호출 실패:`, error);
    throw error;
  }
};
