import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBoardPost } from "../../api/boardApi";

const BoardWritePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      await createBoardPost({ title, content });
      alert("게시글이 등록되었습니다!");
      navigate("/board");
    } catch (error) {
      console.error("게시글 등록 오류:", error);
      alert("게시글 등록 실패!");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">📝 게시글 작성</h1>

      <form
        onSubmit={onSubmit}
        className="bg-white p-6 rounded-lg shadow-md space-y-6"
      >
        <div>
          <label className="block text-lg font-semibold mb-2">제목</label>
          <input
            type="text"
            className="w-full border p-3 rounded-md"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2">내용</label>
          <textarea
            className="w-full border p-3 rounded-md min-h-[200px]"
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            등록하기
          </button>
        </div>
      </form>
    </>
  );
};

export default BoardWritePage;
