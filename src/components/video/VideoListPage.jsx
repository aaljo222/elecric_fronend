import apiClient from "@/api/core/apiClient";
import useCustomMove from "@/hooks/useCustomMove";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Lock,
  Play,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import InteractiveUnitCircle from "../animaions/InteractiveUnitCircle";

// 💡 [필독] 인터랙티브 위젯 컴포넌트를 만들으셨다면 아래 주석을 풀고 경로를 맞추세요.
// import InteractiveUnitCircle from "./widgets/InteractiveUnitCircle";
// import OhmsLawWidget from "./widgets/OhmsLawWidget";

// ==========================================
// 1. 위젯 매핑 설정 (DB의 widget_type과 실제 컴포넌트 연결)
// ==========================================
const WIDGET_MAP = {
  trig_circle: InteractiveUnitCircle, // 예: InteractiveUnitCircle
  ohms_law: null, // 예: OhmsLawWidget
};

const getCategory = (lecture) => {
  const sub = lecture.subject || "";
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
  { id: "회로이론", label: "회로이론", icon: "⚡" },
  { id: "전자기학", label: "전자기학", icon: "🧲" },
  { id: "Vision", label: "Vision", icon: "🚀" },
];

// ==========================================
// 2. 하위 컴포넌트들 (카드, 모달, 배너)
// ==========================================

const HeroBanner = ({ currentCategoryData, total }) => (
  <div className="bg-[#0047a5] rounded-2xl p-10 md:p-14 mb-10 text-white relative overflow-hidden shadow-lg transition-colors duration-500">
    <div className="absolute right-10 top-1/2 -translate-y-1/2 text-[180px] opacity-10 font-serif font-bold pointer-events-none select-none">
      {currentCategoryData.bgIcon}
    </div>
    <div className="relative z-10 max-w-2xl">
      <h1 className="text-4xl font-extrabold mb-4 font-headline tracking-tight">
        {currentCategoryData.title}
      </h1>
      <p className="text-blue-100 text-lg mb-8 leading-relaxed opacity-90">
        {currentCategoryData.desc}
      </p>
      <div className="flex items-center gap-3">
        <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
          총 {total}개의 강의
        </span>
      </div>
    </div>
  </div>
);

const ActiveVideoCard = ({ video, onRead, onOpenModal }) => {
  const finalThumbnail =
    video.thumbnail ||
    "https://placehold.co/400x300/e2e8f0/94a3b8?text=AI+LECTURE";

  return (
    <article
      className="flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100"
      onClick={() => onRead(video.id)}
    >
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <img
          src={finalThumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* 1. 왼쪽 상단: 카테고리 태그 */}
        <div className="absolute top-4 left-4 bg-[#0047a5] text-white px-3 py-1 rounded-lg font-bold text-sm tracking-wider uppercase">
          {video.category || "STEP"}
        </div>

        {/* 💡 2. 오른쪽 상단: 인터랙티브 위젯 버튼 (이 부분이 빠져있었습니다!) ⭐ */}
        {video.widgetType && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // 카드 전체 클릭(영상 이동) 방지
              onOpenModal(video); // 위젯 모달 열기
            }}
            className="absolute top-4 right-4 z-10 bg-yellow-400 hover:bg-yellow-500 text-gray-900 p-2 rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center group/widget"
            title="실습 도구 열기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="fill-current"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            <span className="max-w-0 overflow-hidden group-hover/widget:max-w-xs group-hover/widget:ml-2 transition-all duration-300 text-xs font-black">
              PRACTICE
            </span>
          </button>
        )}

        {/* 3. 중앙: 호버 시 재생 아이콘 */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
            <Play className="text-[#0047a5] fill-current ml-1" size={28} />
          </div>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <span className="text-[#0047a5] font-bold text-xs uppercase tracking-widest mb-2 block">
          {video.subject || "영상 강의"}
        </span>
        <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2 min-h-[3.5rem]">
          {video.title}
        </h2>
        <p className="text-gray-500 text-base mb-8 font-medium line-clamp-2">
          {video.description}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal(video);
            }}
            className="text-[#0047a5] font-bold text-lg hover:underline underline-offset-4 decoration-2"
          >
            상세보기
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRead(video.id);
            }}
            className="bg-[#e5edff] text-[#0047a5] text-lg px-8 py-3 rounded-xl font-bold shadow-sm hover:bg-[#0047a5] hover:text-white transition-colors"
          >
            시청하기
          </button>
        </div>
      </div>
    </article>
  );
};
const LockedVideoCard = ({ locked }) => (
  <article className="flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 opacity-60">
    <div className="relative h-56 bg-gray-200 flex items-center justify-center">
      <Lock className="text-gray-400" size={48} />
    </div>
    <div className="p-8 flex flex-col flex-grow">
      <span className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-2 block">
        {locked.subject || "영상 강의"}
      </span>
      <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2 min-h-[3.5rem]">
        {locked.title}
      </h3>
      <div className="mt-auto">
        <button
          disabled
          className="w-full py-3 bg-gray-100 text-gray-400 text-lg font-bold rounded-xl cursor-not-allowed"
        >
          수강 불가 (영상 준비중)
        </button>
      </div>
    </div>
  </article>
);

const DetailModal = ({ selectedVideo, onClose, onRead }) => {
  if (!selectedVideo) return null;

  // widgetType에 맞는 컴포넌트 추출
  const ActiveWidgetComponent = selectedVideo.widgetType
    ? WIDGET_MAP[selectedVideo.widgetType]
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 border-b border-gray-100 flex justify-between items-start shrink-0">
          <div>
            <div className="bg-[#e5edff] text-[#0047a5] px-3 py-1 rounded text-xs font-bold uppercase tracking-widest mb-3 inline-block">
              강의 상세 안내
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
              {selectedVideo.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors p-2"
          >
            <X size={32} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-grow flex flex-col xl:flex-row gap-8">
          {/* 설명 영역 */}
          <div className="flex-1 space-y-8">
            <p className="text-xl text-gray-600 leading-relaxed font-medium">
              {selectedVideo.description}
            </p>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h4 className="text-base font-bold text-[#0047a5] uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">
                강의 정보
              </h4>
              <div className="space-y-4 text-lg">
                <div className="flex justify-between">
                  <span>카테고리</span>
                  <span className="font-bold text-gray-900">
                    {selectedVideo.category || "미분류"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>과목명</span>
                  <span className="font-bold text-gray-900">
                    {selectedVideo.subject || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 위젯 영역 */}
          {ActiveWidgetComponent && (
            <div className="flex-1 border-t xl:border-t-0 xl:border-l border-gray-100 pt-8 xl:pt-0 xl:pl-8 text-center">
              <div className="mb-4 inline-block bg-blue-100 text-[#0047a5] px-3 py-1 rounded text-sm font-bold uppercase tracking-widest">
                인터랙티브 실습
              </div>
              <ActiveWidgetComponent />
            </div>
          )}
        </div>

        <div className="p-8 bg-gray-50 shrink-0 rounded-b-2xl border-t border-gray-100">
          <button
            onClick={() => {
              onClose();
              onRead(selectedVideo.id);
            }}
            className="w-full py-5 bg-[#0047a5] text-white text-xl font-extrabold rounded-xl shadow-lg hover:bg-blue-800 transition-colors"
          >
            지금 바로 학습 시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. 메인 페이지 컴포넌트
// ==========================================
export default function VideoListPage() {
  const { page, size, moveToList, moveToRead } = useCustomMove("/user/videos");
  const [activeTab, setActiveTab] = useState("전체");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoList, setVideoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 백엔드 API 호출
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await apiClient.get("/api/video/list");

        // 백엔드 데이터(Neo4j)를 프론트 규격에 매핑
        const mappedData = res.data.map((v) => ({
          id: v.id, // Neo4j의 'id' 속성 사용
          title: v.title || "제목 없음",
          videoUrl: v.video_url || "",
          thumbnail: v.thumbnail || "",
          subject: v.subject || "영상 강의",
          description: v.description || "강의 설명이 없습니다.",
          widgetType: v.widget_type || null,
        }));
        setVideoList(mappedData);
      } catch (e) {
        console.error("비디오 리스트 로딩 실패:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // 탭 필터링 및 카테고리화
  const { activeVideos, lockedVideos } = useMemo(() => {
    let result = videoList.map((v) => ({
      ...v,
      category: getCategory(v),
      isLocked: !v.videoUrl || v.videoUrl === "",
    }));

    if (activeTab !== "전체") {
      result = result.filter((v) => v.category === activeTab);
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

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-[#0047a5]" size={48} />
      </div>
    );

  return (
    <main className="mx-auto px-8 py-12 max-w-7xl w-[85%] font-body relative">
      <HeroBanner
        currentCategoryData={CATEGORY_INFO[activeTab]}
        total={total}
      />

      {/* 카테고리 탭 컨트롤 */}
      <div className="flex flex-wrap items-center justify-start gap-4 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveTab(cat.id);
              moveToList({ page: 1, size });
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-sm ${
              activeTab === cat.id
                ? "bg-[#0047a5] text-white scale-105"
                : "bg-[#f3f4f6] text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="text-xl">{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* 상단 안내 정보 및 애니메이션 */}
      <div className="mb-6 flex justify-between items-end">
        <div className="text-gray-500 font-medium">
          총 {total}개의 시청 가능 강의 중 {page}페이지를 탐색 중입니다.
        </div>
        <div className="w-40 md:w-56 rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-white">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto object-cover"
          >
            <source src="/videos/manim/list_intro.webm" type="video/webm" />
          </video>
        </div>
      </div>

      {/* 강의 리스트 그리드 */}
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

        {/* 마지막 페이지에서 잠긴 강의 노출 */}
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
            className="p-2 disabled:opacity-30 text-gray-400 hover:text-[#0047a5]"
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
            className="p-2 disabled:opacity-30 text-gray-400 hover:text-[#0047a5]"
          >
            <ChevronRight size={24} />
          </button>
        </nav>
      )}

      {/* 상세보기 모달 */}
      <DetailModal
        selectedVideo={selectedVideo}
        onClose={() => setSelectedVideo(null)}
        onRead={moveToRead}
      />
    </main>
  );
}
