import apiClient from "@/api/core/apiClient";
import "katex/dist/katex.min.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import ApiQuizCard from "@/components/quiz/ApiQuizCard";
import QnaCard from "@/components/quiz/QnaCard";
import VideoPlayer from "@/components/video/VideoPlayer";

import RecommendedVideo from "@/components/video/RecommendedVideo";
import VideoPlayerList from "@/components/video/VideoPlayList";
import { MoveLeft } from "lucide-react";

export default function AiVideoWatch() {
  const { id } = useParams(); // Neo4j에서 넘어온 lecture_id
  const navigate = useNavigate();
  const user = useSelector((state) => state.login?.user) || { id: "guest_123" };

  const [quizData, setQuizData] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  // 💡 [수정 1] videoUrl 문자열 대신 객체로 변경하여 title도 함께 관리합니다.
  const [videoInfo, setVideoInfo] = useState({ video_url: "", title: "" });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("quiz");

  // 💡 [수정 2] 컴포넌트가 마운트될 때 '영상'과 '첫 번째 퀴즈'를 동시에 불러오게 구조 변경
  const fetchRandomProblem = async () => {
    try {
      setSelectedIndex(null);
      setIsCorrect(null);
      setShowSolution(false);

      const endpoint = id.startsWith("circuit_")
        ? "/api/circuit/random"
        : id.startsWith("em_")
          ? "/api/em/random"
          : "/api/math/random";

      const res = await apiClient.get(`${endpoint}?type=${id}`);
      setQuizData(res.data);
    } catch (e) {
      console.error("문제 로딩 실패:", e);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // 1. 영상 주소 불러오기
        const res = await apiClient.get(`/api/video/url/${id}`);
        setVideoInfo({ video_url: res.data.video_url, title: res.data.title });

        // 2. 💡 [추가] 영상 정보를 가져온 뒤 즉시 첫 번째 퀴즈도 불러옵니다.
        await fetchRandomProblem();
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchInitialData();
  }, [id]);
  // 💡 로딩 중일 때는 플레이어 대신 스켈레톤이나 로딩 바를 보여줍니다.
  if (loading)
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white font-bold">
            강의 데이터를 가져오고 있습니다...
          </p>
        </div>
      </div>
    );

  // 💡 데이터가 아예 없을 경우에 대한 예외 처리 추가
  if (!videoInfo.video_url && !loading) {
    return (
      <div className="pt-32 text-center text-white">
        <p>영상을 찾을 수 없습니다. (ID: {id})</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-400 underline"
        >
          뒤로 가기
        </button>
      </div>
    );
  }
  const handleQuizSelect = async (index) => {
    const correct = index === quizData.correct_index;
    setSelectedIndex(index);
    setIsCorrect(correct);
    setShowSolution(true);
    // (기록 저장 로직은 기존대로 처리하시면 됩니다)
  };

  return (
    <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto font-body">
      <button
        onClick={() => navigate("/user/videos")}
        className="mb-6 text-[#0047a5] font-bold flex items-center gap-1"
      >
        <MoveLeft /> 돌아가기
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {videoInfo.title}
          </h2>

          {loading ? (
            <div className="text-white text-center py-20">
              데이터를 준비 중입니다...
            </div>
          ) : (
            <section className="relative aspect-video bg-black rounded-xl overflow-hidden">
              {/* 💡 video_url이 있을 때만 플레이어를 띄웁니다. */}
              {videoInfo.video_url && (
                <VideoPlayer
                  videoUrl={videoInfo.video_url}
                  title={videoInfo.title}
                />
              )}
            </section>
          )}
          <section className="scroll-mt-24">
            <div className="flex border-b border-gray-200 mt-8 mb-4">
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
              // 💡 [방어 코드] quizData 객체 안에 problem_latex가 확실히 있을 때만 ApiQuizCard를 렌더링합니다!
              quizData && quizData.problem_latex ? (
                <ApiQuizCard
                  quizData={quizData}
                  selectedIndex={selectedIndex}
                  isCorrect={isCorrect}
                  showSolution={showSolution}
                  onSelect={handleQuizSelect}
                  onFetch={fetchRandomProblem}
                />
              ) : (
                <div className="text-center text-slate-400 py-20 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="material-symbols-outlined text-4xl mb-3 block text-slate-600">
                    quiz
                  </span>
                  이 강의에 등록된 실전 퀴즈가 없거나 데이터를 불러올 수
                  없습니다.
                </div>
              )
            ) : (
              <QnaCard />
            )}
          </section>
        </div>

        <aside className="lg:col-span-4 space-y-8">
          <VideoPlayerList />
          <RecommendedVideo count={4} />
        </aside>
      </div>
    </main>
  );
}
