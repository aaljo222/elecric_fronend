// RecentActivityChart.jsx
import {
  ComposedChart, // 👈 ComposedChart 사용
  Bar, // 👈 Bar 추가
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend, // 👈 범례 추가 (옵션)
  ResponsiveContainer,
} from "recharts";

// days prop을 받아 차트 제목을 동적으로 변경합니다.
export default function RecentActivityChart({ data, days = 7 }) {
  console.log("📊 chart data", data);
  return (
    <div className="bg-white rounded-xl shadow p-6">
            {/* days 값에 따라 제목 변경 */}     {" "}
      <h3 className="font-bold mb-4">📈 최근 {days}일 학습 활동</h3>     {" "}
      <ResponsiveContainer width="100%" height={260}>
               {" "}
        <ComposedChart // LineChart 대신 ComposedChart 사용
          data={data}
          margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
        >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />         {" "}
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              background: "#111827",
              color: "#fff",
            }}
          />
          <Legend wrapperStyle={{ paddingTop: 10 }} /> {/* 범례 추가 */}
          {/* 1. 막대 그래프 (Bar) - 총 문제 수 */}         {" "}
          <Bar
            dataKey="total" // 데이터 키를 total로 가정
            barSize={20}
            fill="#3b82f6" // 파란색 막대
            name="총 문제 수"
          />
          {/* 2. 꺾은선 그래프 (Line) - 정답 수 */}         {" "}
          <Line
            type="monotone"
            dataKey="correct" // 데이터 키를 correct로 가정
            stroke="#10b981" // 초록색 선
            strokeWidth={3}
            dot={{ r: 4, fill: "#10b981" }}
            activeDot={{ r: 6 }}
            name="정답 수"
          />
                 {" "}
        </ComposedChart>
             {" "}
      </ResponsiveContainer>
         {" "}
    </div>
  );
}
