import { useEffect, useRef } from 'react';
import { Brain, Network, Zap, Cpu } from 'lucide-react';
import { useSimulation } from '../../../context/SimulationContext';
import styles from './AtlasBrain.module.css';

export default function AtlasBrain() {
  const { phase, aiState } = useSimulation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Animation state
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: { x: number, y: number, vx: number, vy: number, life: number }[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw central brain core
      const baseRadius = 40;
      const pulse = aiState.thinking ? Math.sin(Date.now() / 150) * 10 : Math.sin(Date.now() / 1000) * 3;
      const coreRadius = baseRadius + pulse;

      // Color based on phase
      let coreColor = 'hsl(215, 100%, 58%)'; // nominal blue
      if (phase === 'crisis') coreColor = 'hsl(0, 72%, 58%)';
      else if (phase === 'alert') coreColor = 'hsl(38, 92%, 55%)';
      else if (phase === 'recovery') coreColor = 'hsl(152, 60%, 48%)';

      // Core glow
      const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius * 3);
      grad.addColorStop(0, coreColor);
      grad.addColorStop(1, 'transparent');
      
      ctx.fillStyle = grad;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius * 3, 0, Math.PI * 2);
      ctx.fill();

      // Emit particles if thinking
      if (aiState.thinking && Math.random() > 0.5) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 3;
        particles.push({
          x: centerX + Math.cos(angle) * coreRadius,
          y: centerY + Math.sin(angle) * coreRadius,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.0
        });
      }

      // Update and draw particles
      ctx.globalAlpha = 1;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2 * p.life, 0, Math.PI * 2);
        ctx.fillStyle = coreColor;
        ctx.globalAlpha = p.life;
        ctx.fill();
      }

      // Draw core
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = coreColor;
      ctx.globalAlpha = 0.8;
      ctx.fill();
      
      // Draw outer rings
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius * 1.5, 0, Math.PI * 2);
      ctx.strokeStyle = coreColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.4;
      ctx.stroke();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [phase, aiState.thinking]);

  return (
    <div className={`${styles.brainContainer} ${styles[phase]}`}>
      <div className={styles.canvasWrapper}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
      
      <div className={styles.brainOverlay}>
        <div className={styles.brainHeader}>
          <Brain className={styles.brainIcon} />
          <div className={styles.brainTitle}>Atlas Neural Core</div>
        </div>
        
        <div className={styles.brainStatus}>
          <div className={styles.statusLabel}>Network Status</div>
          <div className={styles.statusValue}>
            {aiState.thinking ? 'Processing Inputs...' : 'Monitoring Active'}
          </div>
        </div>

        {/* Floating Metrics */}
        <div className={styles.metricsGrid}>
          <div className={styles.metric}>
            <Cpu size={14} />
            <span>99.9%</span>
          </div>
          <div className={styles.metric}>
            <Network size={14} />
            <span>12ms</span>
          </div>
          <div className={styles.metric}>
            <Zap size={14} />
            <span>Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
