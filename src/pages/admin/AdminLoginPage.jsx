import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginAdminAsync } from "../../slices/loginSlice";
import { Link, useNavigate } from "react-router-dom";

const AdminLoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const onLogin = () => {
    setError("");

    dispatch(loginAdminAsync({ email, password: pw }))
      .unwrap()
      .then(() => navigate("/admin/dashboard"))
      .catch((err) => {
        if (err === "NOT_ADMIN") {
          setError("관리자 권한이 없습니다.");
        } else {
          setError("로그인 실패! 이메일 또는 비밀번호 확인하세요.");
        }
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-10">
        <h1 className="text-3xl font-bold text-center mb-8">관리자 로그인</h1>

        <input
          type="email"
          placeholder="관리자 이메일"
          className="w-full border p-3 rounded-lg mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="비밀번호"
          className="w-full border p-3 rounded-lg mb-6"
          onChange={(e) => setPw(e.target.value)}
        />

        {error && <p className="text-red-500 text-center">{error}</p>}

        <button
          onClick={onLogin}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
        >
          로그인
        </button>
        <div className="mt-6 text-center text-sm text-gray-600">
          관리자 계정이 없으신가요?{" "}
          <Link
            to="/admin/register"
            className="text-indigo-600 font-semibold hover:underline"
          >
            관리자 등록
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
