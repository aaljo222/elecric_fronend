import { useState } from "react";
import ThumbnailGrid from "./ThumbnailGrid";
import ImageViewer from "./ImageViewer";
import Highlight from "./Highlight";

const items = [
  { src: "/images/career/bislo.jpg", label: "비슬로제어팀장" },
  { src: "/images/career/mirae.jpg", label: "미래 특허기술" },
  { src: "/images/career/samsung.jpg", label: "삼성 전자 경력" },
  { src: "/images/career/강의이력.jpg", label: "강의 경력" },
  {
    src: "/images/career/스태포드머신러닝.jpg",
    label: "머신러닝",
    rotate: true,
    highlightText: "대중화되기 이전부터 머신러닝의 흐름을 읽고 미래 기술을 선제적으로 학습하여 신기술을 빠르게 실무에 적용해 왔습니다",
  },
  { src: "/images/career/실무경력.jpg", label: "실무 경력" },
];

export default function CareerPage() {
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-8">
      <Highlight accent>
        실제 실무 경력과 강의 이력, 관련 자료를 정리한 공간입니다.
        클릭하면 원본 이미지를 크게 확인할 수 있습니다.
      </Highlight>

      <ThumbnailGrid items={items} onOpen={setOpen} />

      {open && (
  <ImageViewer
    src={open.src}
    rotate={open.rotate}
    highlightText={open.highlightText}
    onClose={() => setOpen(null)}
  />
)}

    </div>
  );
}
