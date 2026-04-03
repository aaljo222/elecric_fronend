// 불필요한 로컬 퀴즈 함수 import 전부 삭제! (generateFractionQuiz 등)
import apiClient from "@/api/core/apiClient";
import RecommendedVideo from "@/components/video/RecommendedVideo";
import "katex/dist/katex.min.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import ApiQuizCard from "@/components/quiz/ApiQuizCard"; // 💡 이것만 남깁니다.
import QnaCard from "@/components/quiz/QnaCard";
import VideoPlayer from "@/components/video/VideoPlayer";

import VideoPlayerList from "@/components/video/VideoPlayList";
import { MoveLeft } from "lucide-react";

export default function AiVideoWatch() {
  const { id } = useParams(); // Neo4j에서 넘어온 lecture_id (예: e935dc...)
  const navigate = useNavigate();
  const user = useSelector((state) => state.login?.user) || { id: "guest_123" };

  const [quizData, setQuizData] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("quiz");

  useEffect(() => {
    // 💡 1. 영상 URL 가져오기 (DB에서)
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/api/video/url/${id}`);
        setVideoUrl(res.data.video_url);
      } catch (error) {
        console.error("영상 정보를 불러오지 못했습니다.", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchVideoData();
  }, [id]);

  // 💡 2. 문제 가져오기 (DB/백엔드 팩토리 함수에서)
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

      // 백엔드로 id를 그대로 넘깁니다.
      const res = await apiClient.get(`${endpoint}?type=${id}`);
      setQuizData(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuizSelect = async (index) => {
    const correct = index === quizData.correct_index;
    setSelectedIndex(index);
    setIsCorrect(correct);
    setShowSolution(true);
    // (기록 저장 로직 동일)
  };

  if (loading)
    return (
      <div className="pt-32 text-center font-body text-xl font-bold">
        로딩 중...
      </div>
    );

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
          <section className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-gray-800 flex items-center justify-center">
            <VideoPlayer videoUrl={videoUrl} title={"강의 영상"} />
          </section>

          <section className="scroll-mt-24">
            <div className="flex border-b border-gray-200 mt-8 mb-2">
              <button
                className={`flex-1 py-4 px-6 text-center font-bold text-lg transition-colors ${activeTab === "quiz" ? "border-b-4 border-[#0047a5] text-[#0047a5]" : "text-gray-400"}`}
                onClick={() => setActiveTab("quiz")}
              >
                실전 퀴즈
              </button>
              <button
                className={`flex-1 py-4 px-6 text-center font-bold text-lg transition-colors ${activeTab === "qna" ? "border-b-4 border-[#0047a5] text-[#0047a5]" : "text-gray-400"}`}
                onClick={() => setActiveTab("qna")}
              >
                질문 및 A/S
              </button>
            </div>

            {/* 🌟 3. 완전히 정리된 렌더링 🌟 */}
            {activeTab === "quiz" ? (
              <ApiQuizCard
                quizData={quizData}
                selectedIndex={selectedIndex}
                isCorrect={isCorrect}
                showSolution={showSolution}
                onSelect={handleQuizSelect}
                onFetch={fetchRandomProblem}
              />
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
