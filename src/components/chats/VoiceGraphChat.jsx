import {
  AlertCircle,
  Loader2,
  Mic,
  MicOff,
  Volume2,
  Square,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import apiClient from "../../api/apiClient";

const VoiceGraphChat = () => {
  // --- State 관리 ---
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [userQuery, setUserQuery] = useState("");
  const [response, setResponse] = useState(null); // Backend 응답 전체
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedOption, setSelectedOption] = useState(null); // 퀴즈 선택 값
  const [quizResult, setQuizResult] = useState(null); // 퀴즈 정답 여부

  const recognitionRef = useRef(null);

  // --- 1. 음성 인식 (STT) ---
  const startListening = () => {
    setErrorMsg("");
    setResponse(null);
    setSelectedOption(null);
    setQuizResult(null);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("이 브라우저는 음성 인식을 지원하지 않습니다. (Chrome 권장)");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ko-KR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setUserQuery(text);
      handleVoiceQuery(text); // API 호출
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
  };

  // --- 2. API 호출 (Intent 분류 포함) ---
  const handleVoiceQuery = async (text) => {
    setIsProcessing(true);
    try {
      // 새로 만든 Voice Agent 라우터 호출
      const res = await apiClient.post("/api/voice-agent/query", { text });
      const data = res.data;

      setResponse(data); // { type, speech_text, display_text, quiz_data }

      // 응답 오자마자 읽어주기
      speakText(data.speech_text);
    } catch (err) {
      console.error(err);
      setErrorMsg("답변을 가져오는 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- 3. 음성 합성 (TTS) ---
  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // --- 4. 퀴즈 정답 처리 ---
  const checkAnswer = (optionNo) => {
    if (!response?.quiz_data) return;
    setSelectedOption(optionNo);

    const isCorrect = optionNo === parseInt(response.quiz_data.answer);
    setQuizResult(isCorrect);

    if (isCorrect) {
      speakText("정답입니다! 정말 잘하시네요.");
    } else {
      speakText(`아쉽네요. 정답은 ${response.quiz_data.answer}번 입니다.`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white rounded-3xl shadow-xl border border-gray-100 font-sans text-center">
      {/* 헤더 */}
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-slate-800">
          ⚡ AI 음성 튜터
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          "전자기학 문제 줘" 또는 "코로나 현상이 뭐야?"라고 말해보세요.
        </p>
      </div>

      {/* 상태 아이콘 영역 */}
      <div className="h-8 mb-4 flex justify-center items-center gap-2">
        {isProcessing && (
          <span className="text-blue-500 flex items-center gap-2 font-bold">
            <Loader2 className="animate-spin" /> 생각하는 중...
          </span>
        )}
        {isListening && (
          <span className="text-red-500 font-bold animate-pulse">
            듣고 있어요... 👂
          </span>
        )}
        {isSpeaking && (
          <span className="text-green-600 font-bold flex items-center gap-2">
            <Volume2 className="animate-pulse" /> 말하는 중...
          </span>
        )}
      </div>

      {/* 마이크 버튼 */}
      <div className="mb-10 relative">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
            isListening
              ? "bg-red-500 shadow-red-200 scale-110"
              : "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-200 hover:scale-105"
          }`}
        >
          {isListening ? (
            <MicOff size={40} className="text-white" />
          ) : (
            <Mic size={40} className="text-white" />
          )}
        </button>
      </div>

      {/* 사용자 질문 표시 */}
      {userQuery && (
        <div className="mb-6 text-left bg-gray-50 p-4 rounded-xl border border-gray-100">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            You
          </span>
          <p className="text-lg font-medium text-gray-800 mt-1">{userQuery}</p>
        </div>
      )}

      {/* AI 응답 영역 */}
      {response && (
        <div className="text-left animate-fade-in-up">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">
              AI Tutor
            </span>
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
              >
                멈춤 <Square size={10} className="inline" />
              </button>
            )}
          </div>

          {/* Type A: 개념 설명 (Concept) */}
          {response.type === "concept" && (
            <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100 text-slate-700 leading-relaxed whitespace-pre-line">
              {response.display_text}
            </div>
          )}

          {/* Type B: 문제 풀이 (Quiz) */}
          {response.type === "quiz" && response.quiz_data && (
            <div className="bg-white border-2 border-blue-100 rounded-xl overflow-hidden">
              <div className="bg-blue-50 p-4 border-b border-blue-100">
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-md font-bold mr-2">
                  QUIZ
                </span>
                <span className="font-bold text-slate-800">
                  {response.display_text}
                </span>
              </div>

              <div className="p-4 grid gap-3">
                {response.quiz_data.options.map((opt) => (
                  <button
                    key={opt.no}
                    onClick={() => checkAnswer(opt.no)}
                    disabled={selectedOption !== null} // 정답 선택 후 비활성화
                    className={`
                      w-full text-left p-3 rounded-lg border transition-all
                      ${
                        selectedOption === null
                          ? "border-gray-200 hover:bg-gray-50 hover:border-blue-300"
                          : selectedOption === opt.no
                            ? quizResult
                              ? "bg-green-100 border-green-500 text-green-800"
                              : "bg-red-50 border-red-300 text-red-800"
                            : opt.no === parseInt(response.quiz_data.answer)
                              ? "bg-green-50 border-green-500"
                              : "opacity-50"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        <b className="mr-2">{opt.no}.</b> {opt.text}
                      </span>
                      {selectedOption === opt.no &&
                        (quizResult ? (
                          <CheckCircle2 size={20} className="text-green-600" />
                        ) : (
                          <XCircle size={20} className="text-red-500" />
                        ))}
                    </div>
                  </button>
                ))}
              </div>

              {/* 해설 보기 버튼 (선택사항) */}
              {selectedOption !== null && (
                <div className="p-3 bg-gray-50 text-center text-sm text-gray-500">
                  해설은 '해설 보여줘'라고 말하면 알려드릴게요! (추후 구현)
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center justify-center gap-2">
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}
    </div>
  );
};

export default VoiceGraphChat;
