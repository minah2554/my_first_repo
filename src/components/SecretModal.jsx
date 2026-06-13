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

  // Filter only active students who are not excluded, to be candidate for secret drawing
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
          &times;
        </button>

        <h2 id="secret-modal-title" className="card-title neon-glow-pink">
          🔒 SYSTEM OVERRIDE
        </h2>
        
        <p className="secret-desc">
          여기는 교사 전용 비밀 설정 화면입니다. <br />
          아래에서 대상을 지정하면 다음 SPIN을 돌렸을 때 <strong>지정한 순서대로 당첨</strong>됩니다.
        </p>

        {/* Add student to next queue */}
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
                예약
              </button>
            </div>
          </div>
        </form>

        {/* Current Secret Queue List */}
        <div className="secret-queue-section">
          <div className="secret-queue-header">
            <span className="form-label">예약된 당첨 순서</span>
            {secretQueue.length > 0 && (
              <button onClick={onClearQueue} className="clear-queue-btn">
                예약 모두 취소
              </button>
            )}
          </div>
          
          <div className="secret-queue-list">
            {secretQueue.length === 0 ? (
              <div className="secret-empty-state">
                예약된 학생이 없습니다. <br />
                스핀을 돌릴 때 무작위로 발표자가 선정됩니다.
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
                      &times;
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        <div className="secret-modal-footer">
          <button onClick={onClose} className="btn-arcade btn-cyan w-100">
            비밀 설정 닫기
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .secret-modal-content {
          border-color: var(--neon-pink);
          box-shadow: 0 0 35px var(--neon-pink);
          background-color: #0b0716;
        }

        .secret-desc {
          font-size: 0.85rem;
          color: #a49dbb;
          line-height: 1.5;
          margin-bottom: 20px;
          border-left: 3px solid var(--neon-pink);
          padding-left: 10px;
        }

        .secret-form {
          margin-bottom: 20px;
        }

        .secret-input-row {
          display: flex;
          gap: 10px;
        }

        .secret-select {
          flex: 1;
          background-color: var(--bg-input);
          color: #fff;
          cursor: pointer;
        }

        .secret-select option {
          background-color: var(--bg-card);
          color: #fff;
        }

        .secret-add-btn {
          font-size: 0.75rem;
          padding: 10px 16px;
        }

        .secret-queue-section {
          background-color: rgba(255, 0, 85, 0.03);
          border: 1px dashed var(--neon-pink);
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 20px;
        }

        .secret-queue-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .clear-queue-btn {
          background: transparent;
          border: none;
          color: var(--neon-yellow);
          cursor: pointer;
          font-size: 0.7rem;
          font-family: var(--font-title);
          text-transform: uppercase;
        }

        .clear-queue-btn:hover {
          text-decoration: underline;
        }

        .secret-queue-list {
          min-height: 120px;
          max-height: 200px;
          overflow-y: auto;
        }

        .secret-empty-state {
          color: #6a6480;
          font-size: 0.8rem;
          text-align: center;
          padding: 30px 10px;
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
          padding: 6px 8px;
          background-color: rgba(31, 20, 53, 0.4);
          border-radius: 4px;
          margin-bottom: 6px;
          font-family: var(--font-body);
        }

        .queue-badge {
          font-family: var(--font-arcade);
          font-size: 0.55rem;
          color: var(--neon-pink);
          background-color: rgba(255, 0, 85, 0.1);
          padding: 3px 6px;
          border-radius: 3px;
        }

        .queue-name {
          color: #fff;
          font-weight: 700;
          font-size: 0.95rem;
          flex: 1;
          margin-left: 12px;
        }

        .remove-queue-btn {
          background: transparent;
          border: none;
          color: var(--neon-pink);
          font-size: 1.2rem;
          cursor: pointer;
          line-height: 1;
        }

        .remove-queue-btn:hover {
          color: var(--neon-cyan);
          transform: scale(1.1);
        }

        .secret-modal-footer {
          margin-top: 10px;
        }
      `}} />
    </div>
  );
}
