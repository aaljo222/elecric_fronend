import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getBoardById, deleteBoard } from "../../api/boardApi";
// import useCustomLogin from "../../hooks/useCustomLogin"; // 로그인 체크용 (있다면)

const BoardReadPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // const { loginState } = useCustomLogin(); // 작성자 체크용 (선택)

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getBoardById(id);
        setPost(data ?? null);
      } catch (err) {
        console.error("게시글 조회 실패:", err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) return;

    try {
      await deleteBoard(id);
      alert("삭제되었습니다.");
      navigate("/board");
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-10">
        불러오는 중...
      </div>
    );
  }

  if (!post) {
    return (
      <>
        <div className="text-center py-10 text-gray-500">
          해당 게시글을 찾을 수 없습니다.
        </div>
        <div className="text-center mt-6">
          <Link
            to="/board"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            목록으로
          </Link>
        </div>
      </>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-3">{post.title}</h1>

      <p className="text-gray-500 mb-6">
        작성일:{" "}
        {post.created_at
          ? new Date(post.created_at).toLocaleString()
          : "-"}
      </p>

      {/* 🔥 HTML 렌더링 */}
      <div
        className="bg-white p-6 shadow rounded prose mb-6 leading-relaxed text-lg"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="flex gap-3">
        <Link
          to="/board"
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          목록으로
        </Link>

        {/* ✏️ 수정 */}
        <Link
          to={`/board/edit/${post.id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          수정
        </Link>

        {/* 🗑 삭제 */}
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default BoardReadPage;
