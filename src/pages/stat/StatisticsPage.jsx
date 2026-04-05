// StatisticsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getMyStats,
  getMyWrongStats,
  getRecentStats,
  getRecent30DaysStats, // 👈 30일 API 추가
  getDemoStats,
  getDemoWrongStats,
  getDemoRecentStats,
  getDemoRecent30DaysStats, // 👈 데모 30일 API 추가
} from "../../api/statisticsApi";

import { buildRecentChartData } from "../../utils/chartUtils";

import StatCard from "../../components/stat/StatCard";
import RecentActivityChart from "../../components/stat/RecentActivityChart";
import WeakAreaList from "../../components/stat/WeakAreaList";
import WrongQuestionList from "../../components/stat/WrongQuestionList";

import useCustomLogin from "../../hooks/useCustomLogin";

export default function StatisticsPage() {
  const navigate = useNavigate();
  const { isLogin, user } = useCustomLogin(); // ✅ state 선언

  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [wrong, setWrong] = useState([]);
  const [chartDays, setChartDays] = useState(7); // 👈 차트 기간 state 추가 // ✅ 데모 계정 여부 판단

  const isDemo = !isLogin || user?.email === "a@a.com";

  useEffect(() => {
    // 일반 통계 및 오답 통계는 그대로 가져옵니다.
    (isDemo ? getDemoStats : getMyStats)().then(setStats);
    (isDemo ? getDemoWrongStats : getMyWrongStats)().then(setWrong); // 7일 / 30일 API 함수 선택

    const fetchRecent7Days = isDemo ? getDemoRecentStats : getRecentStats;
    const fetchRecent30Days = isDemo
      ? getDemoRecent30DaysStats
      : getRecent30DaysStats; // 1. 먼저 7일 데이터를 요청합니다.

    fetchRecent7Days().then((recent7Days) => {
      console.log("recent7Days", recent7Days); // buildRecentChartData는 { date, total, correct } 구조로 만든다고 가정
      const chartData7Days = buildRecentChartData(recent7Days); // 7일 동안의 총 학습 문제 수 계산
      const totalActivity = chartData7Days.reduce(
        (sum, item) => sum + item.total,
        0
      );

      if (totalActivity === 0) {
        // 2. 활동이 없으면 30일 데이터를 요청하고 기간을 30일로 설정
        fetchRecent30Days().then((recent30Days) => {
          setRecent(recent30Days);
          setChartDays(30);
        });
      } else {
        // 3. 활동이 있으면 7일 데이터를 사용하고 기간을 7일로 설정
        setRecent(recent7Days);
        setChartDays(7);
      }
    });
  }, [isDemo]);

  if (!stats) return <div>로딩중...</div>; // ✅ 여기서 계산 (recent state와 chartDays state를 사용) // buildRecentChartData는 7일이든 30일이든 받은 데이터를 차트 형식으로 변환합니다.

  const chartData = buildRecentChartData(recent, chartDays);

  const wrongIds = wrong.map((w) => w.question_id).filter(Boolean);

  const retryWrong = () => {
    if (wrongIds.length === 0) {
      alert("틀린 문제가 없습니다 👍");
      return;
    }

    navigate(`/questions/${wrongIds[0]}?mode=retry&idx=0`, {
      state: { wrongIds },
    });
  };

  return (
    <div className="p-6 space-y-8">
            {/* 상단 요약 */}     {" "}
      <div className="grid grid-cols-4 gap-4">
                <StatCard title="총 풀이 문제" value={`${stats.total}문제`} />
                <StatCard title="정답" value={`${stats.correct}문제`} />
                <StatCard title="오답" value={`${stats.wrong}문제`} />
                <StatCard title="정답률" value={`${stats.accuracy}%`} />     {" "}
      </div>
            {/* 최근 학습 - chartDays prop 전달 */}
            <RecentActivityChart data={chartData} days={chartDays} />     {" "}
      {/* 취약 영역 */}
            <WeakAreaList areas={stats.weakAreas || []} />     {" "}
      {/* 틀린 문제 */}
            <WrongQuestionList list={wrong} />     {" "}
      <button
        onClick={retryWrong}
        className="mt-6 px-5 py-3 bg-red-500 text-white rounded-lg text-lg hover:bg-red-600"
      >
                ❌ 틀린 문제 다시 풀기      {" "}
      </button>
           {" "}
      {isDemo && (
        <div className="text-center text-sm text-gray-500 mt-4">
                    현재 데모 계정(a@a.com) 기준 통계를 표시하고 있습니다.      
           {" "}
        </div>
      )}
         {" "}
    </div>
  );
}
