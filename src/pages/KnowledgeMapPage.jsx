import { useEffect, useMemo, useState } from "react";
import apiClient from "../api/apiClient";
import KnowledgeGraph from "../components/graph/KnowledgeGraph";
import useVoiceAssistant from "../hooks/useVoiceAssistant";

// 과목 목록 (테마 색상 포함)
const SUBJECTS = [
  {
    id: "전기자기학",
    label: "전기자기학",
    icon: "⚡",
    desc: "전계와 자계의 기초",
    color: "#f59e0b",
    bgGradient: "from-amber-500/20 to-orange-600/20",
  },
  {
    id: "전력공학",
    label: "전력공학",
    icon: "🏭",
    desc: "송배전 및 발전 시스템",
    color: "#ef4444",
    bgGradient: "from-red-500/20 to-rose-600/20",
  },
  {
    id: "전기기기",
    label: "전기기기",
    icon: "⚙️",
    desc: "모터, 발전기, 변압기",
    color: "#3b82f6",
    bgGradient: "from-blue-500/20 to-indigo-600/20",
  },
  {
    id: "회로이론",
    label: "회로이론",
    icon: "🔄",
    desc: "RLC 회로 해석",
    color: "#10b981",
    bgGradient: "from-emerald-500/20 to-teal-600/20",
  },
  {
    id: "전기설비기술기준",
    label: "설비기준",
    icon: "📜",
    desc: "KEC 법규 및 규정",
    color: "#8b5cf6",
    bgGradient: "from-violet-500/20 to-purple-600/20",
  },
];

export default function KnowledgeMapPage() {
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [stats, setStats] = useState({ chapters: 0, topics: 0, concepts: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [focusNodes, setFocusNodes] = useState([]); // 줌인할 타겟 노드

  // 음성 어시스턴트 훅
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    processVoiceCommand,
    isSpeaking,
  } = useVoiceAssistant(selectedSubject.label);

  // 음성 인식이 완료되어 transcript가 업데이트되면 처리
  useEffect(() => {
    if (transcript && !isListening) {
      handleVoiceCommand(transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript, isListening]);

  const handleVoiceCommand = async (text) => {
    // 1. 백엔드 분석 및 답변 발화
    const targetIds = await processVoiceCommand(text);

    // 2. 그래프 줌인 처리
    if (targetIds && targetIds.length > 0) {
      setFocusNodes(targetIds);

      // (선택 사항) 첫 번째 타겟 노드 패널 열기
      const targetNode = graphData.nodes.find((n) => n.id === targetIds[0]);
      if (targetNode) {
        setSelectedNode(targetNode);
      }
    }
  };

  // 과목 변경 시 데이터 로드
  useEffect(() => {
    const fetchGraph = async () => {
      setLoading(true);
      setGraphData({ nodes: [], links: [] });
      setSelectedNode(null);

      try {
        const res = await apiClient.get(
          `/graph/full-map/${selectedSubject.id}`,
        );
        setGraphData(res.data);

        // 통계 계산
        const nodes = res.data.nodes || [];
        setStats({
          chapters: nodes.filter((n) => n.group === "Chapter").length,
          topics: nodes.filter((n) => n.group === "Topic").length,
          concepts: nodes.filter((n) => n.group === "Concept").length,
        });
      } catch (err) {
        console.error("그래프 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGraph();
  }, [selectedSubject]);

  // 검색 필터링
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return graphData;

    const query = searchQuery.toLowerCase();
    const matchedNodes = new Set();

    graphData.nodes?.forEach((node) => {
      if (node.name.toLowerCase().includes(query)) {
        matchedNodes.add(node.id);
      }
    });

    const connectedNodes = new Set(matchedNodes);
    graphData.links?.forEach((link) => {
      const sourceId =
        typeof link.source === "object" ? link.source.id : link.source;
      const targetId =
        typeof link.target === "object" ? link.target.id : link.target;

      if (matchedNodes.has(sourceId)) connectedNodes.add(targetId);
      if (matchedNodes.has(targetId)) connectedNodes.add(sourceId);
    });

    return {
      nodes: graphData.nodes?.filter((n) => connectedNodes.has(n.id)) || [],
      links:
        graphData.links?.filter((l) => {
          const sourceId =
            typeof l.source === "object" ? l.source.id : l.source;
          const targetId =
            typeof l.target === "object" ? l.target.id : l.target;
          return connectedNodes.has(sourceId) && connectedNodes.has(targetId);
        }) || [],
    };
  }, [graphData, searchQuery]);

  return (
    // 1. Root Container (Relative positioning for children)
    <div className="flex h-screen bg-slate-950 overflow-hidden relative">
      {/* 2. 좌측 사이드바 */}
      <div className="w-80 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 flex flex-col z-20">
        {/* 헤더 */}
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <span className="text-3xl">🧠</span>
            지식 그래프
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            전기기사 지식의 연결고리를 탐험하세요
          </p>
        </div>

        {/* 검색창 */}
        <div className="p-4 border-b border-slate-800">
          <div className="relative">
            <input
              type="text"
              placeholder="개념 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 pl-10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 과목 선택 리스트 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            과목 선택
          </div>
          {SUBJECTS.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubject(sub)}
              className={`w-full text-left p-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                selectedSubject.id === sub.id
                  ? "bg-gradient-to-r " + sub.bgGradient + " border-2"
                  : "bg-slate-800/30 hover:bg-slate-800/60 border-2 border-transparent"
              }`}
              style={{
                borderColor:
                  selectedSubject.id === sub.id ? sub.color : "transparent",
              }}
            >
              {selectedSubject.id === sub.id && (
                <div
                  className="absolute inset-0 opacity-20 blur-xl"
                  style={{ backgroundColor: sub.color }}
                />
              )}
              <div className="relative flex items-center gap-3">
                <span className="text-2xl">{sub.icon}</span>
                <div>
                  <div className="font-bold text-white">{sub.label}</div>
                  <div className="text-xs text-slate-400">{sub.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* 하단 통계 */}
        <div className="p-4 bg-slate-900/50 border-t border-slate-800">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-800/50 rounded-lg p-2">
              <div className="text-lg font-bold text-blue-400">
                {stats.chapters}
              </div>
              <div className="text-xs text-slate-500">단원</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-2">
              <div className="text-lg font-bold text-purple-400">
                {stats.topics}
              </div>
              <div className="text-xs text-slate-500">주제</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-2">
              <div className="text-lg font-bold text-green-400">
                {stats.concepts}
              </div>
              <div className="text-xs text-slate-500">개념</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 메인 그래프 영역 */}
      <div className="flex-1 relative">
        {/* 로딩 표시 */}
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24 mb-6">
                <div
                  className="absolute inset-0 border-4 border-transparent rounded-full animate-spin"
                  style={{
                    borderTopColor: selectedSubject.color,
                    borderRightColor: selectedSubject.color,
                  }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-3xl">
                  {selectedSubject.icon}
                </span>
              </div>
              <span className="font-bold text-xl text-white animate-pulse">
                {selectedSubject.label} 지식맵 생성 중...
              </span>
            </div>
          </div>
        )}

        {/* 그래프 컴포넌트 */}
        <KnowledgeGraph
          data={filteredData}
          subject={selectedSubject.id}
          onNodeClick={(node) => setSelectedNode(node)}
          focusNodeIds={focusNodes}
        />

        {/* 노드 상세 패널 */}
        {selectedNode && (
          <div className="absolute top-6 right-6 w-96 bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-slate-700 animate-slide-in-right z-30">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full animate-pulse"
                  style={{
                    backgroundColor:
                      selectedNode.group === "Subject"
                        ? selectedSubject.color
                        : selectedNode.group === "Chapter"
                          ? "#60a5fa"
                          : "#34d399",
                  }}
                />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {selectedNode.group}
                </span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-500 hover:text-white transition text-xl"
              >
                ✕
              </button>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              {selectedNode.name}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              {selectedNode.description ||
                selectedNode.definition ||
                "상세 설명이 없습니다."}
            </p>
            <div className="space-y-2">
              <button
                className="w-full py-3 rounded-xl font-bold text-white transition flex items-center justify-center gap-2"
                style={{ backgroundColor: selectedSubject.color }}
              >
                <span>📝</span> 관련 문제 풀기
              </button>
            </div>
          </div>
        )}

        {/* 상단 과목 배지 */}
        <div
          className="absolute top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full backdrop-blur-xl border flex items-center gap-3 z-10"
          style={{
            backgroundColor: `${selectedSubject.color}20`,
            borderColor: `${selectedSubject.color}40`,
          }}
        >
          <span className="text-2xl">{selectedSubject.icon}</span>
          <span className="font-bold text-white text-lg">
            {selectedSubject.label}
          </span>
        </div>
      </div>

      {/* 4. 🎙️ 마이크 버튼 (최상위 독립 레이어) */}
      <div
        className="fixed bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4"
        style={{ zIndex: 99999 }}
      >
        {/* 자막 (말풍선) */}
        {(transcript || isSpeaking) && (
          <div className="bg-slate-900/95 backdrop-blur-md px-6 py-3 rounded-2xl border border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center gap-3 animate-bounce-in text-white">
            {isListening ? (
              <>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="font-medium text-slate-100">
                  {transcript || "듣고 있어요..."}
                </span>
              </>
            ) : isSpeaking ? (
              <>
                <span className="text-xl">🤖</span>
                <span className="font-medium text-blue-200">
                  답변하는 중...
                </span>
              </>
            ) : (
              <>
                <span className="text-green-400 font-bold">✔</span>
                <span className="text-slate-200">"{transcript}"</span>
              </>
            )}
          </div>
        )}

        {/* 대왕 마이크 버튼 */}
        <button
          onClick={isListening ? stopListening : startListening}
          className={`group relative w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-[0_0_50px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-110 active:scale-95 ${
            isListening
              ? "bg-red-600 border-red-400 ring-4 ring-red-500/50 animate-pulse"
              : "bg-blue-600 border-blue-400 ring-4 ring-blue-500/50"
          }`}
        >
          <span className="text-5xl z-10 filter drop-shadow-lg">
            {isListening ? "⏹️" : "🎙️"}
          </span>
          {/* 파동 효과 */}
          {isListening && (
            <span className="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-30"></span>
          )}
        </button>
      </div>
    </div>
  );
}
