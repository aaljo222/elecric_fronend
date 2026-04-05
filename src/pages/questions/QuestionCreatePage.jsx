import { useState } from "react";
import { createQuestion } from "../../api/questionApi";

const QuestionCreatePage = () => {
  const [question, setQuestion] = useState("");
  const [choice1, setChoice1] = useState("");
  const [choice2, setChoice2] = useState("");
  const [choice3, setChoice3] = useState("");
  const [choice4, setChoice4] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      question,
      choices: [choice1, choice2, choice3, choice4],
      answer,
    };

    const result = await createQuestion(payload);

    if (result?.success) {
      alert("문제 등록 완료!");
      setQuestion("");
      setChoice1("");
      setChoice2("");
      setChoice3("");
      setChoice4("");
      setAnswer("");
    } else {
      alert("등록 실패! API를 확인하세요.");
    }
  };

  return (
    <>
      <div className="text-3xl font-semibold mb-5">문제 추가하기</div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 shadow-md rounded"
      >
        <div>
          <label className="font-semibold">문제 내용</label>
          <textarea
            className="w-full border p-2 rounded mt-1"
            rows="4"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            className="border p-2 rounded"
            placeholder="보기 1"
            value={choice1}
            onChange={(e) => setChoice1(e.target.value)}
          />
          <input
            className="border p-2 rounded"
            placeholder="보기 2"
            value={choice2}
            onChange={(e) => setChoice2(e.target.value)}
          />
          <input
            className="border p-2 rounded"
            placeholder="보기 3"
            value={choice3}
            onChange={(e) => setChoice3(e.target.value)}
          />
          <input
            className="border p-2 rounded"
            placeholder="보기 4"
            value={choice4}
            onChange={(e) => setChoice4(e.target.value)}
          />
        </div>

        <div>
          <label>정답 번호 (1~4)</label>
          <input
            type="number"
            min="1"
            max="4"
            className="border p-2 rounded w-20 ml-2"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
          />
        </div>

        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          문제 등록하기
        </button>
      </form>
    </>
  );
};

export default QuestionCreatePage;
