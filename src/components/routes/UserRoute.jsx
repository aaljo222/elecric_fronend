import { Navigate } from "react-router-dom";
import useCustomLogin from "../../hooks/useCustomLogin";

const UserRoute = ({ children }) => {
  const { isLogin } = useCustomLogin();

  if (!isLogin) {
    return <Navigate to="/member/login" replace />;
  }
  return children;
};

export default UserRoute;
