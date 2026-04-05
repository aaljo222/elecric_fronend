import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PersonalPracticalSummary = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="my-24">
      <h2 className="text-3xl font-bold mb-6">
        나만의 실기 요약 노트
      </h2>

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl"
        >
          AI 요약 생성
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 p-6 bg-indigo-50 rounded-xl"
          >
            <p>⚠️ 취약: 임피던스 / 교류 위상</p>
            <p className="mt-2">Z 계산 순서 반복 학습 필요</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PersonalPracticalSummary;
