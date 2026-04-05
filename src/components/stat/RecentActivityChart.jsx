import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RecentActivityChart({ data }) {
  console.log("recentActivityChart: ", data);
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-bold mb-4">📈 최근 7일 학습 활동</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
