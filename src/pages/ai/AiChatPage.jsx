// src/pages/ai/AiChatPage.jsx
import React, { useState } from "react";
import { aiChatGraph } from "../../api/aiApi"; // 👈 위에서 수정한 API 파일 경로로 맞춰주세요.

// 간단한 스피너 컴포넌트
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
  </div>
);

const AiChatPage = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");
    setError(null);

    try {
      // ✅ [수정] 로컬 스토리지 등에서 토큰 가져오기 (필요한 경우)
      // 로그인 안 한 상태면 null 처리되어도 괜찮습니다.
      const token = localStorage.getItem("electric_login");

      // ✅ [수정] 직접 axios 호출 대신 API 함수 사용
      const data = await aiChatGraph({ question: question }, token);

      // 응답 받기
      setAnswer(data.answer);
    } catch (err) {
      console.error(err);
      setError(
        "AI가 답변을 생성하는 중 오류가 발생했습니다. (백엔드 연결 확인 필요)",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 헤더 */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          ⚡ AI 전기기사 튜터
        </h1>
        <p className="text-gray-600">
          Neo4j 지식 그래프와 Claude 3.5가 연결된 인공지능에게 물어보세요.
        </p>
      </div>

      {/* 검색창 */}
      <form
        onSubmit={handleSearch}
        className="relative flex items-center mb-10"
      >
        <input
          type="text"
          className="w-full p-4 pr-32 border-2 border-blue-200 rounded-full shadow-sm focus:outline-none focus:border-blue-500 transition text-lg"
          placeholder="예: 직류기에서 전기자 반작용의 영향은 뭐야?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "생성 중..." : "물어보기"}
        </button>
      </form>

      {/* 결과 화면 */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 min-h-[300px]">
        {loading ? (
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-gray-500 mt-4 animate-pulse">
              AI가 지식 그래프를 탐색하고 있습니다... 🧠
            </p>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center font-medium">{error}</div>
        ) : answer ? (
          <div className="prose max-w-none">
            <h3 className="text-lg font-bold text-blue-800 mb-4 border-b pb-2">
              🤖 AI 답변
            </h3>
            <p className="text-gray-800 whitespace-pre-line leading-relaxed text-lg">
              {answer}
            </p>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-10">
            <p className="text-6xl mb-4">💡</p>
            <p>전기기사 관련 개념, 공식, 문제에 대해 무엇이든 물어보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiChatPage;
