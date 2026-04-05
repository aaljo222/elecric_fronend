import { useNavigate } from "react-router-dom";
import useCustomLogin from "../../hooks/useCustomLogin";

const MainMenu = () => {
  const navigate = useNavigate();
  const { user, isLogin } = useCustomLogin();

  const isAdminUser =
    isLogin && (user?.role === "admin" || user?.email === "admin@admin.com");

  const menus = [
    { icon: "📘", label: "전기기사 문제 풀이", to: "/questions" },

    // ✅ [추가] 전기 지식 맵 (시각화 + 음성 질문)
    {
      icon: "🗺️",
      label: "전기 지식 맵 (Knowledge Map)",
      to: "/map",
      highlight: true, // 강조 표시
    },
    // ✅ [추가] AI 영상 검색 메뉴
    {
      icon: "🎬",
      label: "AI 강의 & 음성 검색",
      to: "/videos", // 라우터에 이 경로를 추가해야 합니다.
      highlight: true, // 강조 표시
    },
    { icon: "📖", label: "전기 용어 그래프", to: "/words" },

    // { icon: "🎙️", label: "AI 음성 튜터", to: "/voice-chat" }, // (지식 맵에 통합됨 -> 일단 숨김 or 유지)

    { icon: "📊", label: "AI 학습 분석", to: "/stats" },
    { icon: "❓", label: "Q&A / 해설", to: "/qna" },

    {
      icon: "🚀",
      label: "전기 → 정보통신 커리어 루트",
      to: "/career-route",
      highlight: false,
    },
    {
      icon: "👤",
      label: "이재오 · 플랫폼 비전",
      to: "/about",
    },
    {
      icon: "⚙️",
      label: "관리자 대시보드",
      to: "/admin",
      isAdmin: true,
    },
  ];

  const visibleMenus = menus.filter((m) => {
    if (m.isAdmin) {
      return isAdminUser;
    }
    return true;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* 헤더 섹션 */}
      <div className="text-center mb-12 space-y-3">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
          물어볼 때마다 성장하는 <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            우리집 전기 선생님
          </span>
        </h1>
        <p className="text-lg text-gray-600 font-medium">
          "나보다 내 약점을 더 잘 아는 초개인화 전기 학습 솔루션"
        </p>
      </div>

      {/* 메뉴 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {visibleMenus.map((m) => (
          <button
            key={m.to}
            onClick={() => navigate(m.to)}
            className={`
              relative flex flex-col items-center justify-center
              p-8 rounded-2xl border transition-all duration-300
              group
              ${
                m.highlight
                  ? "bg-gradient-to-br from-indigo-600 to-blue-500 text-white shadow-lg shadow-blue-200 border-transparent hover:-translate-y-1 hover:shadow-xl"
                  : "bg-white border-gray-100 text-gray-600 hover:border-blue-200 hover:bg-blue-50 hover:-translate-y-1 hover:shadow-md"
              }
            `}
          >
            <div className="text-5xl mb-4 transform transition-transform group-hover:scale-110">
              {m.icon}
            </div>

            <div
              className={`text-lg font-bold text-center ${
                m.highlight ? "text-white" : "text-gray-800"
              }`}
            >
              {m.label}
            </div>

            {m.highlight && (
              <div
                className={`mt-3 px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                  m.highlight
                    ? "text-indigo-700 bg-white"
                    : "text-white bg-indigo-500"
                }`}
              >
                AI 추천 ✨
              </div>
            )}

            {m.isAdmin && (
              <div className="mt-3 px-3 py-1 text-xs font-semibold text-slate-800 bg-gray-200 rounded-full shadow-sm">
                관리자 전용 🛠️
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MainMenu;
