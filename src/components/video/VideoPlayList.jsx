import { PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// 대표님의 전체 강의 데이터를 불러옵니다. (경로 확인 필수)
import {
  circuitLectures,
  emLectures,
  mathLectures,
  visionLectures,
} from "@/constants/videoData";

const ALL_LECTURES = [
  ...mathLectures,
  ...circuitLectures,
  ...emLectures,
  ...visionLectures,
];

const VideoPlayList = () => {
  const navigate = useNavigate();

  // 상위 5개의 강의만 샘플로 보여줍니다. (또는 카테고리별로 필터링 가능)
  const displayList = ALL_LECTURES.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
        <h3 className="text-lg font-bold text-gray-900">이어지는 강의</h3>
        <span className="text-xs font-bold text-[#0047a5] bg-[#e5edff] px-2 py-1 rounded">
          {ALL_LECTURES.length} 강
        </span>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {displayList.map((video, index) => (
          <div
            key={video.id}
            onClick={() => navigate(`/user/videos/${video.id}`)}
            className="flex gap-3 items-center p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group"
          >
            <div className="w-24 h-16 bg-gray-200 rounded-lg overflow-hidden shrink-0 relative">
              <img
                src={
                  video.thumbnail ||
                  "https://placehold.co/400x300/e2e8f0/94a3b8?text=No+Image"
                }
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle className="text-white" size={20} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight mb-1 group-hover:text-[#0047a5]">
                {video.title}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {video.subject || "AI Company 강의"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPlayList;
