import { motion } from "framer-motion";

const data = [
  { name: "A", before: 62, after: 74 },
  { name: "B", before: 58, after: 71 },
  { name: "C", before: 66, after: 78 },
];

const CaseScoreGraph = () => {
  return (
    <section className="my-24">
      <h2 className="text-3xl font-bold mb-10">
        실제 수강생 성적 변화 (익명)
      </h2>

      <div className="space-y-6">
        {data.map((d) => (
          <div key={d.name} className="p-6 bg-white border rounded-xl">
            <p className="mb-2 font-semibold">수험생 {d.name}</p>

            <div className="h-4 bg-gray-200 rounded overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${d.after}%` }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="h-4 bg-indigo-500"
              />
            </div>

            <p className="text-sm mt-2">
              {d.before} → <b>{d.after}</b>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CaseScoreGraph;
