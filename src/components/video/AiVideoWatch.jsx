import apiClient from "@/api/core/apiClient"; // 대표님의 API 클라이언트
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AiVideoWatch = () => {
  // 1. URL에서 비디오 ID 가져오기 (라우터의 /videos/:id 부분)
  const { id } = useParams();
  const navigate = useNavigate();

  // 2. 상태 관리
  const [videoData, setVideoData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 3. 비디오 정보 불러오기 로직
  useEffect(() => {
    const fetchVideoDetail = async () => {
      setIsLoading(true);
      try {
        // 백엔드 터미널 로그에 찍히던 그 API입니다!
        const response = await apiClient.get(`/api/video/url/${id}`);

        // 응답 데이터 저장 (API 구조에 따라 response.data.data 일 수도 있습니다)
        setVideoData(response.data);
      } catch (error) {
        console.error("비디오 정보를 불러오는데 실패했습니다.", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchVideoDetail();
    }
  }, [id]);

  // --- UI: 로딩 중 화면 ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#0047a5] border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-lg font-bold text-gray-500 animate-pulse">
          강의 영상을 준비하는 중입니다... ⏳
        </div>
      </div>
    );
  }

  // --- UI: 에러 / 데이터 없음 화면 ---
  if (!videoData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          영상을 찾을 수 없습니다 😢
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-[#e5edff] text-[#0047a5] font-bold rounded-xl hover:bg-blue-100 transition-colors"
        >
          이전 페이지로 돌아가기
        </button>
      </div>
    );
  }

  // Cloudflare iframe URL 조합 (DB에 video_url이 없을 경우 대비)
  const streamUrl =
    videoData.video_url ||
    `https://customer-w4c7tmh3vvpu6ohy.cloudflarestream.com/${videoData.videoId}/iframe`;

  // --- UI: 정상 재생 화면 ---
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      {/* 상단 헤더 & 뒤로가기 */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <span className="text-[#0047a5] font-bold text-sm uppercase tracking-widest mb-2 block">
            {videoData.subject || "심화 수학"}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            {videoData.title || "강의 영상"}
          </h1>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="shrink-0 px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          목록으로
        </button>
      </div>

      {/* 🎬 영상 플레이어 영역 (유튜브처럼 16:9 비율 완벽 유지) */}
      <div className="relative w-full overflow-hidden rounded-2xl shadow-lg bg-black pt-[56.25%] mb-8 border border-gray-100">
        <iframe
          src={streamUrl}
          className="absolute top-0 left-0 w-full h-full border-0"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
        ></iframe>
      </div>

      {/* 📝 하단 설명 및 실습 영역 */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#0047a5]"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" x2="8" y1="13" y2="13" />
            <line x1="16" x2="8" y1="17" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          강의 핵심 요약
        </h3>
        <p className="text-gray-600 leading-relaxed text-lg break-keep">
          {videoData.description ||
            videoData.message ||
            "이 강의에 대한 상세 설명이 제공되지 않았습니다."}
        </p>

        {/* 실습 위젯이 있는 강의일 경우 PRACTICE 버튼 활성화 (선택 사항) */}
        {videoData.widget_type && (
          <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between items-center bg-yellow-50/50 p-6 rounded-xl border border-yellow-100">
            <div>
              <h4 className="font-bold text-gray-900 mb-1">
                이론을 배웠다면 직접 만져보세요!
              </h4>
              <p className="text-sm text-gray-500">
                대화형 위젯을 통해 개념을 시각적으로 이해할 수 있습니다.
              </p>
            </div>
            <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-xl font-black shadow-sm transition-all hover:scale-105 active:scale-95">
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
              실습 도구 열기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiVideoWatch;
