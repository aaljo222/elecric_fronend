import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginPostAsync } from "../../slices/loginSlice";
import { useNavigate, Link } from "react-router-dom";

const MemberLoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const onLogin = () => {
    setError("");

    dispatch(loginPostAsync({ email, password: pw }))
      .unwrap()
      .then(() => navigate("/"))
      .catch(() => setError("로그인 실패! 이메일 또는 비밀번호를 확인하세요."));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-10">
        <h1 className="text-3xl font-bold text-center mb-8">로그인</h1>

        <input
          type="email"
          placeholder="이메일"
          className="w-full border p-3 rounded-lg mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="비밀번호"
          className="w-full border p-3 rounded-lg mb-4"
          onChange={(e) => setPw(e.target.value)}
        />

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <button
          onClick={onLogin}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
        >
          로그인
        </button>

        {/* 🔽 회원가입 영역 */}
        <div className="mt-6 text-center text-sm text-gray-600">
          아직 회원이 아니신가요?{" "}
          <Link
            to="/member/register"
            className="text-indigo-600 font-semibold hover:underline"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MemberLoginPage;
