export default function WeakAreaList({ areas }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-bold mb-4">⚠ 취약 영역</h3>

      {areas.map((a) => (
        <div key={a.subject} className="flex justify-between py-2">
          <span>{a.subject}</span>
          <span
            className={
              a.rate < 50
                ? "text-red-500"
                : a.rate < 70
                ? "text-yellow-500"
                : "text-green-600"
            }
          >
            {a.rate}%
          </span>
        </div>
      ))}
    </div>
  );
}
