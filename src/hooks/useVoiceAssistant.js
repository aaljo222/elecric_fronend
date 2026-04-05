import { useCallback, useEffect, useState } from "react";
import apiClient from "../api/apiClient";

export default function useVoiceAssistant(currentSubjectId) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Web Speech API 초기화
  const recognition =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition)
      ? new (window.SpeechRecognition || window.webkitSpeechRecognition)()
      : null;

  if (recognition) {
    recognition.continuous = false; // 한 문장 끝나면 중지
    recognition.lang = "ko-KR";
    recognition.interimResults = false;
  }

  // TTS: 텍스트를 음성으로 변환
  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // 이전 발화 중지

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  // 백엔드 통신: 음성 명령 분석 요청
  const processVoiceCommand = async (text) => {
    try {
      // 과목명 -> 코드 매핑 (백엔드와 통일 필요)
      const subjectCodeMap = {
        전기자기학: "EM",
        전력공학: "PW",
        전기기기: "MC",
        회로이론: "CT",
        제어공학: "CN",
        전기설비기술기준: "KEC",
      };
      const code = subjectCodeMap[currentSubjectId] || "EM";

      console.log("🎤 음성 분석 요청:", text, code);

      const res = await apiClient.post("/voice/analyze", {
        query: text,
        subject_code: code,
      });
      console.log("res:".res);
      const { answer, target_node_ids } = res.data;

      // 답변 읽어주기
      speak(answer);

      // 타겟 노드 ID 반환 (그래프 줌인용)
      return target_node_ids;
    } catch (error) {
      console.error("Voice processing failed", error);
      speak("죄송합니다. 처리 중에 오류가 발생했습니다.");
      return [];
    }
  };

  const startListening = () => {
    if (!recognition) {
      alert("이 브라우저는 음성 인식을 지원하지 않습니다. (Chrome 권장)");
      return;
    }
    setTranscript("");
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  // 음성 인식 이벤트 핸들러
  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
  }, [recognition]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    processVoiceCommand,
    isSpeaking,
    speak,
  };
}
