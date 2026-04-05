import { useState } from "react";
import Highlight from "./career/Highlight.jsx";
import ThumbnailGrid from "./career/ThumbnailGrid.jsx";
import ImageViewer from "./career/ImageViewer.jsx";

const CareerModal = ({ onClose }) => {
  const [viewer, setViewer] = useState(null);

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/70
                      flex items-center justify-center"
      >
        <div
          className="bg-white w-[1000px]
                        max-h-[90vh] rounded-2xl
                        overflow-y-auto shadow-2xl"
        >
          {/* 헤더 */}
          <div
            className="bg-gradient-to-r
                          from-indigo-600 to-blue-500
                          text-white p-8"
          >
            <h2 className="text-3xl font-bold">
              이재오 · Full-Stack 융합 전문가
            </h2>
            <p className="mt-2 text-indigo-100">
              Samsung Electronics · Electrical · Signal Processing ·
              Communication · AI
            </p>
          </div>

          {/* 본문 */}
          <div className="p-8 space-y-6">
            <Highlight>
              삼성전자 브라운관(VD) 사업부에서
              <b> 전기 설계 및 영상 신호처리</b>를 담당하며 아날로그·디지털 영상
              처리의 기초를 현업에서 다진 엔지니어 출신 개발자입니다.
            </Highlight>

            <Highlight>
              이후 임베디드 시스템, 펌웨어, 레이저 장비 제어, 데이터 처리 및
              AI까지
              <b> 수학 기반 공학 기술</b>을 중심으로 실무 경험을 확장해
              왔습니다.
            </Highlight>

            <Highlight accent>
              <b>2013년 머신러닝 과정 수료</b> — AI 대중화 이전부터
              데이터·알고리즘 기반 연구를 지속해 온
              <b> 드문 이력의 융합 전문가</b>입니다.
            </Highlight>
          </div>

          {/* 썸네일 */}
          <div className="px-8 pb-8">
            <ThumbnailGrid
              onOpen={setViewer}
              items={[
                { src: "/images/career/samsung.jpg", label: "삼성전자 R&D" },
                { src: "/images/career/mirae.jpg", label: "연구소·특허" },
                { src: "/images/career/bislo.jpg", label: "임베디드 실무" },
                { src: "/images/career/강의이력.jpg", label: "강의 이력" },
                {
                  src: "/images/career/스태포드머신러닝.jpg",
                  label: "2013 머신러닝 수료",
                  rotate: true,
                },
              ]}
            />
          </div>

          <div className="p-6 text-right">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded
                         bg-slate-800 text-white
                         hover:bg-slate-700"
            >
              닫기
            </button>
          </div>
        </div>
      </div>

      {viewer && <ImageViewer {...viewer} onClose={() => setViewer(null)} />}
    </>
  );
};

export default CareerModal;
