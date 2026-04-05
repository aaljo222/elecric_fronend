// utils/chartUtils.js (가정)

import { format, subDays, startOfDay } from "date-fns";

/**
 * 서버에서 받은 raw 학습 데이터를 차트 데이터 형식으로 변환합니다.
 * 누락된 날짜에 대해 total: 0, correct: 0을 채웁니다.
 * @param {Array<Object>} rawData - 서버에서 받은 { date, total, correct } 또는 유사한 구조의 데이터
 * @param {number} days - 차트 기간 (7 또는 30)
 * @returns {Array<Object>} 차트 데이터
 */
export function buildRecentChartData(raw = [], days = 7) {
  if (!Array.isArray(raw)) return [];
  console.log("buildRecentChartData", raw);
  return raw
    .slice()
    .reverse()
    .map((item) => {
      // 🔥 여기서 실제 구조 확인
      const dateStr = item.date; // "2025-12-18"
      console.log("dateStr:", item);
      return {
        date: dateStr ? dateStr.slice(5) : "", // "12-18"
        total: Number(item.total ?? 0),
        correct: Number(item.correct ?? 0),
      };
    });
}
