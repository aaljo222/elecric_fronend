import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BlockMath, InlineMath } from "react-katex";

import {
  getWordDetail,
  getAiWordExplanation,
  getQuestionsByWord,
} from "../../api/wordApi";

const WordDetailPage = () => {
  const { term } = useParams();
  const navigate = useNavigate();

  const [word, setWord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [aiText, setAiText] = useState("");
  const [aiLevel, setAiLevel] = useState(null);
  const [aiCached, setAiCached] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [qLoading, setQLoading] = useState(false);

  /* ===============================
     1️⃣ 용어 상세 조회
  =============================== */
  useEffect(() => {
    const loadWord = async () => {
      try {
        setLoading(true);
        const res = await getWordDetail(term);
        setWord(res.data);
      } catch (e) {
        setError("용어 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadWord();
  }, [term]);

  /* ===============================
     2️⃣ AI 설명 로드
  =============================== */
  const loadAI = async (level) => {
    return "비용 지불후  사용하세요";
    // try {
    //   setAiLoading(true);
    //   setAiText("");
    //   setAiLevel(level);

    //   const res = await getAiWordExplanation(term, level);
    //   setAiText(res.data.content);
    //   setAiCached(res.data.cached);
    // } catch (e) {
    //   setAiText("AI 설명을 불러오지 못했습니다.");
    // } finally {
    //   setAiLoading(false);
    // }
  };

  /* ===============================
     3️⃣ 관련 문제 로드
  =============================== */
  const toggleQuestions = async () => {
    if (showQuestions) {
      setShowQuestions(false);
      return;
    }

    try {
      setQLoading(true);
      const res = await getQuestionsByWord(term);
      setQuestions(res.data || []);
      setShowQuestions(true);
    } catch (e) {
      setQuestions([]);
      setShowQuestions(true);
    } finally {
      setQLoading(false);
    }
  };

  const renderLatex = (text) => {
    return text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g).map((part, idx) => {
      if (part.startsWith("$$")) {
        return <BlockMath key={idx}>{part.slice(2, -2)}</BlockMath>;
      }

      if (part.startsWith("$")) {
        return <InlineMath key={idx}>{part.slice(1, -1)}</InlineMath>;
      }

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

  /* ===============================
     렌더링 분기
  =============================== */
  if (loading) return <p className="p-6">로딩 중...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!word) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* ===============================
          용어 기본 정보
      =============================== */}
      <div>
        <h1 className="text-3xl font-bold">{word.term}</h1>
        {word.short_def && (
          <p className="text-gray-600 mt-2">{word.short_def}</p>
        )}
      </div>

      {word.full_def && (
        <div className="bg-gray-50 p-4 rounded border">
          {renderLatex(word.full_def)}
        </div>
      )}

      {/* ===============================
          AI 설명 버튼
      =============================== */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => loadAI("basic")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          🤖 기본 설명
        </button>
        <button
          onClick={() => loadAI("exam")}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          📘 시험 설명
        </button>
        <button
          onClick={toggleQuestions}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          📄 이 용어가 나온 문제 보기
        </button>
      </div>

      {/* ===============================
          AI 설명 결과
      =============================== */}
      {aiLoading && <p>AI 설명 생성 중...</p>}

      {aiText && (
        <div className="border rounded p-4 bg-white">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">
              {aiLevel === "basic" ? "기본 설명" : "시험 설명"}
            </h3>
            <span className="text-xs text-gray-500">
              {aiCached ? "📦 저장된 설명" : "✨ 새로 생성됨"}
            </span>
          </div>
          <div className="leading-relaxed">{renderLatex(aiText)}</div>
        </div>
      )}

      {/* ===============================
          관련 문제 목록
      =============================== */}
      {showQuestions && (
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">🔍 "{term}"이(가) 포함된 문제</h3>

          {qLoading && <p>문제 불러오는 중...</p>}

          {!qLoading && questions.length === 0 && (
            <p className="text-gray-500">관련 문제가 없습니다.</p>
          )}

          <ul className="space-y-2">
            {questions.map((q, idx) => (
              <li
                key={q.id}
                onClick={() => navigate(`/questions/${q.id}`)}
                className="
                  p-3 border rounded cursor-pointer
                  hover:bg-gray-50 transition
                "
              >
                <span className="font-semibold mr-2">Q{idx + 1}.</span>
                {q.question || q.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WordDetailPage;
