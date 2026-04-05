export default function ServicePage() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-10">
      {/* 제목 */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          AI 기반 시험 문제 생성 플랫폼
        </h1>
        <p className="text-gray-600">
          전기기사 필기 시험을 시작으로, 모든 시험 문항 생성을 목표로 합니다.
        </p>
      </div>

      {/* 플랫폼 강점 */}
      <section>
        <h2 className="text-xl font-semibold mb-3">📌 플랫폼 핵심 강점</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>AI 기반 신규 문제 자동 생성 (문제은행 아님)</li>
          <li>오답 분석 기반 반복 학습 구조</li>
          <li>전기기사 필기 5과목 균형 출제</li>
          <li>개념 그래프 기반 문제 설계</li>
        </ul>
      </section>

      {/* 운영자 강점 */}
      <section>
        <h2 className="text-xl font-semibold mb-3">
          👤 콘텐츠 제작 및 검수 구조
        </h2>
        <p className="text-gray-700 leading-relaxed">
          본 플랫폼의 모든 문제는 AI가 생성하되,
          <strong className="text-indigo-600">
            전기 전문 지식을 보유한 전문가가 직접 검수
          </strong>
          한 문항만 DB에 반영됩니다.
        </p>
      </section>

      {/* ⭐️ 특허 강조 영역 */}
      <section className="border-2 border-indigo-600 bg-indigo-50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-indigo-700 mb-4">
          ⭐️ 특허 출원 중인 핵심 기술
        </h2>

        <ul className="list-disc pl-6 space-y-2 text-gray-800">
          <li>AI 기반 시험 문제 자동 생성 기술 (특허 출원 중)</li>
          <li>문제 생성 · 정답 검증 · 해설 구조화를 통합한 시스템</li>
          <li>
            전기기사에 한정되지 않고
            <strong className="text-red-600">
              &nbsp;모든 시험 문항 생성에 적용 가능
            </strong>
          </li>
        </ul>

        <div className="mt-4 p-4 bg-white border-l-4 border-red-500">
          <p className="font-semibold text-red-600 mb-1">⚠️ 중요 안내</p>
          <p className="text-sm text-gray-700">
            본 기술은 시험 담당자의 직접 검수를 전제로 설계되었습니다. 따라서
            교육업체·학원·출판사와의 협업을 통해서만 완성도 높은 서비스 제공이
            가능합니다.
          </p>
        </div>
      </section>

      {/* B2B 문의 */}
      <section className="bg-red-50 border border-red-300 rounded-lg p-6">
        <h2 className="text-lg font-bold text-red-700 mb-2">
          🤝 교육업체 / 기관 협업 안내
        </h2>
        <p className="text-gray-800">
          본 문제 생성 기술은 단독 라이선스, 공동 개발, 내부 문제 생성 시스템
          형태로 제공 가능합니다.
        </p>
        <p className="mt-2 font-semibold">
          📩 교육기관·학원·출판사 관계자분들은 별도 문의 바랍니다.
        </p>
      </section>

      {/* 서비스 로드맵 */}
      <section>
        <h2 className="text-xl font-semibold mb-3">🗓 서비스 로드맵</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>현재: Beta 테스트 (무료)</li>
          <li>
            ~ ~ 2025년 3월: 전기기사 시험에서 많은 수험생이 어려움을 겪는
            수학·공학 수학 영역을 기초부터 단계적으로 설명하는 이론 영상 콘텐츠
            제작
          </li>
          <li>
            <strong className="text-indigo-600">
              2025년 4월: 정식 오픈 및 유료 구독 전환
            </strong>
          </li>
        </ul>
      </section>

      {/* 마무리 */}
      <div className="text-center text-gray-600 italic">
        본 사이트는 현재 Beta 버전이며, 정식 오픈 시 서버 성능 및 응답 속도가
        향상됩니다.
      </div>
    </div>
  );
}
