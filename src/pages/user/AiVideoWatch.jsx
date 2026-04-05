export default function AiVideoWatch() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 영상 관련 상태
  const [videoInfo, setVideoInfo] = useState(null);
  const [allVideos, setAllVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 💡 [추가] 퀴즈 관련 상태
  const [quizData, setQuizData] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  // AiVideoWatch.jsx 내부 함수 수정
  const fetchRandomQuiz = async () => {
    try {
      // 1. 새로운 데이터를 가져오기 전에 모든 상태를 즉시 초기화!
      setSelectedIndex(null);
      setIsCorrect(null);
      setShowSolution(false);
      setQuizData(null); // 💡 문제를 잠시 비워 로딩 효과를 줍니다.

      const endpoint = id.includes("circuit")
        ? "/api/circuit/random"
        : "/api/math/random";
      const res = await apiClient.get(`${endpoint}?type=${id}`);

      // 2. 새로운 데이터 세팅
      setQuizData(res.data);
    } catch (e) {
      console.error("퀴즈 로딩 실패:", e);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // 1. 영상 정보
        const resUrl = await apiClient.get(`/api/video/url/${id}`);
        console.log("DB에서 가져온 영상 데이터:", resUrl.data); // 👈 여기서 video_url이 잘 오는지 확인!
        const playableUrl =
          resUrl.data.video_url?.replace("/watch", "/iframe") || "";
        setVideoInfo({ ...resUrl.data, video_url: playableUrl });

        // 2. 전체 목록
        const resList = await apiClient.get("/api/video/list");
        setAllVideos(resList.data);

        // 3. 첫 번째 퀴즈 가져오기
        await fetchRandomQuiz();
      } catch (e) {
        console.error("데이터 로딩 실패:", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleQuizSelect = (index) => {
    if (showSolution) return;
    const correct = index === quizData.correct_index;
    setSelectedIndex(index);
    setIsCorrect(correct);
    setShowSolution(true);
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );

  return (
    <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 좌측: 플레이어 영역 */}
        <div className="flex-1">
          <button
            onClick={() => navigate("/user/videos")}
            className="mb-6 text-[#0047a5] font-bold flex items-center gap-1"
          >
            <MoveLeft size={20} /> 돌아가기
          </button>
          <h2 className="text-2xl font-bold mb-4">{videoInfo?.title}</h2>
          <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl mb-8">
            {videoInfo?.video_url ? (
              <iframe
                src={videoInfo.video_url}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="h-full flex items-center justify-center text-white">
                영상 준비 중
              </div>
            )}
          </div>
        </div>

        {/* 우측: 재생 목록 */}
        <aside className="w-full lg:w-80">
          <SidebarPlaylist
            currentId={id}
            currentSubject={videoInfo?.subject}
            allVideos={allVideos}
            onMove={(targetId) => navigate(`/user/videos/${targetId}`)}
          />
        </aside>
      </div>

      {/* 💡 [수정] 퀴즈 카드 영역 - Props 전달 필수! */}
      {/* 💡 퀴즈 카드 영역: 함수 이름(onFetch)을 자식과 일치시킵니다! */}
      <section className="max-w-4xl mx-auto w-full">
        <ApiQuizCard lectureId={id} />
      </section>
    </main>
  );
}
