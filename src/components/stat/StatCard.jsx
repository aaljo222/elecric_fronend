export default function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <div className="text-gray-500 text-sm">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
    </div>
  );
}
