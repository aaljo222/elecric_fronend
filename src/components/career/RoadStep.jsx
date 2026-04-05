const RoadStep = ({ step, title, desc, color }) => {
  return (
    <div className="relative flex items-start gap-6 bg-white rounded-xl shadow p-6">
      {/* STEP 뱃지 */}
      <div
        className={`shrink-0 w-14 h-14 rounded-full bg-gradient-to-br ${color}
        text-white flex items-center justify-center font-bold`}
      >
        {step}
      </div>

      {/* 내용 */}
      <div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
};

export default RoadStep;
