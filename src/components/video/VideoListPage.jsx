import apiClient from "@/api/core/apiClient";
import useCustomMove from "@/hooks/useCustomMove";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  circuitLectures,
  emLectures,
  mathLectures,
  visionLectures,
} from "@/constants/videoData";

// 하위 컴포넌트들 Import
import ActiveVideoCard from "./ActiveVideoCard";
import DetailModal from "./DetailModal";
import HeroBanner from "./HeroBanner";
import LockedVideoCard from "./LockedVideoCard";

// 💡 에러의 원인이었던 RandomProblemSection 임포트를 삭제하고,
// 대표님이 만드신 문제 호출 함수를 직접 가져옵니다. (경로 확인 필수!)
import { fetchRandomProblem } from "@/services/mathService";

// ==========================================
// 1. 데이터 및 설정값
// ==========================================
const ALL_LECTURES = [
  ...mathLectures,
  ...circuitLectures,
  ...emLectures,
  ...visionLectures,
];

const getCategory = (lecture) => {
  const sub = lecture.subject || "";
  if (
    sub.includes("심화") ||
    sub.includes("심화수학") ||
    sub.includes("심화 수학")
  )
    return "심화 수학";
  if (sub.includes("수학")) return "기초 수학";
  if (sub.includes("회로")) return "회로이론";
  if (sub.includes("전자기")) return "전자기학";
  if (sub.includes("AI") || sub.includes("Vision")) return "Vision";
  return "전체";
};

const CATEGORY_INFO = {
  전체: {
    title: "알기 쉬운 AI 영상 강의",
    desc: "전기 공학의 기초부터 실무 응용까지, 전문가가 직접 가르치는 고품격 커리큘럼입니다.",
    bgIcon: "A",
  },
  "기초 수학": {
    title: "기초 수학 마스터 클래스",
    desc: "전기 공학 계산의 뼈대가 되는 핵심 수학 이론! 수포자도 이해할 수 있게 쉽게 풀어드립니다.",
    bgIcon: "∑",
  },
  "심화 수학": {
    title: "심화 수학 파워업 클래스",
    desc: "미적분과 벡터 내적 등, 전자기학과 회로망 해석을 위한 필수 고급 수학을 정복합니다.",
    bgIcon: "∫",
  },
  회로이론: {
    title: "회로이론 완벽 정복",
    desc: "전압, 전류, 저항의 관계부터 복잡한 회로망 해석까지 한 번에 끝내는 필수 코스입니다.",
    bgIcon: "Ω",
  },
  전자기학: {
    title: "전자기학 핵심 요약",
    desc: "눈에 보이지 않는 전기장과 자기장의 원리를 3D 시각화 자료를 통해 직관적으로 이해합니다.",
    bgIcon: "🧲",
  },
  Vision: {
    title: "머신 비전 & AI",
    desc: "최신 AI 기술을 활용한 이미지 프로세싱과 머신 비전의 기초를 다집니다.",
    bgIcon: "👁️",
  },
};

const CATEGORIES = [
  { id: "전체", label: "전체보기", icon: "🌟" },
  { id: "기초 수학", label: "기초 수학", icon: "📐" },
  { id: "심화 수학", label: "심화 수학", icon: "📈" },
  { id: "회로이론", label: "회로이론", icon: "⚡" },
  { id: "전자기학", label: "전자기학", icon: "🧲" },
  { id: "Vision", label: "Vision", icon: "🚀" },
];

// ==========================================
// 2. 메인 컴포넌트
// ==========================================
export default function VideoListPage() {
  const { page, size, moveToList, moveToRead } = useCustomMove("/user/videos");

  const [activeTab, setActiveTab] = useState("전체");
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [videoList, setVideoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 💡 랜덤 문제를 위한 State 추가 (기존 외부 파일 로직 내장)
  const [problemData, setProblemData] = useState(null);
  const [isFetchingProblem, setIsFetchingProblem] = useState(false);

  // 백엔드(DB)에서 영상 목록 가져오기
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get("/api/video/list");

        const mappedData = res.data.map((v) => ({
          id: v.id,
          title: v.title || "제목 없음",
          videoUrl: v.video_url || "",
          thumbnail:
            v.thumbnail ||
            "https://placehold.co/400x300/e2e8f0/94a3b8?text=No+Image",
          subject: v.subject || "영상 강의",
          description: v.description || "강의 설명이 없습니다.",
          widgetType: v.widget_type || null,
        }));

        setVideoList(mappedData);
      } catch (e) {
        console.warn(
          "⚠️ 백엔드 데이터 로딩 실패. 로컬 데이터를 대체합니다:",
          e,
        );
        const fallbackData = ALL_LECTURES.map((v) => ({
          id: v.id,
          title: v.title || "제목 없음",
          videoUrl: v.videoUrls?.[0] || "",
          thumbnail:
            v.thumbnail ||
            "https://placehold.co/400x300/e2e8f0/94a3b8?text=No+Image",
          subject: v.subject || "영상 강의",
          description: v.description || "강의 설명이 없습니다.",
          widgetType: null,
        }));
        setVideoList(fallbackData);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // 데이터 가공 및 필터링
  const { activeVideos, lockedVideos } = useMemo(() => {
    let result = videoList.map((v) => ({
      ...v,
      category: getCategory(v),
      duration: v.duration || "10:00",
      createdAt: v.createdAt || "2026-01-01",
      isLocked: !v.videoUrl || v.videoUrl === "",
    }));

    if (activeTab !== "전체") {
      result = result.filter((video) => video.category === activeTab);
    }

    return {
      activeVideos: result.filter((v) => !v.isLocked),
      lockedVideos: result.filter((v) => v.isLocked),
    };
  }, [activeTab, videoList]);

  const total = activeVideos.length;
  const totalPages = Math.ceil(total / size) || 1;
  const start = (page - 1) * size;
  const currentList = activeVideos.slice(start, start + size);

  // 탭 변경 시
  const handleTabClick = (categoryId) => {
    setActiveTab(categoryId);
    setProblemData(null); // 💡 탭을 바꾸면 기존에 띄워둔 문제 화면도 초기화합니다.
    moveToList({ page: 1, size });
  };

  // 💡 랜덤 문제 가져오기 로직 (내장)
  const getRandomProblemId = () => {
    if (activeTab === "회로이론" || activeTab === "전자기학")
      return "circuit_random";
    return "math_random";
  };

  const handleFetchProblem = async () => {
    setIsFetchingProblem(true);
    try {
      const currentId = getRandomProblemId();
      const data = await fetchRandomProblem(currentId);
      setProblemData(data);
    } catch (error) {
      console.error("문제 가져오기 실패:", error);
      alert("문제를 불러오는데 실패했습니다. 백엔드 연결을 확인해주세요.");
    } finally {
      setIsFetchingProblem(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#0047a5]" size={48} />
        <p className="text-gray-500 font-bold">
          강의 데이터를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  return (
    <main className="mx-auto px-8 py-12 max-w-7xl w-[85%] font-body relative">
      <HeroBanner
        currentCategoryData={CATEGORY_INFO[activeTab] || CATEGORY_INFO["전체"]}
        total={total}
      />

      {/* 탭 컨트롤 */}
      <div className="flex flex-wrap items-center justify-start gap-4 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleTabClick(cat.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-sm ${
              activeTab === cat.id
                ? "bg-[#0047a5] text-white shadow-md scale-105"
                : "bg-[#f3f4f6] text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="text-xl">{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="mb-6 text-gray-500 font-medium">
        총 {total}개의 시청 가능 강의 중 {page}페이지를 탐색 중입니다.
      </div>

      {/* 비디오 리스트 */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
        {currentList.length > 0 ? (
          currentList.map((video) => (
            <ActiveVideoCard
              key={video.id}
              video={video}
              onRead={moveToRead}
              onOpenModal={setSelectedVideo}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-gray-500 text-lg font-medium">
            시청 가능한 강의가 없습니다. 😢
          </div>
        )}

        {/* 잠금 비디오 노출 */}
        {(page === totalPages || currentList.length === 0) &&
          lockedVideos.map((locked) => (
            <LockedVideoCard key={locked.id} locked={locked} />
          ))}
      </section>

      {/* 페이지네이션 */}
      {total > 0 && (
        <nav className="flex justify-center items-center gap-2">
          <button
            onClick={() => moveToList({ page: page - 1, size })}
            disabled={page <= 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 text-gray-500"
          >
            <ChevronLeft size={24} />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i + 1}
              onClick={() => moveToList({ page: i + 1, size })}
              className={`w-10 h-10 rounded-xl font-bold transition-all ${
                page === i + 1
                  ? "bg-[#0047a5] text-white shadow-lg scale-110"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => moveToList({ page: page + 1, size })}
            disabled={page >= totalPages}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 text-gray-500"
          >
            <ChevronRight size={24} />
          </button>
        </nav>
      )}

      {/* 💡 하단: 오늘의 랜덤 도전 영역 (내장형) */}
      <div className="mt-20 pt-16 border-t border-gray-200">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            오늘의 랜덤 도전 🎯
          </h2>
          <p className="text-gray-500 mt-3 text-lg">
            선택하신{" "}
            <span className="text-[#0047a5] font-black underline underline-offset-4 decoration-2">
              '{activeTab}'
            </span>{" "}
            분야의 무작위 문제를 풀어보고 실력을 점검하세요!
          </p>
        </div>

        {/* 문제 생성 버튼 */}
        <div className="w-full text-center">
          <button
            onClick={handleFetchProblem}
            disabled={isFetchingProblem}
            className={`font-bold text-lg py-4 px-10 rounded-xl shadow-md transition-all active:scale-[0.98] ${
              isFetchingProblem
                ? "bg-gray-400 text-white cursor-not-allowed animate-pulse"
                : "bg-[#0047a5] text-white hover:bg-blue-800 hover:shadow-lg"
            }`}
          >
            {isFetchingProblem
              ? "⏳ AI가 맞춤형 문제를 빚어내는 중..."
              : "🎯 새로운 실전 문제 생성하기"}
          </button>
        </div>

        {/* 문제 출력 영역 */}
        {problemData && (
          <div className="mt-8 p-8 bg-[#f8faff] border border-blue-100 rounded-xl shadow-sm animate-fade-in text-left max-w-4xl mx-auto">
            <h3 className="text-2xl font-extrabold text-[#0047a5] mb-6 flex items-center gap-2 tracking-tight">
              📝 실전 연습 문제
            </h3>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8 text-xl text-gray-900 font-bold leading-relaxed overflow-x-auto">
              {problemData.problem}
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-gray-700 text-lg border-b border-blue-200 pb-3 mb-4">
                💡 단계별 해설
              </h4>
              {problemData.steps?.map((step, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-start bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
                >
                  <span className="bg-[#e5edff] text-[#0047a5] font-black w-8 h-8 flex items-center justify-center rounded-full shrink-0 shadow-inner">
                    {index + 1}
                  </span>
                  <div className="mt-1 w-full overflow-hidden">
                    <p className="text-gray-600 font-medium mb-3 leading-relaxed">
                      {step.text}
                    </p>
                    {step.math && (
                      <div className="bg-gray-50 p-4 rounded-lg text-[#0047a5] font-mono text-base overflow-x-auto border border-gray-200 whitespace-nowrap">
                        {step.math}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-gradient-to-r from-[#0047a5] to-blue-700 text-white rounded-xl text-center shadow-lg">
              <span className="block text-blue-200 text-sm font-bold mb-1 tracking-wider uppercase">
                최종 정답
              </span>
              <span className="text-3xl font-black">{problemData.answer}</span>
            </div>
          </div>
        )}
      </div>

      <DetailModal
        selectedVideo={selectedVideo}
        onClose={() => setSelectedVideo(null)}
        onRead={moveToRead}
      />
    </main>
  );
}
