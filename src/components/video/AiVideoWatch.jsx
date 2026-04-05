import apiClient from "@/api/core/apiClient";
import katex from "katex";
import "katex/dist/katex.min.css";
import { CheckCircle2, Loader2, MoveLeft, XCircle } from "lucide-react"; // 아이콘 추가
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

// 컴포넌트 Import
import QnaCard from "@/components/quiz/QnaCard";
import RecommendedVideo from "@/components/video/RecommendedVideo";
import VideoInfo from "@/components/video/VideoInfo";
import VideoPlayer from "@/components/video/VideoPlayer";
import VideoPlayerList from "@/components/video/VideoPlayList";

// 데이터 Import
import {
  circuitLectures,
  emLectures,
  mathLectures,
  visionLectures,
} from "@/constants/videoData";

// ==========================================
// 💡 Katex 컴포넌트 (대표님 커스텀)
// ==========================================
const KatexInline = ({ math }) => {
  if (!math) return null;
  const html = katex.renderToString(String(math), { throwOnError: false });
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

const KatexBlock = ({ math }) => {
  if (!math) return null;
  const html = katex.renderToString(String(math), {
    throwOnError: false,
    displayMode: true,
  });
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

const ALL_LECTURES = [
  ...mathLectures,
  ...circuitLectures,
  ...emLectures,
  ...visionLectures,
];

export default function AiVideoWatch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.login?.user) || { id: "guest_123" };

  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("quiz");

  // 🌟 퀴즈 상태 관리 고도화
  const [problemData, setProblemData] = useState(null);
  const [isFetchingProblem, setIsFetchingProblem] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null); // 사용자가 클릭한 번호
  const [showSolution, setShowSolution] = useState(false); // 해설 공개 여부
  const [isCorrect, setIsCorrect] = useState(null); // 정답 여부

  const videoData = ALL_LECTURES.find((l) => l.id === id);
  const isVision = id.startsWith("vision_");

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/api/video/url/${id}`);
        setVideoUrl(res.data.video_url);
      } catch (error) {
        setVideoUrl(videoData?.videoUrls?.[0] || "");
      } finally {
        setLoading(false);
      }
    };

    // 초기화
    setProblemData(null);
    setSelectedIndex(null);
    setShowSolution(false);
    setIsCorrect(null);

    if (videoData) fetchVideoData();
    else setLoading(false);
  }, [id, videoData]);

  // 💡 문제 가져오기 함수 (상태 초기화 포함)
  const handleFetchProblem = async () => {
    setIsFetchingProblem(true);
    setSelectedIndex(null);
    setShowSolution(false);
    setIsCorrect(null);

    try {
      let newData = null;
      if (videoData && videoData.generator) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        newData = videoData.generator();
      } else {
        const endpoint = id.includes("circuit")
          ? "/api/circuit/random"
          : "/api/math/random";
        const res = await apiClient.get(`${endpoint}?type=${id}`);
        newData = res.data;
      }
      setProblemData(newData);
    } catch (error) {
      console.error("문제 생성 중 오류:", error);
      alert("문제를 가져오는데 실패했습니다.");
    } finally {
      setIsFetchingProblem(false);
    }
  };

  // 💡 선택지 클릭 처리 함수
  const handleChoiceClick = (index) => {
    if (showSolution) return; // 이미 해설이 나왔으면 클릭 방지

    const correct = index === problemData.correct_index;
    setSelectedIndex(index);
    setIsCorrect(correct);
    setShowSolution(true); // 클릭하는 순간 해설과 정답 공개!
  };

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#0047a5]" size={48} />
        <p className="text-gray-500 font-bold">강의를 준비하는 중입니다...</p>
      </div>
    );
  }

  if (!videoData)
    return (
      <div className="pt-32 text-center text-xl font-bold">
        영상을 찾을 수 없습니다.
      </div>
    );

  // 데이터 바인딩
  const problemText = problemData?.problem || problemData?.question;
  const choices = problemData?.choices || []; // 4지 선다 배열
  const stepsList = problemData?.steps || [];
  const imageUrl = problemData?.image || problemData?.image_url;

  return (
    <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto font-body">
      <button
        onClick={() => navigate("/user/videos")}
        className="mb-6 text-[#0047a5] font-bold flex items-center gap-1 hover:underline"
      >
        <MoveLeft /> 돌아가기
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <section className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-gray-800 flex items-center justify-center">
            <VideoPlayer videoUrl={videoUrl} title={videoData.title} />
          </section>

          <VideoInfo
            title={isVision ? "🚀 AI Company 비전" : videoData.title}
            subject={videoData.subject}
            description={videoData.description}
          />

          {!isVision && (
            <section className="scroll-mt-24">
              <div className="flex border-b border-gray-200 mt-8 mb-2">
                <button
                  className={`flex-1 py-4 px-6 text-center font-bold text-lg transition-colors ${activeTab === "quiz" ? "border-b-4 border-[#0047a5] text-[#0047a5]" : "text-gray-400 hover:text-gray-600"}`}
                  onClick={() => setActiveTab("quiz")}
                >
                  실전 퀴즈
                </button>
                <button
                  className={`flex-1 py-4 px-6 text-center font-bold text-lg transition-colors ${activeTab === "qna" ? "border-b-4 border-[#0047a5] text-[#0047a5]" : "text-gray-400 hover:text-gray-600"}`}
                  onClick={() => setActiveTab("qna")}
                >
                  질문 및 A/S
                </button>
              </div>

              {activeTab === "quiz" ? (
                <div className="mt-8">
                  <div className="w-full text-center mb-8">
                    <p className="text-gray-500 mb-4 font-medium">
                      강의 내용을 바탕으로 한 맞춤형 문제를 생성합니다.
                    </p>
                    <button
                      onClick={handleFetchProblem}
                      disabled={isFetchingProblem}
                      className={`font-bold text-lg py-4 px-10 rounded-xl shadow-md transition-all active:scale-[0.98] ${isFetchingProblem ? "bg-gray-400 text-white cursor-not-allowed animate-pulse" : "bg-[#0047a5] text-white hover:bg-blue-800"}`}
                    >
                      {isFetchingProblem
                        ? "⏳ 문제를 만드는 중..."
                        : "🎯 랜덤 문제 가져오기"}
                    </button>
                  </div>

                  {problemData && (
                    <div className="mt-8 p-8 bg-white border border-gray-100 rounded-3xl shadow-xl animate-fade-in text-left">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                          📝 실전 테스트
                        </h3>
                        {showSolution && (
                          <div
                            className={`flex items-center gap-2 font-black text-xl ${isCorrect ? "text-green-600" : "text-red-600"}`}
                          >
                            {isCorrect ? (
                              <>
                                <CheckCircle2 size={28} /> 정답입니다!
                              </>
                            ) : (
                              <>
                                <XCircle size={28} /> 아쉬워요!
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* 그래프 이미지 */}
                      {imageUrl && (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 flex justify-center">
                          <img
                            src={
                              imageUrl.startsWith("data:")
                                ? imageUrl
                                : `data:image/png;base64,${imageUrl}`
                            }
                            alt="그래프"
                            className="max-w-full h-auto rounded-lg shadow-sm"
                          />
                        </div>
                      )}

                      {/* 문제 텍스트 */}
                      <div className="mb-10 text-xl text-gray-800 font-bold leading-relaxed px-2">
                        <KatexBlock math={problemText} />
                      </div>

                      {/* 🌟 4지 선다 버튼 영역 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                        {choices.map((choice, index) => (
                          <button
                            key={index}
                            onClick={() => handleChoiceClick(index)}
                            disabled={showSolution}
                            className={`p-6 text-left rounded-2xl border-2 transition-all flex items-center gap-4 group ${
                              selectedIndex === index
                                ? isCorrect
                                  ? "border-green-500 bg-green-50"
                                  : "border-red-500 bg-red-50"
                                : showSolution &&
                                    index === problemData.correct_index
                                  ? "border-green-500 bg-green-50"
                                  : "border-gray-200 hover:border-[#0047a5] hover:shadow-md"
                            }`}
                          >
                            <span
                              className={`w-10 h-10 flex items-center justify-center rounded-full font-black shrink-0 ${
                                selectedIndex === index
                                  ? "bg-white text-gray-900"
                                  : "bg-gray-100 text-gray-500 group-hover:bg-[#0047a5] group-hover:text-white"
                              }`}
                            >
                              {index + 1}
                            </span>
                            <span className="text-lg font-bold">
                              <KatexInline math={choice} />
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* 🌟 클릭 후 나타나는 단계별 해설 */}
                      {showSolution && (
                        <div className="mt-12 pt-10 border-t-2 border-dashed border-gray-200 animate-slide-up">
                          <h4 className="text-xl font-black text-[#0047a5] mb-6 flex items-center gap-2">
                            💡 전문가의 상세 풀이
                          </h4>
                          <div className="space-y-4">
                            {stepsList.map((step, idx) => (
                              <div
                                key={idx}
                                className="flex gap-4 items-start bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50"
                              >
                                <span className="bg-[#0047a5] text-white font-black w-8 h-8 flex items-center justify-center rounded-lg shrink-0 mt-1">
                                  {idx + 1}
                                </span>
                                <div className="mt-1 w-full">
                                  <p className="text-gray-700 font-bold mb-3 leading-relaxed">
                                    {typeof step === "string"
                                      ? step
                                      : step.text}
                                  </p>
                                  {(step.math || step.formula) && (
                                    <div className="bg-white p-4 rounded-xl shadow-sm overflow-x-auto">
                                      <KatexBlock
                                        math={step.math || step.formula}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-10 p-8 bg-[#0047a5] text-white rounded-3xl text-center shadow-lg">
                            <p className="text-blue-200 text-sm font-black mb-2 uppercase tracking-widest">
                              Final Answer
                            </p>
                            <div className="text-4xl font-black">
                              <KatexBlock math={problemData.answer} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <QnaCard />
              )}
            </section>
          )}
        </div>

        <aside className="lg:col-span-4 space-y-8">
          <VideoPlayerList />
          <div>
            <h2 className="text-xl font-bold mb-6 text-gray-900 font-headline">
              추천 강의
            </h2>
            <RecommendedVideo count={4} />
          </div>
        </aside>
      </div>
    </main>
  );
}
