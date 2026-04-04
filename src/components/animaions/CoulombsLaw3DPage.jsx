import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function CoulombsLaw3DPage() {
  const mountRef = useRef(null);
  const [q1, setQ1] = useState(5);
  const [q2, setQ2] = useState(-3);
  const [distance, setDistance] = useState(0.2);

  useEffect(() => {
    // 1. Scene, Camera, Renderer 초기화
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // 슬레이트 다크 배경

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 5, 10); // 카메라를 살짝 위에서 비스듬히 내려다보게 설정

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // 2. 컨트롤러 (마우스 회전, 줌)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 3. 조명 세팅
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // 4. 바닥 그리드 헬퍼 (공간감 부여)
    const gridHelper = new THREE.GridHelper(10, 20, 0x334155, 0x1e293b);
    scene.add(gridHelper);

    // 5. 전하 구체 (Sphere) 메쉬 생성
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);

    const mat1 = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.2,
    }); // Red
    const sphere1 = new THREE.Mesh(sphereGeometry, mat1);
    scene.add(sphere1);

    const mat2 = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      roughness: 0.2,
    }); // Blue
    const sphere2 = new THREE.Mesh(sphereGeometry, mat2);
    scene.add(sphere2);

    // 6. 애니메이션 루프
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update(); // OrbitControls 부드럽게
      renderer.render(scene, camera);
    };
    animate();

    // 7. 리사이즈 대응
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // 메모리에 저장해두고 외부에서 접근할 수 있도록 세팅
    mountRef.current.sceneObjects = { sphere1, sphere2, mat1, mat2 };

    return () => {
      // 컴포넌트 언마운트 시 클린업
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // 🌟 React State 변경 시 Three.js 오브젝트 업데이트
  useEffect(() => {
    if (!mountRef.current?.sceneObjects) return;
    const { sphere1, sphere2, mat1, mat2 } = mountRef.current.sceneObjects;

    // 1. 거리에 따른 위치 업데이트 (X축 기준으로 배치)
    // 시각적 연출을 위해 distance(0.1~1.0)에 상수를 곱해 넓게 띄웁니다.
    const visualDist = distance * 10;
    sphere1.position.set(-visualDist / 2, 0.5, 0);
    sphere2.position.set(visualDist / 2, 0.5, 0);

    // 2. 전하량에 따른 구체 크기 업데이트
    sphere1.scale.setScalar(0.5 + Math.abs(q1) * 0.1);
    sphere2.scale.setScalar(0.5 + Math.abs(q2) * 0.1);

    // 3. 전하 부호에 따른 색상 업데이트
    mat1.color.setHex(q1 > 0 ? 0xef4444 : q1 < 0 ? 0x3b82f6 : 0x94a3b8);
    mat2.color.setHex(q2 > 0 ? 0xef4444 : q2 < 0 ? 0x3b82f6 : 0x94a3b8);
  }, [q1, q2, distance]);

  // 계산식
  const KE = 8.98755;
  const forceRaw = (KE * 0.001 * Math.abs(q1 * q2)) / Math.pow(distance, 2);
  const force = forceRaw.toFixed(3);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Three.js Canvas 마운트 영역 */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* HTML UI 오버레이 (좌측 상단 컨트롤 패널) */}
      <div className="absolute top-6 left-6 w-80 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20">
        <h1 className="text-xl font-bold text-gray-800 mb-6">
          ⚡ 3D 쿨롱의 법칙
        </h1>

        <div className="space-y-4">
          <div>
            <label className="flex justify-between text-sm font-bold text-gray-600 mb-1">
              <span>전하 1 (Q₁)</span> <span>{q1} µC</span>
            </label>
            <input
              type="range"
              min="-10"
              max="10"
              value={q1}
              onChange={(e) => setQ1(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="flex justify-between text-sm font-bold text-gray-600 mb-1">
              <span>전하 2 (Q₂)</span> <span>{q2} µC</span>
            </label>
            <input
              type="range"
              min="-10"
              max="10"
              value={q2}
              onChange={(e) => setQ2(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="flex justify-between text-sm font-bold text-gray-600 mb-1">
              <span>거리 (r)</span> <span>{distance} m</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-1">전기력 크기 (F)</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-gray-900">{force}</span>
            <span className="text-lg font-bold text-gray-500">N</span>
          </div>
          <p className="mt-2 text-sm font-bold">
            {q1 * q2 < 0 ? (
              <span className="text-pink-600">인력 (당김)</span>
            ) : q1 * q2 > 0 ? (
              <span className="text-purple-600">척력 (밀어냄)</span>
            ) : (
              <span className="text-gray-400">힘 없음</span>
            )}
          </p>
        </div>
      </div>

      {/* 화면 조작 가이드 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white px-6 py-2 rounded-full text-sm backdrop-blur-sm pointer-events-none">
        마우스 좌클릭: 회전 / 우클릭: 이동 / 스크롤: 줌
      </div>
    </div>
  );
}
