import { motion } from "framer-motion";

const metrics = [
  {
    icon: "📈",
    title: "문제 정확도",
    desc: "검증된 문제 누적으로 지속 향상",
    color: "from-green-400 to-green-600",
  },
  {
    icon: "🎯",
    title: "추천 정밀도",
    desc: "사용자 통계 기반 맞춤 추천",
    color: "from-blue-400 to-blue-600",
  },
  {
    icon: "🏆",
    title: "합격 확률",
    desc: "실제 성과 데이터 기반 상승",
    color: "from-indigo-400 to-indigo-600",
  },
];

const PlatformGrowthIndicator = () => {
  return (
    <section className="my-12">
      {/* 제목 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mb-6"
      >
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          ⏳ 시간이 갈수록 플랫폼은 더 강해집니다
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          검증 데이터 누적 → AI 피드백 → 성능 지속 향상
        </p>
      </motion.div>

      {/* 카드 영역 */}
      <div className="grid md:grid-cols-3 gap-6">
        {metrics.map((m, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15 }}
            viewport={{ once: true }}
            className="relative bg-white rounded-xl shadow-lg p-6 border"
          >
            {/* 상승 배경 */}
            <div
              className={`absolute inset-0 rounded-xl opacity-10 bg-gradient-to-br ${m.color}`}
            />

            <div className="relative z-10">
              <div className="text-3xl mb-3">{m.icon}</div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">
                {m.title} ↑
              </h4>
              <p className="text-sm text-gray-600">{m.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PlatformGrowthIndicator;
