import React, { useState } from "react";
import axios from "axios";

// ⚠️ 배포된 Railway 백엔드 주소 (마지막에 슬래시 없어야 함)
const API_BASE_URL = "https://cloudflareprj-production.up.railway.app";

const VideoUpload = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("전기자기학"); // 기본값
  const [concept, setConcept] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file || !title || !concept) {
      alert("모든 항목을 입력해주세요!");
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // 1. 백엔드에 "업로드할 URL 줘!" 요청
      console.log("1. 업로드 URL 요청 중...");
      const {
        data: { uploadURL, uid },
      } = await axios.post(`${API_BASE_URL}/api/video/upload-url`, null, {
        params: { title: title }, // 쿼리 파라미터로 제목 전달
      });

      // 2. 받아온 URL로 Cloudflare에 직접 영상 전송
      console.log("2. Cloudflare로 영상 전송 중...");
      const formData = new FormData();
      formData.append("file", file);

      await axios.post(uploadURL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        },
      });

      // 3. 업로드 완료 후 백엔드에 "이 영상 정보 저장해!" 요청 (Neo4j 저장)
      console.log("3. 메타데이터 저장 중...");
      await axios.post(`${API_BASE_URL}/api/video/complete`, {
        uid: uid,
        title: title,
        subject: subject,
        concept: concept,
      });

      alert("🎉 업로드 및 저장 성공!");
      // 입력창 초기화
      setFile(null);
      setTitle("");
      setConcept("");
      setProgress(0);
    } catch (error) {
      console.error("업로드 실패:", error);
      alert("에러가 발생했습니다. 개발자 도구(F12) 콘솔을 확인하세요.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white border rounded shadow-md max-w-lg mx-auto">
      <h3 className="text-xl font-bold mb-4">📹 강의 영상 업로드</h3>

      <div className="space-y-4">
        {/* 과목 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            과목
          </label>
          <select
            className="w-full border p-2 rounded mt-1"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="전기자기학">전기자기학</option>
            <option value="회로이론">회로이론</option>
            <option value="전력공학">전력공학</option>
          </select>
        </div>

        {/* 강의 제목 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            강의 제목
          </label>
          <input
            type="text"
            className="w-full border p-2 rounded mt-1"
            placeholder="예: 1강 - 쿨롱의 법칙"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* 핵심 개념 (지식 그래프용) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            핵심 개념
          </label>
          <input
            type="text"
            className="w-full border p-2 rounded mt-1"
            placeholder="예: 쿨롱의 법칙, 가우스 정리"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
          />
        </div>

        {/* 파일 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            영상 파일
          </label>
          <input
            type="file"
            accept="video/*"
            className="w-full mt-1"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        {/* 업로드 버튼 */}
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`w-full py-2 px-4 rounded text-white font-bold ${
            uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading ? `업로드 중... ${progress}%` : "🚀 업로드 시작"}
        </button>
      </div>
    </div>
  );
};

export default VideoUpload;
