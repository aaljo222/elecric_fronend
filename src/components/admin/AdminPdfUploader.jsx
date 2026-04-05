import { useState } from "react";
import apiClient from "../../api/apiClient"; // 기존 axios 인스턴스 사용
import useCustomLogin from "../../hooks/useCustomLogin";

const AdminPdfUploader = () => {
  const { role, isLogin } = useCustomLogin();
  const isAdmin = isLogin && role === "admin";

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  // 업로드 핸들러
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("PDF 파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    // subject, chapter_no 등은 백엔드에서 자동 분석하므로 제거

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      // ✅ [수정] 백엔드 엔드포인트와 일치시킴
      const res = await apiClient.post(
        "/admin/pdf/process-pdf-graph-gen",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log("Upload Success:", res.data);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || "파일 처리 중 서버 오류가 발생했습니다.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="max-w-xl p-6 bg-white rounded-xl shadow-md border border-gray-100 mt-6">
      <h2 className="text-2xl font-bold mb-4 text-rose-600 flex items-center gap-2">
        📄 PDF 기반 문제 생성기
      </h2>

      <p className="text-sm text-gray-500 mb-4">
        기출문제 PDF를 업로드하면 <b>지식 그래프</b>를 업데이트하고,
        <br />
        이를 기반으로 <b>새로운 문제 20개</b>를 자동 생성합니다. (저작권 Safe)
      </p>

      {/* 파일 입력 영역 */}
      <div className="mb-4">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-rose-50 file:text-rose-700
            hover:file:bg-rose-100
            cursor-pointer border rounded-lg p-2
          "
        />
      </div>

      {/* 업로드 버튼 */}
      <button
        onClick={handleUpload}
        disabled={loading || !selectedFile}
        className={`w-full py-3 rounded-lg font-bold text-white transition-all shadow-md ${
          loading || !selectedFile
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-rose-500 hover:bg-rose-600 active:scale-[0.98]"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            AI 분석 및 문제 생성 중... (약 30초 소요)
          </span>
        ) : (
          "PDF 분석 및 문제 생성 시작"
        )}
      </button>

      {/* 에러 메시지 */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          🚨 {error}
        </div>
      )}

      {/* ✅ [수정] 결과 화면: 백엔드 응답 데이터 구조 반영 */}
      {result && (
        <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-bold text-lg mb-3 text-green-800">
            🎉 작업 완료!
          </h3>

          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <span className="text-blue-500">🧠</span>
              지식 그래프 업데이트: <b>{result.graph_update_count}개 개념</b>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-purple-500">✍️</span>
              새로 생성된 문제: <b>{result.generated_questions_count}개</b>
            </li>
          </ul>

          {/* 생성된 문제 미리보기 (데이터가 있을 경우) */}
          {result.data && result.data.length > 0 && (
            <div className="mt-4 p-3 bg-white rounded border text-xs text-gray-500 h-32 overflow-y-auto">
              <strong>[생성된 문제 예시]</strong>
              <div className="mt-1">
                Q1. {result.data[0].question} <br />
                (정답: {result.data[0].choices[result.data[0].answer]})
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPdfUploader;
