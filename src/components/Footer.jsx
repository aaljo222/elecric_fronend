const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* 상단 3단 컬럼 영역 */}
        <div style={styles.topSection}>
          {/* 1. 회사 정보 */}
          <div style={styles.column}>
            <h3 style={styles.title}>에이아이컴퍼니</h3>
            <div style={styles.infoText}>
              <p>대표자: 이재오 | 사업자번호: 604-28-94788</p>
              <p>주소: 경기도 수원시 ○○구 ○○로 ○○</p>
              <p>이메일: ceo@aicompany.co.kr</p>
            </div>
          </div>

          {/* 2. 데이터 라이선스 */}
          <div style={styles.column}>
            <h3 style={styles.title}>데이터 라이선스</h3>
            <p style={styles.desc}>
              <strong>📜 한국전기설비규정(KEC)</strong>
              <br />
              대한전기협회 및 국가기술표준원의 공공 데이터를 기반으로 하며,
              저작권법 제7조에 의거하여 공유됩니다.
            </p>
            <p style={{ ...styles.desc, marginTop: "4px" }}>
              <strong>📐 자연 법칙 및 공식</strong>
              <br />
              학문적 사실 및 자연 법칙에 해당하여 저작권의 대상이 아닙니다.
            </p>
          </div>

          {/* 3. 면책 조항 */}
          <div style={styles.column}>
            <h3 style={styles.title}>면책 조항 (DISCLAIMER)</h3>
            <p style={styles.desc}>
              본 사이트의 정보는 학습 보조 자료일 뿐이며, 법적 효력을 보증하지
              않습니다. 최신 정보는{" "}
              <a
                href="#"
                style={{ color: "#555", textDecoration: "underline" }}
              >
                공식 사이트
              </a>
              를 확인하세요.
            </p>
            <p style={{ ...styles.desc, marginTop: "4px" }}>
              👉 이용약관 및 개인정보처리방침
            </p>
          </div>
        </div>

        {/* 하단 통합 바 (특허 문구 + 카피라이트) */}
        <div style={styles.bottomBar}>
          <div style={styles.patentText}>
            <span style={styles.badge}>특허 기술 적용</span>본 서비스는 전기기사
            학습 자동화 및 문제 생성에 관한{" "}
            <strong>특허 등록 기술(현재 특허 출원중)</strong>을 기반으로
            운영됩니다.
          </div>
          <div style={styles.copy}>
            © 2025 Electric License AI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#f9fafb", // 아주 연한 회색
    borderTop: "1px solid #eaeaea",
    padding: "20px 0 15px", // 상하 패딩 축소
    fontSize: "11px", // 전체 폰트 크기 축소 (컴팩트함의 핵심)
    color: "#666",
    letterSpacing: "-0.3px",
  },
  container: {
    width: "90%",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  topSection: {
    display: "flex",
    justifyContent: "space-between",
    gap: "30px", // 컬럼 사이 간격
    marginBottom: "15px", // 하단 바와의 간격 최소화
  },
  column: {
    flex: 1, // 3등분
  },
  title: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#333",
    marginBottom: "8px",
  },
  infoText: {
    lineHeight: "1.5",
  },
  desc: {
    lineHeight: "1.4",
    color: "#777",
  },
  /* 하단 바 스타일 */
  bottomBar: {
    borderTop: "1px solid #eee",
    paddingTop: "12px",
    display: "flex",
    justifyContent: "space-between", // 특허문구(좌) - 카피라이트(우) 배치
    alignItems: "center",
    flexWrap: "wrap",
  },
  patentText: {
    color: "#4a5568",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  badge: {
    backgroundColor: "#e3f2fd", // 연한 파랑 배경
    color: "#1976d2",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "10px",
    fontWeight: "700",
  },
  copy: {
    color: "#999",
    marginTop: "0", // 모바일 줄바꿈 대비용 (PC에선 0)
  },
};

export default Footer;
