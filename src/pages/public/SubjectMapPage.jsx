import apiClient from "@/api/core/apiClient";
import FullMapGraph from "@/components/graph/FullMapGraph";
import { Latex } from "@/components/public/Latex";
import useMove from "@/hooks/useMove";
import "katex/dist/katex.min.css";
import { BookOpen, Calculator, PenTool, Play, X } from "lucide-center";
import { useEffect, useState } from "react";

export default function SubjectMapPage() {
  const move = useMove("/user/videos");

  // --- 상태 관리 ---
  const [subjects, setSubjects] = useState([]); // 💡 DB에서 가져온 과목 목록 저장
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ nodes: 0, links: 0 });
  const [selectedNode, setSelectedNode] = useState(null);

  // 1. 초기 과목 목록 로드 (404 방지를 위해 백엔드 API와 경로 일치 확인)
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await apiClient.get("/api/graph/subjects");
        if (res.data && res.data.length > 0) {
          setSubjects(res.data);
          setSelectedSubject(res.data[0]); // 첫 번째 과목을 기본 선택
        }
      } catch (err) {
        console.error("과목 목록 로드 실패:", err);
      }
    };
    fetchSubjects();
  }, []);

  // 2. 선택된 과목 변경 시 그래프 로드
  useEffect(() => {
    if (!selectedSubject?.id) return;

    const fetchGraph = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(
          `/api/graph/full-map/${encodeURIComponent(selectedSubject.id)}?include_formulas=true`,
        );
        setGraphData(res.data);
        setStats({
          nodes: res.data.nodes?.length || 0,
          links: res.data.links?.length || 0,
        });
      } catch (err) {
        console.error("그래프 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGraph();
  }, [selectedSubject]);

  // ✅ 데이터 가드: subjects가 로딩되지 않았을 때의 크래시 방지
  if (!selectedSubject || subjects.length === 0) {
    return (
      <div className="h-screen bg-[#020617] flex items-center justify-center text-white">
        과목 데이터를 불러오는 중...
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // 4. 렌더링 (JSX)
  // ----------------------------------------------------------------------
  return (
    <div className="flex flex-col h-screen bg-[#020617] overflow-hidden relative font-sans text-slate-200">
      {/* ================= Header ================= */}
      <header className="absolute top-0 left-0 right-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-white/5 transition-all">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg bg-gradient-to-br ${selectedSubject.color} shadow-lg shadow-white/5`}
            >
              <span className="text-xl">🗺️</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                전기기사 지식 맵
              </h1>
              <p className="text-xs text-slate-400">
                {stats.nodes > 0
                  ? `${stats.nodes}개의 지식 노드 탐색 중`
                  : "데이터 로딩 중..."}
              </p>
            </div>
          </div>

          <button
            onClick={() => move("/user")}
            className="text-sm text-slate-400 hover:text-white px-3 py-1 rounded-full border border-slate-700 hover:bg-slate-800 transition"
          >
            나가기
          </button>
        </div>

        {/* ✅ [수정됨] Tailwind CSS 동적 클래스 파싱 오류 수정 부분 */}
        <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto scrollbar-hide border-t border-white/5 bg-slate-950/50">
          {subjects.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubject(sub)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${
                selectedSubject.id === sub.id
                  ? `bg-slate-800 ${sub.borderColor} text-white shadow-[0_0_15px_${sub.themeColor}40]`
                  : "bg-transparent border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}
            >
              <span>{sub.icon}</span>
              <span>{sub.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* ================= Main Graph Area ================= */}
      <main className="flex-1 relative w-full h-full">
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <div
                className={`animate-spin w-12 h-12 border-4 rounded-full border-t-transparent`}
                style={{
                  borderColor: selectedSubject.themeColor,
                  borderTopColor: "transparent",
                }}
              ></div>
              <span className="text-slate-300 font-medium animate-pulse">
                지식 그래프 생성 중...
              </span>
            </div>
          </div>
        )}

        <FullMapGraph
          data={graphData}
          focusNodeIds={focusNodes}
          onNodeClick={handleNodeClick}
          subject={selectedSubject.label}
        />

        {/* ================= Detail Panel (상세 모달) ================= */}
        {selectedNode && (
          <div className="absolute top-36 right-4 w-[90%] md:w-96 z-40 animate-in slide-in-from-right duration-300">
            <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-200px)]">
              {/* 패널 헤더 */}
              <div
                className={`px-5 py-4 border-b border-white/10 flex justify-between items-start bg-gradient-to-r ${
                  selectedNode.group === "Formula"
                    ? "from-red-900/20 to-rose-900/20"
                    : selectedNode.group === "Topic"
                      ? "from-green-900/20 to-emerald-900/20"
                      : "from-slate-800 to-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      selectedNode.group === "Formula"
                        ? "bg-red-500/20 text-red-400"
                        : selectedNode.group === "Topic"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {selectedNode.group === "Formula" ? (
                      <Calculator size={18} />
                    ) : (
                      <BookOpen size={18} />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                      {selectedNode.group}
                    </span>
                    <h3 className="text-lg font-bold text-white leading-tight">
                      {selectedNode.group === "Formula" ? (
                        <Latex>{`$$ ${cleanLatexTitle(selectedNode.latex || selectedNode.name)} $$`}</Latex>
                      ) : (
                        selectedNode.name
                      )}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* 패널 본문 */}
              <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                {/* 1. 설명/정의 */}
                <div className="text-slate-300 text-sm leading-7">
                  {!selectedNode.description && !selectedNode.definition ? (
                    <div className="text-center py-8 text-slate-500 italic">
                      상세 설명 데이터가 없습니다.
                    </div>
                  ) : (
                    <Latex>
                      {selectedNode.description || selectedNode.definition}
                    </Latex>
                  )}
                </div>

                {/* 연결된 하위 수식(Formula) 리스트 렌더링 */}
                {selectedNode.connectedFormulas &&
                  selectedNode.connectedFormulas.length > 0 && (
                    <div className="pt-4 border-t border-white/10">
                      <h4 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
                        <Calculator size={14} />
                        관련 공식{" "}
                        <span className="text-xs bg-red-500/10 px-2 py-0.5 rounded-full">
                          {selectedNode.connectedFormulas.length}
                        </span>
                      </h4>
                      <div className="space-y-3">
                        {selectedNode.connectedFormulas.map((formula, idx) => (
                          <div
                            key={formula.id || idx}
                            className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 overflow-x-auto flex justify-center hover:bg-slate-800 transition-colors"
                          >
                            <Latex>{`$$ ${cleanLatexTitle(formula.latex || formula.name)} $$`}</Latex>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* 액션 버튼 */}
                {selectedNode.group !== "Formula" && (
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={handlePlayLecture}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition shadow-lg shadow-blue-900/20"
                    >
                      <Play size={16} fill="currentColor" /> 강의 보기
                    </button>
                    <button
                      onClick={() => alert("문제 풀이 기능 준비 중")}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm transition"
                    >
                      <PenTool size={16} /> 문제 풀기
                    </button>
                  </div>
                )}

                {selectedNode.group === "Chapter" && (
                  <button
                    onClick={() =>
                      move(
                        `/study/chapter/${selectedNode.id.replace("C:", "")}`,
                      )
                    }
                    className="w-full py-3 mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-500 hover:to-teal-500 transition shadow-lg"
                  >
                    📚 이 단원 집중 학습하기
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
