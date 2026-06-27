import React, { useState, useRef, useEffect } from 'react';

const ethicsGuides = [
  {
    id: 1,
    category: '가이드 1',
    concept: '활용 목적',
    title: '생성형 AI의 활용 이유와 범위를 스스로 설명할 수 있어야 해요.',
    description: '생성형 AI를 활용하는 이유가 진짜 궁금한 것을 탐구하기 위해 보조 도구로 활용하려는 것인지, 숙제를 빨리 끝내려고 쓰는 것인지 스스로에게 먼저 물어봐요. 선생님이 허락하신 범위 내에서 내가 정한 학습 목표를 달성하기 위해 생성형 AI를 보조 도구로 활용해요.',
    tags: [
      { text: '주도성', color: 'orange' },
      { text: '합목적성', color: 'green' }
    ],
  },
  {
    id: 2,
    category: '가이드 2',
    concept: '주도적 학습',
    title: '생성형 AI를 사용하기 전, 내가 아는 것을 정리하고 질문을 설계해요.',
    description: '생성형 AI를 사용하기 전에 내 생각을 먼저 적어봐요. 내가 모르는 것이 무엇인지 파악한 다음, 이를 배우기 위해 어떤 도움을 받을지 구체적인 질문(프롬프트)을 만들어요.',
    tags: [
      { text: '주도성', color: 'orange' }
    ],
  },
  {
    id: 3,
    category: '가이드 3',
    concept: '비판적 검증',
    title: '생성형 AI의 답변 속 오류나 편향된 시각을 직접 찾아보고 비교해요.',
    description: '생성형 AI는 가끔 그럴듯한 거짓말(할루시네이션)을 할 수 있어요. 생성형 AI의 답변을 맹신하지 않고 교과서나 공식 자료를 통해 한 번 더 교차 검증해요. 한쪽으로 치우친 생각은 아닌지 비판적으로 검증하는 습관을 가져요.',
    tags: [
      { text: '주도성', color: 'orange' }
    ],
  },
  {
    id: 4,
    category: '가이드 4',
    concept: '사고의 확장',
    title: '단순한 질문을 넘어 좋은 질문을 설계하며 생각의 범위를 넓혀요.',
    description: '생성형 AI에게 단순히 정답만을 요구하는 것은 바람직하지 않아요. 생성형 AI 답변의 근거와 다른 관점을 고려하여, “왜 그럴까?”, “다른 방법은 없을까?”라고 다각도의 심화 질문을 이어가요. 생성형 AI를 토론 파트너처럼 활용하여 나의 생각을 키워가요.',
    tags: [
      { text: '주도성', color: 'orange' },
      { text: '합목적성', color: 'green' }
    ],
  },
  {
    id: 5,
    category: '가이드 5',
    concept: '안전과 관계',
    title: '개인정보를 스스로 지키고, 생성형 AI와 정서적 거리를 유지해요.',
    description: '나 또는 타인의 이름, 연락처, 주소, 계정 정보 등을 함부로 생성형 AI에 입력하지 않아요. 이러한 정보가 생성형 AI 학습에 활용될 수 있어요. 속상하거나 힘든 일이 있을 때는 생성형 AI보다 나를 진심으로 이해해 줄 수 있는 가족, 선생님, 친구들과 마음을 나누어요.',
    tags: [
      { text: '안전성', color: 'blue' }
    ],
  },
  {
    id: 6,
    category: '가이드 6',
    concept: '투명성·윤리',
    title: '생성형 AI를 활용한 부분과 내 생각을 명확하게 구분해서 밝혀요.',
    description: '수업이나 평가 및 과제에서 생성형 AI의 도움을 받았다면, 어떤 도구를 어떤 방식으로 참고했는지 투명하게 밝혀요. 생성형 AI의 답변을 내가 쓴 것처럼 제출하는 것은 표절(부정행위)임을 명심해요.',
    tags: [
      { text: '투명성', color: 'yellow' }
    ],
  }
];

export default function EthicsGate({ onAgree }) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const scrollContainerRef = useRef(null);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // scrollTop + clientHeight가 scrollHeight에 도달했는지 확인 (약간의 오차 방지를 위해 -5px 여유)
    const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 10;
    if (isAtBottom) {
      setHasScrolledToBottom(true);
    }
  };

  // 모바일이나 높이가 넉넉한 화면에서 스크롤바가 생기지 않는 경우 바로 활성화 처리
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      if (container.scrollHeight <= container.clientHeight) {
        setHasScrolledToBottom(true);
      }
    }
  }, []);

  const handleAgreeClick = () => {
    if (hasScrolledToBottom) {
      onAgree();
    }
  };

  return (
    <div className="ethics-gate-overlay">
      <div className="ethics-gate-card">
        <header className="ethics-header">
          <div className="ethics-badge">💡 AI 활용 윤리 서약</div>
          <h1 className="ethics-main-title">생성형 AI 활용 윤리 핵심가이드</h1>
          <p className="ethics-subtitle">
            안전하고 주도적인 학습을 위해 윤리 핵심가이드를 <strong>끝까지 읽고 실천을 서약</strong>해 주세요.
          </p>
        </header>

        {/* 가이드 카드 리스트 영역 (스크롤 감지) */}
        <div 
          className="ethics-scroll-box" 
          ref={scrollContainerRef} 
          onScroll={handleScroll}
        >
          <div className="ethics-grid">
            {ethicsGuides.map((guide) => (
              <div key={guide.id} className="ethics-card">
                <div className="ethics-card-header">
                  <div className="ethics-guide-num">{guide.category}</div>
                  <div className="ethics-concept-tag">{guide.concept}</div>
                  <div className="ethics-value-badges">
                    {guide.tags.map((tag, idx) => (
                      <span key={idx} className={`value-badge value-badge-${tag.color}`}>
                        {tag.text === '주도성' && '🧠 '}
                        {tag.text === '합목적성' && '🎯 '}
                        {tag.text === '안전성' && '🛡️ '}
                        {tag.text === '투명성' && '🔗 '}
                        {tag.text}
                      </span>
                    ))}
                  </div>
                </div>
                <h3 className="ethics-card-title">{guide.title}</h3>
                <p className="ethics-card-desc">{guide.description}</p>
              </div>
            ))}
          </div>
          
          <div className="ethics-scroll-hint">
            {!hasScrolledToBottom && (
              <span className="scroll-arrow-down">👇 가이드를 끝까지 내려서 읽어주세요</span>
            )}
          </div>
        </div>

        <footer className="ethics-footer">
          <button
            onClick={handleAgreeClick}
            disabled={!hasScrolledToBottom}
            className={`btn-ethics-agree ${hasScrolledToBottom ? 'active' : ''}`}
          >
            {hasScrolledToBottom 
              ? '나는 윤리 핵심가이드를 빠짐없이 읽고 이를 실천하겠습니다. (입장하기)' 
              : '가이드를 아래로 스크롤하여 끝까지 읽어주세요'
            }
          </button>
        </footer>
      </div>
    </div>
  );
}
