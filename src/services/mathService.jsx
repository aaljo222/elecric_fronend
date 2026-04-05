/**
 * 백엔드(FastAPI)에서 실시간 생성된 수학/회로 문제를 가져옵니다.
 * @param {string} problemType - 강의 ID (예: "math_radian", "circuit_ohm_law_equivalent")
 */
import { useState } from "react";
// 앞서 만드신 API 호출 함수 경로에 맞게 임포트 해주세요.
import { fetchRandomProblem } from "@/utils/quizUttils"; // 또는 api 폴더

const RandomProblemSection = ({ lectureId }) => {
  // 1. 상태 관리: 문제 데이터와 로딩 상태를 저장할 State
  const [problemData, setProblemData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 2. 버튼 클릭 시 실행될 함수
  const handleFetchProblem = async () => {
    setIsLoading(true);
    try {
      // 프론트엔드 라우터나 페이지에서 넘겨준 현재 강의 ID (예: 'math_derivative')
      // 만약 prop으로 안 넘어오면 기본값 설정
      const currentId = lectureId || "math_derivative";

      const data = await fetchRandomProblem(currentId);
      setProblemData(data);
    } catch (error) {
      console.error("문제 가져오기 실패:", error);
      alert("문제를 불러오는데 실패했습니다. 백엔드 연결을 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto w-full">
      {/* --- 버튼 영역 (대표님이 만드신 UI) --- */}
      <div className="mt-8 p-8 bg-white border border-gray-100 rounded-xl shadow-sm text-center">
        <p className="text-gray-500 mb-6">
          서버에서 무작위 심화 문제를 가져옵니다.
        </p>
        <button
          onClick={handleFetchProblem} // 시동 버튼 연결!
          disabled={isLoading} // 로딩 중에는 연타 방지
          className={`font-bold py-4 px-8 rounded-xl shadow-md transition-all active:scale-[0.98] ${
            isLoading
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-[#0047a5] text-white hover:bg-blue-800"
          }`}
        >
          {isLoading ? "⏳ 문제를 생성하는 중..." : "🎯 랜덤 문제 가져오기"}
        </button>
      </div>

      {/* --- 문제 풀이 출력 영역 (새로 추가된 부분) --- */}
      {problemData && (
        <div className="mt-8 p-8 bg-blue-50 border border-blue-100 rounded-xl shadow-sm animate-fade-in">
          <h3 className="text-xl font-bold text-[#0047a5] mb-4">
            📝 실전 연습 문제
          </h3>

          {/* 문제 출력 */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6 text-lg text-gray-800">
            {/* 주의: 수식 렌더링을 위해 KaTeX/MathJax 라이브러리 컴포넌트(예: <BlockMath>)로 감싸주면 더 좋습니다 */}
            {problemData.problem}
          </div>

          {/* 풀이 과정 (아코디언이나 단순 리스트 형태로 출력) */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-700 border-b pb-2">
              💡 단계별 풀이
            </h4>
            {problemData.steps?.map((step, index) => (
              <div
                key={index}
                className="flex gap-4 items-start bg-white p-4 rounded-lg border border-gray-100"
              >
                <span className="bg-[#e5edff] text-[#0047a5] font-bold w-8 h-8 flex items-center justify-center rounded-full shrink-0">
                  {index + 1}
                </span>
                <div className="mt-1">
                  <p className="text-gray-600 font-medium mb-2">{step.text}</p>
                  {step.math && <p className="text-[#0047a5]">{step.math}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* 정답 */}
          <div className="mt-8 p-4 bg-[#0047a5] text-white rounded-lg text-center font-bold text-xl">
            정답: {problemData.answer}
          </div>
        </div>
      )}
    </section>
  );
};

export default RandomProblemSection;
