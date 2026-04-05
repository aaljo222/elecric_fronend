import { useNavigate } from "react-router-dom";

export default function WrongQuestionList({ list }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-bold mb-4">❌ 틀린 문제 다시 풀기</h3>

      {list.length === 0 && (
        <div className="text-gray-400">틀린 문제가 없습니다 👍</div>
      )}

      {list.map((q) => (
        <div
          key={q.id}
          className="flex justify-between items-center py-2 border-b"
        >
          <div>
            <div className="text-sm text-gray-500">{q.subject}</div>
            <div className="font-medium">문제 #{q.id}</div>
          </div>

          <button
            className="text-blue-600 text-sm"
            onClick={() => navigate(`/questions/${q.id}?mode=retry`)}
          >
            다시 풀기 →
          </button>
        </div>
      ))}
    </div>
  );
}
