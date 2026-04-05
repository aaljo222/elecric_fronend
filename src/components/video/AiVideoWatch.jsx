import apiClient from "@/api/core/apiClient";
import katex from "katex";
import "katex/dist/katex.min.css";
import { Loader2, MoveLeft } from "lucide-react";
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
// 💡 대표님의 완벽한 커스텀 Katex 컴포넌트
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
// ==========================================

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

  const [problemData, setProblemData] = useState(null);
  const [isFetchingProblem, setIsFetchingProblem] = useState(false);

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

    setProblemData(null);

    if (videoData) fetchVideoData();
    else setLoading(false);
  }, [id, videoData]);

  // ==========================================
  // 💡 1. 문제 출제 핵심 로직 (백엔드 통신 완벽 복구!)
  // ==========================================
  const handleFetchProblem = async () => {
    setIsFetchingProblem(true);

    try {
      let newData = null;

      // 1-1. 프론트엔드 로컬에 전용 문제 생성기가 지정된 경우 (기초수학 앞부분)
      if (videoData && videoData.generator) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        newData = videoData.generator();
      }
      // 1-2. 🚀 그 외 모든 강의(삼각함수, 미분, 회로 등)는 무조건 백엔드(FastAPI) 호출!
      else {
        // 기존에 있던 로컬 랜덤 뽑기(mathGenerators)를 완전히 삭제했습니다.
        const endpoint = id.includes("circuit")
          ? "/api/circuit/random"
          : "/api/math/random";
        const res = await apiClient.get(`${endpoint}?type=${id}`);
        newData = res.data;
      }

      setProblemData(newData);
    } catch (error) {
      console.error("문제 생성 중 오류:", error);
      alert("백엔드 서버에서 문제를 가져오는데 실패했습니다.");
    } finally {
      setIsFetchingProblem(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#0047a5]" size={48} />
        <p className="text-gray-500 font-bold">강의를 준비하는 중입니다...</p>
      </div>
    );
  }

  if (!videoData) {
    return (
      <div className="pt-32 text-center font-body text-xl font-bold">
        영상을 찾을 수 없습니다.
      </div>
    );
  }

  // 백엔드 JSON 키값이 다를 경우를 대비한 안전 장치
  const problemText =
    problemData?.problem || problemData?.question || problemData?.problem_latex;
  const answerText =
    problemData?.answer ||
    problemData?.correct_answer ||
    problemData?.answer_latex;
  const stepsList = Array.isArray(problemData?.steps)
    ? problemData.steps
    : Array.isArray(problemData?.explanation)
      ? problemData.explanation
      : [];
  const imageUrl =
    problemData?.image ||
    problemData?.image_url ||
    problemData?.image_base64 ||
    problemData?.plot;

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
                  className={`flex-1 py-4 px-6 text-center font-bold text-lg transition-colors ${
                    activeTab === "quiz"
                      ? "border-b-4 border-[#0047a5] text-[#0047a5]"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  onClick={() => setActiveTab("quiz")}
                >
                  실전 퀴즈
                </button>
                <button
                  className={`flex-1 py-4 px-6 text-center font-bold text-lg transition-colors ${
                    activeTab === "qna"
                      ? "border-b-4 border-[#0047a5] text-[#0047a5]"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  onClick={() => setActiveTab("qna")}
                >
                  질문 및 A/S
                </button>
              </div>

              {activeTab === "quiz" ? (
                <div className="mt-8">
                  <div className="w-full text-center">
                    <p className="text-gray-500 mb-6 font-medium">
                      해당 개념의 맞춤형 심화 문제를 생성합니다.
                    </p>
                    <button
                      onClick={handleFetchProblem}
                      disabled={isFetchingProblem}
                      className={`font-bold text-lg py-4 px-10 rounded-xl shadow-md transition-all active:scale-[0.98] w-full md:w-auto ${
                        isFetchingProblem
                          ? "bg-gray-400 text-white cursor-not-allowed animate-pulse"
                          : "bg-[#0047a5] text-white hover:bg-blue-800 hover:shadow-lg"
                      }`}
                    >
                      {isFetchingProblem
                        ? "⏳ AI가 문제를 빚어내는 중..."
                        : "🎯 랜덤 문제 가져오기"}
                    </button>
                  </div>

                  {problemData && (
                    <div className="mt-8 p-8 bg-[#f8faff] border border-blue-100 rounded-xl shadow-sm animate-fade-in text-left">
                      <h3 className="text-2xl font-extrabold text-[#0047a5] mb-6 flex items-center gap-2 tracking-tight">
                        📝 실전 연습 문제
                      </h3>

                      {/* ==========================================
                          💡 2. Matplotlib 이미지 출력 영역 (Base64 자동 처리)
                          ========================================== */}
                      {imageUrl && (
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex justify-center">
                          <img
                            src={
                              String(imageUrl).startsWith("http") ||
                              String(imageUrl).startsWith("data:")
                                ? imageUrl
                                : `data:image/png;base64,${imageUrl}`
                            }
                            alt="AI 생성 문제 그래프"
                            className="max-w-full h-auto rounded object-contain"
                          />
                        </div>
                      )}

                      {/* 문제 수식 출력 */}
                      {problemText && (
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8 text-xl text-gray-900 font-bold leading-relaxed overflow-x-auto flex justify-center">
                          <KatexBlock math={problemText} />
                        </div>
                      )}

                      {/* 단계별 해설 (백엔드 포맷에 맞춘 강력한 방어 로직) */}
                      {stepsList.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="font-bold text-gray-700 text-lg border-b border-blue-200 pb-3 mb-4">
                            💡 단계별 해설
                          </h4>
                          {stepsList.map((step, index) => {
                            // 백엔드가 문자열로만 줬을 경우와 객체로 줬을 경우 모두 대응
                            const text =
                              typeof step === "string"
                                ? step
                                : step.text || step.description;
                            const math =
                              step.math || step.formula || step.equation;

                            return (
                              <div
                                key={index}
                                className="flex gap-4 items-start bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
                              >
                                <span className="bg-[#e5edff] text-[#0047a5] font-black w-8 h-8 flex items-center justify-center rounded-full shrink-0 shadow-inner mt-1">
                                  {index + 1}
                                </span>
                                <div className="mt-1 w-full overflow-hidden">
                                  {text && (
                                    <p className="text-gray-600 font-medium mb-3 leading-relaxed">
                                      {text}
                                    </p>
                                  )}
                                  {math && (
                                    <div className="bg-gray-50 py-3 px-4 rounded-lg text-[#0047a5] text-base overflow-x-auto border border-gray-200 whitespace-nowrap">
                                      <KatexBlock math={math} />
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* 정답 출력 */}
                      {answerText && (
                        <div className="mt-10 p-6 bg-gradient-to-r from-[#0047a5] to-blue-700 text-white rounded-xl text-center shadow-lg">
                          <span className="block text-blue-200 text-sm font-bold mb-1 tracking-wider uppercase">
                            최종 정답
                          </span>
                          <div className="text-3xl font-black mt-2">
                            <KatexBlock math={answerText} />
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
            <h2 className="text-xl font-bold mb-6 text-gray-900">추천 강의</h2>
            <RecommendedVideo count={4} />
          </div>
        </aside>
      </div>
    </main>
  );
}
