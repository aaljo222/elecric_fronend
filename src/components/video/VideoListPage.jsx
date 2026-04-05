import useCustomMove from "@/hooks/useCustomMove";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import {
  circuitLectures,
  emLectures,
  mathLectures,
  visionLectures,
} from "@/constants/videoData";

// 💡 분리해둔 하위 컴포넌트들 Import 추가
import ActiveVideoCard from "./ActiveVideoCard";
import DetailModal from "./DetailModal";
import HeroBanner from "./HeroBanner";
import LockedVideoCard from "./LockedVideoCard";

// 💡 1. 랜덤 문제 생성기 컴포넌트 임포트 (경로 확인 필수!)
import RandomProblemSection from "@/components/RandomProblemSection";
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
  if (lecture.subject?.includes("수학")) return "기초 수학";
  if (lecture.subject?.includes("회로")) return "회로이론";
  if (lecture.subject?.includes("전자기")) return "전자기학";
  if (lecture.subject?.includes("AI") || lecture.subject?.includes("Vision"))
    return "Vision";
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

// ==========================================
// 3. 메인 컴포넌트
// ==========================================
export default function VideoListPage() {
  const { page, size, moveToList, moveToRead } = useCustomMove("/user/videos");

  const [activeTab, setActiveTab] = useState("전체");
  const [selectedVideo, setSelectedVideo] = useState(null);

  // ✅ 데이터 가공 및 필터링 (정렬 로직 제거)
  const { activeVideos, lockedVideos } = useMemo(() => {
    let result = ALL_LECTURES.map((v) => ({
      ...v,
      category: getCategory(v),
      duration: v.duration || "10:00",
      createdAt: v.createdAt || "2026-01-01",
      isLocked:
        !v.videoUrls || v.videoUrls.length === 0 || v.videoUrls[0] === "",
    }));

    if (activeTab !== "전체")
      result = result.filter((video) => video.category === activeTab);

    // 정렬 로직이 제거됨: 데이터 순서 그대로 유지

    return {
      activeVideos: result.filter((v) => !v.isLocked),
      lockedVideos: result.filter((v) => v.isLocked),
    };
  }, [activeTab]);

  const total = activeVideos.length;
  const totalPages = Math.ceil(total / size) || 1;
  const start = (page - 1) * size;
  const currentList = activeVideos.slice(start, start + size);

  const handleTabClick = (categoryId) => {
    setActiveTab(categoryId);
    moveToList({ page: 1, size });
  };

  // 💡 2. 탭(카테고리)에 따라 백엔드 API에 요청할 고유 ID를 분기 처리
  const getRandomProblemId = () => {
    if (activeTab === "회로이론" || activeTab === "전자기학")
      return "circuit_random";
    return "math_random"; // 기본값: 수학 문제
  };

  return (
    <main className="mx-auto px-8 py-12 max-w-7xl w-[85%] font-body relative">
      <HeroBanner
        currentCategoryData={CATEGORY_INFO[activeTab]}
        total={total}
      />

      {/* 탭 컨트롤 (정렬 필터 제거됨) */}
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

        {/* 잠금 비디오 (마지막 페이지이거나 데이터 없을 때 렌더링) */}
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
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-500"
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
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-500"
          >
            <ChevronRight size={24} />
          </button>
        </nav>
      )}

      {/* 💡 3. 하단: 오늘의 랜덤 도전 영역 추가 */}
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

        {/* 선택된 탭에 따라 동적으로 ID를 던져줍니다. */}
        <RandomProblemSection lectureId={getRandomProblemId()} />
      </div>

      {/* 모달 */}
      <DetailModal
        selectedVideo={selectedVideo}
        onClose={() => setSelectedVideo(null)}
        onRead={moveToRead}
      />
    </main>
  );
}
