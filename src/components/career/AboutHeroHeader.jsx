import { motion } from "framer-motion";
import PlatformGrowthIndicator from "./PlatformGrowthIndicator";

/* ===============================
   1️⃣ 플랫폼 철학 / 차별성
================================ */
const platformLines = [
  "본 플랫폼은 어느 누구도 쉽게 표방할 수 없는,",
  "세계적으로도 유사 사례가 없는 구조의 학습 시스템입니다.",

  "원래라면 전기 도메인 전문가, AI 전문가, 웹 개발자,",
  "그리고 특허 전략을 설계하는 변리사가 협업해야만 가능한 구조를,",

  "전기 전문가인 이재오가 직접",
  "AI 알고리즘 설계, 웹 시스템 구축, 데이터 구조화,",
  "그리고 특허 전략까지 일관되게 설계·운영하고 있습니다.",

  "일반적인 LLM 기반 문제 생성 시스템은",
  "문제를 생성할 때마다 결과가 달라지고,",
  "검증 없이 문제를 생성하는 구조적 한계를 가지고 있습니다.",

  "반면 본 시스템은",
  "전기기사 실무와 출제 구조를 정확히 이해한",
  "전기 전문가가 직접 모든 문제를 검증합니다.",

  "검증된 문제만 데이터베이스에 누적되며,",
  "이 데이터는 이후 문제 생성 시",
  "AI 알고리즘의 피드백 데이터로 다시 활용됩니다.",

  "즉, 문제가 축적될수록",
  "플랫폼의 정확도와 신뢰도는 계속해서 향상됩니다.",

  "구독자의 실제 학습 통계와 행동 데이터를 기반으로",
  "개인별 취약 영역 분석과 맞춤형 학습 경로를 제공하여",

  "단순한 문제 풀이를 넘어",
  "합격 가능성과 실무 이해도를 동시에 끌어올리는",
  "지속 진화형 학습 플랫폼을 구현하고 있습니다.",
];

/* ===============================
   2️⃣ 엔지니어 경력
================================ */
const careerLines = [
  "삼성전자 VD 사업부에서",
  "브라운관 전기·아날로그 회로 설계와",
  "디지털 TV 영상 신호처리를 담당하며",
  "현업에서 공학 기술을 체계적으로 다졌습니다.",

  "이후 임베디드 시스템과 펌웨어 개발을 중심으로",
  "영상·데이터 처리, AI 기술까지 영역을 확장하며",
  "수학 기반 공학 역량을 바탕으로 한 실무 경험을 축적해 왔습니다.",

  "특히 비전공자 교육과 실무 전환에 집중하여,",
  "누적 12,000시간 이상의 교육·멘토링을 통해",
  "비전공자를 실제 개발자로 취업시키는 성과를 만들어 왔습니다.",

  "기술 구현에 그치지 않고",
  "특허 전략과 기술 구조화 경험을 바탕으로",
  "AI 기반 학습 시스템과 지식 모델을",
  "특허로 연결하는 실질적인 설계를 수행해 왔습니다.",
];

/* ===============================
   애니메이션 설정
================================ */
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const AboutHeroHeader = () => {
  return (
    <section className="mb-24">
{/* ===============================
    HERO TITLE
=============================== */}
<motion.div
  initial={{ opacity: 0, y: 24 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="mb-14"
>
  <h1 className="text-4xl font-extrabold mb-3 tracking-tight">
    이재오 · Full-Stack 융합 전문가
  </h1>

  <p className="text-lg text-indigo-600 font-semibold mb-4">
    전기기사 × AI × 실무 × 특허 기반 학습 플랫폼
  </p>

  <hr className="my-6 border-indigo-200" />

  <p className="text-lg leading-relaxed text-gray-700">
    하드웨어, 소프트웨어, 수학, 인공지능,
    <span className="font-semibold text-indigo-600">
      임베디드·펌웨어·웹 개발
    </span>
    까지 폭넓은 경험을 바탕으로
    <br />
    <span className="font-semibold">
      전기기사 자격증 취득을 넘어
    </span>
    <br />
    AI 시대의 전력 수요 변화를 이해하고,
    <br />
    <span className="font-semibold text-indigo-600">
      IoT · 스마트 팩토리 · 지능형 전력 시스템
    </span>
    으로 확장되는
    <br />
    실무 중심의 전기공학 역량을 전달합니다.
  </p>
</motion.div>


      {/* ===============================
          🔥 PLATFORM DNA SECTION
      =============================== */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mb-16 bg-gradient-to-br from-indigo-50 to-white
                   rounded-2xl shadow-xl p-10 border-l-8 border-indigo-600"
      >
        <h2 className="text-2xl font-bold text-indigo-700 mb-6">
          🚀 플랫폼 핵심 차별성
        </h2>

        {platformLines.map((text, idx) => (
          <motion.p
            key={idx}
            variants={item}
            className="text-gray-800 leading-relaxed mb-3 text-base"
          >
            {text}
          </motion.p>
        ))}
      </motion.div>
      <PlatformGrowthIndicator />
      {/* ===============================
          ENGINEER CAREER SECTION
      =============================== */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          👨‍💻 엔지니어 경력 및 전문성
        </h2>

        {careerLines.map((text, idx) => (
          <motion.p
            key={idx}
            variants={item}
            className="text-gray-700 leading-relaxed mb-3 text-base"
          >
            {text}
          </motion.p>
        ))}
      </motion.div>
    </section>
  );
};

export default AboutHeroHeader;
