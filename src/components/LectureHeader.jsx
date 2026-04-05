export default function LectureHeader() {
  return (
    // Flexbox를 사용하여 수직 중앙 정렬 및 양끝 배치
    <div className="flex justify-between items-center w-full mb-4">
      {/* 좌측: 강의 제목 */}
      <h2 className="text-2xl font-bold text-gray-800">5강. 함수의 이해</h2>

      {/* 우측: Manim 영상 컨테이너 (표시하신 빨간색 영역) */}
      <div className="w-48 h-auto rounded-lg overflow-hidden shadow-sm">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          {/* Manim 렌더링 결과물 경로 지정 */}
          <source src="/videos/manim/function_concept.webm" type="video/webm" />
          <source src="/videos/manim/function_concept.mp4" type="video/mp4" />
          브라우저가 비디오 태그를 지원하지 않습니다.
        </video>
      </div>
    </div>
  );
}
