import apiClient from "@/api/core/apiClient";
import useCustomMove from "@/hooks/useCustomMove";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
// 🌟 3D 위젯들 Import 추가
import ActiveVideoCard from "./ActiveVideoCard";
import DetailModal from "./DetailModal";
import HeroBanner from "./HeroBanner";
import LockedVideoCard from "./LockedVideoCard";
// ==========================================
// 1. 위젯 매핑 설정 (DB의 widget_type과 실제 컴포넌트 연결)
// ==========================================
// const WIDGET_MAP = {
//   trig_circle: InteractiveUnitCircle, // 예: InteractiveUnitCircle
//   ohms_law: ParallelResistanceWidget, // 👈 null 대신 추가!
//   y_delta_converter: YDeltaConverterWidget, // 👈 null 대신 추가!
//   coulombs_law: CoulombsLaw3DPage,
//   coulombs_law: CoulombsLaw3DPage, // 쿨롱의 법칙 (전자기)
//   fleming_left: FlemingLeftHandWidget, // 플레밍 왼손 (기기/전자기)
//   rotating_field: RotatingMagneticFieldWidget, // 회전자기장 (기기)
//   dc_rectifier: DcRectificationWidget, // DC 정류 (기기)
//   equipotential: Equipotential3DWidget, // 등전위면 (전자기)
//   ampere_law: AmpereLawWidget, // 앙페르/솔레노이드 (전자기)
//   parabolaWidget: ParabolarIntersection,
// };

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
