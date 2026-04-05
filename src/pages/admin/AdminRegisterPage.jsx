import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// API 함수 임포트
import { registerAdmin } from "../../api/authApi";
import { loginAdminAsync } from "../../slices/loginSlice";

const AdminRegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    // 1. 입력값 검증
    if (!email || !pw || !name) {
      setMsg("이메일, 이름, 비밀번호를 모두 입력해주세요.");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      // 2. 관리자 회원가입 API 호출
      console.log("등록 시도:", { email, name });
      await registerAdmin({ email, password: pw, name });

      // 3. 가입 성공 시 -> 자동 로그인 시도
      console.log("자동 로그인 시도...");
      const loginResult = await dispatch(
        loginAdminAsync({ email, password: pw }),
      ).unwrap();

      console.log("로그인 성공:", loginResult);

      // 4. 대시보드로 이동
      alert(`환영합니다, ${name} 관리자님!`);
      navigate("/admin/dashboard"); // 경로가 맞는지 확인하세요!
    } catch (err) {
      console.error("가입 에러:", err);

      // 서버에서 보내준 에러 메시지 추출
      const serverMsg = err.response?.data?.detail;
      const defaultMsg = "계정 생성에 실패했습니다.";

      if (serverMsg === "이미 가입된 이메일입니다. 로그인해주세요.") {
        setMsg("⚠️ 이미 가입된 이메일입니다. 로그인 페이지로 이동해주세요.");
      } else {
        setMsg(`❌ ${serverMsg || err.message || defaultMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          관리자 회원가입
        </h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="관리자 이메일"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <input
            type="text"
            placeholder="관리자 이름 (예: 홍길동)"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />

          <input
            type="password"
            placeholder="비밀번호"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onRegister()}
            disabled={loading}
          />
        </div>

        {msg && (
          <p className="text-center text-red-500 mt-4 text-sm font-medium whitespace-pre-line">
            {msg}
          </p>
        )}

        <button
          onClick={onRegister}
          disabled={loading}
          className={`w-full mt-6 text-white py-3 rounded-lg font-bold text-lg transition-all shadow-md
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"
            }`}
        >
          {loading ? "처리 중..." : "관리자 등록 및 로그인"}
        </button>
      </div>
    </div>
  );
};

export default AdminRegisterPage;
