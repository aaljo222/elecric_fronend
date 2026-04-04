import { useMemo, useState } from "react";

const ParallelResistanceWidget = () => {
  const [resistorCount, setResistorCount] = useState(2);
  const [voltage, setVoltage] = useState(12);
  const [resistances, setResistances] = useState([10, 20, 30, 40]);

  // ✅ 모든 계산 변수를 useMemo 안에서 안전하게 정의합니다.
  const { totalReq, currents, totalCurrent } = useMemo(() => {
    const activeResistances = resistances.slice(0, resistorCount);

    // 1. 역수 합(1/Req) 계산 - 변수 선언 확인!
    // 분모가 0이 되어 무한대가 되는 것을 방지하기 위해 (R || 1) 처리
    const calculatedInvReq = activeResistances.reduce((acc, R) => {
      const val = Number(R) <= 0 ? 1 : Number(R); // 0 또는 음수 방어
      return acc + 1 / val;
    }, 0);

    // 2. 합성 저항(Req) 계산
    const Req = calculatedInvReq > 0 ? 1 / calculatedInvReq : 0;

    // 3. 각 지로의 전류(I = V / R) 계산
    const branchCurrents = activeResistances.map((R) => {
      const val = Number(R) <= 0 ? 1 : Number(R);
      return voltage / val;
    });

    // 4. 전체 전류 계산
    const totalI = Req > 0 ? voltage / Req : 0;

    return {
      totalReq: Req,
      currents: branchCurrents,
      totalCurrent: totalI,
    };
  }, [resistorCount, voltage, resistances]);

  const handleResChange = (idx, value) => {
    const newRes = [...resistances];
    newRes[idx] = value; // 문자열 상태로 일단 받고 계산시 숫자로 변환
    setResistances(newRes);
  };

  return (
    <div className="flex flex-col bg-slate-50 p-6 rounded-2xl border border-gray-200 shadow-inner">
      <h5 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="bg-yellow-400 p-1 rounded">⚡</span> 병렬 회로 합성저항
        실습
      </h5>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase">
            저항 개수
          </label>
          <div className="flex gap-1">
            {[2, 3, 4].map((num) => (
              <button
                key={num}
                onClick={() => setResistorCount(num)}
                className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
                  resistorCount === num
                    ? "bg-[#0047a5] text-white"
                    : "bg-white text-gray-400 border border-gray-100"
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
            onChange={(e) => setVoltage(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-200 font-bold text-[#0047a5] outline-none"
          />
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {resistances.slice(0, resistorCount).map((R, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-50 shadow-sm"
          >
            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center font-bold text-blue-600 text-xs">
              R{idx + 1}
            </div>
            <div className="flex-1">
              <input
                type="number"
                value={R}
                onChange={(e) => handleResChange(idx, e.target.value)}
                className="w-full text-lg font-black text-gray-800 outline-none"
              />
              <p className="text-[9px] text-gray-400 font-bold uppercase">
                Resistance (Ω)
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-emerald-600">
                {currents[idx]?.toFixed(2) || 0} A
              </p>
              <p className="text-[9px] text-gray-400 font-bold uppercase">
                Current
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#0047a5] p-5 rounded-2xl text-white shadow-lg">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
          <span className="font-bold text-sm opacity-80">합성저항 (Req)</span>
          <span className="text-xl font-black">{totalReq.toFixed(2)} Ω</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-sm opacity-80">
            전체 전류 (Itotal)
          </span>
          <span className="text-xl font-black text-yellow-300">
            {totalCurrent.toFixed(2)} A
          </span>
        </div>
      </div>
    </div>
  );
};

export default ParallelResistanceWidget;
