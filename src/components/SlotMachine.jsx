import React, { useState, useEffect } from 'react';
import { playSpinTick, playWinFanfare } from '../utils/audio';
import ConfettiCanvas from './ConfettiCanvas';

// ----------------------------------------------------
// Individual Slot Reel Component (Figma Style Card)
// ----------------------------------------------------
function SlotReel({ isSpinning, winnerName, candidates, delay, onSpinEnd }) {
  const [displayName, setDisplayName] = useState('—');
  const [reelState, setReelState] = useState('idle'); // idle, spinning, stopping, finished

  useEffect(() => {
    if (!isSpinning) {
      setDisplayName('—');
      setReelState('idle');
      return;
    }

    setReelState('spinning');
    let timer;
    let interval = 50; 
    let elapsed = 0;
    const totalSpinTime = 1200 + delay; 

    const tick = () => {
      if (candidates && candidates.length > 0) {
        const randomCandidate = candidates[Math.floor(Math.random() * candidates.length)];
        setDisplayName(randomCandidate.name);
        playSpinTick();
      } else {
        setDisplayName('—');
      }

      elapsed += interval;

      if (elapsed > totalSpinTime - 500) {
        setReelState('stopping');
        interval = interval * 1.35; 
      }

      if (elapsed >= totalSpinTime) {
        setDisplayName(winnerName || '—');
        setReelState('finished');
        if (onSpinEnd) {
          onSpinEnd();
        }
      } else {
        timer = setTimeout(tick, interval);
      }
    };

    timer = setTimeout(tick, interval);

    return () => clearTimeout(timer);
  }, [isSpinning, winnerName, candidates, delay]);

  const borderClass = 
    reelState === 'spinning' ? 'border-primary-thick' :
    reelState === 'finished' ? 'border-success-flash' : 
    'border-normal';

  return (
    <div className={`figma-slot-reel ${borderClass}`}>
      <div className="slot-header">
        <span className="slot-eyebrow">
          {reelState === 'spinning' && 'SPINNING'}
          {reelState === 'stopping' && 'DECEL'}
          {reelState === 'finished' && 'SUCCESS'}
          {reelState === 'idle' && 'READY'}
        </span>
      </div>
      <div className="slot-body">
        <span className="slot-name-display">{displayName}</span>
      </div>
      <div className="slot-footer">
        <span className="slot-caption-code">SLOT_{delay/500 + 1}</span>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Main Slot Machine Wrapper Component
// ----------------------------------------------------
export default function SlotMachine({ isSpinning, winners, candidates, onSpinFinished }) {
  const [reelsFinished, setReelsFinished] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isSpinning) {
      setReelsFinished([]);
      setShowConfetti(false);
    }
  }, [isSpinning]);

  const handleReelEnd = (index) => {
    setReelsFinished((prev) => {
      const updated = [...prev, index];
      if (updated.length === winners.length) {
        playWinFanfare();
        setShowConfetti(true);
        if (onSpinFinished) {
          onSpinFinished();
        }
      }
      return updated;
    });
  };

  return (
    <div className="figma-slot-machine">
      <ConfettiCanvas active={showConfetti} />
      
      <div className="figma-cabinet-block">
        <div className="cabinet-eyebrow-row">
          <span className="cabinet-eyebrow-label">STORYBOARD / LUCKY DRAW</span>
          <span className="cabinet-badge">ACTIVE</span>
        </div>

        <div className="figma-reels-row">
          {winners.map((winner, index) => (
            <SlotReel
              key={index}
              isSpinning={isSpinning}
              winnerName={winner ? winner.name : '—'}
              candidates={candidates}
              delay={index * 500} 
              onSpinEnd={() => handleReelEnd(index)}
            />
          ))}
          {winners.length === 0 && (
            <div className="figma-placeholder">
              <span className="placeholder-mono">NO_SLOTS_ACTIVE</span>
              <p className="placeholder-sub">추첨 인원수를 선택하고 아래 SPIN 버튼을 클릭하세요.</p>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .figma-slot-machine {
          position: relative;
          width: 100%;
        }

        /* Cream Color-Block Section Style */
        .figma-cabinet-block {
          background-color: var(--block-cream);
          color: var(--figma-ink);
          border-radius: var(--rounded-lg);
          padding: var(--spacing-xxl) var(--spacing-lg) var(--spacing-lg) var(--spacing-lg);
          position: relative;
          border: 1px solid var(--figma-hairline);
        }

        .cabinet-eyebrow-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }

        .cabinet-eyebrow-label {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.8px;
          color: #777777;
        }

        .cabinet-badge {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 700;
          background-color: var(--figma-primary);
          color: var(--figma-on-primary);
          padding: 3px 8px;
          border-radius: var(--rounded-pill);
        }

        .figma-reels-row {
          display: flex;
          gap: var(--spacing-md);
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          min-height: 220px;
        }

        .figma-placeholder {
          text-align: center;
          padding: var(--spacing-xl);
          width: 100%;
        }

        .placeholder-mono {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          font-weight: 700;
          color: #888888;
          display: block;
          margin-bottom: 8px;
        }

        .placeholder-sub {
          font-size: 0.95rem;
          color: #666666;
        }

        /* Figma Style Individual Slot Reel Card */
        .figma-slot-reel {
          flex: 1;
          min-width: 140px;
          max-width: 180px;
          height: 180px;
          background-color: var(--figma-canvas);
          border-radius: var(--rounded-md);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 14px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Border radius states matching Figma System */
        .border-normal {
          border: 1px solid var(--figma-hairline);
        }

        .border-primary-thick {
          border: 1.5px solid var(--figma-primary);
        }

        .border-success-flash {
          border: 2px solid var(--figma-primary);
          animation: success-pulse 0.4s ease-out;
        }

        .slot-header, .slot-footer {
          display: flex;
          width: 100%;
        }

        .slot-eyebrow {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: #888888;
        }

        .border-primary-thick .slot-eyebrow {
          color: var(--figma-primary);
        }

        .border-success-flash .slot-eyebrow {
          color: var(--figma-primary);
          font-weight: 700;
        }

        .slot-body {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin: 10px 0;
        }

        .slot-name-display {
          font-family: var(--font-sans);
          font-size: 2.1rem;
          font-weight: 700;
          color: var(--figma-ink);
          text-align: center;
          letter-spacing: -0.5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .border-success-flash .slot-name-display {
          font-size: 2.3rem;
          font-weight: 900;
          transform: scale(1.03);
          color: var(--figma-primary);
        }

        .slot-caption-code {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.5px;
          color: #bbbbbb;
        }

        @keyframes success-pulse {
          0% { transform: scale(0.95); border-color: var(--figma-hairline); }
          50% { transform: scale(1.04); border-color: var(--figma-primary); }
          100% { transform: scale(1); border-color: var(--figma-primary); }
        }
      `}} />
    </div>
  );
}
