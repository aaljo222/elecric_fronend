import "katex/dist/katex.min.css"; // (참고: 상위 컴포넌트나 index.css에 이미 있다면 생략 가능)
import { useMemo, useState } from "react";
import { BlockMath } from "react-katex"; // 👈 수식 렌더링을 위해 추가

const ParallelResistanceWidget = () => {
  const [resistorCount, setResistorCount] = useState(2);
  const [voltage, setVoltage] = useState(12);
  const [resistances, setResistances] = useState([10, 20, 30, 40]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // 계산 및 동적 LaTeX 수식 생성
  const { totalReq, currents, totalCurrent, latexFormula } = useMemo(() => {
    const activeResistances = resistances.slice(0, resistorCount);

    // 1. 계산 로직
    const calculatedInvReq = activeResistances.reduce((acc, R) => {
      const val = Number(R) <= 0.1 ? 0.1 : Number(R);
      return acc + 1 / val;
    }, 0);

    const Req = calculatedInvReq > 0 ? 1 / calculatedInvReq : 0;

    const branchCurrents = activeResistances.map((R) => {
      const val = Number(R) <= 0.1 ? 0.1 : Number(R);
      return voltage / val;
    });

    const totalI = Req > 0 ? voltage / Req : 0;

    // 💡 2. 동적 수식 문자열 (LaTeX) 생성 ⭐
    // 예: \frac{1}{R_1} + \frac{1}{R_2}
    const symbolicPart = activeResistances
      .map((_, i) => `\\frac{1}{R_{${i + 1}}}`)
      .join(" + ");
    // 예: \frac{1}{10} + \frac{1}{20}
    const numericPart = activeResistances
      .map((R) => `\\frac{1}{${R}}`)
      .join(" + ");

    // 최종 완성된 LaTeX 수식
    const formula = `R_{eq} = \\frac{1}{${symbolicPart}} = \\frac{1}{${numericPart}} = ${Req.toFixed(2)} \\, \\Omega`;

    return {
      totalReq: Req,
      currents: branchCurrents,
      totalCurrent: totalI,
      latexFormula: formula, // 수식 상태 반환
    };
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

      {/* 1. 컨트롤 패널 (생략: 기존과 동일) */}
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

      {/* 2. 회로 시각화 및 드로잉 (생략: 기존과 동일) */}
      <div className="flex justify-center mb-6 relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto min-h-[300px]">
        <svg width="400" height="250" className="overflow-visible">
          {/* 전압원 */}
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

          {resistances.slice(0, resistorCount).map((R, idx) => {
            const xPos = 120 + idx * 70;
            return (
              <g key={idx} transform={`translate(${xPos}, 50)`}>
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
                <polyline
                  points="0,60 10,65 -10,75 10,85 -10,95 10,105 -10,115 10,125 0,130"
                  fill="none"
                  stroke={selectedIndex === idx ? "#0047a5" : "#64748b"}
                  strokeWidth="3"
                  className="cursor-pointer hover:stroke-blue-400"
                  onClick={() => setSelectedIndex(idx)}
                />
                <text
                  x="15"
                  y="40"
                  className="text-[10px] font-bold text-emerald-600"
                >
                  I{idx + 1}: {currents[idx]?.toFixed(2)}A
                </text>
                <path d="M5 25 L5 35 L10 30 Z" fill="#10b981" />
              </g>
            );
          })}

          <line
            x1="350"
            y1="50"
            x2="350"
            y2="240"
            stroke="#94a3b8"
            strokeWidth="2"
          />

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
        </svg>

        {selectedIndex !== null && selectedIndex < resistorCount && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 p-4 rounded-xl border border-blue-200 shadow-2xl backdrop-blur-sm z-10 w-48 text-center animate-fade-in">
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
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* 💡 3. 실시간 합성저항 수식 표시 영역 (새로 추가됨) ⭐ */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6 shadow-sm overflow-x-auto text-center">
        <p className="text-xs font-bold text-[#0047a5] mb-2 flex justify-center items-center gap-1">
          <span className="material-symbols-outlined text-sm">calculate</span>
          실시간 합성저항 계산 과정
        </p>
        <div className="text-gray-900 pointer-events-none">
          {/* BlockMath를 통해 LaTeX 수식 렌더링 */}
          <BlockMath math={latexFormula} />
        </div>
      </div>

      {/* 4. 결과 요약 리포트 */}
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
    </div>
  );
};

export default ParallelResistanceWidget;
