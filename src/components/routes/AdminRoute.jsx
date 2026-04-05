import { Navigate } from "react-router-dom";
import useCustomLogin from "../../hooks/useCustomLogin";

const AdminRoute = ({ children }) => {
  const { isLogin, role } = useCustomLogin(); // ✅ role 직접 받기

  if (!isLogin) {
    alert("로그인이 필요합니다.");
    return <Navigate to="/member/login" replace />;
  }

  if (role !== "admin") {
    // <-- role이 null일 때, AdminRoute가 보호하는 페이지가 렌더링되어 문제가 될 수 있음.
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
