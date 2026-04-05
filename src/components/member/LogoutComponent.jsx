import useCustomLogin from "../../hooks/useCustomLogin";

const LogoutComponent = () => {
  const { doLogout, moveToPath } = useCustomLogin();
  const handleClickLogout = () => {
    doLogout();
    alert("로그아웃되었습니다");
    moveToPath("/");
  };
  return (
    <div className="flex justify-center">
      <div className="relative mb-4 flex w-full justify-center">
        <div className="w-2/5 p-6 flex justify-center font-bold">
          <button
            onClick={handleClickLogout}
            className="rounded p-4 w-36 bg-red-500 text-xl text-white"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutComponent;
