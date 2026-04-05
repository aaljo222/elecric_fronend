import apiClient from "@/api/core/apiClient";
import "katex/dist/katex.min.css";
import { Loader2, MoveLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
// 💡 방금 설치한 수식 렌더링 도구를 불러옵니다!
import { BlockMath } from "react-katex";

// 컴포넌트 Import
import QnaCard from "@/components/quiz/QnaCard";
import RecommendedVideo from "@/components/video/RecommendedVideo";
import VideoInfo from "@/components/video/VideoInfo";
import VideoPlayer from "@/components/video/VideoPlayer";
import VideoPlayerList from "@/components/video/VideoPlayList";

// 데이터 및 퀴즈 생성기 Import
import {
  circuitLectures,
  emLectures,
  mathLectures,
  visionLectures,
} from "@/constants/videoData";

import {
  generateBasicFunctionQuiz,
  generateCompositeFunctionQuiz,
  generateDerivativeQuiz,
  generateExponentQuiz,
  generateFactorizationQuiz,
  generateFractionQuiz,
  generateLogarithmQuiz,
  generateOhmQuiz,
  generatePerfectSquareQuiz,
} from "@/utils/quizUtils";

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

  const handleFetchProblem = () => {
    setIsFetchingProblem(true);

    setTimeout(() => {
      try {
        let newData = null;

        if (videoData && videoData.generator) {
          newData = videoData.generator();
        } else if (videoData?.subject?.includes("회로")) {
          newData = generateOhmQuiz();
        } else {
          const mathGenerators = [
            generateFractionQuiz,
            generateExponentQuiz,
            generateLogarithmQuiz,
            generateFactorizationQuiz,
            generateBasicFunctionQuiz,
            generateCompositeFunctionQuiz,
            generatePerfectSquareQuiz,
            generateDerivativeQuiz,
          ];
          const randomFunc =
            mathGenerators[Math.floor(Math.random() * mathGenerators.length)];
          newData = randomFunc();
        }

        setProblemData(newData);
      } catch (error) {
        console.error("문제 생성 중 오류:", error);
        alert("문제를 생성하는 데 실패했습니다.");
      } finally {
        setIsFetchingProblem(false);
      }
    }, 500);
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

                      {/* 💡 BlockMath를 사용하여 암호 같던 글씨를 예쁜 수식으로 변환합니다! */}
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8 text-xl text-gray-900 font-bold leading-relaxed overflow-x-auto">
                        <BlockMath math={problemData.problem} />
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-bold text-gray-700 text-lg border-b border-blue-200 pb-3 mb-4">
                          💡 단계별 해설
                        </h4>
                        {problemData.steps?.map((step, index) => (
                          <div
                            key={index}
                            className="flex gap-4 items-start bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
                          >
                            <span className="bg-[#e5edff] text-[#0047a5] font-black w-8 h-8 flex items-center justify-center rounded-full shrink-0 shadow-inner">
                              {index + 1}
                            </span>
                            <div className="mt-1 w-full overflow-hidden">
                              <p className="text-gray-600 font-medium mb-3 leading-relaxed">
                                {step.text}
                              </p>
                              {/* 💡 해설에 있는 수식도 예쁘게 변환 */}
                              {step.math && (
                                <div className="bg-gray-50 p-4 rounded-lg text-[#0047a5] text-base overflow-x-auto border border-gray-200 whitespace-nowrap">
                                  <BlockMath math={step.math} />
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
                        {/* 💡 정답도 예쁜 수식으로 변환 */}
                        <span className="text-3xl font-black">
                          <BlockMath math={problemData.answer} />
                        </span>
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
