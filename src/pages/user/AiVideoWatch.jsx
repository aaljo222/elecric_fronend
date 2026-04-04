import apiClient from "@/api/core/apiClient";
import VideoPlayerList from "@/components/video/VideoPlayerList"; // 👈 이 컴포넌트 내부 fetch 확인 필요
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AiVideoWatch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/api/video/url/${id}`);
        // Cloudflare watch -> iframe 변환 (영상 안나오는 문제 해결)
        const playableUrl =
          res.data.video_url?.replace("/watch", "/iframe") || "";
        setVideoInfo({ ...res.data, video_url: playableUrl });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadVideo();
  }, [id]);

  if (loading) return <div className="p-20 text-center">로딩 중...</div>;

  return (
    <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
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
      {/* 우측 재생 목록: videoInfo를 전달하여 subject 기반으로 리스트를 가져오게 합니다 */}
      <aside className="w-full lg:w-80">
        <VideoPlayerList currentSubject={videoInfo?.subject} />
      </aside>
    </main>
  );
}
