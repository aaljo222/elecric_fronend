import { useMemo, useState } from "react";

const ParallelResistanceWidget = () => {
  const [resistorCount, setResistorCount] = useState(2); // 저항 개수 (2~4)
  const [voltage, setVoltage] = useState(12); // 전압 (V)
  const [resistances, setResistances] = useState([10, 20, 30, 40]); // 저항값들 (Ω)

  const { totalReq, currents, totalCurrent } = useMemo(() => {
    // ... 계산 로직
    const Req = 1 / invReq;
    return {
      totalReq: Req, // 👈 여기서 정의한 이름이 중요합니다.
      currents: branchCurrents,
      totalCurrent: totalI,
    };
  }, [resistorCount, voltage, resistances]);
  const handleResChange = (idx, value) => {
    const newRes = [...resistances];
    newRes[idx] = Number(value);
    setResistances(newRes);
  };

  return (
    <div className="flex flex-col bg-slate-50 p-6 rounded-2xl border border-gray-200 shadow-inner">
      <h5 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="bg-yellow-400 p-1 rounded">⚡</span> 병렬 회로 합성저항
        실습
      </h5>

      {/* 설정 영역 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase">
            저항 개수
          </label>
          <div className="flex gap-2">
            {[2, 3, 4].map((num) => (
              <button
                key={num}
                onClick={() => setResistorCount(num)}
                className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                  resistorCount === num
                    ? "bg-[#0047a5] text-white shadow-md"
                    : "bg-white text-gray-400 border border-gray-200"
                }`}
              >
                {num}개
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase">
            공급 전압 (V)
          </label>
          <input
            type="number"
            value={voltage}
            onChange={(e) => setVoltage(Number(e.target.value))}
            className="w-full p-2 rounded-lg border border-gray-200 font-bold text-[#0047a5] focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* 저항 입력 및 개별 전류 출력 */}
      <div className="space-y-4 mb-8">
        {resistances.slice(0, resistorCount).map((R, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm"
          >
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center font-bold text-blue-600">
              R{idx + 1}
            </div>
            <div className="flex-1">
              <input
                type="number"
                value={R}
                onChange={(e) => handleResChange(idx, e.target.value)}
                className="w-full text-lg font-black text-gray-800 outline-none"
              />
              <p className="text-[10px] text-gray-400 font-bold uppercase">
                저항값 (Ω)
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-emerald-600">
                {currents[idx].toFixed(2)} A
              </p>
              <p className="text-[10px] text-gray-400 font-bold uppercase">
                흐르는 전류
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 최종 결과 리포트 */}
      <div className="bg-[#0047a5] p-5 rounded-2xl text-white shadow-lg">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/20">
          <span className="font-bold opacity-80">합성저항 ($R_{eq}$)</span>
          {/* 💡 반드시 정의된 변수명인 totalReq를 사용해야 합니다. */}
          <span className="text-2xl font-black">{totalReq.toFixed(2)} Ω</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold opacity-80">전체 전류 ($I_{total}$)</span>
          <span className="text-2xl font-black text-yellow-300">
            {totalCurrent.toFixed(2)} A
          </span>
        </div>
      </div>

      <p className="mt-4 text-[11px] text-gray-400 text-center italic">
        * 병렬 회로에서 각 저항에 걸리는 전압은 공급 전압과 동일합니다.
      </p>
    </div>
  );
};

export default ParallelResistanceWidget;
