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
// 💡 커스텀 Katex 컴포넌트
// ==========================================
const KatexInline = ({ math }) => {
  if (!math) return null;
  const html = katex.renderToString(math, { throwOnError: false });
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

const KatexBlock = ({ math }) => {
  if (!math) return null;
  const html = katex.renderToString(math, {
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

  // 💡 문제 출제 핵심 로직 (백엔드 통신 복구!)
  const handleFetchProblem = async () => {
    setIsFetchingProblem(true);

    try {
      let newData = null;

      // 1. 프론트엔드 로컬에 전용 문제 생성기가 지정된 경우 (기초수학 앞부분)
      if (videoData && videoData.generator) {
        await new Promise((resolve) => setTimeout(resolve, 500)); // AI 연출 딜레이
        newData = videoData.generator();
      }
      // 2. 🚀 그 외 모든 강의(삼각함수, 벡터, 미분 등)는 무조건 백엔드(FastAPI) 호출!
      else {
        const endpoint = id.includes("circuit")
          ? "/api/circuit/random"
          : "/api/math/random";
        // ❌ 로컬 무작위 퀴즈 대신 백엔드에 현재 강의 ID(삼각함수)를 던져서 정확한 문제를 받아옵니다.
        const res = await apiClient.get(`${endpoint}?type=${id}`);
        newData = res.data;
      }

      setProblemData(newData);
    } catch (error) {
      console.error("문제 생성 중 오류:", error);
      alert(
        "백엔드에서 문제를 가져오는데 실패했습니다. 서버 로그를 확인해주세요.",
      );
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

                      {/* 💡 1. 백엔드에서 Matplotlib 이미지를 넘겨줬다면 먼저 그려줍니다! */}
                      {(problemData.image ||
                        problemData.image_url ||
                        problemData.imageUrl) && (
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex justify-center">
                          <img
                            src={
                              problemData.image ||
                              problemData.image_url ||
                              problemData.imageUrl
                            }
                            alt="AI 생성 문제 그래프"
                            className="max-w-full h-auto rounded"
                          />
                        </div>
                      )}

                      {/* 💡 2. 문제 텍스트 (수식) 렌더링 */}
                      {problemData.problem && (
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8 text-xl text-gray-900 font-bold leading-relaxed overflow-x-auto flex justify-center">
                          <KatexBlock math={problemData.problem} />
                        </div>
                      )}

                      <div className="space-y-4">
                        <h4 className="font-bold text-gray-700 text-lg border-b border-blue-200 pb-3 mb-4">
                          💡 단계별 해설
                        </h4>
                        {problemData.steps?.map((step, index) => (
                          <div
                            key={index}
                            className="flex gap-4 items-start bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
                          >
                            <span className="bg-[#e5edff] text-[#0047a5] font-black w-8 h-8 flex items-center justify-center rounded-full shrink-0 shadow-inner mt-1">
                              {index + 1}
                            </span>
                            <div className="mt-1 w-full overflow-hidden">
                              <p className="text-gray-600 font-medium mb-3 leading-relaxed">
                                {step.text}
                              </p>
                              {step.math && (
                                <div className="bg-gray-50 py-3 px-4 rounded-lg text-[#0047a5] text-base overflow-x-auto border border-gray-200 whitespace-nowrap">
                                  <KatexBlock math={step.math} />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-10 p-6 bg-gradient-to-r from-[#0047a5] to-blue-700 text-white rounded-xl text-center shadow-lg">
                        <span className="block text-blue-200 text-sm font-bold mb-1 tracking-wider uppercase">
                          최종 정답
                        </span>
                        <div className="text-3xl font-black mt-2">
                          <KatexBlock math={problemData.answer} />
                        </div>
                      </div>
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
