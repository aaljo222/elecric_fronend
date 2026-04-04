import apiClient from "@/api/core/apiClient";
import ApiQuizCard from "@/components/quiz/ApiQuizCard";
import { Loader2, Lock, MoveLeft, PlayCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// ==========================================
// 1. (통합) 내부용 재생 목록 컴포넌트
// ==========================================
const SidebarPlaylist = ({ currentId, currentSubject, allVideos, onMove }) => {
  // 현재 보고 있는 영상과 같은 과목의 영상들만 필터링
  const playlist = useMemo(() => {
    return allVideos.filter((v) => v.subject === currentSubject);
  }, [allVideos, currentSubject]);

  if (playlist.length <= 1) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
      <div className="p-4 bg-gray-50 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#0047a5] rounded-full"></span>
          {currentSubject} 재생 목록
        </h3>
      </div>
      <div className="max-h-[500px] overflow-y-auto">
        {playlist.map((video, index) => {
          const isActive = video.id === currentId;
          const isLocked = !video.video_url;

          return (
            <div
              key={video.id}
              onClick={() => !isLocked && onMove(video.id)}
              className={`flex items-start gap-3 p-4 border-b border-gray-50 last:border-0 transition-all
                ${isActive ? "bg-blue-50" : isLocked ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"}
              `}
            >
              <div className="mt-1">
                {isActive ? (
                  <PlayCircle size={16} className="text-[#0047a5]" />
                ) : (
                  <span className="text-xs font-bold text-gray-400">
                    {index + 1}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className={`text-sm font-semibold truncate ${isActive ? "text-[#0047a5]" : "text-gray-700"}`}
                >
                  {video.title}
                </h4>
              </div>
              {isLocked && <Lock size={14} className="text-gray-400" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 2. 메인 시청 페이지 컴포넌트
// ==========================================
export default function AiVideoWatch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoInfo, setVideoInfo] = useState(null);
  const [allVideos, setAllVideos] = useState([]); // 전체 목록 저장용
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // 1. 현재 영상 정보 가져오기
        const resUrl = await apiClient.get(`/api/video/url/${id}`);
        const playableUrl =
          resUrl.data.video_url?.replace("/watch", "/iframe") || "";
        setVideoInfo({ ...resUrl.data, video_url: playableUrl });

        // 2. 전체 목록 가져오기 (재생 목록 구성을 위해)
        const resList = await apiClient.get("/api/video/list");
        setAllVideos(resList.data);
      } catch (e) {
        console.error("데이터 로딩 실패:", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );

  return (
    <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* 좌측: 플레이어 영역 */}
      <div className="flex-1">
        <button
          onClick={() => navigate("/user/videos")}
          className="mb-6 text-[#0047a5] font-bold flex items-center gap-1"
        >
          <MoveLeft size={20} /> 돌아가기
        </button>
        <h2 className="text-2xl font-bold mb-4">{videoInfo?.title}</h2>
        <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
          {videoInfo?.video_url ? (
            <iframe
              src={videoInfo.video_url}
              className="w-full h-full"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="h-full flex items-center justify-center text-white">
              영상이 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* 우측: 통합된 재생 목록 사이드바 */}
      <aside className="w-full lg:w-80">
        <SidebarPlaylist
          currentId={id}
          currentSubject={videoInfo?.subject}
          allVideos={allVideos}
          onMove={(targetId) => navigate(`/user/videos/${targetId}`)}
        />
      </aside>
      <ApiQuizCard />
    </main>
  );
}
