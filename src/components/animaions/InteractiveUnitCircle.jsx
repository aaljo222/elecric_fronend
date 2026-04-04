import { useState } from "react";

const InteractiveUnitCircle = () => {
  const [angle, setAngle] = useState(30); // 기본 각도 30도

  // 수학 계산 (라디안 변환)
  const rad = (angle * Math.PI) / 180;
  const cosValue = Math.cos(rad);
  const sinValue = Math.sin(rad);

  // SVG 좌표 설정 (중심 150, 150 / 반지름 100)
  const centerX = 150;
  const centerY = 150;
  const radius = 100;

  const targetX = centerX + radius * cosValue;
  const targetY = centerY - radius * sinValue; // SVG는 Y축이 아래로 갈수록 커짐

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-2xl border border-blue-50 shadow-inner">
      <h5 className="text-lg font-bold text-gray-800 mb-4">
        단위원을 활용한 삼각비 이해
      </h5>

      {/* 시각화 영역 (SVG) */}
      <svg
        width="300"
        height="300"
        className="bg-slate-50 rounded-xl mb-6 overflow-visible"
      >
        {/* X, Y 축 */}
        <line
          x1="20"
          y1="150"
          x2="280"
          y2="150"
          stroke="#cbd5e1"
          strokeWidth="1"
        />
        <line
          x1="150"
          y1="20"
          x2="150"
          y2="280"
          stroke="#cbd5e1"
          strokeWidth="1"
        />

        {/* 단위 원 */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2"
          strokeDasharray="4 2"
        />

        {/* 빗변 (Radius) */}
        <line
          x1={centerX}
          y1={centerY}
          x2={targetX}
          y2={targetY}
          stroke="#0047a5"
          strokeWidth="3"
        />

        {/* 밑변 (Cos - 가로축) */}
        <line
          x1={centerX}
          y1={centerY}
          x2={targetX}
          y2={centerY}
          stroke="#ef4444"
          strokeWidth="3"
        />

        {/* 높이 (Sin - 세로축) */}
        <line
          x1={targetX}
          y1={centerY}
          x2={targetX}
          y2={targetY}
          stroke="#10b981"
          strokeWidth="3"
        />

        {/* 움직이는 점 */}
        <circle cx={targetX} cy={targetY} r="5" fill="#0047a5" />

        {/* 텍스트 라벨 */}
        <text
          x={centerX + (radius * cosValue) / 2}
          y={centerY + 20}
          textAnchor="middle"
          fill="#ef4444"
          fontSize="12"
          fontWeight="bold"
        >
          cos
        </text>
        <text
          x={targetX + 10}
          y={centerY - (radius * sinValue) / 2}
          fill="#10b981"
          fontSize="12"
          fontWeight="bold"
        >
          sin
        </text>
      </svg>

      {/* 값 출력 영역 */}
      <div className="grid grid-cols-2 gap-4 w-full mb-6">
        <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-center">
          <p className="text-xs text-red-600 font-bold mb-1">
            $\cos({angle}^\circ)$
          </p>
          <p className="text-xl font-black text-red-700">
            {cosValue.toFixed(4)}
          </p>
        </div>
        <div className="bg-green-50 p-3 rounded-xl border border-green-100 text-center">
          <p className="text-xs text-green-600 font-bold mb-1">
            $\sin({angle}^\circ)$
          </p>
          <p className="text-xl font-black text-green-700">
            {sinValue.toFixed(4)}
          </p>
        </div>
      </div>

      {/* 컨트롤 영역 (슬라이더) */}
      <div className="w-full space-y-2">
        <div className="flex justify-between items-center px-1">
          <span className="text-sm font-bold text-gray-500">각도 조절</span>
          <span className="text-lg font-black text-[#0047a5]">{angle}°</span>
        </div>
        <input
          type="range"
          min="0"
          max="360"
          value={angle}
          onChange={(e) => setAngle(Number(e.target.value))}
          className="w-full h-3 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-[#0047a5]"
        />
      </div>
    </div>
  );
};

export default InteractiveUnitCircle;
