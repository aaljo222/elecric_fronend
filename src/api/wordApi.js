// src/api/wordApi.js
import apiClient from "./apiClient";

/* 🔍 용어 상세 */
export const getWordDetail = (term) =>
  apiClient.get(`/words/${term}`);

/* 🤖 AI 용어 설명 */
export const getAiWordExplanation = (term, level = "basic") =>
  apiClient.get(`/words/${term}/ai`, {
    params: { level },
  });

/* 📄 이 용어가 나온 문제 */
export const getQuestionsByWord = (term) =>
  apiClient.get(`/questions/by-term/${term}`);


export const searchWords = (q) =>
  apiClient.get("/words", { params: { q } });
