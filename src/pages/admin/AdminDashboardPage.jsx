import AdminDashboard from "../../components/admin/AdminDashboard";
import AdminQuestionGenerator from "../../components/admin/AdminQuestionGenerator";
import AdminGeminiIngest from "../../components/admin/AdminGeminiIngest"; // 👈 추가
import AutoVideoGenerator from "../../components/AutoVideoGenerator";

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">관리자 제어 센터</h1>
      
      {/* 1. 대시보드 통계 */}
      <AdminDashboard />

      <div className="grid grid-cols-1 gap-8 mt-8">
        {/* 2. Gemini Vision 원서 분석기 (New!) */}
        <section>
          <AdminGeminiIngest />
        </section>
      {/* ✅ 여기에 자동 생성기 버튼 추가 */}
      <AutoVideoGenerator />
        {/* 3. 기존 문제 생성기 */}
        <section>
           <AdminQuestionGenerator />
        </section>
      </div>
    </div>
  );
}