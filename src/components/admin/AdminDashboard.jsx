import axios from "axios";
import { useState, useRef } from "react";
import {
  Loader2,
  FileText,
  Share2,
  Video,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  Merge, // [New] 병합 아이콘
  Database // [New] 데이터베이스 아이콘
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export default function AdminDashboard() {
  // --- 상태 관리 ---
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false); // PDF 업로드용
  const [graphLoading, setGraphLoading] = useState(false); // 그래프 구조화용
  const [videoLoading, setVideoLoading] = useState(false); // 비디오 생성용
  const [mergeLoading, setMergeLoading] = useState(false); // [New] 토픽 병합용
  
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [mergeResult, setMergeResult] = useState(null); // [New] 병합 결과
  
  // 비디오 생성 관련 상태
  const [videoTopic, setVideoTopic] = useState("");
  const [videoResult, setVideoResult] = useState(null);
  const [videoStatusMsg, setVideoStatusMsg] = useState("");
  const pollingRef = useRef(null);

  // --- 공통: 토큰 가져오기 헬퍼 ---
  const getAuthHeader = () => {
    const savedLogin = localStorage.getItem("electric_login");
    const loginData = savedLogin ? JSON.parse(savedLogin) : null;
    return loginData?.token ? { Authorization: `Bearer ${loginData.token}` } : null;
  };

  // --- 1. PDF 업로드 핸들러 ---
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return alert("파일을 선택해주세요.");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${API_BASE}/admin/pdf/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "업로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // --- 2. 그래프 계층 구조화 핸들러 ---
  const handleInitHierarchy = async () => {
    if (!confirm("⚠️ 주의: Neo4j 데이터베이스의 계층 구조를 재설정하시겠습니까?")) return;

    setGraphLoading(true);
    try {
      const headers = getAuthHeader();
      if (!headers) return alert("관리자 로그인이 필요합니다.");

      const res = await axios.post(`${API_BASE}/admin/init-hierarchy`, {}, { headers });
      alert(`✅ 완료: ${res.data.message}`);
    } catch (e) {
      alert(`❌ 실패: ${e.response?.data?.detail || e.message}`);
    } finally {
      setGraphLoading(false);
    }
  };

  // --- 3. [New] 토픽 병합 핸들러 ---
  const handleMergeTopics = async () => {
    if (!confirm("⚡ 유사한 토픽 노드들을 하나로 병합하시겠습니까?\n(예: '쿨롱 법칙' + '쿨롱의 법칙' -> 통합)")) return;

    setMergeLoading(true);
    setMergeResult(null);

    try {
      const headers = getAuthHeader();
      // 백엔드 엔드포인트: /admin/merge-topics (FastAPI에서 구현 필요)
      const res = await axios.post(`${API_BASE}/admin/merge-topics`, {}, { headers });
      setMergeResult(res.data); // { merged_count: 5, groups: [['A', 'B'], ...] } 가정
    } catch (e) {
      console.error(e);
      alert(`❌ 병합 실패: ${e.response?.data?.detail || e.message}`);
    } finally {
      setMergeLoading(false);
    }
  };

  // --- 4. Manim 영상 생성 핸들러 ---
  const handleGenerateVideo = async () => {
    if (!videoTopic.trim()) return alert("영상 주제를 입력해주세요.");
    
    setVideoLoading(true);
    setVideoResult(null);
    setVideoStatusMsg("🚀 AI가 대본을 작성하고 있습니다...");
    
    try {
      const res = await axios.post(`${API_BASE}/api/video/search-or-generate`, {
        topic: videoTopic
      }, { headers: getAuthHeader() });

      const data = res.data;

      if (data.status === 'success') {
        setVideoResult(data);
        setVideoLoading(false);
      } else {
        setVideoStatusMsg("🎥 Manim 엔진이 렌더링 중입니다 (약 30~60초 소요)...");
        startPolling(videoTopic);
      }

    } catch (e) {
      console.error(e);
      alert(`생성 요청 실패: ${e.response?.data?.detail || e.message}`);
      setVideoLoading(false);
    }
  };

  const startPolling = (topic) => {
    if (pollingRef.current) clearInterval(pollingRef.current);

    pollingRef.current = setInterval(async () => {
      try {
        const res = await axios.post(`${API_BASE}/api/video/search-or-generate`, {
          topic: topic
        }, { headers: getAuthHeader() });

        if (res.data.status === 'success') {
          setVideoResult(res.data);
          setVideoLoading(false);
          clearInterval(pollingRef.current);
        } else if (res.data.status === 'failed') {
          setVideoLoading(false);
          alert(`❌ 영상 생성 실패: ${res.data.message}`);
          clearInterval(pollingRef.current);
        }
      } catch (e) {
        console.error("Polling Error", e);
        clearInterval(pollingRef.current);
        setVideoLoading(false);
      }
    }, 3000); 
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 font-sans">
      <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
        🛡️ 관리자 대시보드
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- 섹션 1: PDF 업로드 --- */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-full">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-700">
            <FileText className="text-blue-600" /> 기출문제 PDF 파싱
          </h2>
          <div className="flex flex-col gap-4">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border rounded-full p-1"
            />
            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className={`w-full py-2.5 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                loading ? "bg-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-md"
              }`}
            >
              {loading && <Loader2 className="animate-spin w-4 h-4" />}
              {loading ? "분석 중..." : "업로드"}
            </button>
          </div>
          {error && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex gap-2"><AlertCircle size={18}/> {error}</div>}
          {result && (
            <div className="mt-4 p-4 bg-green-50 text-green-800 rounded-lg border border-green-100 animate-fade-in">
              <p className="font-bold flex items-center gap-2"><CheckCircle size={18}/> 처리 완료!</p>
              <p className="text-sm mt-1">문제 {result.processed_questions}개 파싱됨</p>
            </div>
          )}
        </section>

        {/* --- 섹션 2: 그래프 관리 (구조화 & 병합) --- */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-slate-700">
              <Database className="text-indigo-600" /> 그래프 DB 관리
            </h2>
            <p className="text-slate-500 text-sm mb-6">Neo4j 데이터베이스의 구조를 최적화합니다.</p>
          </div>

          <div className="space-y-4">
            {/* 계층 구조화 버튼 */}
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <h3 className="font-bold text-slate-700 flex items-center gap-2"><Share2 size={18}/> 계층 구조화</h3>
                <p className="text-xs text-slate-400">Chapter - Topic - Concept 연결</p>
              </div>
              <button
                onClick={handleInitHierarchy}
                disabled={graphLoading}
                className={`px-4 py-2 rounded-lg font-bold text-white text-sm transition-all ${
                  graphLoading ? "bg-slate-400" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {graphLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "실행"}
              </button>
            </div>

            {/* [New] 토픽 병합 버튼 */}
            <div className="flex flex-col gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-700 flex items-center gap-2"><Merge size={18}/> 중복 토픽 병합</h3>
                  <p className="text-xs text-slate-400">Vector 유사도 기반 자동 통합</p>
                </div>
                <button
                  onClick={handleMergeTopics}
                  disabled={mergeLoading}
                  className={`px-4 py-2 rounded-lg font-bold text-white text-sm transition-all ${
                    mergeLoading ? "bg-slate-400" : "bg-orange-500 hover:bg-orange-600"
                  }`}
                >
                  {mergeLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "병합 실행"}
                </button>
              </div>
              
              {/* 병합 결과 표시 */}
              {mergeResult && (
                <div className="mt-2 p-3 bg-white rounded-lg border border-orange-200 text-sm animate-fade-in">
                  <p className="font-bold text-orange-700 flex items-center gap-2">
                    <CheckCircle size={14}/> {mergeResult.message || "병합 완료"}
                  </p>
                  {mergeResult.merged_count > 0 ? (
                    <p className="text-slate-600 mt-1">
                      총 <span className="font-bold">{mergeResult.merged_count}</span>개의 그룹이 병합되었습니다.
                    </p>
                  ) : (
                    <p className="text-slate-400 mt-1">병합할 중복 토픽이 없습니다.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* --- 섹션 3: Manim 영상 생성 --- */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 ring-1 ring-purple-100">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-slate-700">
            <Video className="text-purple-600" /> AI 강의 영상 생성 (Manim)
          </h2>
          <p className="text-slate-500 text-sm">
            주제를 입력하면 AI가 <strong>Manim Python 코드</strong>를 작성하고, 
            렌더링 후 <strong>Cloudflare</strong>에 자동 업로드합니다.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input 
            type="text" 
            value={videoTopic}
            onChange={(e) => setVideoTopic(e.target.value)}
            placeholder="예: 변압기의 원리, 3상 교류 회로, 렌츠의 법칙"
            className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerateVideo()}
          />
          <button
            onClick={handleGenerateVideo}
            disabled={videoLoading}
            className={`px-8 py-3 rounded-xl font-bold text-white transition-all shadow-md whitespace-nowrap flex items-center justify-center gap-2 ${
              videoLoading 
                ? "bg-purple-300 cursor-wait" 
                : "bg-purple-600 hover:bg-purple-700 hover:shadow-lg hover:-translate-y-0.5"
            }`}
          >
            {videoLoading ? (
               <>
                 <Loader2 className="animate-spin" />
                 생성 중...
               </>
            ) : (
               <>
                 <PlayCircle />
                 영상 생성하기
               </>
            )}
          </button>
        </div>

        {videoLoading && (
            <div className="mb-6 p-4 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-center gap-3 text-purple-700 animate-pulse">
                <Loader2 className="animate-spin" />
                <span className="font-semibold">{videoStatusMsg}</span>
            </div>
        )}

        {videoResult && (
          <div className="mt-6 bg-slate-900 rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                <span className="text-white font-bold flex items-center gap-2">
                    <CheckCircle className="text-green-400" size={20}/> 
                    생성 완료: {videoTopic}
                </span>
                <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">
                    Source: Cloudflare Stream
                </span>
            </div>
            
            <div className="relative aspect-video bg-black">
                <video 
                    src={videoResult.video_url} 
                    controls 
                    autoPlay 
                    loop 
                    muted 
                    className="w-full h-full object-contain"
                />
            </div>
            
            <div className="p-4 bg-slate-800 text-slate-300 text-sm">
                <p><strong>URL:</strong> <a href={videoResult.video_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{videoResult.video_url}</a></p>
                <p className="mt-1 text-xs text-slate-500">{videoResult.message}</p>
            </div>
          </div>
        )}
      </section>

      {/* --- 섹션 4: 통계 --- */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="총 문제 수" value="1,240" color="text-slate-800" />
        <StatCard title="지식 노드" value="852" color="text-blue-600" />
        <StatCard title="생성된 영상" value="12" color="text-purple-600" />
      </section>
    </div>
  );
}

function StatCard({ title, value, color }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <h3 className="text-slate-500 font-medium mb-2 text-sm">{title}</h3>
          <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
        </div>
    )
}