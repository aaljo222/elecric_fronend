import apiClient from "@/api/core/apiClient";
import WIDGET_MAP from "@/utils/widgetData";
import { X } from "lucide-react";
import { Suspense, useEffect, useState } from "react";

const DetailModal = ({ selectedVideo, onClose, onRead }) => {
  const [modalQuizData, setModalQuizData] = useState(null);

  useEffect(() => {
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

        <div className="p-6 overflow-y-auto flex-grow flex flex-col bg-gray-50/50">
          {ActiveWidgetComponent ? (
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-48 text-gray-400 font-bold">
                  위젯 로딩 중...
                </div>
              }
            >
              <div className="w-full">
                {selectedVideo.widgetType === "parabolaWidget" ? (
                  <ActiveWidgetComponent data={modalQuizData} />
                ) : (
                  <ActiveWidgetComponent />
                )}
              </div>
            </Suspense>
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
