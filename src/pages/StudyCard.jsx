import React from "react";
// 🚨 애니메이션 컴포넌트 경로를 실제 파일 위치에 맞게 수정해주세요.
import RotatingCoil from "../components/animations/RotatingCoil";
import Motor3D from "../components/animations/Motor3D";

// 🚨 [추가됨] 이미지를 임포트합니다.
// image_0.png 파일을 src/assets/images/ 폴더에 넣었다고 가정합니다.
// 파일명과 경로가 다르다면 이 부분을 수정해주세요.
import dcMotorDiagram from "../assets/images/image_0.png";
import RotatingField3D from "../components/animations/RotatingField3D";

const StudyCardPage = () => {
  // 카드 데이터 배열
  const studyTopics = [
    {
      id: 1,
      title: "1. 유도 전동기의 회전 자기장 (Rotating Magnetic Field)",
      component: <RotatingField3D />,
      description:
        "3상 교류 전류가 고정자 권선에 흐를 때, 각 상의 위상차(120°)로 인해 고정자 내부에는 마치 자석이 회전하는 것과 같은 회전 자기장이 발생합니다. 이는 유도 전동기가 회전하는 근본 원리입니다.",
      // 🚨 [수정됨] images 배열의 구조를 { src, alt } 형태로 변경했습니다.
      // 현재는 모든 슬롯에 동일한 이미지를 사용하고 있습니다. 나중에 각 항목에 맞는 이미지로 교체해주세요.
      images: [
        { src: dcMotorDiagram, alt: "3상 교류 파형 다이어그램" },
        { src: dcMotorDiagram, alt: "고정자 단면도" },
        { src: dcMotorDiagram, alt: "벡터의 합성 원리" },
        { src: dcMotorDiagram, alt: "회전 자속의 흐름" },
      ],
    },
    {
      id: 2,
      title: "2. 직류기 원리 (플레밍의 왼손/오른손 법칙)",
      component: <RotatingCoil />,
      description:
        "자기장 내에 있는 도체가 움직이면 기전력이 유도(발전기, 오른손 법칙)되고, 전류가 흐르는 도체가 자기장 내에 있으면 힘을 받습니다(전동기, 왼손 법칙).",
      // 🚨 [수정됨]
      images: [
        { src: dcMotorDiagram, alt: "플레밍의 왼손 법칙 설명" },
        { src: dcMotorDiagram, alt: "플레밍의 오른손 법칙 설명" },
        { src: dcMotorDiagram, alt: "도체 내 전류 방향" },
        { src: dcMotorDiagram, alt: "자기장과 힘의 관계" },
      ],
    },
    {
      id: 3,
      title: "3. 직류 전동기 3D 구조 (DC Motor Structure)",
      component: <Motor3D />,
      description:
        "직류 전동기는 계자(자석), 전기자(회전 코일), 정류자, 브러시로 구성됩니다. 정류자는 코일이 회전함에 따라 전류의 방향을 주기적으로 바꿔주어 한 방향으로 계속 회전하게 합니다.",
      // 🚨 [수정됨]
      images: [
        { src: dcMotorDiagram, alt: "DC 모터 분해조립도" },
        { src: dcMotorDiagram, alt: "정류자와 브러시 접촉 상세" },
        { src: dcMotorDiagram, alt: "전기자 코일 권선 모습" },
        { src: dcMotorDiagram, alt: "계자 자속 분포도" },
      ],
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            ⚡ 전기기사 핵심 원리 시각화
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            어려운 물리적 현상을 애니메이션과 이미지로 직관적으로 이해해보세요.
          </p>
        </div>

        {/* 카드 리스트 렌더링 */}
        {studyTopics.map((topic) => (
          <div
            key={topic.id}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
          >
            {/* 카드 헤더 */}
            <div className="bg-blue-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">{topic.title}</h2>
            </div>

            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* 왼쪽: React Animation 영역 (50%) */}
                <div className="flex-1 flex flex-col">
                  <div className="flex-grow flex items-center justify-center bg-gray-100 rounded-xl p-4 min-h-[400px] border border-gray-200">
                    {/* 컴포넌트 렌더링 */}
                    {topic.component}
                  </div>
                  <p className="mt-2 text-center text-sm text-gray-500 font-medium">
                    [ Interactive Animation ]
                  </p>
                </div>

                {/* 오른쪽: 이미지 그리드 영역 (50%) */}
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-4 h-full min-h-[400px]">
                    {topic.images.map((img, idx) => (
                      // 🚨 [수정됨] 렌더링 로직 변경
                      <div
                        key={idx}
                        className="relative rounded-xl overflow-hidden shadow-sm border border-gray-200 group hover:shadow-md transition-shadow"
                      >
                        {/* 실제 이미지를 렌더링합니다. */}
                        <img
                          src={img.src}
                          alt={img.alt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 하단: 설명 텍스트 */}
              <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">{topic.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyCardPage;
