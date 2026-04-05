import { Link, useSearchParams } from "react-router-dom";
import {
  circuitLectures,
  emLectures,
  mathLectures,
  visionLectures,
} from "./data.js";

const LectureList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "math";

  const getDisplayData = () => {
    if (activeTab === "circuit")
      return {
        data: circuitLectures,
        title: "⚡ 회로이론 마스터 클래스",
        color: "text-red-800",
      };
    if (activeTab === "em")
      return {
        data: emLectures,
        title: "🧲 전자기학 마스터 클래스",
        color: "text-green-800",
      };
    if (activeTab === "vision")
      return {
        data: visionLectures,
        title: "🚀 AI Company Vision",
        color: "text-purple-800",
      };
    return {
      data: mathLectures,
      title: "📐 기초 수학 마스터 클래스",
      color: "text-blue-800",
    };
  };

  const { data, title, color } = getDisplayData();

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 탭 네비게이션 */}
      <div className="flex justify-center gap-4 mb-10">
        <button
          onClick={() => setSearchParams({ tab: "math" })}
          className={`px-6 py-3 font-bold rounded-full transition-all ${activeTab === "math" ? "bg-blue-600 text-white shadow-lg" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
        >
          📐 기초 수학
        </button>
        <button
          onClick={() => setSearchParams({ tab: "circuit" })}
          className={`px-6 py-3 font-bold rounded-full transition-all ${activeTab === "circuit" ? "bg-red-600 text-white shadow-lg" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
        >
          ⚡ 회로이론
        </button>
        <button
          onClick={() => setSearchParams({ tab: "em" })}
          className={`px-6 py-3 font-bold rounded-full transition-all ${activeTab === "em" ? "bg-green-600 text-white shadow-lg" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
        >
          🧲 전자기학
        </button>
        <button
          onClick={() => setSearchParams({ tab: "vision" })}
          className={`px-6 py-3 font-bold rounded-full transition-all ${activeTab === "vision" ? "bg-purple-600 text-white shadow-lg" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
        >
          🚀 Vision
        </button>
      </div>

      <div className="mb-10 text-center">
        <h2 className={`text-3xl font-extrabold mb-3 ${color}`}>{title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {data.map((lecture) => (
          <div
            key={lecture.id}
            className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
          >
            {/* 썸네일 전체를 클릭 가능한 링크로 변경 */}
            <Link
              to={`/lectures/${lecture.id}`}
              className="block relative bg-black"
            >
              <img
                src={lecture.thumbnail}
                alt={lecture.title}
                className="w-full h-52 object-cover border-b border-gray-100 hover:opacity-90 transition-opacity"
              />
              <div className="absolute top-4 left-4 pointer-events-none">
                <span className="text-xs font-bold text-gray-800 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                  {lecture.subject}
                </span>
              </div>
            </Link>

            <div className="p-6 flex-grow flex flex-col justify-start bg-gradient-to-b from-white to-gray-50/50">
              <h3 className="text-xl font-bold mb-3 text-gray-800 hover:text-blue-600 transition-colors">
                <Link to={`/lectures/${lecture.id}`}>{lecture.title}</Link>
              </h3>
              <p className="text-gray-600 text-sm line-clamp-3">
                {lecture.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LectureList;
