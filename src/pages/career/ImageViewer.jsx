import { useEffect, useState } from "react";

const ImageViewer = ({ src, rotate, highlightText, onClose }) => {
  const [zoom, setZoom] = useState(false);

  // ESC 키 닫기
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center"
      onClick={onClose} // 배경 클릭 → 닫기
    >
      <div
        className="flex gap-12 items-center"
        onClick={(e) => e.stopPropagation()} // 내부 보호
      >
        <img
          src={src}
          alt=""
          onClick={() => {
            if (zoom) onClose(); // 확대 상태면 닫기
            else setZoom(true); // 아니면 확대
          }}
          className={`
            transition-all duration-300 ease-in-out
            rounded shadow-2xl cursor-zoom-in
            ${
              zoom
                ? "max-h-[95vh] max-w-[95vw] scale-110 cursor-zoom-out"
                : "max-h-[80vh] max-w-[55vw] scale-110"
            }
            ${rotate ? "rotate-90" : ""}
          `}
        />

        {highlightText && !zoom && (
          <div className="max-w-md text-white">
            <p className="text-4xl font-extrabold leading-tight">
              {highlightText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageViewer;
