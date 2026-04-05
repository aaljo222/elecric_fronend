import Highlight from "@/components/career/Highlight";
import ExampleProblemSection from "@/components/career/ExampleProblemSection";
import AISuggestionSection from "@/components/career/AISuggestionSection";
import CaseScoreGraph from "@/components/career/CaseScoreGraph";
import PracticalSummaryNote from "@/components/career/PracticalSummaryNote";
import PersonalPracticalSummary from "@/components/career/PersonalPracticalSummary";
import PassProbabilityDashboard from "@/components/career/PassProbabilityDashboard";
import CareerRoadmap from "@/components/career/CareerRoadmap";

const AboutElectricEngineerPage = () => {
  return (
    <main className="max-w-6xl mx-auto px-6 py-20">

      {/* ================== HERO ================== */}
      <section className="mb-24 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          전기기사 합격에 특화된<br />
          공학 기반 AI 학습 플랫폼
        </h1>

        <p className="text-gray-600 text-lg">
          문제를 많이 푸는 방식이 아니라<br />
          <span className="text-indigo-600 font-semibold">
            전기를 이해하는 방식
          </span>
          으로 설계했습니다.
        </p>
      </section>

      {/* ================== WHY ME ================== */}
      <section className="space-y-10 mb-32">
        <Highlight accent>
          삼성전자 브라운관(VD) 사업부에서
          <b> 전기 설계 및 영상 신호처리</b>를 담당하며<br />
          전기기사 시험의 핵심인
          <b> 회로·전기이론·신호 흐름</b>를
          실제 제품 설계 기준으로 다뤄온
          엔지니어 출신 교육자입니다.
        </Highlight>

        <Highlight>
          전기기사 수험생이 가장 어려워하는
          <b> 공식 암기 → 계산 적용 → 실기 연결</b> 구간을<br />
          전기·수학·물리 기반의
          <b> 사고 흐름 중심</b>으로 재구성하여
          이해 중심 학습을 제공합니다.
        </Highlight>

        <Highlight accent>
          2013년 머신러닝 과정을 수료한 이후
          AI·데이터 기반 학습 분석을 연구해 왔으며,<br />
          이를 전기기사
          <b> 오답 분석 · 취약 개념 보완 · 실기 대비</b>에
          직접 적용하고 있습니다.
        </Highlight>
      </section>

      {/* ================== HOW TO SOLVE ================== */}
      <ExampleProblemSection />

      {/* ================== AI REASON ================== */}
      <AISuggestionSection />

      {/* ================== REAL RESULT ================== */}
      <CaseScoreGraph />

      {/* ================== PRACTICAL SUMMARY ================== */}
      <PracticalSummaryNote />

      {/* ================== PERSONAL AI SUMMARY ================== */}
      <PersonalPracticalSummary />

      {/* ================== PASS PROBABILITY ================== */}
      <PassProbabilityDashboard />

      {/* ================== CAREER ROADMAP ================== */}
      <CareerRoadmap />

    </main>
  );
};

export default AboutElectricEngineerPage;
