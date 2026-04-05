import RecommendationCard from "@/components/common/RecommendationCard";
import CareerRoadmap from "@/components/career/CareerRoadmap";

const CareerRoutePage = () => {
  return (
    <main className="max-w-6xl mx-auto px-6 py-20 space-y-20">
      {/* HERO */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold">
          전기에서 끝나지 않습니다
        </h1>
        <p className="text-gray-600 text-lg">
          전기 → 정보통신 → AI로 이어지는
          <br />
          <b className="text-indigo-600">실무형 커리어 확장 루트</b>
        </p>
      </section>

      {/* 추천 카드 (중앙 전환축) */}
      <RecommendationCard
        title="다음 단계가 보입니다"
        subtitle="전기기사 이후, 가장 강력한 연계 자격증"
        highlight="정보통신기사"
        desc="전기 개념의 60% 이상이 통신 개념과 직접 연결됩니다.
              AI 그래프 기반 자동 추천 결과입니다."
        cta="전기 · 정보통신 통합 로드맵 보기"
      />

      {/* 로드맵 */}
      <CareerRoadmap />
    </main>
  );
};

export default CareerRoutePage;
