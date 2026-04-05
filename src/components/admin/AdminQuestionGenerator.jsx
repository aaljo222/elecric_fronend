import axios from "axios";
import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export default function AdminQuestionGenerator() {
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState("");

  const handleGenerate = async () => {
    const num = Number(count);
    if (!num || num < 1 || num > 50)
      return alert("1~50 사이 숫자를 입력하세요.");

    setLoading(true);
    setLogs([]); // 로그 초기화
    setProgress("AI가 Graph DB를 분석하여 문제를 생성중입니다...");

    // 로그에 시작 메시지 추가
    setLogs((prev) => [
      `🚀 ${num}문제 일괄 생성 시작... (시간이 조금 걸릴 수 있습니다)`,
      ...prev,
    ]);

    try {
      const savedLogin = localStorage.getItem("electric_login");
      const loginData = savedLogin ? JSON.parse(savedLogin) : null;
      const token = loginData?.token;

      if (!token)
        throw new Error("관리자 인증 정보가 없습니다. 다시 로그인해주세요.");

      // 타임아웃을 넉넉하게 설정 (문제 생성이 오래 걸릴 수 있음)
      const res = await axios.post(
        `${API_BASE}/admin/generate-batch`,
        { count: num },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 120000, // 2분 타임아웃
        },
      );

      const result = res.data;

      // 결과 로그 출력
      if (result.results) {
        result.results.forEach((r) => {
          if (r.status === "success") {
            setLogs((prev) => [`✅ [${r.index}] 성공: ${r.title}`, ...prev]);
          } else {
            setLogs((prev) => [`❌ [${r.index}] 실패: ${r.message}`, ...prev]);
          }
        });
      }

      setLogs((prev) => [
        `🎉 최종 완료: 총 ${result.success_count} / ${result.total_requested} 건 생성 성공`,
        ...prev,
      ]);
      setProgress("");
    } catch (e) {
      console.error(e);
      const errMsg = e.response?.data?.detail || e.message;
      setLogs((prev) => [`❌ 치명적 오류: ${errMsg}`, ...prev]);
      setProgress("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          🤖 Graph DB 기반 AI 문제 생성기
        </h3>
        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
          Admin Only
        </span>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Neo4j 지식 그래프의 개념을 활용하여 저작권 문제 없는 새로운 문제를
        창작합니다.
        <br />
        생성된 문제는 DB에 저장되며 '미검증' 상태로 등록됩니다.
      </p>

      <div className="flex gap-3 mb-4 items-center">
        <label className="text-sm font-bold text-gray-700">생성 개수:</label>
        <input
          type="number"
          min="1"
          max="50"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-20 text-center focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`flex-1 px-4 py-2 rounded-lg font-bold text-white transition
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 shadow-lg"}`}
        >
          {loading ? "AI 생성 중 (잠시만 기다려주세요)..." : "문제 생성 시작"}
        </button>
      </div>

      {progress && (
        <div className="mb-2 text-center text-sm text-indigo-600 font-semibold animate-pulse">
          {progress}
        </div>
      )}

      <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs font-mono h-64 overflow-y-auto shadow-inner border border-gray-700">
        {logs.length === 0 ? (
          <div className="text-gray-500 text-center mt-20">대기 중...</div>
        ) : (
          logs.map((log, i) => (
            <div
              key={i}
              className="mb-1 border-b border-gray-800 pb-1 last:border-0 break-keep"
            >
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
