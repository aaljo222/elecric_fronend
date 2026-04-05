import { motion } from "framer-motion";

const ExampleProblemSection = () => {
  return (
    <section className="my-24">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-3xl font-bold mb-6"
      >
        전기기사 문제, 이렇게 풀립니다
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="p-6 bg-white border rounded-2xl shadow"
        >
          <h3 className="font-semibold mb-3">예제 문제</h3>
          <p className="text-gray-700 leading-relaxed">
            R=10Ω, L=0.1H인 직렬 RL회로에
            100V, 60Hz 교류 전압을 인가하였다.
            전류의 크기는?
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="p-6 bg-indigo-50 border rounded-2xl"
        >
          <h3 className="font-semibold mb-3">풀이 사고 흐름</h3>
          <ul className="space-y-2 text-sm">
            <li>① 교류 + RL → 임피던스</li>
            <li>② ω = 2πf</li>
            <li>③ Z 계산 → I = V/Z</li>
            <li className="font-bold text-indigo-600">④ I ≈ 2.63A</li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default ExampleProblemSection;
