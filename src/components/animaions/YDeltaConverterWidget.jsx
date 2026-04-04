import { ArrowRightLeft, Zap } from "lucide-react";
import { useState } from "react";

const YDeltaConverterWidget = () => {
  const [mode, setMode] = useState("YtoDelta"); // 'YtoDelta' or 'DeltaToY'

  // Y결선 상태 (R1, R2, R3)
  const [yValues, setYValues] = useState({ r1: "", r2: "", r3: "" });
  // 델타결선 상태 (Ra, Rb, Rc)
  const [deltaValues, setDeltaValues] = useState({ ra: "", rb: "", rc: "" });

  // 값 변경 핸들러 및 자동 계산 로직
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
    <div className="w-full h-full flex flex-col bg-white rounded-xl shadow-inner border border-gray-100 overflow-hidden">
      {/* 위젯 헤더 */}
      <div className="bg-[#0047a5] text-white p-6 flex justify-between items-center shrink-0">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="text-yellow-400" fill="currentColor" />
            Y-Δ 등가 변환 시뮬레이터
          </h3>
          <p className="text-blue-200 mt-1">
            저항값을 입력하면 반대 결선의 값이 회로도와 함께 실시간으로
            계산됩니다.
          </p>
        </div>

        {/* 모드 전환 토글 */}
        <div className="flex bg-[#003882] rounded-lg p-1">
          <button
            onClick={() => {
              setMode("YtoDelta");
              setYValues({ r1: "", r2: "", r3: "" });
              setDeltaValues({ ra: "", rb: "", rc: "" });
            }}
            className={`px-4 py-2 rounded-md font-bold transition-all ${mode === "YtoDelta" ? "bg-white text-[#0047a5] shadow" : "text-white hover:bg-[#002f6c]"}`}
          >
            Y → Δ 변환
          </button>
          <button
            onClick={() => {
              setMode("DeltaToY");
              setYValues({ r1: "", r2: "", r3: "" });
              setDeltaValues({ ra: "", rb: "", rc: "" });
            }}
            className={`px-4 py-2 rounded-md font-bold transition-all ${mode === "DeltaToY" ? "bg-white text-[#0047a5] shadow" : "text-white hover:bg-[#002f6c]"}`}
          >
            Δ → Y 변환
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex flex-col lg:flex-row flex-grow p-6 gap-8 items-center justify-center bg-gray-50/50">
        {/* Y 결선 영역 */}
        <div
          className={`flex flex-col items-center p-6 rounded-2xl w-full max-w-sm transition-all duration-300 ${mode === "YtoDelta" ? "bg-white shadow-lg border-2 border-blue-400" : "bg-gray-100 opacity-80"}`}
        >
          <h4 className="text-xl font-bold text-blue-600 mb-4">Y (Wye) 결선</h4>

          {/* Y결선 SVG 시각화 */}
          <div className="relative w-48 h-48 mb-6">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
              <path
                d="M50 50 L50 10 M50 50 L15 85 M50 50 L85 85"
                stroke="#3b82f6"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="50" cy="50" r="4" fill="#1e3a8a" />
              {/* 저항 박스 */}
              <rect
                x="42"
                y="15"
                width="16"
                height="20"
                fill="white"
                stroke="#3b82f6"
                strokeWidth="2"
                rx="2"
              />
              <rect
                x="20"
                y="60"
                width="20"
                height="16"
                fill="white"
                stroke="#3b82f6"
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
                stroke="#3b82f6"
                strokeWidth="2"
                transform="rotate(45 70 68)"
                rx="2"
              />
            </svg>
            <span className="absolute top-2 left-1/2 -translate-x-1/2 bg-blue-100 text-blue-800 text-xs px-1 rounded font-bold">
              {yValues.r1 || "R1"}Ω
            </span>
            <span className="absolute bottom-6 left-2 bg-blue-100 text-blue-800 text-xs px-1 rounded font-bold">
              {yValues.r2 || "R2"}Ω
            </span>
            <span className="absolute bottom-6 right-2 bg-blue-100 text-blue-800 text-xs px-1 rounded font-bold">
              {yValues.r3 || "R3"}Ω
            </span>
          </div>

          <div className="w-full space-y-3">
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

        {/* 중앙 화살표 */}
        <div className="flex flex-col items-center justify-center text-gray-400">
          <ArrowRightLeft
            size={48}
            className={`transition-transform duration-500 ${mode === "DeltaToY" ? "rotate-180 text-green-500" : "text-blue-500"}`}
          />
          <span className="mt-2 font-bold text-sm bg-gray-200 px-3 py-1 rounded-full text-gray-600">
            {mode === "YtoDelta" ? "자동 계산 중" : "자동 계산 중"}
          </span>
        </div>

        {/* 델타 결선 영역 */}
        <div
          className={`flex flex-col items-center p-6 rounded-2xl w-full max-w-sm transition-all duration-300 ${mode === "DeltaToY" ? "bg-white shadow-lg border-2 border-green-400" : "bg-gray-100 opacity-80"}`}
        >
          <h4 className="text-xl font-bold text-green-600 mb-4">
            Δ (Delta) 결선
          </h4>

          {/* 델타결선 SVG 시각화 */}
          <div className="relative w-48 h-48 mb-6">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
              <polygon
                points="50,15 15,85 85,85"
                fill="none"
                stroke="#22c55e"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              {/* 저항 박스 */}
              <rect
                x="20"
                y="40"
                width="16"
                height="20"
                fill="white"
                stroke="#22c55e"
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
                stroke="#22c55e"
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
                stroke="#22c55e"
                strokeWidth="2"
                rx="2"
              />
            </svg>
            <span className="absolute top-1/2 left-0 -translate-y-1/2 bg-green-100 text-green-800 text-xs px-1 rounded font-bold">
              {deltaValues.rc || "Rc"}Ω
            </span>
            <span className="absolute top-1/2 right-0 -translate-y-1/2 bg-green-100 text-green-800 text-xs px-1 rounded font-bold">
              {deltaValues.rb || "Rb"}Ω
            </span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-green-100 text-green-800 text-xs px-1 rounded font-bold">
              {deltaValues.ra || "Ra"}Ω
            </span>
          </div>

          <div className="w-full space-y-3">
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

// 재사용 가능한 입력 필드 컴포넌트
const InputField = ({ label, name, value, onChange, disabled, color }) => {
  const isBlue = color === "blue";
  return (
    <div className="flex items-center justify-between bg-white px-4 py-2 rounded-lg border shadow-sm">
      <span
        className={`font-bold w-8 ${isBlue ? "text-blue-600" : "text-green-600"}`}
      >
        {label}
      </span>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder="0.00"
        className={`w-24 text-right outline-none font-mono text-lg bg-transparent ${disabled ? "text-gray-400 font-bold" : "text-gray-900 border-b-2 border-gray-200 focus:border-blue-500"}`}
      />
      <span className="text-gray-400 ml-2">Ω</span>
    </div>
  );
};

export default YDeltaConverterWidget;
