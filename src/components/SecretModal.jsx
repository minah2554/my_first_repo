import React, { useState } from 'react';

export default function SecretModal({
  isOpen,
  onClose,
  students,
  secretQueue,
  onAddToQueue,
  onRemoveFromQueue,
  onClearQueue
}) {
  const [selectedStudentId, setSelectedStudentId] = useState('');

  if (!isOpen) return null;

  const eligibleStudents = students.filter(s => !s.excluded);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!selectedStudentId) return;
    onAddToQueue(selectedStudentId);
    setSelectedStudentId('');
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="secret-modal-title">
      <div className="modal-content secret-modal-content">
        <button className="modal-close" onClick={onClose} aria-label="닫기">
          ✕
        </button>

        <h2 id="secret-modal-title" className="secret-modal-title-text">
          🔒 SYSTEM OVERRIDE
        </h2>
        
        <p className="secret-desc">
          교사 전용 예약 추첨 제어판입니다. 지정된 학생들은 다음 스핀에서 예약한 순서대로 반드시 당첨됩니다.
        </p>

        {/* Add Student Form */}
        <form onSubmit={handleAdd} className="secret-form">
          <div className="form-group">
            <label className="form-label" htmlFor="secret-student-select">발표자 예약 지정</label>
            <div className="secret-input-row">
              <select
                id="secret-student-select"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="arcade-input secret-select"
              >
                <option value="">-- 학생 선택 --</option>
                {eligibleStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <button type="submit" className="btn-arcade btn-pink secret-add-btn">
                등록
              </button>
            </div>
          </div>
        </form>

        {/* Secret Queue Section */}
        <div className="secret-queue-section">
          <div className="secret-queue-header">
            <span className="form-label">예약 대기열</span>
            {secretQueue.length > 0 && (
              <button onClick={onClearQueue} className="clear-queue-btn">
                전체 초기화
              </button>
            )}
          </div>
          
          <div className="secret-queue-list">
            {secretQueue.length === 0 ? (
              <div className="secret-empty-state">
                예약된 학생이 없습니다. <br />스핀을 진행할 때 무작위로 추첨합니다.
              </div>
            ) : (
              <ol className="secret-ol">
                {secretQueue.map((student, idx) => (
                  <li key={idx} className="secret-queue-item">
                    <span className="queue-badge">{idx + 1}순위</span>
                    <span className="queue-name">{student.name}</span>
                    <button
                      onClick={() => onRemoveFromQueue(idx)}
                      className="remove-queue-btn"
                      title="예약 취소"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        <div className="secret-modal-footer">
          <button onClick={onClose} className="btn-arcade btn-cyan w-100">
            비밀 설정 완료
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .secret-modal-content {
          border: 1.5px solid var(--figma-primary) !important;
          box-shadow: 0 16px 48px rgba(0,0,0,0.16) !important;
          background-color: var(--figma-canvas) !important;
          border-radius: var(--rounded-lg);
          padding: var(--spacing-lg) !important;
        }

        .secret-modal-title-text {
          font-family: var(--font-sans);
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--figma-ink);
          margin-bottom: var(--spacing-sm);
          letter-spacing: -0.2px;
        }

        .secret-desc {
          font-size: 0.88rem;
          color: #666666;
          line-height: 1.5;
          margin-bottom: var(--spacing-md);
          border-left: 2px solid var(--figma-primary);
          padding-left: 10px;
        }

        .secret-form {
          margin-bottom: var(--spacing-md);
        }

        .secret-input-row {
          display: flex;
          gap: 8px;
        }

        .secret-select {
          flex: 1;
          background-color: var(--figma-canvas);
          color: var(--figma-ink);
          border: 1px solid var(--figma-hairline);
          border-radius: var(--rounded-md);
          cursor: pointer;
          font-size: 0.9rem;
        }

        .secret-select option {
          background-color: var(--figma-canvas);
          color: var(--figma-ink);
        }

        .secret-add-btn {
          font-size: 0.85rem;
          padding: 8px 16px;
        }

        .secret-queue-section {
          background-color: var(--figma-surface-soft);
          border: 1px solid var(--figma-hairline);
          border-radius: var(--rounded-md);
          padding: var(--spacing-sm);
          margin-bottom: var(--spacing-md);
        }

        .secret-queue-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-xs);
        }

        .clear-queue-btn {
          background: transparent;
          border: none;
          color: #888888;
          cursor: pointer;
          font-size: 0.72rem;
          font-family: var(--font-mono);
          text-transform: uppercase;
        }

        .clear-queue-btn:hover {
          color: var(--figma-ink);
          text-decoration: underline;
        }

        .secret-queue-list {
          min-height: 100px;
          max-height: 180px;
          overflow-y: auto;
        }

        .secret-empty-state {
          color: #888888;
          font-size: 0.8rem;
          text-align: center;
          padding: var(--spacing-lg) 10px;
          line-height: 1.4;
        }

        .secret-ol {
          padding-left: 0;
          list-style: none;
        }

        .secret-queue-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 10px;
          background-color: var(--figma-canvas);
          border: 1px solid var(--figma-hairline-soft);
          border-radius: var(--rounded-sm);
          margin-bottom: 6px;
          font-family: var(--font-body);
        }

        .queue-badge {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--figma-ink);
          background-color: var(--figma-hairline);
          padding: 2px 6px;
          border-radius: var(--rounded-sm);
        }

        .queue-name {
          color: var(--figma-ink);
          font-weight: 700;
          font-size: 0.9rem;
          flex: 1;
          margin-left: 12px;
        }

        .remove-queue-btn {
          background: transparent;
          border: none;
          color: #888888;
          font-size: 0.8rem;
          font-family: var(--font-mono);
          cursor: pointer;
          line-height: 1;
        }

        .remove-queue-btn:hover {
          color: #ff3333;
        }

        .secret-modal-footer {
          margin-top: 10px;
        }
      `}} />
    </div>
  );
}
