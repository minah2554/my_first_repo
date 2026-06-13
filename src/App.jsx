import React, { useState, useEffect, useRef } from 'react';
import SlotMachine from './components/SlotMachine';
import StudentManager from './components/StudentManager';
import SecretModal from './components/SecretModal';

export default function App() {
  // ----------------------------------------------------
  // State Initialization
  // ----------------------------------------------------
  
  // Load students from localStorage or load a default list of 15 students
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

  // Load history from localStorage
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

  // Secret predetermined winner queue (not saved in localStorage for stealthiness)
  const [secretQueue, setSecretQueue] = useState([]);
  
  const [drawCount, setDrawCount] = useState(1);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winners, setWinners] = useState([]);
  const [isSecretOpen, setIsSecretOpen] = useState(false);

  // Settings hold timer reference
  const holdTimeoutRef = useRef(null);

  // Save student roster whenever it changes
  useEffect(() => {
    localStorage.setItem('presenter_students', JSON.stringify(students));
  }, [students]);

  // ----------------------------------------------------
  // Student Actions
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
    
    // Also remove from secretQueue if excluded
    setSecretQueue(prev => prev.filter(s => s.id !== id));
  };

  const handleDeleteStudent = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    // Also remove from secretQueue
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
      setSecretQueue([]); // clear secret queue if all excluded
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('추첨 기록을 모두 지우시겠습니까?')) {
      setHistory([]);
      localStorage.removeItem('presenter_history');
    }
  };

  // ----------------------------------------------------
  // Secret Queue Actions
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
  // Settings Button Long Press (3 seconds hold)
  // ----------------------------------------------------
  const handleSettingsHoldStart = (e) => {
    // Prevent default context menus or scrolling on mobile touch
    if (e.type === 'touchstart') {
      // Don't fully preventDefault to allow clicking
    }
    
    // Clear any existing timer just in case
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
    }

    holdTimeoutRef.current = setTimeout(() => {
      setIsSecretOpen(true);
      // Trigger haptic feedback if available on mobile
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

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
      }
    };
  }, []);

  // ----------------------------------------------------
  // Main Spin / Draw Logic
  // ----------------------------------------------------
  const handleSpin = () => {
    if (isSpinning) return;

    const activeStudents = students.filter(s => !s.excluded);
    if (activeStudents.length === 0) {
      alert('활성화된 학생이 없습니다. CONTROL PANEL의 학생 목록에서 추천 대상 학생들을 확인(체크)해 주세요!');
      return;
    }

    if (activeStudents.length < drawCount) {
      alert(`활성화된 학생 수(${activeStudents.length}명)가 추첨할 인원(${drawCount}명)보다 적습니다.`);
      return;
    }

    setIsSpinning(true);
    
    const chosenWinners = [];
    let currentSecretQueue = [...secretQueue];
    let availableCandidates = [...activeStudents];

    for (let i = 0; i < drawCount; i++) {
      let selectedWinner = null;

      // 1. If there's an override in the secret queue, pull it
      if (currentSecretQueue.length > 0) {
        const nextSecret = currentSecretQueue.shift();
        // Check if the secret student exists and is currently active
        const isEligible = availableCandidates.some(s => s.id === nextSecret.id);
        if (isEligible) {
          selectedWinner = nextSecret;
        }
      }

      // 2. Otherwise, draw a random winner from the remaining candidates
      if (!selectedWinner) {
        const randomIndex = Math.floor(Math.random() * availableCandidates.length);
        selectedWinner = availableCandidates[randomIndex];
      }

      chosenWinners.push(selectedWinner);
      
      // Remove this winner from the candidates pool to prevent duplicate draws in the same spin
      availableCandidates = availableCandidates.filter(s => s.id !== selectedWinner.id);
    }

    setWinners(chosenWinners);
    setSecretQueue(currentSecretQueue); // Update the secret queue (e.g. elements are shifted out)
  };

  const handleSpinFinished = () => {
    setIsSpinning(false);

    // Save winners to drawing history
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ko-KR', { hour12: false }); // Format: HH:MM:SS
    
    const newHistoryEntries = winners.map(winner => ({
      name: winner.name,
      time: timeStr
    }));

    const updatedHistory = [...newHistoryEntries, ...history].slice(0, 50); // Keep last 50
    setHistory(updatedHistory);
    localStorage.setItem('presenter_history', JSON.stringify(updatedHistory));
  };

  // Keep winners container sized dynamically
  useEffect(() => {
    if (!isSpinning && winners.length !== drawCount) {
      setWinners(Array(drawCount).fill(null));
    }
  }, [drawCount, isSpinning]);

  return (
    <main className="app-container">
      {/* CRT scanline filters */}
      <div className="crt-overlay" />
      <div className="crt-flicker" />

      {/* Header section */}
      <header className="app-header">
        <h1 className="app-title">
          <span>READY PLAYER</span>
          <span className="neon-pink-text">DRAW</span>
        </h1>
        <div className="app-subtitle">🕹️ CLASSROOM PRESENTER SELECTOR 🕹️</div>
      </header>

      {/* Main Grid: Slot Machine & Manager */}
      <div className="dashboard-grid">
        <section className="arcade-card slot-machine-card" aria-label="추첨기">
          <div className="card-title">
            ⚡ LUCKY SELECTOR
          </div>

          {/* Draw Count Picker */}
          <div className="draw-controls">
            <span className="form-label">발표 추첨 인원수</span>
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

          {/* Slot Machine Display */}
          <SlotMachine
            isSpinning={isSpinning}
            winners={winners}
            candidates={students.filter(s => !s.excluded)}
            onSpinFinished={handleSpinFinished}
          />

          {/* Giant Arcade Spin Button */}
          <div className="spin-btn-container">
            <button
              onClick={handleSpin}
              disabled={isSpinning || students.filter(s => !s.excluded).length === 0}
              className="btn-spin-giant"
              aria-label="추첨 시작"
            >
              <span>{isSpinning ? 'SPINNING' : 'SPIN'}</span>
            </button>
          </div>
        </section>

        {/* Student Manager Sidebar */}
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

      {/* Hidden Secret Overlay */}
      <SecretModal
        isOpen={isSecretOpen}
        onClose={() => setIsSecretOpen(false)}
        students={students}
        secretQueue={secretQueue}
        onAddToQueue={handleAddToSecretQueue}
        onRemoveFromQueue={handleRemoveFromSecretQueue}
        onClearQueue={handleClearSecretQueue}
      />

      {/* Subtle footer with stealth secret dot indicator */}
      <footer className="app-footer">
        <p>
          © 2026 Antigravity Class Arcade
          <span 
            className={`secret-indicator ${secretQueue.length > 0 ? 'active' : ''}`}
            title="Stealth system override status"
            aria-hidden="true"
          />
        </p>
      </footer>

      {/* Extra card specific overrides */}
      <style dangerouslySetInnerHTML={{ __html: `
        .slot-machine-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
      `}} />
    </main>
  );
}
