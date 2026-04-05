import {
  AlertCircle,
  Loader2,
  Mic,
  MicOff,
  Square,
  Volume2,
} from "lucide-react";
import { useEffect, useState } from "react";
import apiClient from "../../api/apiClient"; // ✅ 경로 확인해주세요 (src/api/apiClient.js)

const VoiceGraphChat = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // API 통신 중
  const [isSpeaking, setIsSpeaking] = useState(false); // TTS 말하는 중

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 브라우저 음성 인식 객체 (재렌더링 방지를 위해 useRef 사용 가능하지만, 간단히 변수로 처리)
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  // 컴포넌트 언마운트 시 말하기 중단
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // 1. 녹음 시작 (STT)
  const startListening = () => {
    setErrorMsg("");
    if (!SpeechRecognition) {
      alert(
        "죄송합니다. 이 브라우저는 음성 인식을 지원하지 않습니다. (Chrome 권장)",
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ko-KR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(transcript);
      console.log("🗣️ 인식된 질문:", transcript);

      // 인식이 끝나면 바로 API 호출
      handleGraphQuery(transcript);
    };

    recognition.onerror = (event) => {
      console.error("음성 인식 에러:", event.error);
      setIsListening(false);
      setErrorMsg("음성을 인식하지 못했습니다. 다시 시도해주세요.");
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  // 2. 백엔드 통신 (apiClient 활용)
  const handleGraphQuery = async (text) => {
    setIsProcessing(true);
    setAnswer(""); // 이전 답변 초기화

    try {
      // ✅ apiClient를 쓰면 헤더(토큰) 설정 불필요 + BaseURL 자동 적용
      // 백엔드 라우터 경로: /api/graph-chat/query
      const response = await apiClient.post("/api/graph-chat/query", {
        question: text,
      });

      const aiAnswer = response.data.answer;
      setAnswer(aiAnswer);
      setVideoUrl(response.data.video_url || ""); // 백엔드에서 받은 URL 저장
      setManimCode(response.data.manim_code || "");

      speakText(aiAnswer);
    } catch (err) {
      console.error("API Error:", err);
      setErrorMsg("서버와 연결하는 중 문제가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. 음성 합성 (TTS) - 브라우저 내장
  const speakText = (text) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // 기존 대화 중단

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>⚡ 전기기사 AI 음성 튜터</h2>

      {/* 상태 메시지 및 에러 */}
      <div style={styles.statusArea}>
        {errorMsg && (
          <p style={styles.errorText}>
            <AlertCircle size={16} /> {errorMsg}
          </p>
        )}
        {isListening && <p style={styles.listeningText}>듣고 있습니다... 👂</p>}
        {isProcessing && (
          <p style={styles.processingText}>
            <Loader2 size={16} style={styles.spin} /> 지식 그래프 검색 중...
          </p>
        )}
      </div>

      {/* 질문 표시 영역 */}
      <div style={styles.chatBox}>
        <span style={styles.label}>내 질문:</span>
        <p style={styles.text}>{question || "마이크를 누르고 질문해보세요."}</p>
      </div>

      {/* 메인 컨트롤 버튼 */}
      <div style={styles.controls}>
        <button
          onClick={
            isListening ? () => window.location.reload() : startListening
          } // 듣는 중 누르면 취소(새로고침 효과) 또는 stop 구현
          style={{
            ...styles.micButton,
            backgroundColor: isListening ? "#ef4444" : "#3b82f6",
            transform: isListening ? "scale(1.05)" : "scale(1)",
            boxShadow: isListening
              ? "0 0 15px rgba(239, 68, 68, 0.5)"
              : "0 4px 6px rgba(0,0,0,0.1)",
          }}
          disabled={isProcessing} // 처리 중엔 버튼 비활성화
        >
          {isListening ? (
            <MicOff size={32} color="white" />
          ) : (
            <Mic size={32} color="white" />
          )}
        </button>
        <p style={styles.micLabel}>
          {isListening ? "중지하려면 클릭" : "터치하여 말하기"}
        </p>
      </div>

      {/* 답변 표시 영역 */}
      {answer && (
        <div
          style={{
            ...styles.chatBox,
            backgroundColor: "#f0f9ff",
            border: "1px solid #bae6fd",
          }}
        >
          <div style={styles.header}>
            <span style={styles.label}>AI 답변:</span>
            {isSpeaking ? (
              <button onClick={stopSpeaking} style={styles.iconBtn}>
                <Square size={18} fill="currentColor" /> 멈춤
              </button>
            ) : (
              <button onClick={() => speakText(answer)} style={styles.iconBtn}>
                <Volume2 size={18} /> 다시 듣기
              </button>
            )}
          </div>
          {/* 답변 표시 영역 */}
          {answer && (
            <div
              style={{
                ...styles.chatBox,
                backgroundColor: "#f0f9ff",
                border: "1px solid #bae6fd",
              }}
            >
              {/* ... 헤더 및 답변 텍스트 ... */}
              <p style={styles.answerText}>{answer}</p>

              {/* 비디오가 있으면 렌더링 */}
              {videoUrl && (
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                  <video
                    width="100%"
                    controls
                    autoPlay
                    muted
                    style={{ borderRadius: "8px" }}
                  >
                    <source src={videoUrl} type="video/mp4" />
                    브라우저가 비디오 태그를 지원하지 않습니다.
                  </video>
                </div>
              )}

              {/* 영상 URL은 없고 Manim 코드만 있을 경우 코드를 보여줌 */}
              {!videoUrl && manimCode && (
                <div
                  style={{
                    marginTop: "20px",
                    background: "#282c34",
                    color: "#abb2bf",
                    padding: "15px",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    overflowX: "auto",
                  }}
                >
                  <strong>Manim Animation Code:</strong>
                  <pre
                    style={{
                      margin: 0,
                      marginTop: "10px",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {manimCode}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- 스타일 (CSS) ---
const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "30px",
    borderRadius: "24px",
    backgroundColor: "#ffffff",
    boxShadow:
      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    fontFamily: '"Pretendard", sans-serif',
    textAlign: "center",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: "20px",
  },
  statusArea: {
    height: "30px",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "0.9rem",
  },
  listeningText: {
    color: "#ef4444",
    fontWeight: "bold",
    animation: "pulse 1.5s infinite",
  },
  processingText: {
    color: "#3b82f6",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  errorText: {
    color: "#dc2626",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.9rem",
  },

  chatBox: {
    textAlign: "left",
    padding: "20px",
    borderRadius: "16px",
    backgroundColor: "#f8fafc",
    marginBottom: "24px",
    minHeight: "80px",
  },
  label: {
    display: "block",
    fontSize: "0.85rem",
    color: "#64748b",
    fontWeight: "700",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  text: {
    fontSize: "1.1rem",
    color: "#334155",
    lineHeight: "1.5",
    margin: 0,
  },
  answerText: {
    fontSize: "1.1rem",
    color: "#0f172a",
    lineHeight: "1.6",
    margin: 0,
    whiteSpace: "pre-wrap", // 줄바꿈 보존
  },
  controls: {
    marginBottom: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  micButton: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  micLabel: {
    fontSize: "0.9rem",
    color: "#94a3b8",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  iconBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "transparent",
    border: "1px solid #cbd5e1",
    padding: "6px 12px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "0.85rem",
    color: "#475569",
    transition: "background 0.2s",
  },
  spin: {
    animation: "spin 1s linear infinite", // index.css에 @keyframes spin { 100% { transform: rotate(360deg); } } 필요
  },
};

export default VoiceGraphChat;
