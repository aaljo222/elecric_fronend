import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../slices/loginSlice";

const LogoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout()); // ✅ Redux 로그아웃
    navigate("/"); // 메인 이동
  }, [dispatch, navigate]);

  return (
    <div className="p-10 text-center text-gray-600">로그아웃 중입니다...</div>
  );
};

export default LogoutPage;
