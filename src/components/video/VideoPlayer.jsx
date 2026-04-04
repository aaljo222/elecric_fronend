const VideoPlayer = ({ videoUrl, title }) => {
  // 1. 가드 절: URL이 없으면 로딩 표시
  if (!videoUrl) {
    return (
      <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500 mb-4"></div>
        <p className="text-sm text-slate-400">영상을 준비 중입니다...</p>
      </div>
    );
  }

  // 2. 플랫폼 판별
  const isCloudflare = videoUrl.includes("cloudflarestream.com");
  const isYouTube =
    videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");

  // 3. Cloudflare URL 변환 (이미 변환되어 왔을 수도 있으므로 안전하게 처리)
  let finalUrl = videoUrl;
  if (isCloudflare && videoUrl.includes("/watch")) {
    finalUrl = videoUrl.replace("/watch", "/iframe");
  }

  return (
    <div className="w-full h-full bg-black">
      {isCloudflare || isYouTube ? (
        <iframe
          src={`${finalUrl}${finalUrl.includes("?") ? "&" : "?"}autoplay=1`}
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
