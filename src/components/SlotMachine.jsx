import React, { useState, useEffect } from 'react';
import { playSpinTick, playWinFanfare } from '../utils/audio';
import ConfettiCanvas from './ConfettiCanvas';

// ----------------------------------------------------
// Individual Slot Reel Component
// ----------------------------------------------------
function SlotReel({ isSpinning, winnerName, candidates, delay, onSpinEnd }) {
  const [displayName, setDisplayName] = useState('???');
  const [reelState, setReelState] = useState('idle'); // idle, spinning, stopping, finished

  useEffect(() => {
    if (!isSpinning) {
      setDisplayName('???');
      setReelState('idle');
      return;
    }

    setReelState('spinning');
    let timer;
    let interval = 50; // Initial fast interval (ms)
    let elapsed = 0;
    const totalSpinTime = 1200 + delay; // Each reel has a different delay to stop sequentially

    const tick = () => {
      if (candidates && candidates.length > 0) {
        // Pick random candidates to show during spin
        const randomCandidate = candidates[Math.floor(Math.random() * candidates.length)];
        setDisplayName(randomCandidate.name);
        playSpinTick();
      } else {
        setDisplayName('???');
      }

      elapsed += interval;

      // Slowly increase interval as spin duration approaches its end (slowdown effect)
      if (elapsed > totalSpinTime - 600) {
        setReelState('stopping');
        interval = interval * 1.35; 
      }

      if (elapsed >= totalSpinTime) {
        // Lock to the official winner
        setDisplayName(winnerName || '???');
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

  // CSS classes based on state for neon border glows
  const borderGlowClass = 
    reelState === 'spinning' ? 'glow-cyan' :
    reelState === 'stopping' ? 'glow-yellow' :
    reelState === 'finished' ? 'glow-green blinking-border' : 
    'glow-purple';

  return (
    <div className={`slot-reel ${borderGlowClass}`}>
      <div className="slot-scanline"></div>
      <div className="slot-glass-highlight"></div>
      <div className="slot-content">
        <span className="slot-label">READY</span>
        <div className="slot-display-name">
          {displayName}
        </div>
        <span className="slot-status-code">
          {reelState === 'spinning' && 'SPINNING'}
          {reelState === 'stopping' && 'DECEL...'}
          {reelState === 'finished' && 'WINNER!'}
          {reelState === 'idle' && 'STANDBY'}
        </span>
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
      // When the last reel finishes, trigger victory fanfare, confetti, and complete callback
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
    <div className="slot-machine-container">
      <ConfettiCanvas active={showConfetti} />
      
      <div className="slot-machine-cabinet">
        <div className="cabinet-marquee">
          <div className="marquee-light cyan-light"></div>
          <div className="marquee-text">LUCKY DRAW CABINET</div>
          <div className="marquee-light pink-light"></div>
        </div>

        <div className="reels-row">
          {winners.map((winner, index) => (
            <SlotReel
              key={index}
              isSpinning={isSpinning}
              winnerName={winner ? winner.name : '???'}
              candidates={candidates}
              delay={index * 500} // Each reel stops 0.5s after the previous one
              onSpinEnd={() => handleReelEnd(index)}
            />
          ))}
          {winners.length === 0 && (
            <div className="no-reels-placeholder">
              <span className="placeholder-text">인원수를 선택하고 아래 SPIN 버튼을 누르세요!</span>
            </div>
          )}
        </div>

        <div className="cabinet-control-deck">
          <div className="deck-vent"></div>
          <div className="deck-vent"></div>
          <div className="deck-vent"></div>
        </div>
      </div>

      {/* Embedded Styles for Slot Machine elements */}
      <style dangerouslySetInnerHTML={{ __html: `
        .slot-machine-container {
          position: relative;
          width: 100%;
          margin: 0 auto;
        }

        .slot-machine-cabinet {
          background: #19122c;
          border: 4px solid var(--neon-purple);
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.6), 0 0 20px rgba(157, 0, 255, 0.3);
          padding: 24px;
          position: relative;
        }

        .cabinet-marquee {
          background: #0d0818;
          border: 3px solid var(--neon-pink);
          border-radius: 8px;
          padding: 12px;
          text-align: center;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 0 15px rgba(255,0,85,0.2);
        }

        .marquee-text {
          font-family: var(--font-arcade);
          font-size: 0.9rem;
          color: var(--neon-yellow);
          text-shadow: var(--shadow-yellow);
          letter-spacing: 1px;
        }

        .marquee-light {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          animation: blink 0.5s infinite alternate;
        }

        .cyan-light {
          background-color: var(--neon-cyan);
          box-shadow: var(--shadow-cyan);
        }

        .pink-light {
          background-color: var(--neon-pink);
          box-shadow: var(--shadow-pink);
          animation-delay: 0.25s;
        }

        .reels-row {
          display: flex;
          gap: 16px;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          min-height: 220px;
          background: #090511;
          padding: 20px;
          border-radius: 10px;
          border: 2px solid #281a42;
        }

        .no-reels-placeholder {
          color: #6a6480;
          font-size: 0.95rem;
          font-weight: 500;
          text-align: center;
          font-family: var(--font-body);
        }

        /* Slot Reel Component Styles */
        .slot-reel {
          flex: 1;
          min-width: 140px;
          max-width: 180px;
          height: 180px;
          background-color: #000;
          border: 3px solid;
          border-radius: 10px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .glow-purple { border-color: var(--neon-purple); box-shadow: 0 0 8px rgba(157,0,255,0.4); }
        .glow-cyan { border-color: var(--neon-cyan); box-shadow: var(--shadow-cyan); }
        .glow-yellow { border-color: var(--neon-yellow); box-shadow: var(--shadow-yellow); }
        .glow-green { border-color: var(--neon-green); box-shadow: var(--shadow-green); }

        .blinking-border {
          animation: border-flash 0.3s infinite alternate;
        }

        .slot-scanline {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(
            rgba(0,240,255,0) 0%,
            rgba(0,240,255,0.06) 50%,
            rgba(0,240,255,0) 100%
          );
          background-size: 100% 40px;
          animation: scroll-scanline 6s linear infinite;
          pointer-events: none;
          z-index: 3;
        }

        .slot-glass-highlight {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 50%;
          background: linear-gradient(rgba(255,255,255,0.08), rgba(255,255,255,0));
          pointer-events: none;
          z-index: 4;
        }

        .slot-content {
          padding: 12px 8px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .slot-label {
          font-family: var(--font-arcade);
          font-size: 0.5rem;
          color: #6a6480;
          letter-spacing: 1px;
        }

        .slot-display-name {
          font-size: 2.2rem;
          font-weight: 900;
          color: #fff;
          text-shadow: 0 0 10px rgba(255,255,255,0.6);
          word-break: break-all;
          text-align: center;
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 100%;
          margin: 10px 0;
          font-family: var(--font-body);
        }

        .glow-green .slot-display-name {
          color: var(--neon-green);
          text-shadow: var(--shadow-green);
          font-size: 2.4rem;
          transform: scale(1.05);
          animation: name-pop 0.3s ease-out;
        }

        .slot-status-code {
          font-family: var(--font-arcade);
          font-size: 0.5rem;
          letter-spacing: 0.5px;
          padding: 3px 6px;
          border-radius: 4px;
          background-color: #0b0716;
          color: var(--neon-pink);
        }

        .glow-green .slot-status-code {
          color: var(--neon-green);
          background-color: rgba(57,255,20,0.1);
        }

        .cabinet-control-deck {
          height: 20px;
          background: #110c1f;
          border-top: 2px solid #281a42;
          margin-top: 20px;
          border-radius: 0 0 8px 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
        }

        .deck-vent {
          width: 40px;
          height: 4px;
          background: #000;
          border-radius: 2px;
        }

        @keyframes blink {
          0% { opacity: 0.3; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1.1); }
        }

        @keyframes border-flash {
          0% { border-color: var(--neon-green); box-shadow: 0 0 5px var(--neon-green); }
          100% { border-color: #fff; box-shadow: 0 0 20px var(--neon-green); }
        }

        @keyframes scroll-scanline {
          0% { background-position: 0 0; }
          100% { background-position: 0 400px; }
        }

        @keyframes name-pop {
          0% { transform: scale(0.6); opacity: 0.5; }
          70% { transform: scale(1.15); }
          100% { transform: scale(1.05); }
        }
      `}} />
    </div>
  );
}
