import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getBoardList } from "../../api/boardApi";
import useCustomLogin from "../../hooks/useCustomLogin"; // ✅ 추가

const BoardListPage = () => {
  const { isLogin } = useCustomLogin(); // ✅ 로그인 여부

  const [posts, setPosts] = useState([]);
  const [pageInfo, setPageInfo] = useState({ total_pages: 1 });
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getBoardList({ page, size: 10 });
        setPosts(data?.items ?? []);
        setPageInfo(data ?? { total_pages: 1 });
      } catch (err) {
        console.error("게시글 목록 로드 실패:", err);
        setPosts([]);
        setPageInfo({ total_pages: 1 });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page]);

  const changePage = (newPage) => setSearchParams({ page: newPage });

  return (
    <>
      {/* 헤더 + 글쓰기 버튼(로그인만) */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">📌 게시판</h1>

        {isLogin ? (
          <Link
            to="/board/write"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ✍️ 글쓰기
          </Link>
        ) : (
          <Link
            to="/member/login"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            로그인 후 글쓰기
          </Link>
        )}
      </div>

      {/* 이하 동일 */}
      {loading && (
        <div className="text-center text-gray-500 py-10">불러오는 중...</div>
      )}

      {!loading && posts.length === 0 && (
        <div className="text-center text-gray-600 py-10">
          게시글이 없습니다.
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className="overflow-hidden rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 w-20">번호</th>
                <th className="p-3 text-left">제목</th>
                <th className="p-3 w-40">작성일</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="text-center p-3">{post.id}</td>
                  <td className="p-3">
                    <Link
                      to={`/board/${post.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="text-center p-3">
                    {post.created_at
                      ? new Date(post.created_at).toLocaleDateString("ko-KR")
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && pageInfo.total_pages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: pageInfo.total_pages }, (_, i) => i + 1).map(
            (p) => (
              <button
                key={p}
                onClick={() => changePage(p)}
                className={`px-4 py-2 rounded border ${
                  p === page
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>
      )}
    </>
  );
};

export default BoardListPage;
