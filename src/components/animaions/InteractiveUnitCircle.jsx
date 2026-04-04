import { ArrowRightLeft, Calculator, Zap } from "lucide-react";
import { useState } from "react";

// ==========================================
// 1. 수식 렌더링 (초소형 압축 버전)
// ==========================================
const MathFraction = ({
  target,
  numerator,
  denominator,
  result,
  unit = "Ω",
}) => {
  return (
    <div className="flex items-center text-sm font-medium text-gray-700 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm w-full justify-center hover:border-blue-300 transition-colors">
      <span className="font-bold text-gray-900 mr-2 shrink-0">{target} = </span>
      <div className="flex flex-col items-center justify-center mx-1 shrink-0">
        <span className="border-b border-gray-400 px-1 pb-0.5 text-center text-xs whitespace-nowrap">
          {numerator}
        </span>
        <span className="px-1 pt-0.5 text-center text-xs whitespace-nowrap">
          {denominator}
        </span>
      </div>
      {result && (
        <div className="shrink-0 flex items-center ml-1">
          <span className="mx-1 text-gray-400">=</span>
          <span className="font-bold text-blue-600 text-base">
            {result}{" "}
            <span className="text-[10px] text-gray-500 font-normal">
              {unit}
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. 입력 필드 (초소형 압축 버전)
// ==========================================
const InputField = ({ label, name, value, onChange, disabled, color }) => {
  const isBlue = color === "blue";
  return (
    <div
      className={`flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border shadow-sm ${disabled ? "opacity-70 bg-gray-50" : "ring-1 ring-offset-1 " + (isBlue ? "ring-blue-200" : "ring-green-200")}`}
    >
      <span
        className={`font-bold w-6 text-sm ${isBlue ? "text-blue-600" : "text-green-600"}`}
      >
        {label}
      </span>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder="0"
        className="w-20 text-right outline-none font-mono text-base bg-transparent text-gray-900 border-b border-transparent focus:border-gray-300"
      />
      <span className="text-gray-400 text-xs ml-1">Ω</span>
    </div>
  );
};

// ==========================================
// 3. 메인 위젯
// ==========================================
const YDeltaConverterWidget = () => {
  const [mode, setMode] = useState("YtoDelta");

  const [yValues, setYValues] = useState({ r1: "", r2: "", r3: "" });
  const [deltaValues, setDeltaValues] = useState({ ra: "", rb: "", rc: "" });

  const handleYChange = (e) => {
    const { name, value } = e.target;
    const newY = { ...yValues, [name]: value };
    setYValues(newY);

    if (mode === "YtoDelta") {
      const r1 = parseFloat(newY.r1) || 0;
      const r2 = parseFloat(newY.r2) || 0;
      const r3 = parseFloat(newY.r3) || 0;

      if (r1 && r2 && r3) {
        const sumProduct = r1 * r2 + r2 * r3 + r3 * r1;
        setDeltaValues({
          ra: (sumProduct / r1).toFixed(2),
          rb: (sumProduct / r2).toFixed(2),
          rc: (sumProduct / r3).toFixed(2),
        });
      } else {
        setDeltaValues({ ra: "", rb: "", rc: "" });
      }
    }
  };

  const handleDeltaChange = (e) => {
    const { name, value } = e.target;
    const newDelta = { ...deltaValues, [name]: value };
    setDeltaValues(newDelta);

    if (mode === "DeltaToY") {
      const ra = parseFloat(newDelta.ra) || 0;
      const rb = parseFloat(newDelta.rb) || 0;
      const rc = parseFloat(newDelta.rc) || 0;

      if (ra && rb && rc) {
        const sum = ra + rb + rc;
        setYValues({
          r1: ((rb * rc) / sum).toFixed(2),
          r2: ((rc * ra) / sum).toFixed(2),
          r3: ((ra * rb) / sum).toFixed(2),
        });
      } else {
        setYValues({ r1: "", r2: "", r3: "" });
      }
    }
  };

  return (
    <div className="w-full flex flex-col bg-gray-50 rounded-xl shadow-inner font-sans h-full">
      {/* 헤더 영역 (높이 축소) */}
      <div className="bg-[#0047a5] text-white p-4 flex justify-between items-center shrink-0">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Zap className="text-yellow-400" size={20} fill="currentColor" />
          Y-Δ 등가 변환기
        </h3>
        <div className="flex bg-[#003882] rounded-lg p-1 text-sm">
          <button
            onClick={() => {
              setMode("YtoDelta");
              setYValues({ r1: "", r2: "", r3: "" });
              setDeltaValues({ ra: "", rb: "", rc: "" });
            }}
            className={`px-3 py-1.5 rounded-md font-bold transition-all ${mode === "YtoDelta" ? "bg-white text-[#0047a5] shadow" : "text-white hover:bg-[#002f6c]"}`}
          >
            Y → Δ
          </button>
          <button
            onClick={() => {
              setMode("DeltaToY");
              setYValues({ r1: "", r2: "", r3: "" });
              setDeltaValues({ ra: "", rb: "", rc: "" });
            }}
            className={`px-3 py-1.5 rounded-md font-bold transition-all ${mode === "DeltaToY" ? "bg-white text-[#0047a5] shadow" : "text-white hover:bg-[#002f6c]"}`}
          >
            Δ → Y
          </button>
        </div>
      </div>

      {/* 🌟 3단 와이드 레이아웃 (스크롤 제거의 핵심) 🌟 */}
      <div className="flex flex-col lg:flex-row p-4 gap-4 items-center justify-center flex-grow">
        {/* 1단: Y 결선 */}
        <div
          className={`flex flex-col items-center p-4 rounded-2xl w-full lg:w-1/3 max-w-[280px] transition-all duration-300 ${mode === "YtoDelta" ? "bg-white shadow-md border-2 border-blue-400" : "bg-gray-100/50 border border-gray-200"}`}
        >
          <h4 className="text-lg font-bold text-blue-600 mb-2">Y (Wye) 결선</h4>
          <div className="relative w-36 h-36 mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
              <path
                d="M50 50 L50 10 M50 50 L15 85 M50 50 L85 85"
                stroke={mode === "YtoDelta" ? "#3b82f6" : "#9ca3af"}
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="4"
                fill={mode === "YtoDelta" ? "#1e3a8a" : "#6b7280"}
              />
              <rect
                x="42"
                y="15"
                width="16"
                height="20"
                fill="white"
                stroke={mode === "YtoDelta" ? "#3b82f6" : "#9ca3af"}
                strokeWidth="2"
                rx="2"
              />
              <rect
                x="20"
                y="60"
                width="20"
                height="16"
                fill="white"
                stroke={mode === "YtoDelta" ? "#3b82f6" : "#9ca3af"}
                strokeWidth="2"
                transform="rotate(-45 30 68)"
                rx="2"
              />
              <rect
                x="60"
                y="60"
                width="20"
                height="16"
                fill="white"
                stroke={mode === "YtoDelta" ? "#3b82f6" : "#9ca3af"}
                strokeWidth="2"
                transform="rotate(45 70 68)"
                rx="2"
              />
            </svg>
            <span className="absolute top-2 left-1/2 -translate-x-1/2 bg-white border text-blue-800 text-[10px] px-1 rounded font-bold">
              {yValues.r1 || "R1"}
            </span>
            <span className="absolute bottom-4 left-2 bg-white border text-blue-800 text-[10px] px-1 rounded font-bold">
              {yValues.r2 || "R2"}
            </span>
            <span className="absolute bottom-4 right-2 bg-white border text-blue-800 text-[10px] px-1 rounded font-bold">
              {yValues.r3 || "R3"}
            </span>
          </div>
          <div className="w-full space-y-2">
            <InputField
              label="R1"
              name="r1"
              value={yValues.r1}
              onChange={handleYChange}
              disabled={mode !== "YtoDelta"}
              color="blue"
            />
            <InputField
              label="R2"
              name="r2"
              value={yValues.r2}
              onChange={handleYChange}
              disabled={mode !== "YtoDelta"}
              color="blue"
            />
            <InputField
              label="R3"
              name="r3"
              value={yValues.r3}
              onChange={handleYChange}
              disabled={mode !== "YtoDelta"}
              color="blue"
            />
          </div>
        </div>

        {/* 2단: 중앙 공식 & 처리 영역 */}
        <div className="flex flex-col items-center justify-center w-full lg:w-[320px] shrink-0 space-y-3 bg-[#f8fafc] p-4 rounded-2xl border border-gray-200 shadow-inner">
          <div className="flex items-center gap-1.5 text-indigo-700 mb-1">
            <Calculator size={18} />
            <span className="font-bold text-sm">실시간 변환 과정</span>
          </div>

          <div className="flex flex-col gap-2 w-full">
            {mode === "YtoDelta" ? (
              <>
                <MathFraction
                  target="Ra"
                  numerator="R1·R2+R2·R3+R3·R1"
                  denominator="R1"
                  result={deltaValues.ra}
                />
                <MathFraction
                  target="Rb"
                  numerator="R1·R2+R2·R3+R3·R1"
                  denominator="R2"
                  result={deltaValues.rb}
                />
                <MathFraction
                  target="Rc"
                  numerator="R1·R2+R2·R3+R3·R1"
                  denominator="R3"
                  result={deltaValues.rc}
                />
              </>
            ) : (
              <>
                <MathFraction
                  target="R1"
                  numerator="Rb·Rc"
                  denominator="Ra+Rb+Rc"
                  result={yValues.r1}
                />
                <MathFraction
                  target="R2"
                  numerator="Rc·Ra"
                  denominator="Ra+Rb+Rc"
                  result={yValues.r2}
                />
                <MathFraction
                  target="R3"
                  numerator="Ra·Rb"
                  denominator="Ra+Rb+Rc"
                  result={yValues.r3}
                />
              </>
            )}
          </div>

          <ArrowRightLeft
            size={24}
            className={`mt-2 transition-transform duration-500 ${mode === "DeltaToY" ? "rotate-180 text-green-500" : "text-blue-500"}`}
          />

          <p className="text-[11px] text-gray-500 text-center leading-tight font-medium bg-white p-2 rounded border border-gray-100 w-full">
            {mode === "YtoDelta"
              ? "💡 분자: 두 저항의 곱을 모두 합산\n분모: 구하려는 위치와 마주보는 저항"
              : "💡 분자: 구하려는 위치 양옆 저항의 곱\n분모: 모든 저항의 합산"}
          </p>
        </div>

        {/* 3단: 델타 결선 */}
        <div
          className={`flex flex-col items-center p-4 rounded-2xl w-full lg:w-1/3 max-w-[280px] transition-all duration-300 ${mode === "DeltaToY" ? "bg-white shadow-md border-2 border-green-400" : "bg-gray-100/50 border border-gray-200"}`}
        >
          <h4 className="text-lg font-bold text-green-600 mb-2">
            Δ (Delta) 결선
          </h4>
          <div className="relative w-36 h-36 mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
              <polygon
                points="50,15 15,85 85,85"
                fill="none"
                stroke={mode === "DeltaToY" ? "#22c55e" : "#9ca3af"}
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <rect
                x="20"
                y="40"
                width="16"
                height="20"
                fill="white"
                stroke={mode === "DeltaToY" ? "#22c55e" : "#9ca3af"}
                strokeWidth="2"
                transform="rotate(25 28 50)"
                rx="2"
              />
              <rect
                x="64"
                y="40"
                width="16"
                height="20"
                fill="white"
                stroke={mode === "DeltaToY" ? "#22c55e" : "#9ca3af"}
                strokeWidth="2"
                transform="rotate(-25 72 50)"
                rx="2"
              />
              <rect
                x="40"
                y="77"
                width="20"
                height="16"
                fill="white"
                stroke={mode === "DeltaToY" ? "#22c55e" : "#9ca3af"}
                strokeWidth="2"
                rx="2"
              />
            </svg>
            <span className="absolute top-1/2 left-0 -translate-y-1/2 bg-white border text-green-800 text-[10px] px-1 rounded font-bold">
              {deltaValues.rc || "Rc"}
            </span>
            <span className="absolute top-1/2 right-0 -translate-y-1/2 bg-white border text-green-800 text-[10px] px-1 rounded font-bold">
              {deltaValues.rb || "Rb"}
            </span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white border text-green-800 text-[10px] px-1 rounded font-bold">
              {deltaValues.ra || "Ra"}
            </span>
          </div>
          <div className="w-full space-y-2">
            <InputField
              label="Ra"
              name="ra"
              value={deltaValues.ra}
              onChange={handleDeltaChange}
              disabled={mode !== "DeltaToY"}
              color="green"
            />
            <InputField
              label="Rb"
              name="rb"
              value={deltaValues.rb}
              onChange={handleDeltaChange}
              disabled={mode !== "DeltaToY"}
              color="green"
            />
            <InputField
              label="Rc"
              name="rc"
              value={deltaValues.rc}
              onChange={handleDeltaChange}
              disabled={mode !== "DeltaToY"}
              color="green"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default YDeltaConverterWidget;
