import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

const RegisterComponent = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // input 핸들러
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 회원가입 요청
  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (!form.email || !form.password) {
      setError("이메일과 비밀번호를 입력하세요.");
      return;
    }

    if (form.password !== form.password2) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/member/register`, {
        email: form.email,
        password: form.password,
      });

      if (res.data.status === "ok") {
        setSuccess("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError("회원가입 실패. 다시 시도하세요.");
      }
    } catch (e) {
      console.error(e);
      setError("이미 존재하는 이메일이거나 서버 오류입니다.");
    }
  };

  return (
    <div className="max-w-xl mx-auto border p-8 mt-10 shadow-md bg-white rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">
        회원가입
      </h2>

      {/* 오류 메시지 */}
      {error && (
        <div className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {/* 성공 메시지 */}
      {success && (
        <div className="bg-green-100 text-green-600 px-4 py-2 rounded mb-4">
          {success}
        </div>
      )}

      <div className="mb-4">
        <label className="block font-semibold mb-1">이메일</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="example@mail.com"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">비밀번호</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="******"
        />
      </div>

      <div className="mb-6">
        <label className="block font-semibold mb-1">비밀번호 확인</label>
        <input
          type="password"
          name="password2"
          value={form.password2}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="******"
        />
      </div>

      <button
        onClick={handleRegister}
        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg font-bold"
      >
        회원가입
      </button>

      <div className="text-center mt-4">
        이미 계정이 있나요?{" "}
        <span
          className="text-blue-500 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          로그인하기
        </span>
      </div>
    </div>
  );
};

export default RegisterComponent;
