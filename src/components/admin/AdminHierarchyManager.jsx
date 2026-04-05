// components/admin/AdminHierarchyManager.jsx
import axios from "axios";
import { useState } from "react";

// 환경변수 or 로컬주소
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export default function AdminHierarchyManager() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const handleInitHierarchy = async () => {
    if (!confirm("Neo4j 그래프의 과목/챕터/토픽 구조를 재설정하시겠습니까?"))
      return;

    setLoading(true);
    setLogs((prev) => ["🔄 구조화 작업 시작...", ...prev]);

    try {
      const savedLogin = localStorage.getItem("electric_login");
      const loginData = savedLogin ? JSON.parse(savedLogin) : null;
      const token = loginData?.token;

      if (!token) throw new Error("관리자 인증 정보가 없습니다.");

      // ✅ 백엔드 API 호출
      const res = await axios.post(
        `${API_BASE}/admin/init-hierarchy`,
        {}, // body 없음
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setLogs((prev) => [`✅ 성공: ${res.data.message}`, ...prev]);
    } catch (e) {
      const errMsg = e.response?.data?.detail || e.message;
      setLogs((prev) => [`❌ 실패: ${errMsg}`, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md border border-gray-100 h-full">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        🧠 지식 그래프 구조화
        <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">
          Neo4j
        </span>
      </h3>

      <p className="text-sm text-gray-600 mb-4">
        Subject(과목) → Chapter(단원) → Topic(주제)의 계층 구조를 자동으로
        생성하고 연결합니다.
      </p>

      <button
        onClick={handleInitHierarchy}
        disabled={loading}
        className={`w-full py-3 rounded-lg font-bold text-white transition mb-4 shadow-sm
          ${
            loading
              ? "bg-emerald-400 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700 hover:shadow-md"
          }`}
      >
        {loading ? "작업 진행 중..." : "🚀 계층 구조 자동 생성 실행"}
      </button>

      {/* 로그 창 */}
      <div className="bg-gray-900 text-emerald-400 p-3 rounded-lg text-xs font-mono h-32 overflow-y-auto shadow-inner">
        {logs.length === 0 ? (
          <span className="text-gray-600 opacity-50">대기 중...</span>
        ) : (
          logs.map((log, i) => (
            <div
              key={i}
              className="mb-1 border-b border-gray-800 pb-1 last:border-0"
            >
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
