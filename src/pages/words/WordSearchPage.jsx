// src/pages/words/WordSearchPage.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchWords } from "../../api/wordApi";

const WordSearchPage = () => {
  const [q, setQ] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const nav = useNavigate();
  const debounceRef = useRef(null);

  // 🔍 검색 (디바운스)
  const handleSearch = (value) => {
    setQ(value);
    setError(null);

    // 이전 타이머 제거
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // 입력 없으면 초기화
    if (!value || value.trim().length < 1) {
      setList([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await searchWords(value.trim());

        // ✅ 절대 map 에러 안 나게 방어
        const data = res?.data;
        setList(Array.isArray(data) ? data : []);

      } catch (err) {
        console.error("❌ word search error:", err);
        setError("용어 검색 중 오류가 발생했습니다.");
        setList([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  // 🔁 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* 🔍 검색 입력 */}
      <input
        className="
          w-full border p-2 mb-4 rounded
          focus:outline-none focus:ring
        "
        placeholder="전기 용어 검색 (예: 저항, 역률, ㅈㅇ)"
        value={q}
        onChange={(e) => handleSearch(e.target.value)}
      />

      {/* ⏳ 로딩 */}
      {loading && (
        <p className="text-sm text-gray-500 mb-2">
          🔍 검색 중...
        </p>
      )}

      {/* ❌ 에러 */}
      {error && (
        <p className="text-sm text-red-600 mb-2">
          {error}
        </p>
      )}

      {/* 📭 결과 없음 */}
      {!loading && q && list.length === 0 && !error && (
        <p className="text-sm text-gray-500">
          검색 결과가 없습니다.
        </p>
      )}

      {/* 📄 검색 결과 */}
      <ul className="divide-y">
        {Array.isArray(list) &&
          list.map((w) => (
            <li
              key={w.id}
              className="
                p-3 cursor-pointer
                hover:bg-gray-100
                transition
              "
              onClick={() => nav(`/words/${w.term}`)}
            >
              <div className="font-semibold">
                {w.term}
              </div>
              <div className="text-sm text-gray-600">
                {w.short_def}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default WordSearchPage;
