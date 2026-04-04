import "katex/dist/katex.min.css";
import { AlertCircle, Calculator, MousePointer2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { BlockMath, InlineMath } from "react-katex";

const VectorInnerProductWidget = () => {
  // --- 1. 상태 관리 ---
  const [u, setU] = useState({ x: 3, y: 4 }); // 벡터 U (파란색)
  const [v, setV] = useState({ x: 6, y: 0 }); // 벡터 V (빨간색)
  const [dragging, setDragging] = useState(null); // 'u' 또는 'v'
  const svgRef = useRef(null);

  // --- 2. 수학 및 렌더링 상수 ---
  const SVG_SIZE = 500;
  const CENTER = SVG_SIZE / 2;
  const SCALE = 25; // 1단위 = 25px (총 -10 ~ 10 범위)

  // 좌표 변환 함수 (수학 좌표 <-> SVG 픽셀 좌표)
  const mathToSvg = (mathX, mathY) => ({
    x: CENTER + mathX * SCALE,
    y: CENTER - mathY * SCALE,
  });

  const svgToMath = (svgX, svgY) => ({
    x: (svgX - CENTER) / SCALE,
    y: (CENTER - svgY) / SCALE,
  });

  // --- 3. 실시간 수학 연산 (💡 오류 해결 부분!) ---
  const { dot, magU, magV, proj, angle, isOrthogonal } = useMemo(() => {
    const dotProduct = u.x * v.x + u.y * v.y;
    const magnitudeU = Math.sqrt(u.x ** 2 + u.y ** 2);
    const magnitudeV = Math.sqrt(v.x ** 2 + v.y ** 2);

    // 투영 벡터 (Projection of U onto V) = (U·V / |V|^2) * V
    let projX = 0;
    let projY = 0;
    if (magnitudeV > 0) {
      const scalar = dotProduct / magnitudeV ** 2;
      projX = scalar * v.x;
      projY = scalar * v.y;
    }

    // 각도 계산 (cos^-1) - 💡 안전한 처리
    let theta = 0;
    if (magnitudeU > 0 && magnitudeV > 0) {
      let cosTheta = dotProduct / (magnitudeU * magnitudeV);
      // 부동소수점 오차 방지: -1.0 ~ 1.0 사이로 강제 고정
      if (cosTheta > 1) cosTheta = 1;
      if (cosTheta < -1) cosTheta = -1;
      theta = (Math.acos(cosTheta) * 180) / Math.PI;
    } else {
      theta = 0; // 한 벡터의 길이가 0일 경우 안전하게 0으로 처리
    }

    return {
      dot: dotProduct,
      magU: magnitudeU,
      magV: magnitudeV,
      proj: { x: projX, y: projY },
      angle: isNaN(theta) ? 0 : theta, // NaN 방어 로직
      isOrthogonal: dotProduct === 0 && magnitudeU > 0 && magnitudeV > 0,
    };
  }, [u, v]);

  // --- 4. 드래그 이벤트 핸들러 ---
  const handlePointerDown = (e, vectorName) => {
    e.preventDefault();
    setDragging(vectorName);
  };

  const handlePointerMove = (e) => {
    if (!dragging || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    // 터치 이벤트 지원 추가 (모바일 대응)
    let clientX = e.clientX;
    let clientY = e.clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    const svgX = ((clientX - rect.left) / rect.width) * SVG_SIZE;
    const svgY = ((clientY - rect.top) / rect.height) * SVG_SIZE;

    const { x, y } = svgToMath(svgX, svgY);
    let snappedX = Math.round(x);
    let snappedY = Math.round(y);

    snappedX = Math.max(-10, Math.min(10, snappedX));
    snappedY = Math.max(-10, Math.min(10, snappedY));

    if (snappedX === 0 && snappedY === 0) {
      snappedX = dragging === "u" ? 0 : 1;
      snappedY = dragging === "u" ? 1 : 0;
    }

    if (dragging === "u") setU({ x: snappedX, y: snappedY });
    if (dragging === "v") setV({ x: snappedX, y: snappedY });
  };

  const handlePointerUp = () => {
    setDragging(null);
  };

  useEffect(() => {
    // 마우스 및 터치 이벤트 모두 지원하도록 수정
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchend", handlePointerUp);
    return () => {
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, []);

  // --- 5. 렌더링 헬퍼 ---
  const svgU = mathToSvg(u.x, u.y);
  const svgV = mathToSvg(v.x, v.y);
  const svgProj = mathToSvg(proj.x, proj.y);
  const svgOrigin = mathToSvg(0, 0);

  const gridLines = [];
  for (let i = -10; i <= 10; i++) {
    const pos = CENTER + i * SCALE;
    gridLines.push(
      <line
        key={`v${i}`}
        x1={pos}
        y1={0}
        x2={pos}
        y2={SVG_SIZE}
        stroke={i === 0 ? "#94a3b8" : "#f1f5f9"}
        strokeWidth={i === 0 ? 2 : 1}
      />,
      <line
        key={`h${i}`}
        x1={0}
        y1={pos}
        x2={SVG_SIZE}
        y2={pos}
        stroke={i === 0 ? "#94a3b8" : "#f1f5f9"}
        strokeWidth={i === 0 ? 2 : 1}
      />,
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-6xl mx-auto my-4">
      {/* 왼쪽: SVG 시각화 영역 */}
      <div className="flex-1 relative touch-none select-none">
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-sm font-bold text-gray-600 flex items-center gap-2 z-10">
          <MousePointer2 size={16} className="text-blue-500 animate-pulse" />
          화살표 끝을 드래그하여 움직여보세요
        </div>

        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          className="w-full h-auto bg-slate-50 rounded-2xl cursor-crosshair border border-slate-200"
          onMouseMove={handlePointerMove}
          onTouchMove={handlePointerMove}
          style={{ touchAction: "none" }}
        >
          {/* 그리드 및 축 */}
          <g>{gridLines}</g>

          {/* 직각(90도) 표시 심볼 */}
          {isOrthogonal && (
            <g>
              <rect
                x={svgOrigin.x}
                y={svgOrigin.y - (u.y > 0 || v.y > 0 ? 20 : -20)}
                width="20"
                height="20"
                fill="rgba(34, 197, 94, 0.2)"
                stroke="#22c55e"
                strokeWidth="2"
                transform={`rotate(${Math.atan2(-v.y, v.x) * (180 / Math.PI)}, ${svgOrigin.x}, ${svgOrigin.y})`}
              />
            </g>
          )}

          {/* 투영선 (Dashed) */}
          <line
            x1={svgU.x}
            y1={svgU.y}
            x2={svgProj.x}
            y2={svgProj.y}
            stroke="#94a3b8"
            strokeWidth="2"
            strokeDasharray="5,5"
          />

          {/* 벡터 V (빨간색) */}
          <line
            x1={svgOrigin.x}
            y1={svgOrigin.y}
            x2={svgV.x}
            y2={svgV.y}
            stroke="#f43f5e"
            strokeWidth="4"
          />
          <polygon
            points="0,-6 12,0 0,6"
            fill="#f43f5e"
            transform={`translate(${svgV.x}, ${svgV.y}) rotate(${Math.atan2(svgOrigin.y - svgV.y, svgV.x - svgOrigin.x) * (180 / Math.PI)})`}
          />

          {/* 투영된 벡터 (초록색) */}
          {dot !== 0 && (
            <line
              x1={svgOrigin.x}
              y1={svgOrigin.y}
              x2={svgProj.x}
              y2={svgProj.y}
              stroke="#22c55e"
              strokeWidth="6"
              opacity="0.6"
              strokeLinecap="round"
            />
          )}

          {/* 벡터 U (파란색) */}
          <line
            x1={svgOrigin.x}
            y1={svgOrigin.y}
            x2={svgU.x}
            y2={svgU.y}
            stroke="#3b82f6"
            strokeWidth="4"
          />
          <polygon
            points="0,-6 12,0 0,6"
            fill="#3b82f6"
            transform={`translate(${svgU.x}, ${svgU.y}) rotate(${Math.atan2(svgOrigin.y - svgU.y, svgU.x - svgOrigin.x) * (180 / Math.PI)})`}
          />

          {/* 드래그 핸들 */}
          <circle
            cx={svgV.x}
            cy={svgV.y}
            r="25"
            fill="transparent"
            className="cursor-grab hover:cursor-grabbing"
            onMouseDown={(e) => handlePointerDown(e, "v")}
            onTouchStart={(e) => handlePointerDown(e, "v")}
          />
          <circle
            cx={svgU.x}
            cy={svgU.y}
            r="25"
            fill="transparent"
            className="cursor-grab hover:cursor-grabbing"
            onMouseDown={(e) => handlePointerDown(e, "u")}
            onTouchStart={(e) => handlePointerDown(e, "u")}
          />

          <circle
            cx={svgV.x}
            cy={svgV.y}
            r="6"
            fill="#fff"
            stroke="#f43f5e"
            strokeWidth="3"
            className="pointer-events-none"
          />
          <circle
            cx={svgU.x}
            cy={svgU.y}
            r="6"
            fill="#fff"
            stroke="#3b82f6"
            strokeWidth="3"
            className="pointer-events-none"
          />
        </svg>
      </div>

      {/* 오른쪽: 수학 계산 정보 패널 */}
      <div className="flex-1 flex flex-col gap-4 min-w-[300px]">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-2 border-b pb-4">
          <Calculator className="text-[#0047a5]" /> 실시간 내적 계산기
        </h3>

        {/* 핵심 알림 */}
        <div
          className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-start gap-3 ${
            isOrthogonal
              ? "bg-green-50 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)] scale-105"
              : "bg-blue-50/50 border-blue-100"
          }`}
        >
          {isOrthogonal ? (
            <AlertCircle className="text-green-500 shrink-0 mt-0.5" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              i
            </div>
          )}
          <div>
            <h4
              className={`font-bold ${isOrthogonal ? "text-green-700 text-lg" : "text-blue-800"}`}
            >
              {isOrthogonal
                ? "🎯 수직 (Orthogonal) 발견!"
                : "기하학적 의미 (투영)"}
            </h4>
            <p
              className={`text-sm mt-1 leading-relaxed ${isOrthogonal ? "text-green-600 font-medium" : "text-blue-600/80"}`}
            >
              {isOrthogonal
                ? "두 벡터가 정확히 90도를 이룹니다. 직각일 때 서로에게 미치는 영향(투영된 그림자)이 0이 되므로 내적 값은 항상 0이 됩니다."
                : "파란색 벡터(U)에서 수직으로 빛을 비추었을 때, 빨간색 벡터(V) 위로 생기는 그림자(초록색 선)의 길이가 내적의 크기를 결정합니다."}
            </p>
          </div>
        </div>

        {/* 연산 상세 과정 */}
        <div className="bg-slate-50 p-6 rounded-xl space-y-6 text-gray-700">
          {/* 1. 벡터 좌표 */}
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              1. Vector Coordinates
            </div>
            <div className="flex gap-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg font-mono font-medium">
                <InlineMath math={`\\vec{u} = (${u.x}, ${u.y})`} />
              </div>
              <div className="bg-rose-100 text-rose-800 px-3 py-1.5 rounded-lg font-mono font-medium">
                <InlineMath math={`\\vec{v} = (${v.x}, ${v.y})`} />
              </div>
            </div>
          </div>

          {/* 2. 내적 계산 */}
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              2. Dot Product (내적)
            </div>
            <div
              className={`p-4 rounded-lg bg-white border ${isOrthogonal ? "border-green-300" : "border-gray-200"} text-center overflow-x-auto`}
            >
              <BlockMath
                math={`\\vec{u} \\cdot \\vec{v} = (${u.x})(${v.x}) + (${u.y})(${v.y})`}
              />
              <div
                className={`text-3xl font-black mt-2 ${isOrthogonal ? "text-green-500" : dot < 0 ? "text-rose-500" : "text-slate-800"}`}
              >
                = {dot}
              </div>
            </div>
          </div>

          {/* 3. 사이각 계산 (Arccosine) */}
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              3. Angle & Arccosine (역코사인)
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 overflow-x-auto">
              <div className="text-sm text-gray-500 mb-2 border-b pb-2">
                내적 공식을 변형하면 각도 $\theta$를 구할 수 있습니다: <br />
                <InlineMath
                  math={`\\cos\\theta = \\frac{\\vec{u} \\cdot \\vec{v}}{|\\vec{u}| |\\vec{v}|}`}
                />
              </div>
              <BlockMath
                math={`\\theta = \\cos^{-1}\\left(\\frac{${dot}}{${magU.toFixed(1)} \\times ${magV.toFixed(1)}}\\right)`}
              />
              <div className="text-center text-xl font-bold text-[#0047a5] mt-2">
                <InlineMath
                  math={`\\theta \\approx ${angle.toFixed(1)}^\\circ`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VectorInnerProductWidget;
