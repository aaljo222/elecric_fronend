import { useNavigate } from "react-router-dom"; // 👈 라우터 이동을 위해 추가

// 💡 1. 그래프 노드 이름과 실제 강의 ID를 연결해주는 맵핑 객체 생성 (컴포넌트 밖이나 안에 작성)
const NODE_TO_LECTURE_MAP = {
  "옴의 법칙 (Ohm's Law)": "circuit_ohm_law_equivalent",
  "옴의 법칙": "circuit_ohm_law_equivalent",
  // 🔽 나중에 다른 노드들도 이렇게 추가하시면 됩니다.
  // "직·병렬 회로망": "circuit_resistance",
  // "Y-Δ 변환": "circuit_ydelta",
};

const MapPage = () => {
  // (현재 사이드 패널을 띄워주는 컴포넌트 이름)
  const navigate = useNavigate();
  // const [selectedNode, setSelectedNode] = useState(null); // (기존에 선택된 노드 상태)

  // 💡 2. '강의 보기' 버튼 클릭 시 실행할 함수
  const handleLectureClick = () => {
    if (!selectedNode) return;

    // 노드 이름을 기반으로 연결된 강의 ID를 찾습니다.
    const lectureId = NODE_TO_LECTURE_MAP[selectedNode.name];

    if (lectureId) {
      // 맵핑된 강의가 있으면 해당 상세 페이지로 쓩 이동!
      navigate(`/lectures/${lectureId}`);
    } else {
      // 맵핑된 강의가 없으면 알림 띄우기
      alert("아직 이 개념에 연결된 강의 영상이 준비되지 않았습니다.");
    }
  };

  return (
    <div>
      {/* ... 그래프 영역 (`FullMapGraph`) ... */}

      {/* 💡 3. 사이드 패널의 강의 보기 버튼에 onClick 이벤트 연결 */}
      {selectedNode && (
        <div className="side-panel">
          {/* ... 노드 제목, 공식 등등 ... */}

          <button
            onClick={handleLectureClick}
            className="bg-blue-600 text-white ..."
          >
            ▶ 강의 보기
          </button>
        </div>
      )}
    </div>
  );
};
