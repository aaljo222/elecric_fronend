import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
// import root from "./router/root";
import root from "@/router/root";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [hideForever, setHideForever] = useState(false);

  useEffect(() => {
    const isHidden = localStorage.getItem("hideNotice");
    if (!isHidden) {
      setShowModal(true);
    }
  }, []);

  const handleClose = () => {
    if (hideForever) {
      localStorage.setItem("hideNotice", "true");
    }
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            {/* 화려한 헤더 부분 */}
            <div style={styles.header}>
              <h2 style={styles.headerTitle}>🚀 CEO 개발 노트 🚀</h2>
            </div>

            {/* 본문 내용 */}
            <div style={styles.body}>
              <p style={styles.text}>
                본 플랫폼은{" "}
                <strong>
                  AI 에이전트가 자동으로 뚝딱 만들어낸 사이트가 아닙니다.
                </strong>
              </p>
              <p style={styles.text}>
                AI는 잦은 환각(Hallucination)과 치명적인 오류를 발생시킵니다.
                이를 바로잡고 완벽한 시스템을 구현하기 위해,{" "}
                <strong>
                  개발자가 직접 아키텍처를 설계하고 전문적인 도메인 지식으로
                  오류를 검증하며 한 땀 한 땀 코드를 작성
                </strong>
                했습니다.
              </p>

              {/* 눈에 확 띄는 비용 강조 박스 */}
              <div style={styles.highlightBox}>
                <div style={styles.highlightText}>
                  💡 추가 API 토큰 비용 :{" "}
                  <span style={{ color: "#d32f2f", fontSize: "28px" }}>
                    0원
                  </span>
                </div>
                <div style={styles.highlightText}>
                  💡 소요 비용 : 오직 AI 구독료{" "}
                  <span style={{ color: "#1976d2", fontSize: "28px" }}>
                    월 3만 원
                  </span>
                </div>
              </div>

              <p
                style={{
                  ...styles.text,
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "#2c3e50",
                }}
              >
                인간의 압도적인 전문성과 AI의 효율성이 결합된
                <br />
                최고의 서비스를 경험해 보시기 바랍니다.
              </p>
            </div>

            {/* 하단 푸터 (다시 보지 않기 & 버튼) */}
            <div style={styles.footer}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={hideForever}
                  onChange={(e) => setHideForever(e.target.checked)}
                  style={{
                    marginRight: "10px",
                    width: "18px",
                    height: "18px",
                    cursor: "pointer",
                  }}
                />
                다시 보지 않기
              </label>
              <button onClick={handleClose} style={styles.button}>
                확인하고 입장하기
              </button>
            </div>
          </div>
        </div>
      )}

      <RouterProvider router={root} />
    </>
  );
}

// 화려하고 큼직하게 업그레이드된 스타일
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // 배경을 좀 더 어둡게
    backdropFilter: "blur(5px)", // 배경 화면을 흐리게 만들어서 팝업에 집중 (최신 트렌드)
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: "16px",
    width: "90%",
    maxWidth: "800px", // 기존 500px에서 800px로 대폭 확대
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", // 더 깊고 화려한 그림자
    fontFamily: "'Pretendard', 'Malgun Gothic', sans-serif",
    overflow: "hidden", // 헤더 둥근 모서리 적용을 위해
  },
  header: {
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", // 고급스러운 네이비 블루 그라데이션
    padding: "25px",
    textAlign: "center",
  },
  headerTitle: {
    margin: 0,
    color: "white",
    fontSize: "32px", // 제목 크기 대폭 확대
    fontWeight: "900",
    letterSpacing: "2px",
  },
  body: {
    padding: "40px", // 여백 확대
  },
  text: {
    fontSize: "20px", // 본문 글씨 크기 확대
    lineHeight: "1.8",
    color: "#334155",
    wordBreak: "keep-all",
    marginBottom: "15px",
  },
  highlightBox: {
    background: "linear-gradient(to right, #fff8e1, #ffecb3)", // 눈에 확 띄는 은은한 금빛 그라데이션
    padding: "30px",
    borderRadius: "12px",
    margin: "35px 0",
    borderLeft: "8px solid #ffc107", // 강렬한 노란색 포인트 선
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  },
  highlightText: {
    fontSize: "24px", // 강조 글씨 확대
    fontWeight: "bold",
    color: "#424242",
    margin: "12px 0",
    letterSpacing: "-0.5px",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    backgroundColor: "#f8fafc",
    borderTop: "1px solid #e2e8f0",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "18px", // 체크박스 글씨 확대
    color: "#64748b",
    fontWeight: "500",
  },
  button: {
    background: "linear-gradient(135deg, #11998e, #38ef7d)", // 클릭을 유도하는 화려한 민트/그린 그라데이션 (사이트 톤앤매너와 어울림)
    color: "white",
    border: "none",
    padding: "15px 35px",
    fontSize: "20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 4px 15px rgba(56, 239, 125, 0.4)", // 버튼에도 빛나는 그림자 효과
    transition: "all 0.3s ease",
  },
};

export default App;
