const CopyrightPage = () => {
  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-6">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        {/* 상단 헤더 */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-10 text-center">
          <h1 className="text-3xl font-bold mb-2">저작권 정책 및 법적 고지</h1>
          <p className="text-slate-300">Electric License AI 서비스 이용 안내</p>
        </div>

        {/* 본문 콘텐츠 */}
        <div className="p-10 space-y-12 text-gray-700 leading-relaxed">
          {/* 섹션 1: 데이터 출처 및 공공성 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 border-b-2 border-blue-500 inline-block pb-2 mb-4">
              1. 데이터 출처 및 저작권 안내
            </h2>
            <div className="bg-blue-50 p-6 rounded-lg text-sm space-y-3 border border-blue-100">
              <p>
                본 서비스에서 제공하는 학습 자료는 다음과 같은 기준에 따라
                구성되었습니다.
              </p>
              <ul className="list-disc pl-5 space-y-2 marker:text-blue-500">
                <li>
                  <strong className="text-gray-900">
                    한국전기설비규정(KEC):
                  </strong>
                  대한전기협회 및 산업통상자원부에서 고시한 법령 및 기술 기준은
                  저작권법 제7조(보호받지 못하는 저작물)에 의거하여, 누구나
                  자유롭게 이용할 수 있는 공공 데이터입니다.
                </li>
                <li>
                  <strong className="text-gray-900">
                    학문적 사실 및 공식:
                  </strong>
                  옴의 법칙, 맥스웰 방정식 등 자연 과학 법칙과 수학적 공식은
                  인류 공통의 자산으로 저작권의 대상이 아닙니다.
                </li>
                <li>
                  <strong className="text-gray-900">서비스 고유 자산:</strong>위
                  데이터를 기반으로{" "}
                  <span className="text-blue-600 font-semibold">
                    AI가 재가공한 설명, 지식 그래프의 연결 구조(Node Structure),
                    UI/UX 디자인, 소스 코드
                  </span>
                  는 <strong>에이아이컴퍼니</strong>의 독점적 저작물입니다. 이를
                  무단으로 크롤링하거나 상업적으로 복제하는 행위를 금합니다.
                </li>
              </ul>
            </div>
          </section>

          {/* 섹션 2: 면책 조항 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 border-b-2 border-red-500 inline-block pb-2 mb-4">
              2. 면책 조항 (Disclaimer)
            </h2>
            <div className="text-sm space-y-4">
              <p>
                본 서비스는 전기기사 자격증 취득을 돕기 위한{" "}
                <strong>학습 보조 도구</strong>입니다. 개발팀은 데이터의
                최신성과 정확성을 유지하기 위해 최선을 다하고 있으나, AI 모델의
                특성상 의도치 않은 오류가 포함될 수 있습니다.
              </p>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 font-medium">
                ⚠️ 주의: 본 사이트의 정보를 실제 전기 설비의 시공, 감리, 안전
                관리 업무의 법적 근거로 활용하여 발생한 모든 문제에 대해 서비스
                제공자는 법적 책임을 지지 않습니다. 실무 적용 시에는 반드시 관련
                법령 원문을 확인하시기 바랍니다.
              </div>
            </div>
          </section>

          {/* 섹션 3: 지식재산권 및 특허 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 border-b-2 border-green-500 inline-block pb-2 mb-4">
              3. 지식재산권 및 특허
            </h2>
            <p className="text-sm mb-4">
              본 서비스에 적용된{" "}
              <strong>
                "지식 그래프 기반 자동 문제 생성 및 학습 경로 추천 알고리즘"
              </strong>
              은 특허청에 출원 중인 기술입니다.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="border p-4 rounded bg-gray-50">
                <strong>특허 출원(3건)</strong> 
            <ul className="space-y-2 text-gray-700 text-sm md:text-base">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-1">•</span>
                  <span>
                    문장형 문제 기반 자동 풀이 및 맞춤형 문항을 생성하기 위한 시스템 및 방법
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-1">•</span>
                  <span>학습용 지식 데이터베이스 구축 시스템</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-1">•</span>
                  <span>전기 산업용 지식 기반 판단 시스템</span>
                </li>
              </ul>
              </div>
              <div className="border p-4 rounded bg-gray-50">
                <strong>권리 보유자:</strong> 에이아이컴퍼니 (대표: 이재오)
              </div>
            </div>
          </section>
        </div>

        {/* 하단 문의처 */}
        <div className="bg-gray-50 p-8 text-center border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">
            저작권 관련 신고 및 데이터 수정 요청
          </p>
          <a
            href="mailto:ceo@aicompany.co.kr"
            className="text-blue-600 font-bold hover:underline text-lg"
          >
            ceo@aicompany.co.kr
          </a>
        </div>
      </div>
    </div>
  );
};

export default CopyrightPage;
