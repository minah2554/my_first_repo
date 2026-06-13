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

  // Handle single student addition
  const handleSingleAdd = (e) => {
    e.preventDefault();
    const trimmed = singleName.trim();
    if (!trimmed) return;
    onAddStudent(trimmed);
    setSingleName('');
  };

  // Handle bulk students addition
  const handleBulkAdd = (e) => {
    e.preventDefault();
    if (!bulkInput.trim()) return;
    
    // Split by comma or newline, filter out empty elements
    const names = bulkInput
      .split(/[,\n]/)
      .map(name => name.trim())
      .filter(name => name.length > 0);
      
    if (names.length > 0) {
      onBulkAddStudents(names);
      setBulkInput('');
      setActiveTab('list'); // switch back to list
    }
  };

  // Counters
  const totalCount = students.length;
  const activeCount = students.filter(s => !s.excluded).length;
  const excludedCount = totalCount - activeCount;

  return (
    <aside className="arcade-card student-manager-card" aria-label="학생 관리">
      <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>🕹️ CONTROL PANEL</span>
        <button
          className="btn-settings-gear"
          onMouseDown={onSettingsHoldStart}
          onTouchStart={onSettingsHoldStart}
          onMouseUp={onSettingsHoldEnd}
          onMouseLeave={onSettingsHoldEnd}
          onTouchEnd={onSettingsHoldEnd}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--neon-purple)',
            cursor: 'pointer',
            fontSize: '1.2rem',
            padding: '2px 8px',
            textShadow: 'var(--shadow-purple)',
            transition: 'all 0.2s'
          }}
          title="비밀 설정 (3초간 누르기)"
        >
          ⚙️
        </button>
      </div>

      {/* Tabs Menu */}
      <div className="tab-menu" role="tablist">
        <button
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
          role="tab"
          aria-selected={activeTab === 'list'}
        >
          학생 목록 ({activeCount}/{totalCount})
        </button>
        <button
          className={`tab-btn ${activeTab === 'bulk' ? 'active' : ''}`}
          onClick={() => setActiveTab('bulk')}
          role="tab"
          aria-selected={activeTab === 'bulk'}
        >
          일괄 등록
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
          role="tab"
          aria-selected={activeTab === 'history'}
        >
          추첨 기록
        </button>
      </div>

      {/* Tab 1: Student List */}
      {activeTab === 'list' && (
        <div className="tab-content" id="list-tab">
          {/* Add Single Student Form */}
          <form onSubmit={handleSingleAdd} className="add-single-form">
            <input
              type="text"
              placeholder="학생 이름 입력..."
              value={singleName}
              onChange={(e) => setSingleName(e.target.value)}
              className="arcade-input single-add-input"
              maxLength={15}
            />
            <button type="submit" className="btn-arcade btn-cyan add-btn">
              추가
            </button>
          </form>

          {/* Quick Actions */}
          <div className="roster-actions">
            <button
              onClick={() => onToggleAll(true)}
              className="btn-roster-action"
              title="모든 학생을 추천 대상에서 제외합니다"
            >
              전체 제외
            </button>
            <button
              onClick={() => onToggleAll(false)}
              className="btn-roster-action"
              title="모든 학생을 추천 대상에 포함합니다"
            >
              전체 포함
            </button>
            <button
              onClick={onResetRoster}
              className="btn-roster-action reset-roster-btn"
              title="학생 목록을 초기화합니다"
            >
              목록 초기화
            </button>
          </div>

          {/* Scrollable Students List */}
          <div className="students-scroll-list">
            {students.length === 0 ? (
              <div className="empty-state">
                등록된 학생이 없습니다.<br/>위에서 학생을 추가해주세요!
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
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Bulk Add */}
      {activeTab === 'bulk' && (
        <div className="tab-content" id="bulk-tab">
          <form onSubmit={handleBulkAdd} className="bulk-add-form">
            <div className="form-group">
              <label className="form-label" htmlFor="bulk-textarea">
                대량 학생 이름 입력
              </label>
              <textarea
                id="bulk-textarea"
                placeholder="쉼표(,)나 줄바꿈(엔터)으로 여러 학생의 이름을 입력하세요.&#10;예시:&#10;김철수, 이영희, 박민수&#10;최수민&#10;정지원"
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
        <div className="tab-content" id="history-tab">
          <div className="history-header">
            <span className="form-label">최근 당첨자 기록</span>
            {history.length > 0 && (
              <button onClick={onClearHistory} className="clear-history-btn">
                기록 삭제
              </button>
            )}
          </div>
          <div className="history-scroll-list">
            {history.length === 0 ? (
              <div className="empty-state">
                아직 당첨 기록이 없습니다.<br/>룰렛을 돌려 발표자를 추첨해보세요!
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

      {/* Embedded Styles for StudentManager */}
      <style dangerouslySetInnerHTML={{ __html: `
        .student-manager-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 520px;
        }

        .tab-menu {
          display: flex;
          gap: 4px;
          border-bottom: 2px solid var(--neon-purple);
          margin-bottom: 16px;
        }

        .tab-btn {
          flex: 1;
          background: transparent;
          border: none;
          color: #6a6480;
          font-family: var(--font-title);
          font-size: 0.8rem;
          font-weight: 700;
          padding: 10px 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 4px 4px 0 0;
          text-align: center;
        }

        .tab-btn.active {
          color: var(--neon-cyan);
          text-shadow: var(--shadow-cyan);
          background-color: rgba(0, 240, 255, 0.05);
          border-bottom: 2px solid var(--neon-cyan);
          margin-bottom: -2px;
        }

        .tab-btn:hover:not(.active) {
          color: #a49dbb;
          background-color: rgba(255, 255, 255, 0.02);
        }

        .tab-content {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        /* Single Add Form */
        .add-single-form {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .single-add-input {
          flex: 1;
        }

        .add-btn {
          padding-left: 14px;
          padding-right: 14px;
        }

        /* Roster Actions */
        .roster-actions {
          display: flex;
          justify-content: space-between;
          gap: 6px;
          margin-bottom: 12px;
        }

        .btn-roster-action {
          background-color: rgba(31, 20, 53, 0.6);
          border: 1px solid var(--neon-purple);
          border-radius: 4px;
          color: #a49dbb;
          font-size: 0.75rem;
          padding: 6px 8px;
          cursor: pointer;
          transition: all 0.2s;
          flex: 1;
        }

        .btn-roster-action:hover {
          color: #fff;
          border-color: var(--neon-cyan);
          background-color: rgba(0, 240, 255, 0.1);
        }

        .btn-roster-action.reset-roster-btn:hover {
          border-color: var(--neon-pink);
          background-color: rgba(255, 0, 85, 0.1);
          color: var(--neon-pink);
        }

        /* Students Scroll List */
        .students-scroll-list {
          flex: 1;
          overflow-y: auto;
          background-color: #0d0818;
          border-radius: 8px;
          border: 1px solid #281a42;
          padding: 8px;
          max-height: 320px;
        }

        .student-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 10px;
          border-radius: 6px;
          border-bottom: 1px solid #1c142c;
          transition: all 0.15s ease;
        }

        .student-item:hover {
          background-color: rgba(255, 255, 255, 0.03);
        }

        .student-item.excluded {
          opacity: 0.45;
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
          width: 16px;
          height: 16px;
          accent-color: var(--neon-cyan);
          cursor: pointer;
        }

        .student-name-text {
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.95rem;
          color: #fff;
        }

        .delete-student-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          padding: 2px 4px;
          transition: transform 0.1s;
        }

        .delete-student-btn:hover {
          transform: scale(1.2);
        }

        .empty-state {
          text-align: center;
          color: #6a6480;
          font-size: 0.8rem;
          padding: 40px 10px;
          line-height: 1.5;
        }

        /* Bulk Tab */
        .bulk-add-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          flex: 1;
        }

        .w-100 {
          width: 100%;
        }

        /* History Tab */
        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .clear-history-btn {
          background: transparent;
          border: none;
          color: var(--neon-pink);
          cursor: pointer;
          font-size: 0.75rem;
          font-family: var(--font-title);
          text-transform: uppercase;
        }

        .clear-history-btn:hover {
          text-decoration: underline;
        }

        .history-scroll-list {
          flex: 1;
          overflow-y: auto;
          background-color: #0d0818;
          border-radius: 8px;
          border: 1px solid #281a42;
          padding: 8px;
          max-height: 350px;
        }

        .history-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 10px;
          border-bottom: 1px solid #1c142c;
          font-family: var(--font-body);
        }

        .history-time {
          color: #6a6480;
          font-size: 0.75rem;
        }

        .history-name {
          color: var(--neon-cyan);
          font-weight: 700;
          font-size: 0.95rem;
          text-shadow: 0 0 5px rgba(0, 240, 255, 0.2);
        }
      `}} />
    </aside>
  );
}
