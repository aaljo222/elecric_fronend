import useCustomMove from "@/hooks/useCustomMove";
import { Loader2, Lock, PlayCircle } from "lucide-react"; // Loader2(로딩 아이콘) 추가
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

export default function VideoPlayerList() {
  const { id } = useParams();
  const { moveToRead } = useCustomMove("/user/videos");

  // ✅ 1. 백엔드에서 데이터를 받아올 상태 추가
  const [videoList, setVideoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ 2. 컴포넌트 로드 시 백엔드 API(/api/video/list) 호출
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/api/video/list");
        if (!response.ok) throw new Error("네트워크 응답 에러");

        const data = await response.json();
        if (data && data.length > 0) {
          setVideoList(data);
        }
      } catch (error) {
        console.error("재생 목록 데이터를 불러오지 못했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // ✅ 3. 가져온 DB 데이터(videoList)를 기반으로 현재 과목 필터링
  const { currentSubjectLectures, currentTitle } = useMemo(() => {
    if (videoList.length === 0)
      return { currentSubjectLectures: [], currentTitle: "" };

    const currentVideo = videoList.find((v) => v.id === id);
    if (!currentVideo) return { currentSubjectLectures: [], currentTitle: "" };

    const filtered = videoList.filter(
      (v) => v.subject === currentVideo.subject,
    );

    return {
      currentSubjectLectures: filtered,
      currentTitle: currentVideo.subject,
    };
  }, [id, videoList]);

  // 로딩 중일 때 표시할 UI
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center h-[200px]">
        <Loader2 className="animate-spin text-[#0047a5]" size={32} />
      </div>
    );
  }

  // 같은 과목의 강의가 1개 이하면 재생 목록을 아예 숨김
  if (currentSubjectLectures.length <= 1) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
      {/* 헤더 영역 */}
      <div className="p-4 bg-gray-50 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#0047a5] rounded-full"></span>
          {currentTitle} 재생 목록
        </h3>
        <p className="text-[11px] text-gray-500 mt-1">
          총 {currentSubjectLectures.length}개의 강의로 구성되어 있습니다.
        </p>
      </div>

      {/* 리스트 영역 */}
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {currentSubjectLectures.map((video, index) => {
          const isActive = video.id === id;

          // ✅ 4. 백엔드 규격(video_url 문자열)에 맞게 잠금 확인 로직 수정
          const isLocked = !video.video_url || video.video_url === "";

          return (
            <div
              key={video.id}
              onClick={() => !isLocked && moveToRead(video.id)}
              className={`group flex items-start gap-3 p-4 transition-all border-b border-gray-50 last:border-0
                ${isActive ? "bg-blue-50/50" : isLocked ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"}
              `}
            >
              {/* 인덱스 또는 상태 아이콘 */}
              <div className="mt-0.5 shrink-0">
                {isActive ? (
                  <PlayCircle
                    size={18}
                    className="text-[#0047a5] fill-current bg-white rounded-full"
                  />
                ) : isLocked ? (
                  <Lock size={16} className="text-gray-400" />
                ) : (
                  <span className="text-xs font-bold text-gray-400 group-hover:text-[#0047a5]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                )}
              </div>

              {/* 강의 정보 */}
              <div className="flex-1 min-w-0">
                <h4
                  className={`text-sm font-semibold truncate ${isActive ? "text-[#0047a5]" : "text-gray-700"}`}
                >
                  {video.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-gray-400 font-medium">
                    {/* DB에 duration이 없으면 기본값 표시 */}
                    {video.duration && video.duration !== "-"
                      ? video.duration
                      : "10:00"}
                  </span>
                  {isActive && (
                    <span className="text-[10px] bg-[#0047a5] text-white px-1.5 py-0.5 rounded font-bold animate-pulse">
                      PLAYING
                    </span>
                  )}
                </div>
              </div>

              {/* 학습 완료 체크 */}
              {!isLocked && !isActive && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle size={16} className="text-gray-300" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
