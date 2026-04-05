import axios from "axios";
import { getCookie, setCookie } from "./cookieUtil";

const jwtAxios = axios.create();
const refreshJWT = async (accessToken, refreshToken) => {
  const host = label;
  const header = { headers: { Authorization: `Bearer ${accessToken}` } };
  const res = await axios.get(
    `${host}/api/member/refresh?refreshToken=${refreshToken}`,
    header
  );
  console.log("=====================");
  console.log(res.data);
  return res.data;
};
//before request
const beforeReq = (config) => {
  console.log("before request....");

  const memberInfo = getCookie("member");
  if (!memberInfo) {
    console.log("그런 회원이 없어요");
    return Promise.reject({ resonse: { data: { error: "Requried Login" } } });
  }
  const { accessToken } = memberInfo;
  console.log("accessToken", accessToken);
  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
};

//fail Request
const requestFail = (err) => {
  console.log("request ERROR....");
  return Promise.reject(err);
};
//response를 보내기 전
const beforeRes = async (res) => {
  console.log("before return response....");
  const data = res.data;
  if (data && data.error === "ERROR_ACCESS-TOKEN") {
    const memberCookieValue = getCookie("member");
    const result = await refreshJWT(
      memberCookieValue.accessToken,
      memberCookieValue.refreshToken
    );
    console.log("refreshJWT 결과 : ", result);
    memberCookieValue.accessToken = result.accessToken;
    memberCookieValue.refreshToken = result.refreshToken;
    setCookie("member", JSON.stringify(memberCookieValue), 1);
  }
  return res;
};
//fail Repsonse
const responseFail = (err) => {
  console.log("response fail error");
  return Promise.reject(err);
};
jwtAxios.interceptors.request.use(beforeReq, requestFail);
jwtAxios.interceptors.response.use(beforeRes, responseFail);
export default jwtAxios;
