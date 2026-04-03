import apiClient from "@/api/core/apiClient";
import RecommendedVideo from "@/components/video/RecommendedVideo";
import "katex/dist/katex.min.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import ApiQuizCard from "@/components/quiz/ApiQuizCard";
import QnaCard from "@/components/quiz/QnaCard";
import VideoPlayer from "@/components/video/VideoPlayer";

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
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/api/video/url/${id}`);
        // 💡 백엔드 응답이 성공적일 때만 데이터 세팅
        if (res.data && res.data.video_url) {
          setVideoInfo(res.data);
        }
      } catch (err) {
        console.error("영상 로드 실패", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchVideo();
  }, [id]);
  // 💡 로딩 중일 때는 플레이어 대신 스켈레톤이나 로딩 바를 보여줍니다.
  if (loading)
    return (
      <div className="text-white text-center pt-20">
        강의 정보를 가져오는 중...
      </div>
    );
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

          <section className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-gray-800 flex items-center justify-center">
            {/* 💡 [수정 3] 하드코딩된 제목 대신 DB에서 가져온 진짜 제목 전달 */}
            <VideoPlayer
              videoUrl={videoInfo.video_url}
              title={videoInfo.title}
            />
          </section>

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
              // 💡 이제 퀴즈 탭이 열리자마자 백엔드에서 생성된 문제가 화면에 뜹니다!
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
