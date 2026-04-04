const ActiveVideoCard = ({ video, onRead, onOpenModal }) => {
  console.log("ActiveVideoCard ,video:", video);
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
export default ActiveVideoCard;
