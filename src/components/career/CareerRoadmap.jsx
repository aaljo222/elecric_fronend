import { motion } from "framer-motion";
import RoadStep from "./RoadStep";

const steps = [
  {
    step: "STEP 1",
    title: "전기기사 자격증 합격",
    desc: "핵심 이론 + 기출 기반 AI 분석으로 필기·실기 동시 대비",
    color: "from-blue-500 to-indigo-500",
  },
  {
    step: "STEP 2",
    title: "정보통신기사 확장 학습",
    desc: "전기 이후 가장 강력한 연계 자격증으로 통신·네트워크·신호 이해",
    color: "from-indigo-500 to-purple-500",
  },
  {
    step: "STEP 3",
    title: "전기·통신 융합 실무 이해",
    desc: "스마트빌딩·스마트팩토리 관점에서 전력 + 데이터 흐름 통합",
    color: "from-purple-500 to-fuchsia-500",
  },
  {
    step: "STEP 4",
    title: "AI 그래프 기반 지식 자동화",
    desc: "Neo4j 개념 그래프로 실기 서술·문제·개념 연결 자동 생성",
    color: "from-fuchsia-500 to-pink-500",
  },
  {
    step: "STEP 5",
    title: "특허·플랫폼 경쟁력 확보",
    desc: "전기·통신·AI 학습 구조를 기술 자산으로 특허화 및 플랫폼화",
    color: "from-pink-500 to-orange-500",
  },
];

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const CareerRoadmap = () => {
  return (
    <section>
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <h2 className="text-3xl font-bold mb-4">
          전기기사 합격 이후 커리어 로드맵
        </h2>
        <p className="text-gray-600">
          자격증에서 끝나지 않고, <b>실무·AI·특허</b>로 확장되는 구조
        </p>
      </motion.div>

      {/* 로드맵 */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="space-y-6"
      >
        {steps.map((s, idx) => (
          <motion.div key={idx} variants={item}>
            <RoadStep {...s} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default CareerRoadmap;
