// src/pages/questions/QuestionListPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getQuestionList } from "../../api/questionApi";

const QuestionListPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const size = 10;

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getQuestionList({ page, size });

        // ✅ 백엔드가 {items,total_pages}로 주는 기준
        const items = data?.items ?? [];
        const tp = data?.total_pages ?? 1;

        setQuestions(items);
        setTotalPages(tp);

        // ✅ page가 totalPages보다 커졌으면 보정
        if (page > tp) setPage(tp);
      } catch (e) {
        console.error("API 호출 실패:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 pb-2 border-b-2 border-indigo-500">
        ⚡ 전기기사 예상 문제 목록
      </h1>

      {loading && (
        <div className="text-center text-lg text-indigo-600 my-10">
          문제 목록을 불러오는 중입니다...
        </div>
      )}

      {!loading && questions.length === 0 && (
        <div className="text-center text-lg text-gray-500 my-10">
          아직 생성된 문제가 없습니다.
        </div>
      )}

<div className="space-y-4">
  {questions.map((q, index) => (
    <div
      key={q.id}
      className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 border border-gray-100"
    >
      {/* 왼쪽: 번호 + 제목 */}
      <div className="flex items-center space-x-4 w-3/4">
        <span className="text-lg font-bold text-indigo-600 w-8 flex-shrink-0">
          {(page - 1) * size + index + 1}.
        </span>

        <div className="text-gray-700 truncate">{q.title}</div>
      </div>

      {/* 오른쪽: 검증 상태 + 버튼 */}
      <div className="flex items-center gap-3">
        {/* ✅ 검증 상태 표시 */}
        {q.is_verified ? (
          <span
            title="관리자 또는 전문가 검증 완료 문제"
            className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700"
          >
            ✔ 검증됨
          </span>
        ) : (
          <span
            title="AI가 생성한 문제"
            className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-500"
          >
            🧠 AI 생성
          </span>
        )}

        {/* 문제 풀기 버튼 */}
        <Link
          to={`/questions/${q.id}`}
          className="flex items-center bg-indigo-500 text-white px-4 py-2 rounded-full font-medium hover:bg-indigo-600 transition"
        >
          문제 풀기 →
        </Link>
      </div>
    </div>
  ))}
</div>

      {/* 페이징 */}
      <div className="flex justify-center mt-8 space-x-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className={`px-3 py-2 rounded ${
            page === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-indigo-500 text-white hover:bg-indigo-600"
          }`}
        >
          이전
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setPage(pageNum)} // ✅ 해당 번호로 이동
            className={`px-3 py-2 rounded ${
              page === pageNum
                ? "bg-indigo-600 text-white font-bold"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {pageNum}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className={`px-3 py-2 rounded ${
            page === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-indigo-500 text-white hover:bg-indigo-600"
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default QuestionListPage;
