import React, { useEffect } from 'react';

const termsContent = (
  <div className="doc-content-body">
    <h4>제1조 (목적)</h4>
    <p>본 약관은 [홍민아](이하 "개발자")가 개발한 교육용 발표자 추첨 프로그램 **'Ready Player Draw'**(이하 "본 서비스")를 이용자가 이용함에 있어 필요한 제반 사항을 규정하는 것을 목적으로 합니다.</p>
    
    <h4>제2조 (용어의 정의)</h4>
    <p>1. <strong>"이용자"</strong>란 본 서비스에 접속하여 서비스를 이용하는 교사 및 학생을 말합니다.</p>
    <p>2. <strong>"기기 데이터"</strong>란 이용자가 학급 운영을 위해 직접 등록한 학생 명단, 추첨 히스토리, 윤리 가이드 서약 여부 등 브라우저 로컬 스토리지(LocalStorage)에 저장되는 데이터를 말합니다.</p>
    
    <h4>제3조 (약관의 효력 및 변경)</h4>
    <p>1. 본 약관은 서비스 메인 화면 하단 또는 최초 진입 시 링크를 통해 게시함으로써 효력이 발생합니다.</p>
    <p>2. 개발자는 교육적 목적 또는 법령의 변경에 따라 본 약관을 변경할 수 있으며, 변경된 약관은 서비스 내에 고지합니다.</p>
    
    <h4>제4조 (서비스의 이용 및 제한)</h4>
    <p>1. 본 서비스는 학교 수업, 학급 활동 등 비상업적인 교육적 목적으로만 무료로 이용할 수 있습니다.</p>
    <p>2. 상업적인 목적의 이용, 시스템에 무단으로 위해를 가하는 행위 등은 금지되며, 부적절한 이용 시 서비스 이용이 제한될 수 있습니다.</p>
    
    <h4>제5조 (개발자의 의무)</h4>
    <p>1. 개발자는 학교 교육 활동이 원활히 이루어질 수 있도록 안정적이고 쾌적한 서비스를 제공하기 위해 노력합니다.</p>
    <p>2. 개발자는 이용자의 개인정보를 전송받거나 수집하지 않으며, 브라우저 환경에서 안전하게 작동하도록 소프트웨어를 관리합니다.</p>
    
    <h4>제6조 (이용자의 의무)</h4>
    <p>1. 이용자는 본 약관 및 교육 현장의 윤리적 가이드라인을 준수해야 합니다.</p>
    <p>2. 이용자가 입력한 학생 명단 및 데이터는 이용자 본인의 기기에 저장되므로, 기기 분실이나 브라우저 초기화로 인해 데이터가 유실되지 않도록 관리할 책임은 이용자에게 있습니다.</p>
    <p>3. 생성형 AI 활용 윤리 핵심가이드를 준수하고 실천할 의무가 있습니다.</p>
    
    <h4>제7조 (면책 조항)</h4>
    <p>1. 본 서비스는 교육적 공익 목적으로 개발되어 무상으로 제공되는 소프트웨어입니다. 서비스 이용 중 발생한 데이터의 일시적 유실이나 장애에 대해 개발자는 고의 또는 중과실이 없는 한 책임을 지지 않습니다.</p>
    <p>2. 인터넷 환경, 학교 방화벽 및 네트워크 설정으로 인해 발생하는 서비스의 접속 지연 및 제한에 대해서는 책임을 지지 않습니다.</p>
    
    <h4>제8조 (분쟁 해결 및 관할 법원)</h4>
    <p>본 서비스의 이용과 관련하여 분쟁이 발생할 경우, 상호 협의하여 교육적으로 해결하는 것을 원칙으로 하며, 부득이 소송이 제기될 경우 개발자 소속 학교 관할 법원을 합의 관할 법원으로 합니다.</p>
    
    <div className="doc-footer-date">
      <strong>부칙</strong><br />
      이 약관은 2026년 6월 27일부터 시행합니다.
    </div>
  </div>
);

const privacyContent = (
  <div className="doc-content-body">
    <h4>제1조 (개인정보의 처리 목적)</h4>
    <p>본 서비스는 학교 수업 및 학급 운영 중 발표자 추첨(Lucky Draw)을 원활하게 수행하기 위한 최소한의 데이터를 처리합니다. 본 서비스는 <strong>별도의 회원가입 없이 이용할 수 있는 순수 클라이언트 사이드 웹 애플리케이션</strong>으로, 어떠한 경우에도 수집된 정보를 서버에 전송하거나 타인에게 공유하지 않습니다.</p>
    <p>1. 학생 명단 관리: 학급 발표자 추첨 대상을 식별하기 위한 목적</p>
    <p>2. 추첨 이력 관리: 수업 중 발표 순서 확인 및 공정한 추첨 기록 보관을 위한 목적</p>
    
    <h4>제2조 (개인정보의 처리 및 보유기간)</h4>
    <p>1. 본 서비스는 서비스의 작동 특성상 이용자가 직접 입력한 데이터를 웹 브라우저의 <strong>로컬 스토리지(LocalStorage)</strong>에만 보관하며, 외부 서버에 저장하지 않습니다.</p>
    <p>2. <strong>보유 기간</strong>: 이용자가 직접 웹 브라우저의 임시 인터넷 파일(캐시 및 쿠키)을 삭제하거나 서비스 내에서 '학생 목록 초기화' 버튼을 누르기 전까지 보존됩니다. 교육 활동 목적이 완료되는 해당 학년도 종료 시(익년 2월 말) 또는 진급 시 이용자는 스스로 데이터를 초기화할 것을 권장합니다.</p>
    
    <h4>제3조 (처리하는 개인정보 항목)</h4>
    <p>본 서비스는 기능 수행을 위해 필요한 최소한의 데이터만 입력받습니다.</p>
    <p>1. <strong>필수 항목</strong>: 이용자가 등록한 학생 이름 (또는 닉네임)</p>
    <p>2. <strong>자동 수집 항목</strong>: 최근 추첨 이력(이름 및 추첨 시간), 윤리 핵심가이드 서약 완료 여부</p>
    <p>3. <strong>수집하지 않는 항목</strong>: 비밀번호, 주민등록번호, 연락처, 이메일, 주소 등 불필요한 민감 정보는 일체 수집하거나 입력받지 않습니다.</p>
    
    <h4>제4조 (만 14세 미만 아동의 개인정보 처리에 관한 사항)</h4>
    <p>1. 본 서비스는 오직 기기(웹 브라우저) 내에서만 데이터가 기록되므로 외부로 개인정보가 유출될 우려가 없습니다.</p>
    <p>2. 단, 원활한 교육 활동과 학급 명단 관리를 위해 필요한 경우, 학교 또는 교사는 학기 초 가정통신문(개인정보 수집·이용 동의서)을 통하여 법정대리인의 동의를 득한 후 학생 명단을 등록하여 활용하시기 바랍니다.</p>
    
    <h4>제5조 (개인정보의 파기 절차 및 방법)</h4>
    <p>본 서비스는 이용자가 직접 데이터를 완벽하게 파기할 수 있는 통제권을 가집니다.</p>
    <p>1. <strong>파기 절차</strong>: 이용자가 서비스 내의 <strong>[학생 목록 초기화]</strong> 버튼이나 <strong>[기록 지우기]</strong> 버튼을 클릭하면 관련 데이터가 즉시 삭제됩니다.</p>
    <p>2. <strong>파기 방법</strong>: 브라우저 로컬 저장소(LocalStorage)에서 해당 항목을 영구 삭제(Remove Item) 처리합니다.</p>
    
    <h4>제6조 (개인정보의 안전성 확보조치)</h4>
    <p>본 서비스는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
    <p>1. <strong>서버 수집 배제</strong>: 데이터를 보관하는 데이터베이스 서버를 두지 않고 이용자의 로컬 웹 브라우저 저장소만 이용하므로, 서버 해킹 등으로 인한 대규모 개인정보 유출 위험이 원천적으로 차단됩니다.</p>
    <p>2. <strong>보안 전송(HTTPS)</strong>: 웹 페이지 접속 시 HTTPS 보안 통신 프로토콜을 적용하여 데이터 전송 구간에서의 도청이나 위변조를 예방합니다.</p>
    
    <h4>제7조 (정보주체와 법정대리인의 권리·의무 및 행사방법)</h4>
    <p>1. 정보주체(학생) 및 법정대리인은 언제든지 개인정보의 열람, 수정, 삭제를 요구할 수 있습니다.</p>
    <p>2. 본 서비스는 서버가 없는 로컬 앱이므로, 이용자가 직접 브라우저 화면 상에서 학생 명단을 수정하거나 삭제함으로써 즉시 권리 행사가 가능합니다.</p>
    
    <h4>제8조 (개인정보 보호책임자)</h4>
    <p>본 서비스는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
    <p>• <strong>성명</strong>: [홍민아] (개발자)<br />
       • <strong>소속</strong>: [우신중학교]<br />
       • <strong>직위</strong>: 교사<br />
       • <strong>연락처</strong>: [02-2610-1621] (학교 교무실 내선 번호)<br />
       <small>*(※ 개인정보 보호를 위해 교사의 개인 휴대전화 번호는 기재하지 않습니다.)*</small></p>
       
    <div className="doc-footer-date">
      <strong>부칙</strong><br />
      이 개인정보 처리방침은 2026년 6월 27일부터 적용됩니다.
    </div>
  </div>
);

export default function DocumentModal({ isOpen, onClose, type }) {
  // ESC 키를 누르면 모달이 닫히도록 바인딩
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isTerms = type === 'terms';
  const title = isTerms ? 'Ready Player Draw 서비스 이용약관' : 'Ready Player Draw 개인정보처리방침';
  const content = isTerms ? termsContent : privacyContent;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content doc-modal-content">
        <button className="modal-close" onClick={onClose} aria-label="닫기">
          ✕
        </button>
        <header className="doc-modal-header">
          <div className="doc-modal-badge">{isTerms ? '📄 이용약관' : '🛡️ 개인정보처리방침'}</div>
          <h2 className="doc-modal-title">{title}</h2>
        </header>
        <div className="doc-scroll-area">
          {content}
        </div>
        <footer className="doc-modal-footer">
          <button className="btn-arcade btn-pink" onClick={onClose}>
            닫기
          </button>
        </footer>
      </div>
    </div>
  );
}
