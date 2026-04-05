import { useParams, useLocation, useNavigate } from "react-router-dom";

export default function ChapterStudyPage() {
  const { id } = useParams(); // URL의 :id (예: EM-01)
  const location = useLocation();
  const navigate = useNavigate();
  const title = location.state?.title || "챕터 학습"; // 이전 페이지에서 넘겨준 제목

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 pt-24">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-slate-400 hover:text-white flex items-center gap-2"
      >
        ← 뒤로 가기
      </button>

      <div className="max-w-4xl mx-auto">
        <header className="mb-10 border-b border-slate-700 pb-6">
          <span className="text-blue-400 font-bold text-sm uppercase tracking-wider">
            CHAPTER {id}
          </span>
          <h1 className="text-4xl font-bold mt-2">{title}</h1>
          <p className="text-slate-400 mt-2">
            이 단원의 핵심 내용을 학습하고 문제를 풀어보세요.
          </p>
        </header>

        {/* 여기에 나중에 영상이나 학습 자료를 넣으면 됩니다 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-blue-500 transition-colors cursor-pointer group">
            <span className="text-3xl mb-4 block">📺</span>
            <h3 className="text-xl font-bold group-hover:text-blue-400">
              강의 영상 보기
            </h3>
            <p className="text-slate-400 text-sm mt-2">
              핵심 개념을 영상으로 빠르게 정리합니다.
            </p>
          </div>

          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-emerald-500 transition-colors cursor-pointer group">
            <span className="text-3xl mb-4 block">📝</span>
            <h3 className="text-xl font-bold group-hover:text-emerald-400">
              문제 풀기
            </h3>
            <p className="text-slate-400 text-sm mt-2">
              기출 문제를 통해 실력을 점검하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
