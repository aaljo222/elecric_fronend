import React, { useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import {
  FaMicrophone,
  FaSearch,
  FaPlayCircle,
  FaVideo,
  FaRobot,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";

const VideoSearchPage = () => {
  const [videoList, setVideoList] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. 초기 데이터 로드
  useEffect(() => {
    fetchVideoList();
  }, []);

  const fetchVideoList = async () => {
    try {
      const res = await apiClient.get("/api/video/list");
      console.log("받은 데이터:", res.data); // 콘솔에서 데이터 확인
      setVideoList(res.data);
    } catch (err) {
      console.error("목록 로드 실패:", err);
    }
  };

  // MP4 파일(R2)인지 확인하는 함수
  const isMp4 = (url) =>
    url && (url.includes(".mp4") || url.includes("r2.dev"));

  // VideoSearchPage.js 내 검색 핸들러 부분 수정
  const handleSearch = async (query) => {
    if (!query) return;
    setLoading(true);
    setCurrentVideo(null);

    try {
      // 1. Neo4j 기반 API 호출 (저장된 영상이 있는지 먼저 확인) [cite: 114]
      const res = await apiClient.get("/api/video/play/by-concept", {
        params: { concept: query },
      });

      // 2. 결과가 있으면 즉시 재생 (Claude 호출 없음) [cite: 118]
      setCurrentVideo({
        video_url: res.data.video_url,
        title: res.data.title,
        status: "completed",
      });
    } catch (err) {
      // 3. 만약 DB에 없다면 새로운 영상 생성을 유도 [cite: 113, 116]
      if (window.confirm("새로운 개념입니다. AI가 영상을 제작하도록 할까요?")) {
        await apiClient.post("/api/video/search-or-generate", { topic: query });
        alert("영상 제작을 시작했습니다. 잠시 후 목록에서 확인하세요!");
      }
    } finally {
      setLoading(false);
    }
  };
  // 3. 음성 인식 구현
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("이 브라우저는 음성 인식을 지원하지 않습니다. (Chrome 사용 권장)");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ko-KR";
    recognition.start();
    setIsListening(true);

    recognition.onresult = (e) => {
      const txt = e.results[0][0].transcript;
      setSearchText(txt);
      handleSearch(txt);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
      {/* 헤더 & 검색창 */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 flex justify-center items-center gap-2">
          <FaRobot className="text-indigo-600" /> AI 개념 영상 검색
        </h2>

        <div className="relative max-w-2xl mx-auto flex items-center">
          <input
            type="text"
            className="w-full p-4 pl-6 pr-16 rounded-full border-2 border-indigo-100 shadow-sm focus:outline-none focus:border-indigo-500"
            placeholder="마이크를 누르고 '변압기 원리' 라고 말해보세요"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(searchText)}
          />
          <button
            onClick={() => handleSearch(searchText)}
            className="absolute right-14 text-gray-400 hover:text-indigo-600 p-2"
          >
            <FaSearch size={20} />
          </button>
          <button
            onClick={startListening}
            className={`absolute right-2 p-3 rounded-full transition-all ${isListening ? "bg-red-500 animate-pulse text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
          >
            <FaMicrophone size={20} />
          </button>
        </div>
      </div>

      {/* 메인 플레이어 */}
      {loading ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl mb-10 border border-gray-100">
          <div className="animate-spin text-4xl mb-4 text-indigo-500 mx-auto w-fit">
            <FaSpinner />
          </div>
          <p className="text-gray-600 font-medium">
            AI가 영상을 찾아오고 있습니다...
          </p>
        </div>
      ) : (
        currentVideo && (
          <div className="bg-black rounded-2xl overflow-hidden shadow-2xl mb-12 max-w-4xl mx-auto border-4 border-gray-900 animate-fade-in-up">
            <div className="relative pt-[56.25%]">
              {isMp4(currentVideo.video_url) ? (
                <video
                  src={currentVideo.video_url}
                  controls
                  autoPlay
                  className="absolute top-0 left-0 w-full h-full"
                />
              ) : (
                <iframe
                  src={`https://iframe.videodelivery.net/${currentVideo.video_url.split("/").pop()}?preload=true&autoplay=true`}
                  className="absolute top-0 left-0 w-full h-full border-none"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen={true}
                ></iframe>
              )}
            </div>
            <div className="p-6 bg-gray-900 text-white">
              <h3 className="text-2xl font-bold">{currentVideo.title}</h3>
              <p className="text-gray-400 mt-1">
                {currentVideo.concept
                  ? `검색 키워드: ${currentVideo.concept}`
                  : "선택된 강의"}
              </p>
            </div>
          </div>
        )
      )}

      {/* 목록 리스트 */}
      <div className="mt-12 border-t pt-8 border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaPlayCircle className="text-indigo-600" /> 전체 강의 현황
        </h3>

        {/* 데이터가 없을 때 표시 */}
        {videoList.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            표시할 강의 데이터가 없습니다. (관리자 페이지에서 생성을 시작하세요)
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videoList.map((video, idx) => (
            <div
              key={idx}
              className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 overflow-hidden hover:-translate-y-1"
              onClick={() => {
                // 완료된 것만 재생 가능
                if (video.status === "completed" && video.video_url) {
                  setCurrentVideo(video);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  alert(
                    `현재 상태: ${video.status}\n${video.message || "아직 재생할 수 없습니다."}`,
                  );
                }
              }}
            >
              {/* 썸네일 영역 */}
              <div className="relative aspect-video bg-slate-100 flex items-center justify-center overflow-hidden">
                {video.status === "completed" && video.video_url ? (
                  isMp4(video.video_url) ? (
                    <div className="flex flex-col items-center text-indigo-400">
                      <FaVideo size={40} />
                      <span className="text-xs mt-2 font-bold">재생하기</span>
                    </div>
                  ) : (
                    <img
                      src={`https://videodelivery.net/${video.video_url.split("/").pop()}/thumbnails/thumbnail.jpg?time=2s&height=300`}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  )
                ) : video.status === "generating" ? (
                  <div className="flex flex-col items-center text-blue-500 animate-pulse">
                    <FaSpinner size={30} className="animate-spin mb-2" />
                    <span className="text-xs font-bold">AI 생성 중...</span>
                  </div>
                ) : (
                  // 실패 상태 표시
                  <div className="flex flex-col items-center text-red-400">
                    <FaExclamationCircle size={30} className="mb-2" />
                    <span className="text-xs font-bold">생성 실패</span>
                  </div>
                )}
              </div>

              {/* 정보 영역 */}
              <div className="p-4">
                <h4 className="font-bold text-gray-900 line-clamp-1">
                  {video.title}
                </h4>
                <div className="flex justify-between items-center mt-2">
                  <span
                    className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                      video.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : video.status === "generating"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {video.status === "completed"
                      ? "완료됨"
                      : video.status === "generating"
                        ? "제작 중"
                        : "실패"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {video.created_at ? video.created_at.split("T")[0] : ""}
                  </span>
                </div>
                {/* 에러 메시지 (실패 시) */}
                {video.status === "failed" && (
                  <p className="text-[10px] text-red-500 mt-2 bg-red-50 p-1 rounded line-clamp-2">
                    {video.message || "오류 발생"}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoSearchPage;
