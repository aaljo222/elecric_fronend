import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <Outlet /> {/* 🔥 핵심 */}
    </div>
  );
};

export default AuthLayout;
