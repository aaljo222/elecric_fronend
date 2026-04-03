const VideoPlayer = ({ videoUrl, title }) => {
  // 💡 [수정] videoUrl이 아예 없거나 빈 문자열이면 에러를 띄우지 않고 준비 중 화면을 보여줍니다.
  if (!videoUrl || typeof videoUrl !== "string") {
    return (
      <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white p-6">
        <span className="text-gray-500 mb-4 material-symbols-outlined text-6xl">
          videocam_off
        </span>
        <p className="text-lg font-bold">강의 영상을 불러오는 중이거나</p>
        <p className="text-sm text-slate-400">등록된 영상 주소가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {/* 💡 .includes와 .replace를 쓰기 전에 위에서 이미 string임을 보장했습니다. */}
      {videoUrl.includes("cloudflarestream.com") ? (
        <iframe
          src={`${videoUrl.replace("/watch", "/iframe")}?autoplay=1`}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
        ></iframe>
      ) : (
        <video
          src={videoUrl}
          controls
          autoPlay
          className="w-full h-full object-contain bg-black"
        />
      )}
    </div>
  );
};

export default VideoPlayer;
