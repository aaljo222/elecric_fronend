import { useNavigate } from "react-router-dom";

const RecommendationCard = ({
  title,
  subtitle,
  highlight,
  desc,
  cta,
  to = "/career-route",
}) => {
  const navigate = useNavigate();

  return (
    <section
      className="
        relative overflow-hidden
        rounded-2xl border
        bg-gradient-to-br from-indigo-600 to-blue-500
        text-white shadow-2xl
      "
    >
      {/* 배경 장식 */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

      <div className="relative p-10 md:p-14">
        {/* 상단 문구 */}
        <div className="mb-6">
          <p className="text-indigo-100 font-semibold tracking-wide uppercase text-sm">
            AI Career Recommendation
          </p>
          <h3 className="text-3xl md:text-4xl font-extrabold mt-2">{title}</h3>
        </div>

        {/* 서브 설명 */}
        <p className="text-indigo-100 text-lg mb-6">{subtitle}</p>

        {/* 핵심 강조 */}
        <div className="bg-white/15 backdrop-blur rounded-xl p-6 mb-8">
          <p className="text-xl md:text-2xl font-bold mb-3">▶ {highlight}</p>
          <p className="text-indigo-100 leading-relaxed whitespace-pre-line">
            {desc}
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button
            onClick={() => navigate(to)}
            className="
              px-8 py-4 rounded-xl
              bg-white text-indigo-700
              font-bold text-lg
              hover:bg-indigo-50
              transition shadow-lg
            "
          >
            {cta}
          </button>

          <span className="text-indigo-200 text-sm">
            ※ 전기 개념 그래프 기반 자동 추천
          </span>
        </div>
      </div>
    </section>
  );
};

export default RecommendationCard;
