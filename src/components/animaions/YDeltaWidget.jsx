import { useState } from "react";

const YDeltaWidget = () => {
  // Y결선 상태 (R1, R2, R3)
  const [yValues, setYValues] = useState({ r1: "", r2: "", r3: "" });
  // 델타결선 상태 (Ra, Rb, Rc)
  const [deltaValues, setDeltaValues] = useState({ ra: "", rb: "", rc: "" });

  // Y -> 델타 변환 로직
  const convertYtoDelta = () => {
    const r1 = parseFloat(yValues.r1);
    const r2 = parseFloat(yValues.r2);
    const r3 = parseFloat(yValues.r3);

    if (r1 && r2 && r3) {
      const sumProduct = r1 * r2 + r2 * r3 + r3 * r1;
      setDeltaValues({
        ra: (sumProduct / r1).toFixed(2),
        rb: (sumProduct / r2).toFixed(2),
        rc: (sumProduct / r3).toFixed(2),
      });
    } else {
      alert("Y결선의 모든 저항값을 입력해주세요.");
    }
  };

  // 델타 -> Y 변환 로직
  const convertDeltaToY = () => {
    const ra = parseFloat(deltaValues.ra);
    const rb = parseFloat(deltaValues.rb);
    const rc = parseFloat(deltaValues.rc);

    if (ra && rb && rc) {
      const sum = ra + rb + rc;
      setYValues({
        r1: ((rb * rc) / sum).toFixed(2),
        r2: ((rc * ra) / sum).toFixed(2),
        r3: ((ra * rb) / sum).toFixed(2),
      });
    } else {
      alert("델타결선의 모든 저항값을 입력해주세요.");
    }
  };

  const handleYChange = (e) =>
    setYValues({ ...yValues, [e.target.name]: e.target.value });
  const handleDeltaChange = (e) =>
    setDeltaValues({ ...deltaValues, [e.target.name]: e.target.value });

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Y-Δ 결선 변환기
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Y결선 입력부 */}
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold text-blue-600">Y (Wye) 결선</h3>
          <div className="flex flex-col space-y-2">
            <label className="flex items-center justify-between">
              <span>R1 (Ω):</span>
              <input
                type="number"
                name="r1"
                value={yValues.r1}
                onChange={handleYChange}
                className="border p-1 w-24 rounded"
              />
            </label>
            <label className="flex items-center justify-between">
              <span>R2 (Ω):</span>
              <input
                type="number"
                name="r2"
                value={yValues.r2}
                onChange={handleYChange}
                className="border p-1 w-24 rounded"
              />
            </label>
            <label className="flex items-center justify-between">
              <span>R3 (Ω):</span>
              <input
                type="number"
                name="r3"
                value={yValues.r3}
                onChange={handleYChange}
                className="border p-1 w-24 rounded"
              />
            </label>
          </div>
          <button
            onClick={convertYtoDelta}
            className="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Y → Δ 변환하기
          </button>
        </div>

        {/* 델타결선 입력부 */}
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold text-green-600">
            Δ (Delta) 결선
          </h3>
          <div className="flex flex-col space-y-2">
            <label className="flex items-center justify-between">
              <span>Ra (Ω):</span>
              <input
                type="number"
                name="ra"
                value={deltaValues.ra}
                onChange={handleDeltaChange}
                className="border p-1 w-24 rounded"
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Rb (Ω):</span>
              <input
                type="number"
                name="rb"
                value={deltaValues.rb}
                onChange={handleDeltaChange}
                className="border p-1 w-24 rounded"
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Rc (Ω):</span>
              <input
                type="number"
                name="rc"
                value={deltaValues.rc}
                onChange={handleDeltaChange}
                className="border p-1 w-24 rounded"
              />
            </label>
          </div>
          <button
            onClick={convertDeltaToY}
            className="w-full mt-4 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
          >
            Δ → Y 변환하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default YDeltaWidget;
