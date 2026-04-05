import AboutHeroHeader from "../components/career/AboutHeroHeader";
import AISuggestionSection from "../components/career/AISuggestionSection";
import CareerRoadmap from "../components/career/CareerRoadmap";
import CaseScoreGraph from "../components/career/CaseScoreGraph";
import ExampleProblemSection from "../components/career/ExampleProblemSection";
import PassProbabilityDashboard from "../components/career/PassProbabilityDashboard";
import PersonalPracticalSummary from "../components/career/PersonalPracticalSummary";
import PracticalSummaryNote from "../components/career/PracticalSummaryNote";
import RecommendationCard from "../components/common/RecommendationCard";

const AboutPage = () => {
  return (
    <main className="max-w-5xl mx-auto px-6 py-14">
      {/* 🔥 이재오 경력 헤더 */}
      <AboutHeroHeader />

      {/* 기존 섹션들 그대로 유지 */}
      <ExampleProblemSection />
      <AISuggestionSection />
      <CaseScoreGraph />
      <PracticalSummaryNote />
      <PersonalPracticalSummary />
      <PassProbabilityDashboard />
      {/* 🔥 NEXT STEP 추천 (여기!) */}
      <RecommendationCard
        title="다음 단계가 보입니다"
        subtitle="전기기사 이후, 가장 강력한 연계 자격증"
        highlight="정보통신기사"
        desc="전기 개념의 60% 이상이 통신과 연결됩니다.
        AI 그래프 기반 자동 추천 결과입니다."
        cta="전기 → 통신 커리어 루트 보기"
      />
      <CareerRoadmap />
    </main>
  );
};

export default AboutPage;
