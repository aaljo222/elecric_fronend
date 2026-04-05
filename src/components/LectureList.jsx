import React, { useEffect, useState } from "react";
import axios from "axios";

// 대표님의 실제 Railway 주소
const API_BASE_URL = "https://cloudflareprj-production.up.railway.app";

const LectureList = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // 1. 강의 목록 가져오기
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/video/list`);
        setVideos(res.data);
      } catch (err) {
        console.error("목록 불러오기 실패:", err);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 className="text-2xl font-bold mb-4">📚 내 강의실</h2>

      {/* 2. 비디오 플레이어 (선택된 경우만 표시) */}
      {selectedVideo && (
        <div style={{ marginBottom: "30px" }}>
          <iframe
            src={`https://iframe.videodelivery.net/${selectedVideo}`}
            style={{ border: "none", width: "100%", height: "450px" }}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen={true}
            title="Cloudflare Player"
          ></iframe>
        </div>
      )}

      {/* 3. 강의 리스트 */}
      <ul className="space-y-2">
        {videos.map((v) => (
          <li
            key={v.uid}
            onClick={() => setSelectedVideo(v.uid)}
            className="p-4 border rounded hover:bg-gray-100 cursor-pointer flex justify-between"
          >
            <span>📺 {v.title}</span>
            <span className="text-gray-500 text-sm">재생하기 ▶</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LectureList;
