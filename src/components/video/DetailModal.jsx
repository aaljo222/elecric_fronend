import apiClient from "@/api/core/apiClient";
import { X } from "lucide-react"; // 🌟 X 아이콘 에러 해결!
import { useEffect, useState } from "react"; // 🌟 useState, useEffect 에러 해결!

// 💡 3D 위젯들 Import (경로가 ../animations 인지 ../animaions 인지 꼭 실제 폴더명과 확인하세요!)
import AmpereLawWidget from "../animaions/AmpereLawWidget";
import CoulombsLaw3DPage from "../animaions/CoulombsLaw3DPage";
import DcRectificationWidget from "../animaions/DcRectificationWidget";
import Equipotential3DWidget from "../animaions/Equipotential3DWidget";
import FlemingLeftHandWidget from "../animaions/FlemingLeftHandWidget";
import InteractiveUnitCircle from "../animaions/InteractiveUnitCircle";
import ParabolarIntersection from "../animaions/ParabolaIntersection";
import ParallelResistanceWidget from "../animaions/ParallelResistanceWidget";
import RotatingMagneticFieldWidget from "../animaions/RotatingMagneticFieldWidget";
import YDeltaConverterWidget from "../animaions/YDeltaConverterWidget";

// 위젯 매핑 (DB의 widgetType과 일치해야 함)
const WIDGET_MAP = {
  trig_circle: InteractiveUnitCircle,
  ohms_law: ParallelResistanceWidget,
  y_delta_converter: YDeltaConverterWidget,
  coulombs_law: CoulombsLaw3DPage,
  fleming_left: FlemingLeftHandWidget,
  rotating_field: RotatingMagneticFieldWidget,
  dc_rectifier: DcRectificationWidget,
  equipotential: Equipotential3DWidget,
  ampere_law: AmpereLawWidget,
  parabolaWidget: ParabolarIntersection, // 8강 포물선 위젯 키값 매핑
};

const DetailModal = ({ selectedVideo, onClose, onRead }) => {
  // 모달 내부에서 위젯(퀴즈) 데이터를 불러오기 위한 상태
  const [modalQuizData, setModalQuizData] = useState(null);

  useEffect(() => {
    // 위젯 타입이 parabolaWidget일 때만 백엔드 데이터 실시간 패칭
    if (selectedVideo?.widgetType === "parabolaWidget") {
      apiClient
        .get(`/api/math/random?type=${selectedVideo.id}`)
        .then((res) => setModalQuizData(res.data))
        .catch((err) => console.error("모달 위젯 데이터 로딩 실패:", err));
    }
  }, [selectedVideo]);

  if (!selectedVideo) return null;

  const ActiveWidgetComponent = selectedVideo.widgetType
    ? WIDGET_MAP[selectedVideo.widgetType]
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 영역 */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-start shrink-0">
          <div>
            <div className="bg-[#e5edff] text-[#0047a5] px-3 py-1 rounded text-xs font-bold uppercase tracking-widest mb-2 inline-block">
              {ActiveWidgetComponent ? "인터랙티브 실습" : "강의 상세 안내"}
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
              {selectedVideo.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors p-2"
          >
            <X size={28} />
          </button>
        </div>

        {/* 모달 본문 영역 (위젯 or 상세설명) */}
        <div className="p-6 overflow-y-auto flex-grow flex flex-col bg-gray-50/50">
          {ActiveWidgetComponent ? (
            <div className="w-full">
              {/* 위젯에 백엔드에서 받아온 데이터(data props) 전달 */}
              {selectedVideo.widgetType === "parabolaWidget" ? (
                <ActiveWidgetComponent data={modalQuizData} />
              ) : (
                <ActiveWidgetComponent />
              )}
            </div>
          ) : (
            <div className="flex-1 space-y-8 max-w-4xl mx-auto">
              <p className="text-xl text-gray-600 leading-relaxed font-medium">
                {selectedVideo.description}
              </p>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="text-base font-bold text-[#0047a5] uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                  강의 정보
                </h4>
                <div className="space-y-4 text-lg">
                  <div className="flex justify-between">
                    <span className="text-gray-500">카테고리</span>
                    <span className="font-bold text-gray-900">
                      {selectedVideo.category || "미분류"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">과목명</span>
                    <span className="font-bold text-gray-900">
                      {selectedVideo.subject || "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 모달 하단 버튼 영역 */}
        <div className="p-6 bg-white shrink-0 rounded-b-2xl border-t border-gray-100">
          <button
            onClick={() => {
              onClose();
              onRead(selectedVideo.id);
            }}
            className="w-full py-4 bg-[#0047a5] text-white text-xl font-extrabold rounded-xl shadow-lg hover:bg-blue-800 transition-colors"
          >
            지금 바로 학습 시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
