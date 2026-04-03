import p5 from "p5";
import { useEffect, useRef, useState } from "react";

export default function InteractiveUnitCircle() {
  // p5 캔버스가 삽입될 DOM 영역
  const sketchRef = useRef(null);

  // UI에 표시할 React 상태
  const [angle, setAngle] = useState(30);

  // p5의 draw 루프 내부에서 최신 상태를 끊김 없이 읽기 위한 Ref
  const angleRef = useRef(30);

  // 슬라이더 조작 시 실행되는 함수
  const handleAngleChange = (e) => {
    const newAngle = Number(e.target.value);
    setAngle(newAngle);
    angleRef.current = newAngle; // p5가 참조하는 값도 동기화
  };

  useEffect(() => {
    // p5 인스턴스 모드 스케치 정의
    const sketch = (p) => {
      const R = 120; // 캔버스 내 단위 원의 반지름 크기(픽셀)

      p.setup = () => {
        // 400x400 크기의 캔버스 생성
        p.createCanvas(400, 400);
        p.angleMode(p.DEGREES); // 라디안 대신 익숙한 '도(Degree)' 사용
      };

      // 1초에 약 60번씩 반복 실행되며 화면을 그리는 함수
      p.draw = () => {
        p.background(255); // 배경 흰색으로 초기화
        p.translate(p.width / 2, p.height / 2); // 캔버스 중앙을 (0,0) 원점으로 설정

        // 1. x, y 좌표축 (십자가) 그리기
        p.stroke(220);
        p.strokeWeight(1);
        p.line(-p.width / 2, 0, p.width / 2, 0); // x축
        p.line(0, -p.height / 2, 0, p.height / 2); // y축

        // 2. 배경 단위 원 그리기
        p.noFill();
        p.stroke(200);
        p.strokeWeight(2);
        p.circle(0, 0, R * 2);

        // React의 최신 각도 값 가져오기
        const currentAngle = angleRef.current;

        // 3. 점 P(x, y) 좌표 계산
        // 주의: 웹 캔버스는 y축이 아래로 갈수록 +이므로 sin 값에 -를 붙여줍니다.
        const x = R * p.cos(currentAngle);
        const y = -R * p.sin(currentAngle);

        // 4. 삼각함수 시각화 선 그리기
        // 빗변 (검은색 계열)
        p.stroke(100);
        p.strokeWeight(2);
        p.line(0, 0, x, y);

        // 밑변 (코사인 - 파란색)
        p.stroke("#3b82f6"); // Tailwind blue-500
        p.strokeWeight(4);
        p.line(0, 0, x, 0);

        // 높이 (사인 - 빨간색)
        p.stroke("#ef4444"); // Tailwind red-500
        p.strokeWeight(4);
        p.line(x, 0, x, y);

        // 5. 점 P 렌더링
        p.fill("#0047a5"); // 메인 테마 색상
        p.noStroke();
        p.circle(x, y, 12);
      };
    };

    // p5 객체 생성 및 DOM에 부착
    const myP5 = new p5(sketch, sketchRef.current);

    // 컴포넌트가 화면에서 사라질 때 캔버스를 메모리에서 깔끔하게 삭제
    return () => {
      myP5.remove();
    };
  }, []); // 빈 배열: 컴포넌트 마운트 시 1번만 실행됨

  return (
    <div className="flex flex-col items-center bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-lg mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 font-headline tracking-tight">
        인터랙티브 삼각함수 탐험
      </h3>

      {/* p5.js 캔버스가 렌더링될 DOM 컨테이너 */}
      <div
        ref={sketchRef}
        className="rounded-xl overflow-hidden border-2 border-white shadow-md mb-8 bg-white"
      />

      {/* 사용자가 직접 조작하는 컨트롤 패널 */}
      <div className="w-full px-2">
        <div className="flex justify-between items-center mb-4 font-medium text-gray-700">
          <span className="text-lg">각도 (θ) 조절</span>
          <span className="text-[#0047a5] font-extrabold text-xl">
            {angle}°
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="360"
          value={angle}
          onChange={handleAngleChange}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0047a5] hover:accent-blue-800 transition-colors"
        />

        {/* 하단 실시간 결과값 표시 영역 */}
        <div className="flex justify-between mt-8 text-xl font-bold bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex flex-col items-center w-1/2 border-r border-gray-100">
            <span className="text-sm text-gray-400 mb-1 uppercase tracking-widest">
              높이
            </span>
            <span className="text-red-500">
              sin({angle}°) = {Math.sin((angle * Math.PI) / 180).toFixed(2)}
            </span>
          </div>
          <div className="flex flex-col items-center w-1/2">
            <span className="text-sm text-gray-400 mb-1 uppercase tracking-widest">
              밑변
            </span>
            <span className="text-blue-500">
              cos({angle}°) = {Math.cos((angle * Math.PI) / 180).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
