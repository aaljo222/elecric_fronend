// api/generateApi.js
import apiClient from "./apiClient";

// 관리자: 문제 일괄 생성
export const adminGenerateBatch = async ({ count = 20, publish = true }) => {
  const res = await apiClient.post(
    `/generate/admin/batch?count=${count}&publish=${publish}`
  );
  return res.data;
};

// (선택) Neo4j 재시도 큐 수동 실행
export const runNeo4jSync = async ({ limit = 10 }) => {
  const res = await apiClient.post(
    `/generate/admin/neo4j-sync/run?limit=${limit}`
  );
  return res.data;
};
