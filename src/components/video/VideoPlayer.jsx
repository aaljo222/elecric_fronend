const VideoPlayer = ({ videoUrl, title }) => {
  // 💡 [핵심] 문자열 타입 체크와 데이터 존재 여부를 가장 먼저 검사합니다.
  if (!videoUrl || typeof videoUrl !== "string") {
    return (
      <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-sm text-slate-400">영상을 불러오는 중입니다...</p>
      </div>
    );
  }

  // 💡 이제 videoUrl은 100% 문자열임이 보장되므로 에러가 나지 않습니다.
  const isCloudflare = videoUrl.includes("cloudflarestream.com");

  return (
    <div className="w-full h-full bg-black">
      {isCloudflare ? (
        <iframe
          // 💡 여기서 발생하던 'replace' 에러가 위쪽 체크 덕분에 해결됩니다.
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
          className="w-full h-full object-contain"
        />
      )}
    </div>
  );
};

export default VideoPlayer;
