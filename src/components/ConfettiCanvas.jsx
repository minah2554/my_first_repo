import React, { useEffect, useRef } from 'react';

export default function ConfettiCanvas({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;

    // Set canvas dimensions based on container parent
    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    
    resizeCanvas();

    const colors = ['#ff0055', '#00f0ff', '#9d00ff', '#ffdd00', '#39ff14'];
    const particles = [];

    // Spawn 160 colorful particles shooting upward from the bottom middle
    for (let i = 0; i < 160; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 40,
        y: canvas.height - 20,
        size: Math.random() * 8 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 16,
        speedY: -Math.random() * 18 - 8, // shooting velocity
        gravity: 0.22,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
        opacity: 1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let anyAlive = false;

      particles.forEach((p) => {
        // Apply physics
        p.speedY += p.gravity;
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        
        // Bounce off side walls slightly
        if (p.x < 0 || p.x > canvas.width) {
          p.speedX = -p.speedX * 0.8;
        }

        // Check if particles are falling down and fade them
        if (p.speedY > 0) {
          p.opacity -= 0.006;
        }

        if (p.opacity > 0 && p.y < canvas.height + 50) {
          anyAlive = true;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          
          // Draw standard confetti rectangles
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (anyAlive) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Clear remaining canvas when finished
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
        borderRadius: '12px'
      }}
    />
  );
}
