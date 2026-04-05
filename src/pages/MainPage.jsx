import MainMenu from "../components/main/MainMenu";

const MainPage = () => {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">전기기사 문제 풀이 플랫폼</h1>

      <p className="text-slate-600">
        매일 20문제 · 자동 풀이 · 해설 · 오답 관리까지 한 곳에서 해결하세요.
      </p>

      {/* ✅ Main에서만 메뉴 노출 */}
      <MainMenu />
    </div>
  );
};

export default MainPage;
