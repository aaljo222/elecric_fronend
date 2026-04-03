import apiClient from "@/api/core/apiClient";
import FullMapGraph from "@/components/graph/FullMapGraph";
import { useCallback, useEffect, useState } from "react";

// 수식 렌더링 라이브러리
import { Latex } from "@/components/public/Latex";
import "katex/dist/katex.min.css";

// 아이콘 라이브러리
import useMove from "@/hooks/useMove";
import { BookOpen, Calculator, PenTool, Play, X } from "lucide-react";

export default function SubjectMapPage() {
  const move = useMove("/user/videos");

  // --- 1. 상태 관리 (에러 방지를 위해 모두 선언) ---
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ nodes: 0, links: 0 });
  const [selectedNode, setSelectedNode] = useState(null);
  const [focusNodes, setFocusNodes] = useState([]);

  // --- 2. 유틸리티 함수 ---
  const cleanLatexTitle = (text) => {
    if (!text) return "";
    let processed = text.replaceAll("$", "");
    const keywords = [
      "sigma",
      "pi",
      "mu",
      "epsilon",
      "nabla",
      "int",
      "frac",
      "sqrt",
      "cdot",
    ];
    keywords.forEach((key) => {
      const regex = new RegExp(`(?<!\\\\)\\b${key}\\b`, "g");
      processed = processed.replace(regex, `\\${key}`);
    });
    return processed;
  };

  // --- 3. 데이터 로딩 (API 호출) ---
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await apiClient.get("/api/graph/subjects");
        if (res.data && res.data.length > 0) {
          // 💡 [핵심 추가] 이름(label)을 기준으로 중복된 과목 탭 제거
          const uniqueSubjects = Array.from(
            new Map(res.data.map((item) => [item.label, item])).values(),
          );

          setSubjects(uniqueSubjects);
          setSelectedSubject(uniqueSubjects[0]); // 중복 제거된 배열의 첫 번째 값 선택
        }
      } catch (err) {
        console.error("과목 목록 로드 실패:", err);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (!selectedSubject?.id) return;

    const fetchGraph = async () => {
      setLoading(true);
      setGraphData({ nodes: [], links: [] });
      setSelectedNode(null);

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
        console.error("그래프 데이터 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGraph();
  }, [selectedSubject]);

  // --- 4. 이벤트 핸들러 (handleNodeClick 추가) ---
  const handleNodeClick = useCallback(
    (node) => {
      if (!node) {
        setSelectedNode(null);
        return;
      }
      const detailedNode = { ...node };

      if (node.group === "Concept") {
        const connectedFormulas = graphData.links
          .filter((link) => {
            const sId =
              typeof link.source === "object" ? link.source.id : link.source;
            const tId =
              typeof link.target === "object" ? link.target.id : link.target;
            return sId === node.id || tId === node.id;
          })
          .map((link) => {
            const sId =
              typeof link.source === "object" ? link.source.id : link.source;
            const tId =
              typeof link.target === "object" ? link.target.id : link.target;
            const targetId = sId === node.id ? tId : sId;
            return graphData.nodes.find((n) => n.id === targetId);
          })
          .filter((n) => n && n.group === "Formula");

        detailedNode.connectedFormulas = connectedFormulas;
      } else if (node.group === "Formula") {
        detailedNode.name = "수식 상세";
        detailedNode.connectedFormulas = [
          {
            id: node.id,
            latex: node.latex,
            name: node.name,
            description: node.description,
          },
        ];
      }
      setSelectedNode(detailedNode);
    },
    [graphData],
  );

  const handlePlayLecture = () => {
    if (!selectedNode) return;

    // 💡 'K:1234' 같은 ID에서 ':'를 기준으로 자른 뒤 뒷부분(순수 ID)만 가져옵니다.
    const rawId = selectedNode.id.includes(":")
      ? selectedNode.id.split(":")[1]
      : selectedNode.id;

    // DB에 명시된 lecture_id가 있으면 그걸 쓰고, 없으면 방금 정제한 rawId를 씁니다.
    const lectureId = selectedNode.lecture_id || rawId;

    if (lectureId) {
      move(`/user/videos/${lectureId}`);
    } else {
      alert(`[${selectedNode.name}] 강의가 없습니다.`);
    }
  };
  // --- 5. 가드 렌더링 (에러 방지) ---
  if (!selectedSubject) {
    return (
      <div className="h-screen bg-[#020617] flex items-center justify-center text-white">
        데이터 로딩 중...
      </div>
    );
  }

  // --- 6. JSX (디자인 원본 유지) ---
  return (
    <div className="flex flex-col h-screen bg-[#020617] overflow-hidden relative font-sans text-slate-200">
      <header className="absolute top-0 left-0 right-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-white/5 transition-all">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg bg-gradient-to-br ${selectedSubject.color || "from-pink-500 to-rose-500"} shadow-lg shadow-white/5`}
            >
              <span className="text-xl">{selectedSubject.icon}</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                전기기사 지식 맵
              </h1>
              <p className="text-xs text-slate-400">
                {stats.nodes}개의 지식 노드 탐색 중
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

        {/* 과목 선택 (subjects.map 으로 수정하여 에러 해결) */}
        <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto scrollbar-hide border-t border-white/5 bg-slate-950/50">
          {subjects.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubject(sub)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${
                selectedSubject.id === sub.id
                  ? `bg-slate-800 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]`
                  : "bg-transparent border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}
            >
              <span>{sub.icon}</span>
              <span>{sub.label}</span>
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 relative w-full h-full">
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div
              className="animate-spin w-12 h-12 border-4 rounded-full border-t-transparent"
              style={{ borderColor: selectedSubject.themeColor }}
            ></div>
          </div>
        )}

        <FullMapGraph
          data={graphData}
          focusNodeIds={focusNodes}
          onNodeClick={handleNodeClick}
          subject={selectedSubject.label}
        />

        {selectedNode && (
          <div className="absolute top-36 right-4 w-[90%] md:w-96 z-40 animate-in slide-in-from-right duration-300">
            <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-200px)]">
              <div
                className={`px-5 py-4 border-b border-white/10 flex justify-between items-start bg-slate-800`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
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
              <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-6">
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

                {selectedNode.connectedFormulas?.length > 0 && (
                  <div className="pt-4 border-t border-white/10">
                    <h4 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
                      <Calculator size={14} /> 관련 공식{" "}
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

                {selectedNode.group !== "Formula" && (
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={handlePlayLecture}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition shadow-lg shadow-blue-900/20"
                    >
                      <Play size={16} fill="currentColor" /> 강의 보기
                    </button>
                    <button
                      onClick={() => alert("준비 중입니다.")}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm transition"
                    >
                      <PenTool size={16} /> 문제 풀기
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
