import { Link } from "react-router-dom";
import useCustomLogin from "../../hooks/useCustomLogin";

const BasicMenu = () => {
  const { isLogin, email, role } = useCustomLogin();

  return (
    <nav className="flex bg-blue-300 p-4 justify-between text-white shadow-md">
      <ul className="flex items-center font-bold text-lg">
        <li className="mr-6">
          <a
            href="https://www.aicompany.co.kr"
            target="_blank" // 새 탭에서 열기 (선택사항)
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/50 text-white px-4 py-2 rounded-full transition-all shadow-sm hover:shadow-md text-sm"
          >
            {/* 집 아이콘 SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            AICompany 홈
          </a>
        </li>
        <li className="px-4 hover:text-blue-100 transition-colors">
          <Link to="/">Main</Link>
        </li>
        <li className="px-4 hover:text-blue-100 transition-colors">
          <Link to="/about">About</Link>
        </li>
        <li className="px-4 hover:text-blue-100 transition-colors">
          <Link to="/service">서비스소개</Link>
        </li>
        {/* ✅ [수정] 이론강의듣기 드롭다운 메뉴 */}
        <li className="relative group px-4 hover:text-blue-100 transition-colors border-l border-blue-200 ml-2 pl-6">
          <div className="flex items-center gap-1 cursor-pointer py-2">
            📺 이론강의듣기 ▼
          </div>
          {/* 드롭다운 UI */}
          <ul className="absolute left-6 top-full mt-1 w-44 bg-white text-gray-800 shadow-xl rounded-md overflow-hidden opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 border border-gray-100">
            <li>
              <Link
                to="/lectures?tab=math"
                className="block px-5 py-3 hover:bg-blue-50 hover:text-blue-600 font-semibold border-b border-gray-100"
              >
                📐 기초 수학
              </Link>
            </li>
            <li>
              <Link
                to="/lectures?tab=circuit"
                className="block px-5 py-3 hover:bg-blue-50 hover:text-red-600 font-semibold border-b border-gray-100"
              >
                ⚡ 회로이론
              </Link>
            </li>
            <li>
              <Link
                to="/lectures?tab=vision"
                className="block px-5 py-3 hover:bg-blue-50 hover:text-green-600 font-semibold"
              >
                🧲 AI Company Vision
              </Link>
            </li>
            <li>
              <Link
                to="/lectures?tab=em"
                className="block px-5 py-3 hover:bg-blue-50 hover:text-green-600 font-semibold"
              >
                🧲 전자기학
              </Link>
            </li>
          </ul>
        </li>
        {/* ✅ [추가] AI 음성 튜터 (학습 그룹의 시작점으로 배치) */}
        <li className="px-4 hover:text-yellow-200 transition-colors border-l border-blue-200 ml-2 pl-6">
          {/* 눈에 띄게 아이콘 추가 */}
          <Link to="/voice-chat" className="flex items-center gap-1">
            🎙️ AI 음성 튜터
          </Link>
        </li>
        {/* 학습 관련 메뉴 그룹 */}
        <li className="px-4 hover:text-yellow-200 transition-colors border-l border-blue-200 ml-2 pl-6">
          <Link to="/presentation">노드구조화</Link>
        </li>
        <li className="px-4 hover:text-yellow-200 transition-colors">
          <Link to="/presentation/select">그래프</Link>
        </li>
        <li className="px-4 hover:text-yellow-200 transition-colors">
          {/* 🚨 수정됨: /animation -> /presentation/animation */}
          <Link to="/presentation/animation">애니메이션</Link>
        </li>

        {/* ✅ 저작권 정책 메뉴 (명확하게 분리) */}
        <li className="px-4 hover:text-gray-200 transition-colors text-sm font-normal pt-1">
          <Link to="/copyright">📜 저작권 정책</Link>
        </li>

        {isLogin && (
          <>
            <li className="px-4 hover:text-blue-100 transition-colors border-l border-blue-200 ml-2 pl-6">
              <Link to="/questions">문제 목록</Link>
            </li>
            {role === "admin" && (
              <li className="px-4 text-yellow-300 hover:text-yellow-100 transition-colors">
                <Link to="/admin/dashboard">관리자 페이지</Link>
              </li>
            )}
          </>
        )}
      </ul>

      <div className="flex items-center font-semibold">
        {!isLogin ? (
          <>
            <Link to="/member/login" className="px-4 hover:underline">
              로그인
            </Link>
            <Link
              to="/admin/login"
              className="px-4 text-yellow-300 hover:text-yellow-100"
            >
              관리자 로그인
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <span className="px-4 bg-blue-400 rounded-full py-1 text-sm">
              {email} <span className="text-yellow-300">({role})</span>
            </span>
            <Link to="/member/logout" className="px-4 hover:underline">
              로그아웃
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default BasicMenu;
