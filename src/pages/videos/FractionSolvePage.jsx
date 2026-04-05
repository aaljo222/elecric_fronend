import React, { useState } from "react";
import { useParams } from "react-router-dom";
import 'katex/dist/katex.min.css';
import { BlockMath } from "react-katex";
import { getFractionSteps } from "../../api/mathApi.js";

const FractionSolvePage = () => {
  const { videoId } = useParams();
  const [steps, setSteps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  // 임시 동영상 URL (Supabase Storage URL 등으로 교체)
  const videoUrl = `https://your-supabase-url.com/videos/${videoId}.mp4`;

  const handleShowSolution = async () => {
    if (showSolution) return; // 이미 불러온 경우 중복 호출 방지
    
    setIsLoading(true);
    const result = await getFractionSteps(videoId);
    if (result && result.status === "success") {
      setSteps(result.data);
      setShowSolution(true);
    } else {
      alert("풀이 과정을 불러오지 못했습니다.");
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">📺 분수 문제 풀이 학습</h2>
      
      {/* 동영상 플레이어 영역 */}
      <div className="bg-black rounded-lg overflow-hidden shadow-lg mb-6 aspect-video">
        <video 
          src={videoUrl} 
          controls 
          className="w-full h-full object-contain"
          controlsList="nodownload"
        />
      </div>

      {/* 풀이 보기 버튼 */}
      {!showSolution && (
        <button 
          onClick={handleShowSolution}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          {isLoading ? "불러오는 중..." : "💡 단계별 풀이 보기 (무료)"}
        </button>
      )}

      {/* 단계별 풀이 렌더링 영역 */}
      {showSolution && steps.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">📝 풀이 과정</h3>
          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.step_num} className="p-4 bg-gray-50 rounded-md border-l-4 border-blue-500">
                <p className="font-semibold text-gray-700 mb-2">
                  Step {step.step_num}. {step.description}
                </p>
                {/* KaTeX를 이용한 수식 렌더링 */}
                <div className="text-lg overflow-x-auto text-center">
                  <BlockMath math={step.latex.replace(/\$/g, '')} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FractionSolvePage;