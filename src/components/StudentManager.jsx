import React, { useState } from 'react';

export default function StudentManager({
  students,
  history,
  onAddStudent,
  onBulkAddStudents,
  onToggleStudent,
  onDeleteStudent,
  onResetRoster,
  onToggleAll,
  onClearHistory,
  onSettingsHoldStart,
  onSettingsHoldEnd
}) {
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'bulk', 'history'
  const [singleName, setSingleName] = useState('');
  const [bulkInput, setBulkInput] = useState('');

  const handleSingleAdd = (e) => {
    e.preventDefault();
    const trimmed = singleName.trim();
    if (!trimmed) return;
    onAddStudent(trimmed);
    setSingleName('');
  };

  const handleBulkAdd = (e) => {
    e.preventDefault();
    if (!bulkInput.trim()) return;
    
    const names = bulkInput
      .split(/[,\n]/)
      .map(name => name.trim())
      .filter(name => name.length > 0);
      
    if (names.length > 0) {
      onBulkAddStudents(names);
      setBulkInput('');
      setActiveTab('list'); 
    }
  };

  const totalCount = students.length;
  const activeCount = students.filter(s => !s.excluded).length;

  return (
    <aside className="figma-sidebar figma-card" aria-label="학생 관리">
      <div className="card-title-row">
        <span className="sidebar-title">ROSTER SETTINGS</span>
        <button
          className="btn-settings-gear"
          onMouseDown={onSettingsHoldStart}
          onTouchStart={onSettingsHoldStart}
          onMouseUp={onSettingsHoldEnd}
          onMouseLeave={onSettingsHoldEnd}
          onTouchEnd={onSettingsHoldEnd}
          title="비밀 설정 (3초간 누르기)"
        >
          ⚙️
        </button>
      </div>

      {/* Tabs Menu - Styled as Figma Pill Toggles */}
      <div className="tab-menu-pill" role="tablist">
        <button
          className={`tab-btn-pill ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
          role="tab"
          aria-selected={activeTab === 'list'}
        >
          목록 ({activeCount}/{totalCount})
        </button>
        <button
          className={`tab-btn-pill ${activeTab === 'bulk' ? 'active' : ''}`}
          onClick={() => setActiveTab('bulk')}
          role="tab"
          aria-selected={activeTab === 'bulk'}
        >
          일괄 등록
        </button>
        <button
          className={`tab-btn-pill ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
          role="tab"
          aria-selected={activeTab === 'history'}
        >
          기록
        </button>
      </div>

      {/* Tab 1: Student List */}
      {activeTab === 'list' && (
        <div className="tab-content">
          {/* Add Single Student */}
          <form onSubmit={handleSingleAdd} className="add-single-form">
            <input
              type="text"
              placeholder="학생 추가..."
              value={singleName}
              onChange={(e) => setSingleName(e.target.value)}
              className="arcade-input single-add-input"
              maxLength={15}
            />
            <button type="submit" className="btn-arcade btn-pink add-btn">
              추가
            </button>
          </form>

          {/* Quick Roster Actions */}
          <div className="roster-actions">
            <button
              onClick={() => onToggleAll(true)}
              className="btn-roster-action"
            >
              모든 학생 제외
            </button>
            <button
              onClick={() => onToggleAll(false)}
              className="btn-roster-action"
            >
              모든 학생 포함
            </button>
            <button
              onClick={onResetRoster}
              className="btn-roster-action reset-btn"
            >
              목록 초기화
            </button>
          </div>

          {/* Roster Scroll List (Figma Surface Soft background) */}
          <div className="students-scroll-list">
            {students.length === 0 ? (
              <div className="empty-state">
                등록된 학생이 없습니다. <br />위에서 학생을 추가하거나 '일괄 등록'을 이용하세요.
              </div>
            ) : (
              students.map((student) => (
                <div
                  key={student.id}
                  className={`student-item ${student.excluded ? 'excluded' : ''}`}
                >
                  <label className="student-label-checkbox">
                    <input
                      type="checkbox"
                      checked={!student.excluded}
                      onChange={() => onToggleStudent(student.id)}
                      className="custom-checkbox"
                    />
                    <span className="student-name-text">{student.name}</span>
                  </label>
                  <button
                    onClick={() => onDeleteStudent(student.id)}
                    className="delete-student-btn"
                    title="삭제"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Bulk Add */}
      {activeTab === 'bulk' && (
        <div className="tab-content">
          <form onSubmit={handleBulkAdd} className="bulk-add-form">
            <div className="form-group">
              <label className="form-label" htmlFor="bulk-textarea">
                대량 학생 추가 (줄바꿈/쉼표 구분)
              </label>
              <textarea
                id="bulk-textarea"
                placeholder="쉼표(,) 또는 줄바꿈으로 나누어 이름을 입력하세요.&#10;예: 김철수, 이영희, 박민수"
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                className="arcade-input arcade-textarea"
              ></textarea>
            </div>
            <button type="submit" className="btn-arcade btn-pink w-100">
              일괄 추가 완료
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: History Log */}
      {activeTab === 'history' && (
        <div className="tab-content">
          <div className="history-header">
            <span className="form-label">추첨 로그</span>
            {history.length > 0 && (
              <button onClick={onClearHistory} className="clear-history-btn">
                로그 삭제
              </button>
            )}
          </div>
          <div className="history-scroll-list">
            {history.length === 0 ? (
              <div className="empty-state">
                추첨 기록이 아직 비어있습니다.
              </div>
            ) : (
              history.map((item, idx) => (
                <div key={idx} className="history-item">
                  <span className="history-time">{item.time}</span>
                  <span className="history-name">{item.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .figma-sidebar {
          background-color: var(--figma-canvas);
          border: 1px solid var(--figma-hairline);
          border-radius: var(--rounded-lg);
          padding: var(--spacing-lg);
          min-height: 520px;
          display: flex;
          flex-direction: column;
        }

        .card-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
          border-bottom: 1px solid var(--figma-hairline);
          padding-bottom: var(--spacing-sm);
        }

        .sidebar-title {
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--figma-ink);
          letter-spacing: -0.1px;
        }

        .btn-settings-gear {
          background: transparent;
          border: none;
          color: #888888;
          cursor: pointer;
          font-size: 1.15rem;
          padding: 4px;
          line-height: 1;
          transition: color 0.15s ease;
        }

        .btn-settings-gear:hover {
          color: var(--figma-primary);
        }

        /* Figma Pill Toggles for Menu */
        .tab-menu-pill {
          display: flex;
          gap: 2px;
          background-color: var(--figma-surface-soft);
          padding: 3px;
          border-radius: var(--rounded-pill);
          margin-bottom: var(--spacing-md);
        }

        .tab-btn-pill {
          flex: 1;
          background: transparent;
          border: none;
          color: #666666;
          font-family: var(--font-sans);
          font-size: 0.8rem;
          font-weight: 500;
          padding: 6px 4px;
          cursor: pointer;
          transition: all 0.15s ease;
          border-radius: var(--rounded-pill);
          text-align: center;
        }

        .tab-btn-pill.active {
          background-color: var(--figma-canvas);
          color: var(--figma-ink);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          font-weight: 700;
        }

        .tab-btn-pill:hover:not(.active) {
          color: var(--figma-ink);
        }

        .tab-content {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        /* Forms */
        .add-single-form {
          display: flex;
          gap: 6px;
          margin-bottom: var(--spacing-sm);
        }

        .single-add-input {
          flex: 1;
          padding: 8px 12px;
          font-size: 0.9rem;
        }

        .add-btn {
          font-size: 0.85rem;
          padding: 8px 14px;
        }

        /* Roster actions */
        .roster-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          margin-bottom: var(--spacing-sm);
        }

        .btn-roster-action {
          background-color: var(--figma-canvas);
          border: 1px solid var(--figma-hairline);
          border-radius: var(--rounded-pill);
          color: #555555;
          font-family: var(--font-sans);
          font-size: 0.72rem;
          font-weight: 500;
          padding: 6px 4px;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: center;
        }

        .btn-roster-action:hover {
          background-color: var(--figma-surface-soft);
          color: var(--figma-ink);
          border-color: #b3b3b3;
        }

        .btn-roster-action.reset-btn {
          grid-column: span 2;
          border-color: var(--figma-hairline);
          color: #888888;
        }

        .btn-roster-action.reset-btn:hover {
          border-color: #ffcccc;
          color: #ff3333;
          background-color: #fff5f5;
        }

        /* Scroll lists with clean surfaces */
        .students-scroll-list {
          flex: 1;
          overflow-y: auto;
          background-color: var(--figma-surface-soft);
          border-radius: var(--rounded-md);
          border: 1px solid var(--figma-hairline);
          padding: var(--spacing-xs);
          max-height: 290px;
        }

        .student-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 10px;
          border-radius: var(--rounded-sm);
          background-color: var(--figma-canvas);
          border: 1px solid var(--figma-hairline-soft);
          margin-bottom: 6px;
          transition: border-color 0.15s ease;
        }

        .student-item:hover {
          border-color: #cccccc;
        }

        .student-item.excluded {
          opacity: 0.45;
          background-color: transparent;
        }

        .student-label-checkbox {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          flex: 1;
          user-select: none;
        }

        .custom-checkbox {
          width: 15px;
          height: 15px;
          accent-color: var(--figma-primary);
          cursor: pointer;
        }

        .student-name-text {
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--figma-ink);
        }

        .delete-student-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 0.85rem;
          color: #888888;
          padding: 2px 6px;
          font-family: var(--font-mono);
        }

        .delete-student-btn:hover {
          color: #ff3333;
        }

        .empty-state {
          text-align: center;
          color: #888888;
          font-size: 0.8rem;
          padding: 40px 10px;
          line-height: 1.5;
        }

        /* Bulk */
        .bulk-add-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          flex: 1;
        }

        /* History */
        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-sm);
        }

        .clear-history-btn {
          background: transparent;
          border: none;
          color: #888888;
          cursor: pointer;
          font-size: 0.75rem;
          font-family: var(--font-mono);
          text-transform: uppercase;
        }

        .clear-history-btn:hover {
          color: var(--figma-ink);
          text-decoration: underline;
        }

        .history-scroll-list {
          flex: 1;
          overflow-y: auto;
          background-color: var(--figma-surface-soft);
          border-radius: var(--rounded-md);
          border: 1px solid var(--figma-hairline);
          padding: var(--spacing-xs);
          max-height: 350px;
        }

        .history-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 10px;
          background-color: var(--figma-canvas);
          border: 1px solid var(--figma-hairline-soft);
          border-radius: var(--rounded-sm);
          margin-bottom: 6px;
        }

        .history-time {
          color: #888888;
          font-family: var(--font-mono);
          font-size: 0.72rem;
        }

        .history-name {
          color: var(--figma-ink);
          font-weight: 700;
          font-size: 0.9rem;
        }
      `}} />
    </aside>
  );
}
