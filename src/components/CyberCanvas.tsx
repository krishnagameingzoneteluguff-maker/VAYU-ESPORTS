import React, { useEffect, useRef } from 'react';

export const CyberCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Handle resizing
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === document.body) {
          width = canvas.width = window.innerWidth;
          height = canvas.height = window.innerHeight;
        }
      }
    });
    resizeObserver.observe(document.body);

    // Particles config
    const particleCount = 50;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }> = [];

    const colors = ['rgba(0, 242, 254, ', 'rgba(157, 78, 221, ', 'rgba(123, 44, 191, '];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const drawGrid = () => {
      if (!ctx || !width || !height) return;
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.03)';
      ctx.lineWidth = 1;

      // Vertical lines
      const step = 60;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    const animate = () => {
      if (!ctx || !width || !height) return;
      ctx.fillStyle = 'rgba(6, 6, 12, 0.3)'; // Semi-transparent black for trail
      ctx.fillRect(0, 0, width, height);

      drawGrid();

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color === colors[0] ? '#00f2fe' : '#9d4ede';
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      // Draw subtle neon grid hubs
      ctx.fillStyle = 'rgba(0, 242, 254, 0.07)';
      for (let i = 0; i < 5; i++) {
        const xIndex = Math.floor(width / 3) * (i % 3) + 100;
        const yIndex = Math.floor(height / 2) * Math.floor(i / 3) + 150;
        ctx.beginPath();
        ctx.arc(xIndex, yIndex, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      id="cyber-grid-canvas"
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
