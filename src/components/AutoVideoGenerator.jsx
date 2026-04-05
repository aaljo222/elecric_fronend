import React, { useState } from "react";
import apiClient from "../api/apiClient"; // ✅ 설정해둔 apiClient 사용
import { FaRocket, FaRobot, FaExclamationTriangle } from "react-icons/fa";

const AutoVideoGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleStartAutoGenerate = async () => {
    // 1. 실수 방지 확인
    if (!window.confirm("⚠️ 경고: 약 100개의 영상을 연속으로 생성합니다.\n서버 부하가 발생할 수 있으며 수 시간이 소요됩니다.\n\n정말 시작하시겠습니까?")) {
      return;
    }

    setLoading(true);
    setStatusMsg("🚀 서버에 배치 작업을 요청하는 중...");

    try {
      // 2. 백엔드 호출 (/api 생략 - apiClient가 처리)
      const res = await apiClient.post("/api/video/auto-generate-all");
      
      // 3. 성공 처리
      setStatusMsg(`✅ ${res.data.message}`);
      alert("자동 생성 작업이 백그라운드에서 시작되었습니다!\n관리자 로그를 확인하세요.");
      
    } catch (err) {
      console.error(err);
      setStatusMsg("❌ 요청 실패: 서버 에러가 발생했습니다.");
      alert("작업 시작에 실패했습니다. 개발자 도구(F12)를 확인하세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 my-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaRobot className="text-indigo-600" />
            전기기사 100대 주제 자동 생성기
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            "쿨롱의 법칙"부터 "전식 방지 대책"까지, 100개의 핵심 주제 영상을 한 번에 만듭니다.
          </p>
        </div>
        <div className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded text-xs font-medium flex items-center gap-1">
          <FaExclamationTriangle /> 주의: 장시간 소요
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={handleStartAutoGenerate}
          disabled={loading}
          className={`
            w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-white shadow-md transition-all
            flex items-center justify-center gap-2
            ${loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:-translate-y-1"
            }
          `}
        >
          {loading ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              요청 중...
            </>
          ) : (
            <>
              <FaRocket />
              🚀 100개 영상 생성 시작
            </>
          )}
        </button>

        {statusMsg && (
          <span className={`text-sm font-medium ${statusMsg.includes("❌") ? "text-red-500" : "text-green-600"}`}>
            {statusMsg}
          </span>
        )}
      </div>

      <div className="mt-4 p-4 bg-slate-50 rounded-lg text-xs text-slate-500">
        <strong>💡 작동 방식:</strong> 버튼을 누르면 서버가 백그라운드에서 작업을 시작합니다. 
        이 페이지를 닫아도 서버는 계속 영상을 만듭니다. 
        진행 상황은 <span className="font-mono text-slate-700">Deploy Logs</span>나 영상 목록에서 확인할 수 있습니다.
      </div>
    </div>
  );
};

export default AutoVideoGenerator;