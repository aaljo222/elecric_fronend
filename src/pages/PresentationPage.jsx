import "katex/dist/katex.min.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { BlockMath } from "react-katex";

const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");

// 📌 챕터 카드 (디자인 유지)
function ChapterCard({ item }) {
  console.log("item:", item);
  const concepts = item.concepts || [];

  return (
    <section className="w-full mb-16 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <span className="px-4 py-2 bg-blue-600 text-white rounded-lg text-lg font-black shadow-md tracking-wide">
            {item.code}
          </span>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            {item.title}
          </h2>
        </div>
      </div>

      <div className="p-10 bg-white">
        {concepts.length > 0 ? (
          <div className="flex flex-col gap-8">
            {concepts.map((concept, idx) => (
              <div
                key={idx}
                className="flex flex-col xl:flex-row gap-8 p-8 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                    <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                      {concept.name}
                    </h3>
                  </div>
                  <p className="text-xl text-slate-600 leading-relaxed font-medium pl-5">
                    {concept.summary}
                  </p>
                  {concept.definition && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-xl border-l-4 border-slate-400 ml-5">
                      <span className="text-sm font-bold text-slate-500 uppercase block mb-1">
                        Definition
                      </span>
                      <p className="text-lg text-slate-700">
                        {concept.definition}
                      </p>
                    </div>
                  )}
                </div>

                {concept.formulas && concept.formulas.length > 0 && (
                  <div className="xl:w-[450px] flex-shrink-0 flex flex-col justify-center">
                    <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6 shadow-sm group-hover:border-amber-300 transition-colors">
                      <h4 className="text-sm font-bold text-amber-600 mb-4 uppercase tracking-wider flex items-center gap-2">
                        <span>📐 Essential Formula</span>
                      </h4>
                      <div className="space-y-6">
                        {concept.formulas.map((f, fIdx) => (
                          <div
                            key={fIdx}
                            className="overflow-x-auto py-2 flex justify-center"
                          >
                            <span className="text-2xl text-slate-800">
                              <BlockMath math={f} />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400 text-xl font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            등록된 핵심 개념이 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}

// 📌 메인 페이지 (무한 스크롤 수정됨)
export default function PresentationPage() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0); // ✅ lastOrder 대신 page 사용
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef(null);

  const fetchNext = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      // ✅ limit=3, after는 (페이지 * 3)으로 건너뛰기
      const limit = 3;
      const skip = page * limit;

      const res = await fetch(
        `${API_BASE}/api/presentation/chapters?after=${skip}&limit=${limit}`
      );
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setItems((prev) => {
          // 중복 방지 (code 기준)
          const newItems = data.filter(
            (d) => !prev.some((p) => p.code === d.code)
          );
          return [...prev, ...newItems];
        });
        setPage((prev) => prev + 1); // ✅ 다음 페이지로 증가
      } else {
        setHasMore(false); // 더 이상 데이터 없음
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  // Observer 연결
  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNext();
      },
      { threshold: 0.1 }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [fetchNext, hasMore]);

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 md:px-8">
      <div className="w-full mx-auto">
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-black text-slate-800 mb-4 tracking-tight">
            전기기사 핵심 요약 노트
          </h1>
          <p className="text-xl text-slate-500 font-medium">
            주요 개념과 공식을 한눈에 학습하세요.
          </p>
        </header>

        {items.map((item) => (
          <ChapterCard key={item.code} item={item} />
        ))}

        <div
          ref={sentinelRef}
          className="h-40 flex justify-center items-center text-2xl text-gray-500 font-bold"
        >
          {loading && (
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              Loading...
            </div>
          )}
          {!hasMore && !loading && (
            <span className="opacity-50">모든 노트를 불러왔습니다.</span>
          )}
        </div>
      </div>
    </div>
  );
}
