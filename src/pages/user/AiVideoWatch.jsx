import apiClient from "@/api/core/apiClient";
import { Loader2, MoveLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// 대표님이 가지고 계신 컴포넌트들 임포트
import SidebarPlaylist from "./SidebarPlaylist";
// 💡 아까 분리해서 만드셨던 랜덤 문제 컴포넌트를 이렇게 불러옵니다!
import RandomProblemSection from "@/components/RandomProblemSection";

export default function AiVideoWatch() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 영상 관련 상태
  const [videoInfo, setVideoInfo] = useState(null);
  const [allVideos, setAllVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // 1. 영상 정보 가져오기
        const resUrl = await apiClient.get(`/api/video/url/${id}`);
        const playableUrl =
          resUrl.data.video_url?.replace("/watch", "/iframe") || "";
        setVideoInfo({ ...resUrl.data, video_url: playableUrl });

        // 2. 전체 목록 가져오기
        const resList = await apiClient.get("/api/video/list");
        setAllVideos(resList.data);
      } catch (e) {
        console.error("데이터 로딩 실패:", e);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* --- 좌측: 플레이어 영역 --- */}
        <div className="flex-1">
          <button
            onClick={() => navigate("/user/videos")}
            className="mb-6 text-[#0047a5] font-bold flex items-center gap-1 hover:underline"
          >
            <MoveLeft size={20} /> 돌아가기
          </button>
          <h2 className="text-2xl font-bold mb-4">{videoInfo?.title}</h2>

          <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl mb-8">
            {videoInfo?.video_url ? (
              <iframe
                src={videoInfo.video_url}
                className="w-full h-full border-0"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="h-full flex items-center justify-center text-white">
                영상 준비 중
              </div>
            )}
          </div>
        </div>

        {/* --- 우측: 재생 목록 (기존 코드 유지) --- */}
        <aside className="w-full lg:w-80">
          <SidebarPlaylist
            currentId={id}
            currentSubject={videoInfo?.subject}
            allVideos={allVideos}
            onMove={(targetId) => navigate(`/user/videos/${targetId}`)}
          />
        </aside>
      </div>

      {/* 💡 하단: 랜덤 문제 생성기 컴포넌트 연결 */}
      {/* 현재 영상의 id(예: math_derivative)를 넘겨서 그에 맞는 문제를 가져오게 합니다 */}
      <section className="max-w-4xl mx-auto w-full mt-8">
        <RandomProblemSection lectureId={id} />
      </section>
    </main>
  );
}
