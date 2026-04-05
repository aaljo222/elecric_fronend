import React, { useState } from "react";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from "react-katex";
import apiClient from "../../api/apiClient"; // 기존에 세팅하신 axios 클라이언트
import { recordQuizResult } from "../../api/mathApi.js"; // ✅ 추가된 API 임포트
const VideoQuizPage = () => {
  const [quizData, setQuizData] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  // 랜덤 문제 불러오기
  const fetchRandomProblem = async () => {
    try {
      // 초기화
      setSelectedIndex(null);
      setIsCorrect(null);
      setShowSolution(false);
      
      const res = await apiClient.get("/api/fraction/random");
      setQuizData(res.data);
    } catch (error) {
      console.error("문제 로드 실패:", error);
      alert("문제를 불러오지 못했습니다.");
    }
  };

  // ✅ 보기 선택 핸들러 (이 부분 업데이트)
  const handleSelect = async (index) => {
    if (showSolution) return; 
    
    const correct = (index === quizData.correct_index);
    setSelectedIndex(index);
    setIsCorrect(correct);
    setShowSolution(true); // 선택 즉시 답안과 해설을 보여주도록 흐름 개선

    // Neo4j에 데이터 기록하기 (비동기로 조용히 처리)
    const recordPayload = {
      user_id: user.id, // 실제 학생 ID
      concept_name: "분수의 덧셈", // 현재 영상의 핵심 개념
      is_correct: correct,
      chosen_answer: quizData.choices[index],
      problem_latex: quizData.problem_latex
    };

    await recordQuizResult(recordPayload);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">📺 영상 시청 및 실전 퀴즈</h2>
      
      {/* 1. 영상 플레이어 영역 */}
      <div className="bg-black rounded-lg overflow-hidden shadow-lg mb-6 aspect-video">
        <video 
          src="https://www.w3schools.com/html/mov_bbb.mp4" // 예시 영상
          controls 
          className="w-full h-full object-contain"
        />
      </div>

      <button 
        onClick={fetchRandomProblem}
        className="mb-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all"
      >
        🎯 깜짝 문제 풀기 (랜덤 생성)
      </button>

      {/* 2. 퀴즈 영역 */}
      {quizData && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-bold mb-4">다음 수식을 계산하시오:</h3>
          <div className="text-3xl text-center mb-8 p-4 bg-gray-50 rounded">
            <BlockMath math={quizData.problem_latex.replace(/\$/g, '')} />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {quizData.choices.map((choice, idx) => {
              // 선택지 스타일 결정
              let btnClass = "border-2 p-4 rounded-lg text-xl hover:bg-blue-50 transition-colors ";
              if (selectedIndex === idx) {
                btnClass += isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50";
              } else if (showSolution && idx === quizData.correct_index) {
                btnClass += "border-green-500 bg-green-50"; // 오답 선택 후 정답 강조
              } else {
                btnClass += "border-gray-200";
              }

              return (
                <button 
                  key={idx} 
                  onClick={() => handleSelect(idx)}
                  className={btnClass}
                >
                  <span className="font-bold mr-3 text-gray-500">{idx + 1})</span>
                  <InlineMath math={choice.replace(/\$/g, '')} />
                </button>
              );
            })}
          </div>

          {/* 3. 채점 결과 및 답안 보기 버튼 */}
          {selectedIndex !== null && !showSolution && (
            <div className="text-center animate-fade-in">
              <p className={`text-2xl font-bold mb-4 ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                {isCorrect ? "🎉 정답입니다!" : "😅 아쉽네요, 다시 도전해보세요!"}
              </p>
              <button 
                onClick={() => setShowSolution(true)}
                className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-md"
              >
                📝 해설 및 풀이 과정 보기
              </button>
            </div>
          )}

          {/* 4. 단계별 풀이 과정 영역 */}
          {showSolution && (
            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="text-lg font-bold mb-4 text-blue-800">💡 단계별 해설</h4>
              <div className="space-y-4">
                {quizData.steps.map((step) => (
                  <div key={step.step_num} className="p-3 bg-white rounded shadow-sm">
                    <p className="font-semibold text-gray-700 mb-2">
                      Step {step.step_num}. {step.description}
                    </p>
                    <div className="text-center text-lg">
                      <BlockMath math={step.latex.replace(/\$/g, '')} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoQuizPage;