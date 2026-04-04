import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const CoulombsLawWidget = () => {
  const mountRef = useRef(null);
  const [q1, setQ1] = useState(5);
  const [q2, setQ2] = useState(-3);
  const [distance, setDistance] = useState(0.2);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene & Camera 초기화
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // 슬레이트 다크 배경

    // 💡 화면 전체(window)가 아닌, 부모 컨테이너(모달)의 크기를 가져옵니다.
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 8, 15); // 카메라 각도를 살짝 더 위로 조정하여 한눈에 보이게 함

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio); // 고해상도 모니터 대응
    mountRef.current.appendChild(renderer.domElement);

    // 2. 컨트롤러
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // 3. 🌟 조명(Lighting) 대폭 강화 (화사하고 선명하게) 🌟
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // 전체 밝기 증가
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0); // 강한 직사광선
    directionalLight.position.set(10, 20, 15);
    scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.8); // 뒷면 그림자 방지용
    backLight.position.set(-10, 10, -15);
    scene.add(backLight);

    // 4. 바닥 그리드
    const gridHelper = new THREE.GridHelper(20, 40, 0x3b82f6, 0x1e293b);
    gridHelper.material.opacity = 0.4;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // 5. 전하 구체 (크기와 질감 개선)
    const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);

    // MeshPhysicalMaterial을 사용하여 플라스틱/유리처럼 반짝이게 만듭니다.
    const mat1 = new THREE.MeshPhysicalMaterial({
      color: 0xff4444,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 1.0,
    });
    const sphere1 = new THREE.Mesh(sphereGeometry, mat1);
    scene.add(sphere1);

    const mat2 = new THREE.MeshPhysicalMaterial({
      color: 0x4488ff,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 1.0,
    });
    const sphere2 = new THREE.Mesh(sphereGeometry, mat2);
    scene.add(sphere2);

    // 6. 애니메이션 루프
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 7. 💡 ResizeObserver: 모달 창 크기가 변할 때마다 캔버스 크기를 정확히 다시 맞춤 (스크롤 방지)
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    });
    resizeObserver.observe(mountRef.current);

    // 메모리 저장
    mountRef.current.sceneObjects = { sphere1, sphere2, mat1, mat2 };

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // 🌟 React State 변경 시 오브젝트 업데이트
  useEffect(() => {
    if (!mountRef.current?.sceneObjects) return;
    const { sphere1, sphere2, mat1, mat2 } = mountRef.current.sceneObjects;

    const visualDist = distance * 12; // 시각적 거리를 약간 넓힘
    sphere1.position.set(-visualDist / 2, 1, 0);
    sphere2.position.set(visualDist / 2, 1, 0);

    // 전하량 0일 때 너무 작아지지 않게 기본 스케일 유지
    sphere1.scale.setScalar(0.6 + Math.abs(q1) * 0.08);
    sphere2.scale.setScalar(0.6 + Math.abs(q2) * 0.08);

    // 색상 쨍하게 업데이트 (빨강: 양전하, 파랑: 음전하, 회색: 0)
    mat1.color.setHex(q1 > 0 ? 0xff3333 : q1 < 0 ? 0x3377ff : 0x888888);
    mat2.color.setHex(q2 > 0 ? 0xff3333 : q2 < 0 ? 0x3377ff : 0x888888);
  }, [q1, q2, distance]);

  // 계산식
  const KE = 8.98755;
  const forceRaw = (KE * 0.001 * Math.abs(q1 * q2)) / Math.pow(distance, 2);
  const force = forceRaw.toFixed(3);

  return (
    // 💡 부모 태그에 고정 높이(h-[600px] 등)를 주어 모달 안에서 스크롤이 생기지 않도록 고정합니다.
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden bg-[#0f172a] shadow-inner font-sans border border-slate-800">
      {/* Three.js Canvas가 그려질 영역 */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* 왼쪽 위: 컨트롤 UI 패널 */}
      <div className="absolute top-4 left-4 w-[320px] bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-white/20 z-10 flex flex-col pointer-events-auto transition-transform">
        <h2 className="text-lg font-extrabold text-gray-800 mb-4 flex items-center gap-2">
          ⚡ 쿨롱의 법칙 시뮬레이터
        </h2>

        <div className="space-y-4">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <label className="flex justify-between text-xs font-bold text-gray-600 mb-2">
              <span>전하 1 (Q₁)</span>{" "}
              <span
                className={
                  q1 > 0
                    ? "text-red-600"
                    : q1 < 0
                      ? "text-blue-600"
                      : "text-gray-500"
                }
              >
                {q1} µC
              </span>
            </label>
            <input
              type="range"
              min="-10"
              max="10"
              value={q1}
              onChange={(e) => setQ1(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <label className="flex justify-between text-xs font-bold text-gray-600 mb-2">
              <span>전하 2 (Q₂)</span>{" "}
              <span
                className={
                  q2 > 0
                    ? "text-red-600"
                    : q2 < 0
                      ? "text-blue-600"
                      : "text-gray-500"
                }
              >
                {q2} µC
              </span>
            </label>
            <input
              type="range"
              min="-10"
              max="10"
              value={q2}
              onChange={(e) => setQ2(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <label className="flex justify-between text-xs font-bold text-gray-600 mb-2">
              <span>거리 (r)</span>{" "}
              <span className="text-emerald-600">{distance} m</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* 오른쪽 위: 결과 표시 패널 */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-2xl border border-white/20 z-10 pointer-events-auto min-w-[200px] text-center">
        <p className="text-xs text-gray-500 font-bold mb-1">전기력 크기 (F)</p>
        <div className="flex items-baseline justify-center gap-1 mb-2">
          <span className="text-3xl font-black text-gray-900">{force}</span>
          <span className="text-base font-bold text-gray-400">N</span>
        </div>
        <div
          className={`text-sm font-bold px-3 py-1.5 rounded-full ${q1 * q2 < 0 ? "bg-pink-100 text-pink-700" : q1 * q2 > 0 ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-500"}`}
        >
          {q1 * q2 < 0
            ? "인력 (당김)"
            : q1 * q2 > 0
              ? "척력 (밀어냄)"
              : "힘 없음"}
        </div>
      </div>

      {/* 하단 중앙: 조작 가이드 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white/90 px-6 py-2 rounded-full text-xs font-medium tracking-wide backdrop-blur-sm pointer-events-none">
        🖱️ 마우스 좌클릭: 회전 | 우클릭: 이동 | 스크롤: 줌
      </div>
    </div>
  );
};

export default CoulombsLawWidget;
