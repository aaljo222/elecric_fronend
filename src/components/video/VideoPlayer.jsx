const VideoPlayer = ({ videoUrl, title }) => {
  // 💡 [핵심 수정] videoUrl이 없거나 문자열이 아니면 로딩 화면을 보여줍니다.
  if (!videoUrl || typeof videoUrl !== "string") {
    return (
      <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-sm text-slate-400">
          강의 영상을 불러오는 중입니다...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {/* 💡 이제 videoUrl이 문자열임이 보장되므로 replace가 안전합니다. */}
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
