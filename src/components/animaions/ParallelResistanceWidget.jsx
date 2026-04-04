import { useMemo, useState } from "react";

const ParallelResistanceWidget = () => {
  const [resistorCount, setResistorCount] = useState(2);
  const [voltage, setVoltage] = useState(12);
  const [resistances, setResistances] = useState([10, 20, 30, 40]);

  // 계산 로직 (기존과 동일하되 안전장치 강화)
  const { totalReq, currents, totalCurrent } = useMemo(() => {
    const activeResistances = resistances.slice(0, resistorCount);

    // 분모 0 방지 및 안전 계산
    const calculatedInvReq = activeResistances.reduce((acc, R) => {
      const val = Number(R) <= 0.1 ? 0.1 : Number(R); // 최소값 0.1Ω 제한
      return acc + 1 / val;
    }, 0);

    const Req = calculatedInvReq > 0 ? 1 / calculatedInvReq : 0;

    const branchCurrents = activeResistances.map((R) => {
      const val = Number(R) <= 0.1 ? 0.1 : Number(R);
      return voltage / val;
    });

    const totalI = Req > 0 ? voltage / Req : 0;

    return { totalReq: Req, currents: branchCurrents, totalCurrent: totalI };
  }, [resistorCount, voltage, resistances]);

  const handleResChange = (idx, value) => {
    const newRes = [...resistances];
    newRes[idx] = value;
    setResistances(newRes);
  };

  return (
    <div className="flex flex-col bg-slate-50 p-6 rounded-2xl border border-gray-200 shadow-inner">
      <h5 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="bg-yellow-400 p-1 rounded">⚡</span> 병렬 회로
        인터랙티브 실습
      </h5>

      {/* 1. 컨트롤 패널 (상단) */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase">
            저항 개수 (2~4)
          </label>
          <div className="flex gap-1">
            {[2, 3, 4].map((num) => (
              <button
                key={num}
                onClick={() => setResistorCount(num)}
                className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
                  resistorCount === num
                    ? "bg-[#0047a5] text-white shadow-md"
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
            전압원 (V)
          </label>
          <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-100 font-bold text-[#0047a5]">
            <span>{voltage}</span>
            <input
              type="range"
              min="1"
              max="50"
              value={voltage}
              onChange={(e) => setVoltage(e.target.value)}
              className="flex-1 h-1 accent-[#0047a5]"
            />
            <span className="text-xs text-gray-400">V</span>
          </div>
        </div>
      </div>

      {/* 💡 2. 대망의 회로 시각화 및 드로잉 영역 (SVG) ⭐ */}
      <div className="flex justify-center mb-8 relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <svg width="400" height="250" className="overflow-visible">
          {/* 배터리/전압원 기호 */}
          <g transform="translate(40, 100)">
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="40"
              stroke="#0047a5"
              strokeWidth="2"
            />
            <line
              x1="-10"
              y1="40"
              x2="10"
              y2="40"
              stroke="#0047a5"
              strokeWidth="4"
            />
            <line
              x1="-5"
              y1="50"
              x2="5"
              y2="50"
              stroke="#0047a5"
              strokeWidth="2"
            />
            <line
              x1="0"
              y1="50"
              x2="0"
              y2="90"
              stroke="#0047a5"
              strokeWidth="2"
            />
            <text x="20" y="55" className="text-sm font-black text-[#0047a5]">
              {voltage} V
            </text>
          </g>

          {/* 메인 회로선 */}
          <line
            x1="40"
            y1="100"
            x2="40"
            y2="50"
            stroke="#94a3b8"
            strokeWidth="2"
          />
          <line
            x1="40"
            y1="50"
            x2="350"
            y2="50"
            stroke="#94a3b8"
            strokeWidth="2"
          />
          <line
            x1="40"
            y1="190"
            x2="40"
            y2="240"
            stroke="#94a3b8"
            strokeWidth="2"
          />
          <line
            x1="40"
            y1="240"
            x2="350"
            y2="240"
            stroke="#94a3b8"
            strokeWidth="2"
          />

          {/* 병렬 지로 (Branch) 드로잉 및 인터랙션 */}
          {resistances.slice(0, resistorCount).map((R, idx) => {
            const xPos = 120 + idx * 70; // 저항 간격 70px

            return (
              <g key={idx} transform={`translate(${xPos}, 50)`}>
                {/* 세로 회로선 */}
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="60"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                />
                <line
                  x1="0"
                  y1="130"
                  x2="0"
                  y2="190"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                />
                {/* ✅ 저항 기호 드로잉 (Zigzag) ⭐ */}
                <polyline
                  points="0,60 10,65 -10,75 10,85 -10,95 10,105 -10,115 10,125 0,130"
                  fill="none"
                  stroke={selectedIndex === idx ? "#0047a5" : "#64748b"}
                  strokeWidth="3"
                  className="cursor-pointer"
                  onClick={() => setSelectedIndex(idx)} // 저항 선택
                />
                {/* 흐르는 전류 표시 라벨 */}
                <text
                  x="15"
                  y="40"
                  className="text-[10px] font-bold text-emerald-600"
                >
                  I{idx + 1}: {currents[idx]?.toFixed(2)}A
                </text>
                <path d="M5 25 L5 35 L10 30 Z" fill="#10b981" />{" "}
                {/* 전류 방향 화살표 */}
              </g>
            );
          })}

          {/* 회로 마무리선 */}
          <line
            x1="350"
            y1="50"
            x2="350"
            y2="240"
            stroke="#94a3b8"
            strokeWidth="2"
          />

          {/* 전체 전류 및 합성저항 표시 라벨 */}
          <g transform="translate(180, 20)">
            <rect
              x="0"
              y="0"
              width="120"
              height="25"
              rx="5"
              fill="#f8fafc"
              stroke="#e2e8f0"
            />
            <text x="10" y="17" className="text-[10px] font-bold text-gray-500">
              Itotal:{" "}
              <tspan className="text-xs font-black text-yellow-500">
                {totalCurrent.toFixed(2)}A
              </tspan>
            </text>
          </g>
          <g transform="translate(360, 130)">
            <rect
              x="0"
              y="0"
              width="90"
              height="25"
              rx="5"
              fill="#f8fafc"
              stroke="#e2e8f0"
            />
            <text x="10" y="17" className="text-[10px] font-bold text-gray-500">
              Req:{" "}
              <tspan className="text-xs font-black text-[#0047a5]">
                {totalReq.toFixed(2)}Ω
              </tspan>
            </text>
          </g>
        </svg>

        {/* 💡 3. 저항값 슬라이더 컨트롤 (선택된 저항에 따라 변함) ⭐ */}
        {selectedIndex !== null && selectedIndex < resistorCount && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 p-4 rounded-xl border border-blue-200 shadow-2xl backdrop-blur-sm z-10 w-48 text-center animate-fade-in">
            <p className="text-xs font-bold text-blue-700 mb-1">
              R{selectedIndex + 1} 저항값 조절
            </p>
            <p className="text-3xl font-black text-gray-900 mb-2">
              {resistances[selectedIndex]} Ω
            </p>
            <input
              type="range"
              min="1"
              max="100"
              value={resistances[selectedIndex]}
              onChange={(e) => handleResChange(selectedIndex, e.target.value)}
              className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-[#0047a5]"
            />
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-1 right-1 text-gray-400 hover:text-red-500 text-xs"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* 4. 최종 결과 리포트 (하단) */}
      <div className="bg-[#0047a5] p-5 rounded-2xl text-white shadow-lg grid grid-cols-2 gap-4">
        <div className="text-center border-r border-white/10 pr-4">
          <p className="text-[11px] font-bold opacity-80 uppercase mb-1">
            합성저항 (Req)
          </p>
          <span className="text-3xl font-black">
            {totalReq.toFixed(2)}{" "}
            <tspan className="text-lg opacity-60">Ω</tspan>
          </span>
        </div>
        <div className="text-center pl-4">
          <p className="text-[11px] font-bold opacity-80 uppercase mb-1">
            전체 전류 (Itotal)
          </p>
          <span className="text-3xl font-black text-yellow-300">
            {totalCurrent.toFixed(2)}{" "}
            <tspan className="text-lg opacity-60">A</tspan>
          </span>
        </div>
      </div>

      <p className="mt-5 text-[11px] text-gray-400 text-center italic">
        * 병렬 회로에서 각 지로(Branch)에 흐르는 전류의 합은 전체 전류와
        같습니다.
      </p>
    </div>
  );
};

// 저항 선택을 위한 간단한 상태 추가
const [selectedIndex, setSelectedIndex] = useState(null);

export default ParallelResistanceWidget;
