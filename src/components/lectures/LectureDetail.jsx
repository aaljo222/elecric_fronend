import "katex/dist/katex.min.css";
import { useEffect, useState } from "react";
import { BlockMath, InlineMath } from "react-katex";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../api/apiClient";
import {
  circuitLectures,
  emLectures,
  mathLectures,
  visionLectures,
} from "./data";

import {
  generateBasicFunctionQuiz,
  generateComplexVectorQuiz,
  generateCompositeFunctionQuiz,
  generateExponentQuiz,
  generateFactorizationQuiz,
  generateFractionQuiz,
  generateLogarithmQuiz,
} from "../../utils/quizUtils";

const LOCAL_QUIZ_CONFIG = {
  math_fraction: { title: "분수와 비례식", generateFunc: generateFractionQuiz },
  math_exponent: { title: "지수법칙", generateFunc: generateExponentQuiz },
  math_logarithm: { title: "로그의 이해", generateFunc: generateLogarithmQuiz },
  math_factorization: {
    title: "인수분해",
    generateFunc: generateFactorizationQuiz,
  },
  math_function: {
    title: "함수의 이해",
    generateFunc: generateBasicFunctionQuiz,
  },
  math_composite_function: {
    title: "합성함수 연산",
    generateFunc: generateCompositeFunctionQuiz,
  },
  math_complex_vector: {
    title: "복소수와 벡터의 덧셈",
    generateFunc: generateComplexVectorQuiz,
  },
};

const LocalQuizCard = ({ title, generateFunc }) => {
  const [quizData, setQuizData] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  const handleGenerate = () => {
    setQuizData(generateFunc());
    setShowSolution(false);
  };

  return (
    <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">✍️ 실전! {title} 랜덤 퀴즈</h3>

      {quizData ? (
        <div className="mb-6 text-2xl font-extrabold text-center bg-gray-50 p-6 rounded text-gray-800">
          문제: <InlineMath math={quizData.problem} />
        </div>
      ) : (
        <p className="text-center text-gray-500 mb-6 py-4 bg-gray-50 rounded">
          버튼을 눌러 문제를 생성해보세요!
        </p>
      )}

      {showSolution && quizData && (
        <div className="mb-6 animate-fade-in p-6 bg-blue-50 rounded-lg border border-blue-100">
          <h4 className="text-lg font-bold mb-4 text-blue-800">
            💡 단계별 해설
          </h4>
          <div className="space-y-4 mb-6">
            {quizData.steps.map((step, idx) => (
              <div key={idx} className="p-4 bg-white rounded shadow-sm">
                <p className="font-semibold text-gray-700 mb-2">
                  Step {idx + 1}. {step.text}
                </p>
                {step.math && (
                  <div className="text-center text-lg mt-2 text-blue-600">
                    <BlockMath math={step.math} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-2xl font-bold text-center text-red-600 border-t pt-4">
            정답: <InlineMath math={quizData.answer} />
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleGenerate}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all"
        >
          {quizData ? "새로운 문제 만들기" : "문제 생성하기"}
        </button>
        {quizData && (
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors"
          >
            {showSolution ? "해설 숨기기" : "정답 및 해설 보기"}
          </button>
        )}
      </div>
    </div>
  );
};

const LectureDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.login?.user) || { id: "guest_123" };

  const [quizData, setQuizData] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  const [videoUrl, setVideoUrl] = useState("");
  // ✅ [핵심 추가] 숏폼 애니메이션 URL 및 모달 상태
  const [animationUrl, setAnimationUrl] = useState("");
  const [showAnimationModal, setShowAnimationModal] = useState(false);

  const [loading, setLoading] = useState(true);

  const isVision = id.startsWith("vision_");

  const allLectures = [
    ...mathLectures,
    ...circuitLectures,
    ...emLectures,
    ...visionLectures,
  ];
  const currentLectureData = allLectures.find((l) => l.id === id);
  const currentLocalQuiz = LOCAL_QUIZ_CONFIG[id];

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/api/video/url/${id}`);
        setVideoUrl(res.data.video_url);

        // =================================================================
        // ✅ [핵심 수정 부분] 백엔드가 URL을 안 주면, React에서 강제로 주입합니다!
        // =================================================================
        if (res.data.animation_url) {
          setAnimationUrl(res.data.animation_url);
        } else if (id === "circuit_ohm_law_equivalent") {
          // 현재 페이지가 '옴의 법칙' 강의라면, 대표님이 올리신 Cloudflare 영상을 강제 세팅!
          setAnimationUrl(
            "https://customer-w4c7tmh3vvpu6ohy.cloudflarestream.com/224e53260899f45e1bce4e819095c33c/iframe?autoplay=true&loop=true&controls=true&muted=false",
          );
        }
        // =================================================================
      } catch (error) {
        console.error("영상 로드 실패:", error);
        if (currentLectureData && currentLectureData.videoUrls) {
          setVideoUrl(currentLectureData.videoUrls[0]);
        } else {
          setVideoUrl("https://www.w3schools.com/html/mov_bbb.mp4");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchVideoData();
  }, [id, currentLectureData]);

  const fetchRandomProblem = async () => {
    if (isVision) return;

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
    } catch (error) {
      console.error("문제 로드 실패:", error);
    }
  };

  const handleSelect = async (index) => {
    if (showSolution) return;

    const correct = index === quizData.correct_index;
    setSelectedIndex(index);
    setIsCorrect(correct);
    setShowSolution(true);

    const recordPayload = {
      user_id: user.id,
      concept_name: id,
      is_correct: correct,
      chosen_answer: quizData.choices[index],
      problem_latex: quizData.problem_latex,
    };

    try {
      const recordEndpoint = id.startsWith("circuit_")
        ? "/api/circuit/record"
        : id.startsWith("em_")
          ? "/api/em/record"
          : "/api/math/record";

      await apiClient.post(recordEndpoint, recordPayload);
    } catch (error) {
      console.error("결과 저장 실패:", error);
    }
  };

  if (loading) return <div className="p-6 text-center">영상 로딩 중...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 relative">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:font-bold flex items-center gap-1"
      >
        ← 목록으로 돌아가기
      </button>

      <div className="flex justify-between items-end mb-4">
        <h2 className="text-2xl font-bold">
          {isVision
            ? "🚀 AI Company 비전 영상"
            : `📺 강의 영상 및 실전 퀴즈 (${currentLectureData?.title || id})`}
        </h2>

        {/* ✅ [핵심 추가] 숏폼 애니메이션 버튼 (URL이 있을 때만 표시) */}
        {!isVision && animationUrl && (
          <button
            onClick={() => setShowAnimationModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 animate-pulse"
          >
            <span>📱</span> 30초 핵심 쇼츠
          </button>
        )}
      </div>

      {/* 영상 렌더링 영역 */}
      <div className="flex flex-col gap-6 mb-8">
        {currentLectureData?.videoUrls &&
        currentLectureData.videoUrls.length > 0 ? (
          currentLectureData.videoUrls.map((url, idx) => (
            <div
              key={idx}
              className="bg-black rounded-lg overflow-hidden shadow-lg aspect-video"
            >
              <iframe
                src={url.replace("/watch", "/iframe")}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            </div>
          ))
        ) : (
          <div className="bg-black rounded-lg overflow-hidden shadow-lg aspect-video">
            {videoUrl.includes("cloudflarestream.com") ? (
              <iframe
                src={videoUrl.replace("/watch", "/iframe")}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            ) : (
              <video
                src={videoUrl}
                controls
                className="w-full h-full object-contain"
              />
            )}
          </div>
        )}
      </div>

      {/* 퀴즈 렌더링 영역 */}
      {!isVision && (
        <>
          {currentLocalQuiz ? (
            <LocalQuizCard
              title={currentLocalQuiz.title}
              generateFunc={currentLocalQuiz.generateFunc}
            />
          ) : (
            <>
              <button
                onClick={fetchRandomProblem}
                className="mb-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all"
              >
                🎯 팝업 문제 풀기 (랜덤 생성)
              </button>

              {quizData && (
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-xl font-bold mb-4">
                    다음 문제를 해결하시오:
                  </h3>

                  {quizData.circuit_image && (
                    <div className="flex justify-center mb-6 bg-white p-4 rounded-lg border border-gray-100">
                      <img
                        src={`data:image/svg+xml;base64,${quizData.circuit_image.replace(/\n/g, "")}`}
                        alt="회로도"
                        className="max-w-full h-auto"
                      />
                    </div>
                  )}

                  <div className="text-3xl text-center mb-8 p-4 bg-gray-50 rounded">
                    <BlockMath
                      math={quizData.problem_latex.replace(/\$/g, "")}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {quizData.choices.map((choice, idx) => {
                      let btnClass =
                        "border-2 p-4 rounded-lg text-xl hover:bg-blue-50 transition-colors ";
                      if (selectedIndex === idx) {
                        btnClass += isCorrect
                          ? "border-green-500 bg-green-50"
                          : "border-red-500 bg-red-50";
                      } else if (
                        showSolution &&
                        idx === quizData.correct_index
                      ) {
                        btnClass += "border-green-500 bg-green-50";
                      } else {
                        btnClass += "border-gray-200";
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelect(idx)}
                          className={btnClass}
                        >
                          <span className="font-bold mr-3 text-gray-500">
                            {idx + 1})
                          </span>
                          <InlineMath math={choice.replace(/\$/g, "")} />
                        </button>
                      );
                    })}
                  </div>

                  {showSolution && (
                    <div className="animate-fade-in mt-6">
                      <p
                        className={`text-2xl font-bold text-center mb-6 ${isCorrect ? "text-green-600" : "text-red-600"}`}
                      >
                        {isCorrect
                          ? "🎉 정답입니다!"
                          : "😅 아쉽네요, 해설을 확인해 보세요."}
                      </p>
                      <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
                        <h4 className="text-lg font-bold mb-4 text-blue-800">
                          💡 단계별 해설
                        </h4>
                        <div className="space-y-4">
                          {quizData.steps.map((step) => (
                            <div
                              key={step.step_num}
                              className="p-4 bg-white rounded shadow-sm"
                            >
                              <p className="font-semibold text-gray-700 mb-2">
                                Step {step.step_num}. {step.description}
                              </p>
                              <div className="text-center text-lg">
                                <BlockMath
                                  math={step.latex.replace(/\$/g, "")}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ✅ [핵심 추가] 숏폼 애니메이션 모달 (9:16 세로형) */}
      {showAnimationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-[400px] bg-black rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            {/* 모달 상단 헤더 */}
            <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-gradient-to-b from-black/70 to-transparent">
              <span className="text-white font-bold text-sm bg-purple-600/80 px-3 py-1 rounded-full">
                💡 Manim 핵심 요약
              </span>
              <button
                onClick={() => setShowAnimationModal(false)}
                className="text-white bg-black/50 hover:bg-red-500/80 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* 9:16 세로형 Cloudflare Stream iframe 플레이어 */}
            <div className="relative w-full pb-[177.77%]">
              <iframe
                src={animationUrl}
                className="absolute top-0 left-0 w-full h-full border-none"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LectureDetail;
