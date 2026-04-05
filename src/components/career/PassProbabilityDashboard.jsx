import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchPassProbability } from "@/api/careerApi";

const PassProbabilityDashboard = () => {
  const [prob, setProb] = useState(null);

  useEffect(() => {
    fetchPassProbability().then((res) => {
      setProb(res.probability);
    });
  }, []);

  if (prob === null) return null;

  return (
    <section className="my-24 text-center">
      <h2 className="text-3xl font-bold mb-6">
        AI 실기 합격 가능성
      </h2>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-6xl font-extrabold text-indigo-600"
      >
        {prob}%
      </motion.div>

      <p className="mt-4 text-gray-600">
        AI 분석 기반 예측 결과
      </p>
    </section>
  );
};

export default PassProbabilityDashboard;
