import apiClient from "./apiClient";

// 1) 일반 로그인
export const loginUser = async ({ email, password }) => {
  const res = await apiClient.post(`/member/login`, { email, password });
  return { ...res.data, role: "user" };
};

// 2) 관리자 로그인
export const loginAdmin = async ({ email, password }) => {
  const res = await apiClient.post(`/admin/login`, { email, password });
  const { access_token } = res.data;

  // role 확인은 "로그인 직후 받은 토큰"으로 직접 붙여서 호출
  const roleRes = await apiClient.get(`/admin/role`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (roleRes.data.role !== "admin") {
    throw new Error("NOT_ADMIN");
  }

  return { ...res.data, role: "admin" };
};

// 3) 일반 회원가입
export const registerUser = async ({ email, password, name }) => {
  const res = await apiClient.post(`/member/register`, {
    email,
    password,
    name,
  });
  return res.data;
};

// 4) 관리자 회원가입
export const registerAdmin = async ({ email, password }) => {
  alert("관리자에게 문의 바랍니다") 
  //const res = await apiClient.post(`/admin/register`, { email, password });
  //return res.data;
};
