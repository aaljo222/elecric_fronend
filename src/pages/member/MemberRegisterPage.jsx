import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE || "http://localhost:8000";

const MemberRegisterPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onRegister = async () => {
    setError("");
    setSuccess("");

    if (pw !== pw2) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const res = await axios.post(`${API}/member/register`, {
        email,
        password: pw,
        name,
      });

      setSuccess("회원가입 완료! 이제 로그인하세요.");

      setTimeout(() => navigate("/member/login"), 1500);
    } catch (err) {
      setError("회원가입 실패! 이미 존재하는 이메일일 수 있습니다.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white shadow-lg rounded-xl p-10">
      <h1 className="text-3xl font-bold text-center mb-8">회원가입</h1>

      <div className="space-y-4">
        <input
          type="text"
          className="w-full border p-3 rounded-lg"
          placeholder="이름 입력"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          className="w-full border p-3 rounded-rounded-lg"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-3 rounded-lg"
          placeholder="비밀번호 입력"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-3 rounded-lg"
          placeholder="비밀번호 확인"
          value={pw2}
          onChange={(e) => setPw2(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-center font-semibold">{error}</p>
        )}

        {success && (
          <p className="text-green-600 text-center font-semibold">{success}</p>
        )}

        <button
          onClick={onRegister}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
        >
          가입하기
        </button>

        <button
          onClick={() => navigate("/member/login")}
          className="w-full text-indigo-600 font-semibold mt-3"
        >
          로그인 페이지 →
        </button>
      </div>
    </div>
  );
};

export default MemberRegisterPage;
