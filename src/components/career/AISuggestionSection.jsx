import { motion } from "framer-motion";

const AISuggestionSection = () => {
  return (
    <section className="my-24">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl font-bold mb-10"
      >
        AI는 왜 이 문제를 추천했을까?
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          ["취약 개념", "임피던스·교류 계산 오답률 높음"],
          ["실기 연계", "RL 회로는 실기 핵심 단골"],
          ["합격 영향", "보완 시 평균 +8점"],
        ].map(([title, text], i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            viewport={{ once: true }}
            className="p-6 bg-white border rounded-xl shadow"
          >
            <h3 className="font-semibold mb-2">{title}</h3>
            <p className="text-sm text-gray-700">{text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AISuggestionSection;
