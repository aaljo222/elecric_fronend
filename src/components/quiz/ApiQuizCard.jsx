import { fetchRandomProblem } from "@/services/mathService"; // 생성하신 서비스 임포트
import { Loader2 } from "lucide-react"; // 로딩 아이콘 (필요시 추가)
import { useCallback, useEffect, useState } from "react";
import { BlockMath, InlineMath } from "react-katex";

const ApiQuizCard = ({ lectureId }) => {
  // 1. 내부 상태(State) 관리
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  // 2. 퀴즈 데이터를 불러오는 통합 함수
  const loadQuiz = useCallback(async () => {
    if (!lectureId) return;

    setLoading(true);
    // 새로운 문제를 부를 때 기존 풀이 상태 초기화
    setSelectedIndex(null);
    setIsCorrect(null);
    setShowSolution(false);

    try {
      const data = await fetchRandomProblem(lectureId);
      setQuizData(data);
    } catch (error) {
      console.error("퀴즈를 불러오지 못했습니다.", error);
    } finally {
      setLoading(false);
    }
  }, [lectureId]);

  // 3. 컴포넌트가 마운트되거나 lectureId가 바뀔 때 자동 실행
  useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  // 4. 정답 선택 핸들러
  const handleSelect = (idx) => {
    if (showSolution || !quizData) return;
    setSelectedIndex(idx);
    setIsCorrect(idx === quizData.correct_index);
    setShowSolution(true);
  };

  // 로딩 중 UI
  if (loading && !quizData) {
    return (
      <div className="mt-8 p-12 bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#0047a5]" size={32} />
        <p className="text-gray-500 font-medium">
          AI 튜터가 맞춤형 문제를 생성 중입니다...
        </p>
      </div>
    );
  }

  // 데이터가 없을 때 UI
  if (!quizData) {
    return (
      <div className="mt-8 p-8 bg-white border border-gray-100 rounded-xl shadow-sm text-center">
        <p className="text-gray-500 mb-6">
          서버에서 무작위 심화 문제를 가져옵니다.
        </p>
        <button
          onClick={loadQuiz}
          className="bg-[#0047a5] text-white font-bold py-4 px-8 rounded-xl shadow-md transition-all active:scale-[0.98]"
        >
          🎯 랜덤 문제 가져오기
        </button>
      </div>
    );
  }

  // 메인 렌더링 UI
  return (
    <div className="mt-8 p-8 bg-white border border-gray-100 rounded-xl shadow-sm animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0047a5]">
            psychology
          </span>
          심화 실전 퀴즈
        </h3>

        <button
          onClick={loadQuiz} // 통합된 함수 연결
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#0047a5] text-sm font-bold rounded-lg border border-blue-200 hover:bg-[#0047a5] hover:text-white transition-colors shadow-sm active:scale-95 disabled:opacity-50"
        >
          <span
            className={`material-symbols-outlined text-[18px] ${loading ? "animate-spin" : ""}`}
          >
            refresh
          </span>
          새로운 문제
        </button>
      </div>

      {/* 문제용 이미지 */}
      {quizData.circuit_image && (
        <div className="flex justify-center mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-inner">
          <img
            src={`data:image/svg+xml;base64,${quizData.circuit_image.replace(/\n/g, "")}`}
            alt="문제 참고용 그림"
            className="max-w-full h-auto"
          />
        </div>
      )}

      {/* 문제 텍스트 (LaTeX) */}
      <div className="text-2xl text-center mb-8 p-8 bg-blue-50/50 border border-blue-100/50 rounded-xl text-gray-900">
        <BlockMath math={quizData.problem_latex.replace(/\$/g, "")} />
      </div>

      {/* 4지선다 선택지 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {quizData.choices.map((choice, idx) => {
          let btnClass =
            "border-2 p-5 rounded-xl text-lg transition-all text-left flex items-center gap-3 ";

          if (selectedIndex === idx) {
            btnClass += isCorrect
              ? "border-green-500 bg-green-50"
              : "border-red-500 bg-red-50";
          } else if (showSolution && idx === quizData.correct_index) {
            btnClass += "border-green-500 bg-green-50";
          } else {
            btnClass +=
              "border-gray-200 hover:border-blue-300 hover:bg-blue-50/30";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)} // 통합된 핸들러 연결
              className={btnClass}
              disabled={showSolution}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                  selectedIndex === idx
                    ? isCorrect
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : showSolution && idx === quizData.correct_index
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                }`}
              >
                {idx + 1}
              </div>
              <InlineMath math={choice.replace(/\$/g, "")} />
            </button>
          );
        })}
      </div>

      {/* 해설 영역 */}
      {showSolution && (
        <div className="mt-8 pt-8 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
          <p
            className={`text-2xl font-bold text-center mb-8 ${isCorrect ? "text-green-600" : "text-red-500"}`}
          >
            {isCorrect ? "정답입니다! 🎉" : "아쉽네요, 해설을 확인해 보세요 😅"}
          </p>
          <div className="p-6 bg-[#f7fafe] rounded-xl border border-[#d7e2ff]">
            <h4 className="font-bold text-[#0047a5] mb-4">💡 단계별 해설</h4>

            {/* 해설용 이미지 */}
            {quizData.graph_image && (
              <div className="flex justify-center mb-6">
                <img
                  src={`data:image/svg+xml;base64,${quizData.graph_image.replace(/\n/g, "")}`}
                  alt="해설 그래프"
                  className="max-w-full h-auto border rounded bg-white shadow-sm"
                />
              </div>
            )}

            {/* 단계별 풀이 */}
            <div className="space-y-4">
              {quizData.steps.map((step) => (
                <div
                  key={step.step_num}
                  className="p-5 bg-white rounded-lg shadow-sm"
                >
                  <p className="font-semibold text-gray-700 mb-2">
                    Step {step.step_num}. {step.description}
                  </p>
                  <BlockMath math={step.latex.replace(/\$/g, "")} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiQuizCard;
