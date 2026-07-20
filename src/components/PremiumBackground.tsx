import React, { useEffect, useRef, useState } from 'react';

export const PremiumBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle class for drifting gold dust
    class DustParticle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      pulseSpeed: number;
      angle: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.25;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.5 + 0.15;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.angle = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.pulseSpeed;

        // Bounce or wrap edges
        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        // Pulsing glow effect
        const currentOpacity = this.opacity + Math.sin(this.angle) * 0.1;
        c.shadowBlur = Math.random() * 8 + 4;
        c.shadowColor = 'rgba(230, 202, 101, 0.4)';
        c.fillStyle = `rgba(230, 202, 101, ${Math.max(0.05, currentOpacity)})`;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    const particles: DustParticle[] = Array.from({ length: 45 }, () => new DustParticle());

    // Resize handler
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse tracking on container
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: e.clientX,
        y: e.clientY,
        active: true,
      });
    };

    const handleMouseLeave = () => {
      setMouse(prev => ({ ...prev, active: false }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle ambient luxury radial spotlights
      // Top-left gold/copper burst
      const grad1 = ctx.createRadialGradient(width * 0.2, height * 0.1, 50, width * 0.2, height * 0.1, 450);
      grad1.addColorStop(0, 'rgba(115, 77, 28, 0.12)');
      grad1.addColorStop(1, 'rgba(8, 6, 3, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Bottom-right amber burst
      const grad2 = ctx.createRadialGradient(width * 0.8, height * 0.8, 50, width * 0.8, height * 0.8, 400);
      grad2.addColorStop(0, 'rgba(153, 102, 51, 0.08)');
      grad2.addColorStop(1, 'rgba(8, 6, 3, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // 2. Interactive mouse ambient glow
      if (mouse.active) {
        const mouseGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 180);
        mouseGrad.addColorStop(0, 'rgba(230, 202, 101, 0.06)');
        mouseGrad.addColorStop(0.5, 'rgba(230, 202, 101, 0.015)');
        mouseGrad.addColorStop(1, 'rgba(8, 6, 3, 0)');
        ctx.fillStyle = mouseGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // 3. Luxurious thin architectural grid system
      const gridSize = 70;
      ctx.strokeStyle = 'rgba(230, 202, 101, 0.025)';
      ctx.lineWidth = 1;

      // Draw vertical lines
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw micro coordinate crosshairs/dots at intersections
      ctx.fillStyle = 'rgba(230, 202, 101, 0.08)';
      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          // Draw subtle cross or mini-dot at intersection
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 4. Update and draw particles
      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mouse.active, mouse.x, mouse.y]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: '#080603' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
