import { motion } from "framer-motion";

const PracticalSummaryNote = () => {
  return (
    <section className="my-24">
      <h2 className="text-3xl font-bold mb-10">
        실기 대비 요약 노트
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {[
          ["임피던스", ["Z=√(R²+(ωL)²)", "I=V/Z"]],
          ["전력 계산", ["P=VIcosθ", "cosθ=R/Z"]],
        ].map(([title, formulas]) => (
          <motion.div
            key={title}
            whileHover={{ scale: 1.03 }}
            className="p-6 bg-white border rounded-xl shadow"
          >
            <h3 className="font-semibold mb-3">{title}</h3>
            <ul className="text-sm font-mono space-y-1">
              {formulas.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PracticalSummaryNote;
