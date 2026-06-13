import React, { useState, useEffect, useRef } from 'react';
import SlotMachine from './components/SlotMachine';
import StudentManager from './components/StudentManager';
import SecretModal from './components/SecretModal';

export default function App() {
  // ----------------------------------------------------
  // State Initialization
  // ----------------------------------------------------
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('presenter_students');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved students', e);
      }
    }
    
    // Default 15 Korean names for instant use
    const defaultNames = [
      '김동현', '이서연', '박준서', '최지우', '정민우', 
      '강하은', '조예준', '윤서현', '장건우', '임다은', 
      '한지민', '오우진', '서유나', '신민재', '황지아'
    ];
    return defaultNames.map((name, idx) => ({
      id: `student-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
      name,
      excluded: false
    }));
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('presenter_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
    return [];
  });

  const [secretQueue, setSecretQueue] = useState([]);
  const [drawCount, setDrawCount] = useState(1);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winners, setWinners] = useState([]);
  const [isSecretOpen, setIsSecretOpen] = useState(false);

  const holdTimeoutRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('presenter_students', JSON.stringify(students));
  }, [students]);

  // ----------------------------------------------------
  // Student Roster Actions
  // ----------------------------------------------------
  const handleAddStudent = (name) => {
    const newStudent = {
      id: `student-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name,
      excluded: false
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const handleBulkAddStudents = (names) => {
    const newStudents = names.map((name, idx) => ({
      id: `student-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
      name,
      excluded: false
    }));
    setStudents(prev => [...prev, ...newStudents]);
  };

  const handleToggleStudent = (id) => {
    setStudents(prev => prev.map(s => 
      s.id === id ? { ...s, excluded: !s.excluded } : s
    ));
    setSecretQueue(prev => prev.filter(s => s.id !== id));
  };

  const handleDeleteStudent = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setSecretQueue(prev => prev.filter(s => s.id !== id));
  };

  const handleResetRoster = () => {
    if (window.confirm('학생 목록을 완전히 초기화하시겠습니까?')) {
      setStudents([]);
      setSecretQueue([]);
      localStorage.removeItem('presenter_students');
    }
  };

  const handleToggleAll = (excluded) => {
    setStudents(prev => prev.map(s => ({ ...s, excluded })));
    if (excluded) {
      setSecretQueue([]);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('추첨 기록을 모두 지우시겠습니까?')) {
      setHistory([]);
      localStorage.removeItem('presenter_history');
    }
  };

  // ----------------------------------------------------
  // Secret Override Actions
  // ----------------------------------------------------
  const handleAddToSecretQueue = (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setSecretQueue(prev => [...prev, student]);
    }
  };

  const handleRemoveFromSecretQueue = (idx) => {
    setSecretQueue(prev => prev.filter((_, i) => i !== idx));
  };

  const handleClearSecretQueue = () => {
    setSecretQueue([]);
  };

  // ----------------------------------------------------
  // Hold Detection for Secret Configuration (3 seconds)
  // ----------------------------------------------------
  const handleSettingsHoldStart = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
    }
    holdTimeoutRef.current = setTimeout(() => {
      setIsSecretOpen(true);
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
    }, 3000);
  };

  const handleSettingsHoldEnd = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
      }
    };
  }, []);

  // ----------------------------------------------------
  // Draw / Spin Action Logic
  // ----------------------------------------------------
  const handleSpin = () => {
    if (isSpinning) return;

    const activeStudents = students.filter(s => !s.excluded);
    if (activeStudents.length === 0) {
      alert('활성화된 학생이 없습니다. 학생 목록에서 추천 대상 학생들을 확인(체크)해 주세요!');
      return;
    }

    if (activeStudents.length < drawCount) {
      alert(`활성화된 학생 수(${activeStudents.length}명)가 선택한 추첨 인원(${drawCount}명)보다 적습니다.`);
      return;
    }

    setIsSpinning(true);
    
    const chosenWinners = [];
    let currentSecretQueue = [...secretQueue];
    let availableCandidates = [...activeStudents];

    for (let i = 0; i < drawCount; i++) {
      let selectedWinner = null;

      // Check if override target is available in secret queue
      if (currentSecretQueue.length > 0) {
        const nextSecret = currentSecretQueue.shift();
        const isEligible = availableCandidates.some(s => s.id === nextSecret.id);
        if (isEligible) {
          selectedWinner = nextSecret;
        }
      }

      // Otherwise, draw random candidate
      if (!selectedWinner) {
        const randomIndex = Math.floor(Math.random() * availableCandidates.length);
        selectedWinner = availableCandidates[randomIndex];
      }

      chosenWinners.push(selectedWinner);
      availableCandidates = availableCandidates.filter(s => s.id !== selectedWinner.id);
    }

    setWinners(chosenWinners);
    setSecretQueue(currentSecretQueue); 
  };

  const handleSpinFinished = () => {
    setIsSpinning(false);

    const now = new Date();
    const timeStr = now.toLocaleTimeString('ko-KR', { hour12: false });
    
    const newHistoryEntries = winners.map(winner => ({
      name: winner.name,
      time: timeStr
    }));

    const updatedHistory = [...newHistoryEntries, ...history].slice(0, 50);
    setHistory(updatedHistory);
    localStorage.setItem('presenter_history', JSON.stringify(updatedHistory));
  };

  useEffect(() => {
    if (!isSpinning && winners.length !== drawCount) {
      setWinners(Array(drawCount).fill(null));
    }
  }, [drawCount, isSpinning]);

  return (
    <main className="app-container">
      {/* Header section with figmaSans modulation style (heavy vs light) */}
      <header className="app-header">
        <h1 className="app-title">
          <span>READY PLAYER </span>
          <span className="title-draw-weight">DRAW</span>
        </h1>
        <div className="app-subtitle">DESIGN_SYSTEM_V.ALPHA // PRESENTER SELECTOR</div>
      </header>

      {/* Main Grid Layout */}
      <div className="dashboard-grid">
        <section className="arcade-card figma-card slot-card" aria-label="추첨 룰렛">
          <div className="card-title">
            <span>⚡ LUCKY DRAW CANVAS</span>
          </div>

          {/* Draw Count Picker */}
          <div className="draw-controls">
            <span className="form-label">추첨 인원수</span>
            <div className="count-picker">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  className={`btn-count-option ${drawCount === num ? 'active' : ''}`}
                  onClick={() => !isSpinning && setDrawCount(num)}
                  disabled={isSpinning}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Slot Machine Roll Canvas */}
          <SlotMachine
            isSpinning={isSpinning}
            winners={winners}
            candidates={students.filter(s => !s.excluded)}
            onSpinFinished={handleSpinFinished}
          />

          {/* Figma Primary Pill Action button */}
          <div className="spin-btn-container">
            <button
              onClick={handleSpin}
              disabled={isSpinning || students.filter(s => !s.excluded).length === 0}
              className="btn-spin-giant"
              aria-label="추첨 시작"
            >
              <span>{isSpinning ? 'SELECTING_PRESENTER...' : 'SPIN'}</span>
            </button>
          </div>
        </section>

        {/* Student manager sidebar */}
        <StudentManager
          students={students}
          history={history}
          onAddStudent={handleAddStudent}
          onBulkAddStudents={handleBulkAddStudents}
          onToggleStudent={handleToggleStudent}
          onDeleteStudent={handleDeleteStudent}
          onResetRoster={handleResetRoster}
          onToggleAll={handleToggleAll}
          onClearHistory={handleClearHistory}
          onSettingsHoldStart={handleSettingsHoldStart}
          onSettingsHoldEnd={handleSettingsHoldEnd}
        />
      </div>

      {/* Hidden Secret Dialog overlay */}
      <SecretModal
        isOpen={isSecretOpen}
        onClose={() => setIsSecretOpen(false)}
        students={students}
        secretQueue={secretQueue}
        onAddToQueue={handleAddToSecretQueue}
        onRemoveFromQueue={handleRemoveFromSecretQueue}
        onClearQueue={handleClearSecretQueue}
      />

      {/* Subtle footer with stealth indicator dot */}
      <footer className="app-footer">
        <p>
          © 2026 FIGMA PRESENTER SELECTOR
          <span 
            className={`secret-indicator ${secretQueue.length > 0 ? 'active' : ''}`}
            title="Stealth override status"
            aria-hidden="true"
          />
        </p>
      </footer>

      {/* Inline figmaSans title font-weight modulation */}
      <style dangerouslySetInnerHTML={{ __html: `
        .title-draw-weight {
          font-weight: 300 !important;
          color: #888888;
        }

        .slot-card {
          min-height: 520px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
      `}} />
    </main>
  );
}
