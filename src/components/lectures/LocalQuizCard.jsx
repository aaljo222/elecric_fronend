import "katex/dist/katex.min.css";
import { useState } from "react";
import { BlockMath, InlineMath } from "react-katex";

import {
  generateBasicFunctionQuiz,
  generateComplexVectorQuiz,
  generateCompositeFunctionQuiz,
  generateExponentQuiz,
  generateFactorizationQuiz,
  generateFractionQuiz,
  generateLogarithmQuiz,
} from "../../utils/quizUtils";

// 💡 1. 로컬 퀴즈 설정을 매핑 객체로 분리하여 관리합니다.
// 새로운 로컬 퀴즈가 생기면 이곳에 한 줄만 추가하면 됩니다!
const LOCAL_QUIZ_CONFIG = {
  math_fraction: { title: "분수와 비례식", generateFunc: generateFractionQuiz },
  math_exponent: { title: "지수법칙", generateFunc: generateExponentQuiz },
  math_logarithm: { title: "로그의 이해", generateFunc: generateLogarithmQuiz },
  math_factorization: {
    title: "인수분해",
    generateFunc: generateFactorizationQuiz,
  },
  math_function: {
    title: "함수의 이해",
    generateFunc: generateBasicFunctionQuiz,
  },
  math_composite_function: {
    title: "합성함수 연산",
    generateFunc: generateCompositeFunctionQuiz,
  },
  math_complex_vector: {
    title: "복소수와 벡터의 덧셈",
    generateFunc: generateComplexVectorQuiz,
  },
  // circuit_ohm_law_equivalent: { title: "오옴의 법칙과 합성저항", generateFunc: generateOhmQuiz },
};

// 💡 2. 프론트엔드 단독 퀴즈 공용 카드 컴포넌트
const LocalQuizCard = ({ title, generateFunc }) => {
  const [quizData, setQuizData] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  const handleGenerate = () => {
    setQuizData(generateFunc());
    setShowSolution(false);
  };

  return (
    <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">✍️ 실전! {title} 랜덤 퀴즈</h3>

      {quizData ? (
        <div className="mb-6 text-2xl font-extrabold text-center bg-gray-50 p-6 rounded text-gray-800">
          문제: <InlineMath math={quizData.problem} />
        </div>
      ) : (
        <p className="text-center text-gray-500 mb-6 py-4 bg-gray-50 rounded">
          버튼을 눌러 문제를 생성해보세요!
        </p>
      )}

      {showSolution && quizData && (
        <div className="mb-6 animate-fade-in p-6 bg-blue-50 rounded-lg border border-blue-100">
          <h4 className="text-lg font-bold mb-4 text-blue-800">
            💡 단계별 해설
          </h4>
          <div className="space-y-4 mb-6">
            {quizData.steps.map((step, idx) => (
              <div key={idx} className="p-4 bg-white rounded shadow-sm">
                <p className="font-semibold text-gray-700 mb-2">
                  Step {idx + 1}. {step.text}
                </p>
                {step.math && (
                  <div className="text-center text-lg mt-2 text-blue-600">
                    <BlockMath math={step.math} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-2xl font-bold text-center text-red-600 border-t pt-4">
            정답: <InlineMath math={quizData.answer} />
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleGenerate}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all"
        >
          {quizData ? "새로운 문제 만들기" : "문제 생성하기"}
        </button>
        {quizData && (
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors"
          >
            {showSolution ? "해설 숨기기" : "정답 및 해설 보기"}
          </button>
        )}
      </div>
    </div>
  );
};
