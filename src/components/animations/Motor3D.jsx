import { motion } from "framer-motion";

const Motor3D = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border shadow-sm w-full h-full min-h-[400px]">
      <h3 className="text-lg font-bold text-gray-800 mb-2">
        ⚡ 직류 전동기 (DC Motor)
      </h3>
      <p className="text-sm text-gray-500 mb-8 text-center">
        플레밍의 왼손 법칙:{" "}
        <span className="text-blue-600 font-bold">시계 방향(Right)</span> 회전
      </p>

      {/* 3D Scene Container */}
      <div
        className="relative w-full max-w-[400px] aspect-square bg-gray-50 rounded-lg overflow-visible flex items-center justify-center"
        style={{ perspective: "1000px" }} // 원근감
      >
        {/* 전체 뷰 각도 조정 (Isometric View) */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            transform: "rotateX(10deg) rotateY(0deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* 1. 자석 (N극 - Left) */}
          <div
            className="absolute left-4 w-24 h-48 bg-red-600 rounded-l-lg shadow-2xl flex items-center justify-center z-10"
            style={{
              background: "linear-gradient(135deg, #ef4444 0%, #991b1b 100%)",
              transform: "translateZ(-20px)",
              boxShadow: "5px 5px 15px rgba(0,0,0,0.3)",
            }}
          >
            <span className="text-white font-black text-5xl drop-shadow-md mr-4">
              N
            </span>
            {/* 자속선 (화살표) */}
            <div className="absolute -right-12 top-1/2 w-12 h-1 bg-red-300 opacity-50"></div>
          </div>

          {/* 2. 자석 (S극 - Right) */}
          <div
            className="absolute right-4 w-24 h-48 bg-blue-700 rounded-r-lg shadow-2xl flex items-center justify-center z-10"
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)",
              transform: "translateZ(-20px)",
              boxShadow: "-5px 5px 15px rgba(0,0,0,0.3)",
            }}
          >
            <span className="text-white font-black text-5xl drop-shadow-md ml-4">
              S
            </span>
            {/* 자속선 (화살표) */}
            <div className="absolute -left-12 top-1/2 w-12 h-1 bg-blue-300 opacity-50"></div>
          </div>

          {/* 3. 회전체 (Armature) - 시계방향(Z축) 회전 */}
          <motion.div
            className="relative w-56 h-12 z-20 flex items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateZ: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* 코일 프레임 (입체감) */}
            <div
              className="absolute w-full h-40 border-[8px] border-yellow-500 rounded-sm"
              style={{
                transform: "rotateX(90deg)",
                background: "rgba(234, 179, 8, 0.15)",
                boxShadow: "0 0 20px rgba(234, 179, 8, 0.6)",
              }}
            >
              <div className="absolute top-0 left-1/2 w-0.5 h-full bg-yellow-600 opacity-50"></div>
            </div>

            {/* 회전축 (Shaft) */}
            <div
              className="absolute w-80 h-3 bg-gray-800 rounded-full"
              style={{ transform: "rotateY(0deg)" }}
            ></div>

            {/* 힘의 방향 (Force Vectors) */}
            <div className="absolute right-0 -top-16 text-2xl font-bold text-blue-600 animate-bounce">
              F↑
            </div>
            <div className="absolute left-0 -bottom-16 text-2xl font-bold text-blue-600 animate-bounce">
              F↓
            </div>
          </motion.div>

          {/* 4. 정류자 및 브러시 */}
          <div
            className="absolute z-30 flex items-center justify-center"
            style={{ transform: "translateZ(60px)" }}
          >
            <motion.div
              className="w-16 h-16 rounded-full border-[8px] border-yellow-500 border-t-transparent border-b-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            {/* 브러시 */}
            <div className="absolute -left-3 w-4 h-8 bg-gray-800 rounded-sm"></div>
            <div className="absolute -right-3 w-4 h-8 bg-gray-800 rounded-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Motor3D;
