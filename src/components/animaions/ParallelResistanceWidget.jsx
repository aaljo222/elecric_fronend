import "katex/dist/katex.min.css";
import { useMemo, useState } from "react";
import { BlockMath } from "react-katex";

const ParallelResistanceWidget = () => {
  const [resistorCount, setResistorCount] = useState(3);
  const [voltage, setVoltage] = useState(35);
  const [resistances, setResistances] = useState([10, 20, 30, 40]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const { totalReq, currents, totalCurrent, latexFormula } = useMemo(() => {
    const activeResistances = resistances.slice(0, resistorCount);

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

    const symbolicPart = activeResistances
      .map((_, i) => `\\frac{1}{R_{${i + 1}}}`)
      .join(" + ");
    const numericPart = activeResistances
      .map((R) => `\\frac{1}{${R}}`)
      .join(" + ");
    const formula = `R_{eq} = \\frac{1}{${symbolicPart}} = \\frac{1}{${numericPart}} = ${Req.toFixed(2)} \\, \\Omega`;

    return {
      totalReq: Req,
      currents: branchCurrents,
      totalCurrent: totalI,
      latexFormula: formula,
    };
  }, [resistorCount, voltage, resistances]);

  const handleResChange = (idx, value) => {
    const newRes = [...resistances];
    newRes[idx] = value;
    setResistances(newRes);
  };

  return (
    <div className="w-full bg-white rounded-2xl">
      {/* 타이틀 영역 */}
      <h5 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
        <span className="bg-yellow-400 p-1.5 rounded-lg text-white">⚡</span>{" "}
        병렬 회로 실시간 분석기
      </h5>

      {/* 💡 2단 분할 레이아웃 적용 */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        {/* ========================================= */}
        {/* 왼쪽 영역: 회로 시각화 (회로도) */}
        {/* ========================================= */}
        <div className="flex-[4] flex flex-col bg-slate-50 rounded-2xl border border-gray-200 shadow-inner relative p-4 min-h-[350px]">
          <p className="text-xs font-bold text-gray-500 uppercase text-center mb-2 tracking-widest">
            Circuit Diagram
          </p>
          <div className="flex-1 flex justify-center items-center w-full h-full relative">
            <svg
              viewBox="0 0 400 250"
              className="w-full max-w-md h-auto overflow-visible drop-shadow-md"
            >
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
                  x1="-15"
                  y1="40"
                  x2="15"
                  y2="40"
                  stroke="#0047a5"
                  strokeWidth="4"
                />
                <line
                  x1="-8"
                  y1="50"
                  x2="8"
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
                <text
                  x="25"
                  y="55"
                  className="text-base font-black text-[#0047a5]"
                >
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
                      className="cursor-pointer hover:stroke-blue-500 transition-colors"
                      onClick={() => setSelectedIndex(idx)}
                    />
                    <text
                      x="15"
                      y="40"
                      className="text-[11px] font-bold text-emerald-600"
                    >
                      I{idx + 1}: {currents[idx]?.toFixed(2)}A
                    </text>
                    <path d="M5 25 L5 35 L10 30 Z" fill="#10b981" />
                    <text
                      x="15"
                      y="100"
                      className="text-[12px] font-black text-gray-700"
                    >
                      {R}Ω
                    </text>
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
                  width="130"
                  height="25"
                  rx="5"
                  fill="#f8fafc"
                  stroke="#e2e8f0"
                />
                <text
                  x="10"
                  y="17"
                  className="text-[11px] font-bold text-gray-500"
                >
                  Itotal:{" "}
                  <tspan className="text-sm font-black text-yellow-600">
                    {totalCurrent.toFixed(2)}A
                  </tspan>
                </text>
              </g>
            </svg>
          </div>

          {/* 저항 팝업 조절기 (SVG 내부에 위치) */}
          {selectedIndex !== null && selectedIndex < resistorCount && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 p-5 rounded-2xl border border-blue-300 shadow-2xl backdrop-blur-sm z-10 w-56 text-center animate-fade-in">
              <p className="text-sm font-bold text-[#0047a5] mb-2">
                R{selectedIndex + 1} 저항값 설정
              </p>
              <p className="text-4xl font-black text-gray-900 mb-4">
                {resistances[selectedIndex]}{" "}
                <span className="text-lg opacity-50">Ω</span>
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
                className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-lg"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* ========================================= */}
        {/* 오른쪽 영역: 컨트롤 및 수식, 결과 리포트 */}
        {/* ========================================= */}
        <div className="flex-[3] flex flex-col justify-between gap-4">
          {/* 컨트롤 (저항 개수 / 전압) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <label className="text-xs font-bold text-gray-500 uppercase block mb-3">
                저항 개수
              </label>
              <div className="flex gap-2">
                {[2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      setResistorCount(num);
                      if (selectedIndex >= num) setSelectedIndex(null);
                    }}
                    className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm ${
                      resistorCount === num
                        ? "bg-[#0047a5] text-white"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {num}개
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <label className="text-xs font-bold text-gray-500 uppercase block mb-3">
                전압원 설정 (V)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={voltage}
                  onChange={(e) => setVoltage(e.target.value)}
                  className="flex-1 h-2 accent-[#0047a5]"
                />
                <span className="w-10 text-center font-black text-[#0047a5] text-lg">
                  {voltage}
                </span>
              </div>
            </div>
          </div>

          {/* 수식 표시 영역 */}
          <div className="bg-blue-50/50 border border-blue-200 p-5 rounded-xl shadow-sm flex-1 flex flex-col justify-center">
            <p className="text-sm font-bold text-[#0047a5] mb-4 flex items-center gap-2 border-b border-blue-200 pb-2">
              <span className="material-symbols-outlined text-base">
                calculate
              </span>
              실시간 합성저항 계산 과정
            </p>
            <div className="text-gray-900 pointer-events-none overflow-x-auto py-2">
              <BlockMath math={latexFormula} />
            </div>
          </div>

          {/* 최종 결과값 */}
          <div className="bg-[#0047a5] p-5 rounded-xl text-white shadow-lg grid grid-cols-2 gap-4 mt-2">
            <div className="text-center border-r border-white/20 pr-2">
              <p className="text-[11px] font-bold opacity-80 uppercase mb-2">
                합성저항 (Req)
              </p>
              <span className="text-3xl font-black">
                {totalReq.toFixed(2)}{" "}
                <tspan className="text-base opacity-60">Ω</tspan>
              </span>
            </div>
            <div className="text-center pl-2">
              <p className="text-[11px] font-bold opacity-80 uppercase mb-2">
                전체 전류 (Itotal)
              </p>
              <span className="text-3xl font-black text-yellow-300">
                {totalCurrent.toFixed(2)}{" "}
                <tspan className="text-base opacity-60">A</tspan>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParallelResistanceWidget;
