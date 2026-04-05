import { Link } from "react-router-dom";

const Copyright = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-auto text-xs text-gray-500">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* 상단: 3단 컬럼 정보 영역 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-6">
          {/* 1. 회사 정보 (압축형) */}
          <div>
            <h3 className="font-bold text-gray-800 mb-2">에이아이컴퍼니</h3>
            <div className="leading-relaxed space-y-1">
              <p>
                <span className="font-medium text-gray-600 mr-2">대표자</span>
                이재오
                <span className="mx-2 text-gray-300">|</span>
                <span className="font-medium text-gray-600 mr-2">
                  사업자번호
                </span>
                824-87-03549
              </p>
              <p>
                <span className="font-medium text-gray-600 mr-2">주소</span>
                경기도 수원시 권선구 구운동 532-1번지
              </p>
              <p>
                <span className="font-medium text-gray-600 mr-2">이메일</span>
                ceo@aicompany.co.kr
              </p>
            </div>
          </div>

          {/* 2. 데이터 라이선스 */}
          <div>
            <h3 className="font-bold text-gray-800 mb-2">데이터 라이선스</h3>
            <ul className="space-y-2">
              <li>
                <span className="font-medium text-gray-600 block">
                  📜 한국전기설비규정(KEC)
                </span>
                공공 데이터 기반 (저작권법 제7조 의거 공유)
              </li>
              <li>
                <span className="font-medium text-gray-600 block">
                  📐 자연 법칙 및 공식
                </span>
                학문적 사실 및 자연 법칙 (저작권 대상 아님)
              </li>
            </ul>
          </div>

          {/* 3. 면책 조항 */}
          <div>
            <h3 className="font-bold text-gray-800 mb-2">
              면책 조항 (Disclaimer)
            </h3>
            <p className="leading-relaxed mb-2">
              본 정보는 학습 보조 자료이며 법적 효력을 보증하지 않습니다. 최신
              정보는{" "}
              <a
                href="http://kec.kea.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                공식 사이트
              </a>
              를 확인하세요.
            </p>
            <Link
              to="/copyright"
              className="text-gray-600 hover:text-blue-600 font-medium inline-flex items-center"
            >
              👉 이용약관 및 개인정보처리방침
            </Link>
          </div>
        </div>

        {/* 하단: 구분선 및 특허/카피라이트 가로 배치 */}
        <div className="border-t border-gray-200 pt-4 flex flex-col md:flex-row justify-between items-center gap-2">
          {/* 특허 문구 (왼쪽 배치) */}
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded text-blue-800">
            <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              PATENT
            </span>
            <span className="font-medium">
              특허 등록 기술 (현재 출원중) 기반 운영
            </span>
          </div>

          {/* 카피라이트 (오른쪽 배치) */}
          <p className="text-gray-400">
            © 2026 Electric License AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Copyright;
