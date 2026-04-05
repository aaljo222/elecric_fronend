import { useEffect, useRef, useState } from "react";
import { BlockMath, InlineMath } from "react-katex";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { submitAnswer } from "../../api/answerApi";
import { getQuestionById } from "../../api/questionApi";
import { aiChatGraph } from "../../api/aiApi"; // ✅ [추가] AI API 임포트
import useCustomLogin from "../../hooks/useCustomLogin";

// ✅ 백엔드 서버 주소 (Cloudflare 연동용)
const API_BASE_URL = "https://cloudflareprj-production.up.railway.app";

export default function QuestionSolvePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const [submitting, setSubmitting] = useState(false);

  const { isLogin, token } = useCustomLogin();
  const mode = new URLSearchParams(location.search).get("mode");
  const idx = Number(new URLSearchParams(location.search).get("idx"));
  const wrongIds = location.state?.wrongIds || [];

  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  // ✅ 동영상 관련 상태
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  // ✅ [추가] AI 튜터 관련 상태
  const [showAiChat, setShowAiChat] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  const [loading, setLoading] = useState(true);

  // 문제 로딩
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const q = await getQuestionById(id);
        setQuestion(q);
        // ✅ [편의성] AI 질문창에 기본적으로 문제 제목을 세팅해둡니다.
        setAiQuestion(q.question || q.title || "");
      } catch (e) {
        console.error("문제 로딩 실패:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // 답안 제출
  const onSubmit = async () => {
    if (!selected || result || submitting) return;
    if (!isLogin || !token) {
      alert("로그인이 필요합니다.");
      navigate("/member/login");
      return;
    }

    try {
      setSubmitting(true);
      const res = await submitAnswer(
        {
          question_id: id,
          selected_answer: Number(selected),
        },
        token,
      );
      setResult(res);
    } catch (e) {
      alert("로그인해주세요");
    } finally {
      setSubmitting(false);
    }
  };

  // 다음 오답 이동
  const goNextWrong = () => {
    if (idx + 1 >= wrongIds.length) {
      alert("오답 다시풀기 완료 🎉");
      navigate("/stats");
      return;
    }
    navigate(`/questions/${wrongIds[idx + 1]}?mode=retry&idx=${idx + 1}`, {
      state: { wrongIds },
    });
  };

  // ✅ 동영상 해설 보기 핸들러
  const handleShowVideo = async () => {
    if (showVideo) {
      setShowVideo(false);
      setVideoUrl(null);
      return;
    }

    setShowVideo(true);
    setIsVideoLoading(true);

    const searchConcept =
      question?.concept || question?.chapter || "전기자기학";

    try {
      const res = await axios.get(`${API_BASE_URL}/api/video/play/by-concept`, {
        params: { concept: searchConcept },
      });
      setVideoUrl(res.data.video_url);
    } catch (err) {
      if (question?.video_url) {
        let finalUrl = question.video_url;
        if (finalUrl.includes("youtu.be/")) {
          finalUrl = finalUrl.replace("youtu.be/", "www.youtube.com/embed/");
        } else if (finalUrl.includes("youtube.com/watch?v=")) {
          finalUrl = finalUrl.replace("watch?v=", "embed/");
        }
        setVideoUrl(finalUrl);
      } else {
        alert("등록된 해설 영상이 없습니다. 😅");
        setShowVideo(false);
      }
    } finally {
      setIsVideoLoading(false);
    }
  };

// ✅ [수정됨] AI 질문하기 핸들러 (429 에러 처리 추가)
  const handleAiSearch = async (e) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    setAiLoading(true);
    setAiAnswer("");
    setAiError(null);

    try {
      const data = await aiChatGraph({ question: aiQuestion }, token);
      setAiAnswer(data.answer);
      
      // (선택) 만약 백엔드가 남은 횟수를 보내준다면 여기서 처리 가능
      if (data.remaining_count !== undefined) {
         console.log(`남은 횟수: ${data.remaining_count}`);
      }

    } catch (err) {
      console.error("AI Error:", err);
      
      // 🚨 [핵심] 429(Too Many Requests) 에러 캐치
      if (err.response && err.response.status === 429) {
        // 백엔드에서 보낸 친절한 메시지("내일 다시 물어봐주세요!")를 표시
        setAiError(err.response.data.detail || "⛔ 일일 질문 한도(3회)를 초과했습니다.");
      } else {
        setAiError("시스템 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      setAiLoading(false);
    }
  };

  // 캔버스 로직 (그대로 유지)
  const startDraw = (e) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    isDrawingRef.current = true;
  };
  const draw = (e) => {
    if (!isDrawingRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };
  const endDraw = () => {
    isDrawingRef.current = false;
  };
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  };

  // 수식 렌더링
  const renderSolution = (text) => {
    if (!text) return null;
    return text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g).map((part, idx) => {
      if (part.startsWith("$$"))
        return <BlockMath key={idx}>{part.slice(2, -2)}</BlockMath>;
      if (part.startsWith("$"))
        return <InlineMath key={idx}>{part.slice(1, -1)}</InlineMath>;
      return (
        <span key={idx}>
          {part.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </span>
      );
    });
  };

  if (loading || !question)
    return <div className="text-center py-10">문제 로딩 중...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 문제 영역 */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold">
            Q. {question?.question || question?.title}
          </h2>

          <div className="space-y-2">
            {question && question.choices && Array.isArray(question.choices) ? (
              question.choices.map((text, i) => {
                const number = i + 1;
                const isSubmitted = !!result;
                const isCorrectAnswer = isSubmitted && number === result.answer;
                const isUserSelected = number === selected;
                const shouldStrikeThrough =
                  isSubmitted && isUserSelected && !isCorrectAnswer;

                const highlightClass = isCorrectAnswer
                  ? "bg-green-100 border-green-500 text-green-800 font-semibold"
                  : shouldStrikeThrough
                    ? "bg-red-100 border-red-500 text-red-700 font-semibold"
                    : isSubmitted && !isUserSelected
                      ? "opacity-50 border-gray-200"
                      : isUserSelected
                        ? "border-indigo-500 border-2"
                        : "border-gray-200 border";

                return (
                  <label
                    key={number}
                    className={`flex items-center gap-3 p-3 rounded-lg transition cursor-pointer ${highlightClass} ${shouldStrikeThrough ? "line-through" : ""}`}
                  >
                    <span className="w-6 text-center font-bold">
                      {isCorrectAnswer && "✔"}
                      {shouldStrikeThrough && "✖"}
                    </span>
                    <input
                      type="radio"
                      name="answer-choice"
                      className="hidden"
                      checked={isSubmitted ? isCorrectAnswer : isUserSelected}
                      disabled={isSubmitted}
                      onChange={() => !isSubmitted && setSelected(number)}
                    />
                    <span>
                      {number}. {text}
                    </span>
                  </label>
                );
              })
            ) : (
              <div className="text-gray-500 p-4 border rounded">
                보기 정보를 불러올 수 없습니다.
              </div>
            )}
          </div>

          <button
            onClick={onSubmit}
            disabled={!selected || !!result || submitting}
            className={`px-5 py-2 rounded text-white flex items-center gap-2 ${submitting ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
          >
            {submitting && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {submitting ? "제출 중..." : "답안 제출"}
          </button>

          {/* ✅ 결과 및 해설 영역 (제출 후에만 보임) */}
          {result && (
            <div className="mt-6 space-y-4 animate-fade-in-up">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="px-4 py-2 bg-gray-800 text-white rounded shadow-sm hover:bg-gray-900 transition flex items-center gap-2"
                >
                  {showSolution ? "📝 해설 닫기" : "📝 텍스트 풀이 보기"}
                </button>

                <button
                  onClick={handleShowVideo}
                  className="px-4 py-2 bg-red-600 text-white rounded shadow-sm hover:bg-red-700 transition flex items-center gap-2"
                >
                  {showVideo ? "🎬 동영상 닫기" : "🎬 동영상 해설 보기"}
                </button>

                {/* ✅ [추가] AI 튜터 버튼 */}
                <button
                  onClick={() => setShowAiChat(!showAiChat)}
                  className="px-4 py-2 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700 transition flex items-center gap-2"
                >
                  {showAiChat ? "🤖 AI 닫기" : "🤖 AI 튜터에게 질문"}
                </button>

                {mode === "retry" && (
                  <button
                    onClick={goNextWrong}
                    className="px-4 py-2 bg-emerald-600 text-white rounded shadow-sm hover:bg-emerald-700 ml-auto"
                  >
                    다음 오답 →
                  </button>
                )}
              </div>

              {/* 텍스트 해설 */}
              {showSolution && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 shadow-inner">
                  <h4 className="font-bold text-blue-800 mb-2">💡 상세 해설</h4>
                  <div className="text-gray-700 leading-relaxed text-sm">
                    {renderSolution(result.solution || question.solution)}
                  </div>
                </div>
              )}

              {/* 동영상 플레이어 */}
              {showVideo && (
                <div className="bg-black rounded-xl overflow-hidden aspect-video shadow-lg relative border border-gray-700 mt-4">
                  {isVideoLoading ? (
                    <div className="w-full h-full flex items-center justify-center text-white space-x-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>영상 불러오는 중...</span>
                    </div>
                  ) : videoUrl ? (
                    <iframe
                      src={videoUrl}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="해설 강의"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-900">
                      <p>📭 재생 가능한 영상이 없습니다.</p>
                    </div>
                  )}
                </div>
              )}

              {/* ✅ [추가] AI 튜터 채팅 영역 */}
              {showAiChat && (
                <div className="bg-white border-2 border-blue-100 rounded-xl p-5 shadow-lg mt-4">
                  <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                    🤖 AI 전기기사 튜터
                    <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      Claude 3.5 & Neo4j
                    </span>
                  </h4>

                  {/* 질문 입력 폼 */}
                  <form onSubmit={handleAiSearch} className="flex gap-2 mb-4">
                    <input
                      type="text"
                      className="flex-1 p-3 border rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
                      placeholder="이 문제의 개념이나 공식에 대해 물어보세요."
                      value={aiQuestion}
                      onChange={(e) => setAiQuestion(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={aiLoading}
                      className="px-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
                    >
                      {aiLoading ? "분석 중..." : "질문"}
                    </button>
                  </form>

                  {/* AI 답변 영역 */}
                  {aiLoading ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-blue-600 font-medium">AI가 지식 그래프를 분석 중입니다...</span>
                    </div>
                  ) : aiError ? (
                    // 🚨 에러 메시지 표시 (한도 초과 시 주황색 경고창)
                    <div className={`p-4 rounded-lg flex items-start gap-3 ${
                      aiError.includes("한도") || aiError.includes("3회")
                        ? "bg-orange-50 text-orange-700 border border-orange-200"
                        : "bg-red-50 text-red-600 border border-red-200"
                    }`}>
                      <span className="text-xl">
                        {aiError.includes("한도") ? "🛑" : "⚠️"}
                      </span>
                      <div className="text-sm font-medium leading-relaxed">
                        {aiError}
                      </div>
                    </div>
                  ) : aiAnswer ? (
                    <div className="prose max-w-none text-sm bg-blue-50 p-5 rounded-xl border border-blue-100">
                      <div className="flex items-center justify-between mb-2">
                         <span className="text-xs font-bold text-blue-600 bg-white px-2 py-1 rounded shadow-sm">
                           💡 AI 답변
                         </span>
                      </div>
                      <p className="whitespace-pre-line leading-relaxed text-gray-800">
                        {aiAnswer}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <p className="text-gray-500 text-sm">
                        궁금한 내용을 입력하면 <br/>
                        <span className="font-semibold text-blue-600">하루 3회</span> 무료로 답변해 드립니다. 🎁
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        {/* 수기 풀이 영역 (그대로 유지) */}
        <section className="flex flex-col gap-6">
          <div className="bg-white border rounded-lg shadow p-4 space-y-3">
            <h4 className="font-semibold text-gray-700">📝 풀이 메모</h4>
            <canvas
              ref={canvasRef}
              width={480}
              height={280}
              className="w-full border rounded bg-white touch-none"
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
            />
            <button
              onClick={clearCanvas}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition text-sm"
            >
              지우기
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
