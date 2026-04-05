import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import FullMapGraph from "../components/graph/FullMapGraph";
import useVoiceAssistant from "../hooks/useVoiceAssistant";

// 수식 렌더링 라이브러리
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

// 아이콘 라이브러리
import { BookOpen, Calculator, PenTool, Play, X } from "lucide-react";

// ----------------------------------------------------------------------
// 1. 과목 상수 데이터 (SUBJECTS)
// ----------------------------------------------------------------------
const SUBJECTS = [
  {
    id: "전기자기학",
    label: "전기자기학",
    icon: "⚡",
    color: "from-amber-500 to-orange-500",
    borderColor: "border-amber-500",
    bgColor: "bg-amber-500",
    themeColor: "#f59e0b",
  },
  {
    id: "전력공학",
    label: "전력공학",
    icon: "🏭",
    color: "from-red-500 to-rose-500",
    borderColor: "border-red-500",
    bgColor: "bg-red-500",
    themeColor: "#ef4444",
  },
  {
    id: "전기기기",
    label: "전기기기",
    icon: "⚙️",
    color: "from-blue-500 to-indigo-500",
    borderColor: "border-blue-500",
    bgColor: "bg-blue-500",
    themeColor: "#3b82f6",
  },
  {
    id: "회로이론",
    label: "회로이론",
    icon: "🔄",
    color: "from-emerald-500 to-teal-500",
    borderColor: "border-emerald-500",
    bgColor: "bg-emerald-500",
    themeColor: "#10b981",
  },
  {
    id: "제어공학",
    label: "제어공학",
    icon: "🎛️",
    color: "from-cyan-500 to-sky-500",
    borderColor: "border-cyan-500",
    bgColor: "bg-cyan-500",
    themeColor: "#06b6d4",
  },
  {
    id: "전기설비기술기준",
    label: "설비기준",
    icon: "📜",
    color: "from-violet-500 to-purple-500",
    borderColor: "border-violet-500",
    bgColor: "bg-violet-500",
    themeColor: "#8b5cf6",
  },
];

// ✅ [핵심 추가] 노드 이름과 실제 강의 ID 매핑 객체
const NODE_TO_LECTURE_MAP = {
  "옴의 법칙 (Ohm's Law)": "circuit_ohm_law_equivalent",
  "옴의 법칙": "circuit_ohm_law_equivalent", // 1번 개념
  "병렬연결 (Parallel Connection)": "circuit_ohm_law_equivalent", // 2번 개념 (강의 ID 통일)
  "직렬 회로": "circuit_resistance",
  "Y-Δ 변환": "circuit_ydelta",
  // 필요한 강의 매핑을 여기에 계속 추가하세요.
};

export default function SubjectMapPage() {
  const navigate = useNavigate();

  // 상태 관리
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ nodes: 0, links: 0 });
  const [selectedNode, setSelectedNode] = useState(null);
  const [focusNodes, setFocusNodes] = useState([]); // 줌인 타겟

  // 음성 비서 훅
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    processVoiceCommand,
    isSpeaking,
  } = useVoiceAssistant(selectedSubject.label);

  // ----------------------------------------------------------------------
  // 2. 음성 명령 처리
  // ----------------------------------------------------------------------
  useEffect(() => {
    if (transcript && !isListening) {
      handleVoiceCommand(transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript, isListening]);

  const handleVoiceCommand = async (text) => {
    if (!text.trim()) return;

    const targetIds = await processVoiceCommand(text);

    if (targetIds && targetIds.length > 0) {
      setFocusNodes(targetIds);

      const targetNode = graphData.nodes.find((n) => n.id === targetIds[0]);
      if (targetNode) {
        // 음성으로 찾은 노드도 상세 정보를 표시하기 위해 handleNodeClick 로직 태움
        handleNodeClick(targetNode);
      }
    }
  };

  // ----------------------------------------------------------------------
  // 3. 데이터 로딩 (API 호출)
  // ----------------------------------------------------------------------
  useEffect(() => {
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
        console.error("그래프 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGraph();
  }, [selectedSubject]);

  // ----------------------------------------------------------------------
  // 4. 유틸리티 함수 및 핸들러
  // ----------------------------------------------------------------------
  const cleanLatexTitle = (text) => {
    if (!text) return "";
    let processed = text.replaceAll("$", "");

    const keywords = [
      { from: "Wsigma", to: "\\sigma" },
      { from: "Wpi", to: "\\pi" },
      { key: "sigma" },
      { key: "pi" },
      { key: "mu" },
      { key: "epsilon" },
      { key: "nabla" },
      { key: "int" },
      { key: "frac" },
      { key: "sqrt" },
      { key: "cdot" },
    ];

    keywords.forEach((item) => {
      if (item.from) {
        processed = processed.replaceAll(item.from, item.to);
      } else {
        const regex = new RegExp(`(?<!\\\\)\\b${item.key}\\b`, "g");
        processed = processed.replace(regex, `\\${item.key}`);
      }
    });
    return processed;
  };

  const handleNodeClick = (node) => {
    if (!node) {
      setSelectedNode(null);
      return;
    }

    const detailedNode = { ...node };

    // [CASE 1] Concept(개념) 노드 클릭 -> 연결된 Formula(수식) 찾기
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
    }

    // [CASE 2] Formula(수식) 노드 직접 클릭 -> 자기 자신을 연결된 수식으로 처리
    else if (node.group === "Formula") {
      detailedNode.name = "수식 상세"; // 제목 변경
      // Formula 노드 자체에 있는 latex 정보를 connectedFormulas 형태로 가공
      detailedNode.connectedFormulas = [
        {
          id: node.id,
          latex: node.latex,
          name: node.name,
          description: node.description, // 수식에 대한 설명
        },
      ];
    }

    setSelectedNode(detailedNode);
  };

  // ✅ [핵심 추가] 강의 보기 버튼 클릭 핸들러
  const handlePlayLecture = () => {
    if (!selectedNode || !selectedNode.name) return;

    const lectureId = NODE_TO_LECTURE_MAP[selectedNode.name];

    if (lectureId) {
      navigate(`/lectures/${lectureId}`);
    } else {
      alert(
        `[${selectedNode.name}] 개념에 연결된 강의 영상이 아직 준비되지 않았습니다.`,
      );
    }
  };

  // ----------------------------------------------------------------------
  // 5. 렌더링 (JSX)
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
            onClick={() => navigate(-1)}
            className="text-sm text-slate-400 hover:text-white px-3 py-1 rounded-full border border-slate-700 hover:bg-slate-800 transition"
          >
            나가기
          </button>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto scrollbar-hide border-t border-white/5 bg-slate-950/50">
          {SUBJECTS.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubject(sub)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${
                selectedSubject.id === sub.id
                  ? `bg-slate-800 border-${sub.borderColor.split("-")[1]}-500 text-white shadow-[0_0_15px_${sub.themeColor}40]`
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
                            {/* 수식 렌더링: latex 필드가 없으면 name을 사용 */}
                            <Latex>{`$$ ${cleanLatexTitle(formula.latex || formula.name)} $$`}</Latex>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* 액션 버튼 */}
                {selectedNode.group !== "Formula" && (
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                    {/* ✅ [수정됨] 강의 보기 버튼 동작 변경 */}
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
                      navigate(
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

      {/* ================= Voice Dock ================= */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 w-full max-w-md px-4">
        {(transcript || isSpeaking) && (
          <div className="bg-slate-900/90 backdrop-blur-xl border border-blue-500/30 px-6 py-3 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="flex items-center gap-3">
              {isListening ? (
                <>
                  <div className="flex gap-1 h-3 items-end">
                    <span className="w-1 h-full bg-red-500 rounded-full animate-[bounce_1s_infinite]"></span>
                    <span className="w-1 h-2/3 bg-red-500 rounded-full animate-[bounce_1s_infinite_0.2s]"></span>
                    <span className="w-1 h-1/2 bg-red-500 rounded-full animate-[bounce_1s_infinite_0.4s]"></span>
                  </div>
                  <span className="text-white font-medium text-sm">
                    {transcript || "말씀해주세요..."}
                  </span>
                </>
              ) : isSpeaking ? (
                <>
                  <span className="text-xl">🤖</span>
                  <span className="text-blue-300 font-medium text-sm">
                    답변 중입니다...
                  </span>
                </>
              ) : (
                <>
                  <span className="text-green-400 font-bold">✔</span>
                  <span className="text-slate-300 text-sm">"{transcript}"</span>
                </>
              )}
            </div>
          </div>
        )}

        <button
          onClick={isListening ? stopListening : startListening}
          className={`group relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.5)] border-4 ${
            isListening
              ? "bg-red-500 border-red-400 scale-110 shadow-red-500/40"
              : "bg-blue-600 border-blue-400 hover:bg-blue-500 hover:scale-105 shadow-blue-500/40"
          }`}
        >
          {isListening && (
            <>
              <span className="absolute inset-0 rounded-full bg-red-500 opacity-20 animate-ping"></span>
              <span className="absolute -inset-3 rounded-full border border-red-500/30 opacity-40 animate-pulse"></span>
            </>
          )}

          <span className="text-4xl z-10 filter drop-shadow-md">
            {isListening ? "⏹️" : "🎙️"}
          </span>
        </button>

        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">
          AI Voice Assistant
        </p>
      </div>
    </div>
  );
}
