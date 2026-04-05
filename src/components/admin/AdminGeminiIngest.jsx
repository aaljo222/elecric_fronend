import { useState } from "react";
import axios from "axios";

// ✅ 환경변수에서 API 주소 가져오기 (없으면 로컬호스트 기본값)
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export default function AdminGeminiIngest() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  // ✅ [1] 과목 선택 상태 추가
  const [subject, setSubject] = useState("전기자기학"); 
  
  const [pageRange, setPageRange] = useState({ start: 10, end: 12 }); // 기본값 10~12페이지
  const subjects = [
      "전기자기학", "전력공학", "전기기기", "회로이론 및 제어공학", "전기설비기술기준"
  ];
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("분석할 PDF 파일을 먼저 선택해주세요.");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // ✅ Axios 사용: params 옵션으로 쿼리 파라미터 깔끔하게 처리
      const response = await axios.post(`${API_BASE}/admin/gemini/ingest-pdf`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
       // ✅ [2] 쿼리 파라미터에 subject 추가
        params: {
          subject: subject, 
          start_page: pageRange.start,
          end_page: pageRange.end,
        },
      });

      console.log("Upload Success:", response.data);
      setResult(response.data);
      alert("✅ 원서 분석 및 데이터 저장이 완료되었습니다!");

    } catch (error) {
      console.error("Upload Error:", error);
      const errorMsg = error.response?.data?.detail || "서버 통신 중 오류가 발생했습니다.";
      alert(`❌ 오류 발생: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-indigo-700 flex items-center gap-2">
        <span>📚</span> Gemini Vision 원서 분석기
      </h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        {/* ✅ [3] 과목 선택 드롭다운 UI 추가 (파일 업로드 왼쪽이나 위에 배치) */}
        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">과목 선택</label>
          <select 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            {subjects.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
        {/* 파일 업로드 */}
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            전기자기학 원서 PDF 선택
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100 cursor-pointer"
          />
        </div>

        {/* 페이지 범위 설정 */}
        <div className="flex gap-2 w-full md:w-auto">
          <div className="w-24">
            <label className="block text-xs text-gray-500 mb-1">시작 페이지</label>
            <input
              type="number"
              value={pageRange.start}
              onChange={(e) => setPageRange({ ...pageRange, start: Number(e.target.value) })}
              className="border border-gray-300 p-2 rounded w-full text-center focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="w-24">
            <label className="block text-xs text-gray-500 mb-1">종료 페이지</label>
            <input
              type="number"
              value={pageRange.end}
              onChange={(e) => setPageRange({ ...pageRange, end: Number(e.target.value) })}
              className="border border-gray-300 p-2 rounded w-full text-center focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* 실행 버튼 */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className={`w-full py-3 rounded-lg font-bold text-white transition duration-200 shadow-sm
          ${loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg"
          }`}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Gemini가 책을 읽고 있습니다...
          </div>
        ) : (
          "🚀 원서 분석 및 지식 그래프 생성 시작"
        )}
      </button>

      {/* 결과 화면 */}
      {result && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 animate-fade-in-up">
          <h3 className="font-bold text-green-700 mb-2 flex items-center gap-2">
            ✅ 분석 완료 결과
          </h3>
          <ul className="text-sm space-y-1 text-gray-700 ml-1 mb-3">
            <li>• 파일명: <span className="font-semibold">{result.filename}</span></li>
            <li>• 처리된 페이지: <span className="font-semibold">{result.pages_processed}장</span></li>
            <li>• 저장된 지식(Node): <span className="font-semibold text-blue-600">{result.concepts_saved}개</span></li>
          </ul>
          
          <details className="group">
            <summary className="text-xs text-gray-500 cursor-pointer hover:text-indigo-600 select-none flex items-center gap-1">
              <span>▶ JSON 데이터 미리보기</span>
            </summary>
            <div className="mt-2 relative">
              <pre className="p-3 bg-gray-900 text-green-400 rounded-md overflow-auto max-h-60 text-xs font-mono shadow-inner">
                {JSON.stringify(result.data_preview, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}