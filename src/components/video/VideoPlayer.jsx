const VideoPlayer = ({ videoUrl, title }) => {
  // 1. 데이터 존재 여부 및 문자열 타입 검사
  if (!videoUrl || typeof videoUrl !== "string") {
    return (
      <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-sm text-slate-400">영상을 불러오는 중입니다...</p>
      </div>
    );
  }

  // 2. 영상 플랫폼 판별 로직 추가
  const isCloudflare = videoUrl.includes("cloudflarestream.com");

  // 💡 [추가] 유튜브 ID인지 판별합니다.
  // 보통 유튜브 ID는 11자리이고 특수기호가 적습니다.
  // http가 포함되지 않은 짧은 문자열이라면 유튜브 ID로 간주합니다.
  const isYouTubeId = !videoUrl.startsWith("http") && videoUrl.length <= 15;

  return (
    <div className="w-full h-full bg-black">
      {isCloudflare ? (
        // --- 1. 클라우드플레어 영상 ---
        <iframe
          src={`${videoUrl.replace("/watch", "/iframe")}?autoplay=1`}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
        ></iframe>
      ) : isYouTubeId ? (
        // --- 2. 💡 [추가] 유튜브 영상 ---
        // 유튜브 iframe 형식에 맞게 src 주소를 조합합니다.
        <iframe
          src={`https://www.youtube.com/embed/${videoUrl}?autoplay=1`}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
        ></iframe>
      ) : (
        // --- 3. 일반 비디오 파일 (.mp4 등) ---
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
