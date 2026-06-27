import { useEffect, useRef } from "react";

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse
    const mouse = { x: -1000, y: -1000, radius: 150 };

    // Stars
    interface Star {
      x: number;
      y: number;
      size: number;
      twinkleSpeed: number;
      alpha: number;
      direction: number;
    }
    const stars: Star[] = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5,
        twinkleSpeed: 0.005 + Math.random() * 0.015,
        alpha: Math.random(),
        direction: Math.random() > 0.5 ? 1 : -1,
      });
    }

    // Swirling Galaxy Particles
    interface GalaxyParticle {
      angle: number;
      distance: number;
      speed: number;
      size: number;
      color: string;
    }
    const galaxyParticles: GalaxyParticle[] = [];
    const galaxyColors = [
      "rgba(147, 51, 234, 0.45)", // deep purple
      "rgba(79, 70, 229, 0.45)",  // indigo
      "rgba(6, 182, 212, 0.45)",  // cyan
      "rgba(236, 72, 153, 0.2)"   // pink dust
    ];
    for (let i = 0; i < 200; i++) {
      galaxyParticles.push({
        angle: Math.random() * Math.PI * 2,
        distance: 50 + Math.random() * 350,
        speed: 0.0005 + Math.random() * 0.0015,
        size: Math.random() * 2 + 0.5,
        color: galaxyColors[Math.floor(Math.random() * galaxyColors.length)],
      });
    }

    // Gravitational wave ripples from clicks
    interface Ripple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      speed: number;
      alpha: number;
    }
    let ripples: Ripple[] = [];

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleMouseDown = (e: MouseEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 10,
        maxRadius: 250,
        speed: 4,
        alpha: 1,
      });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mousedown", handleMouseDown);

    // Draw loop
    const render = () => {
      // Space Dark Theme background
      ctx.fillStyle = "#03000a";
      ctx.fillRect(0, 0, width, height);

      // Draw faint background nebula glow
      const radialGlow = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.6
      );
      radialGlow.addColorStop(0, "rgba(22, 10, 48, 0.4)");
      radialGlow.addColorStop(0.5, "rgba(8, 3, 24, 0.2)");
      radialGlow.addColorStop(1, "rgba(3, 0, 10, 1)");
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // 1. Draw Twinkling Stars
      for (const star of stars) {
        star.alpha += star.twinkleSpeed * star.direction;
        if (star.alpha <= 0.1) {
          star.alpha = 0.1;
          star.direction = 1;
        } else if (star.alpha >= 0.95) {
          star.alpha = 0.95;
          star.direction = -1;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
      }

      // 2. Draw Gravitational ripples
      ripples = ripples.filter((r) => r.alpha > 0.01);
      for (const ripple of ripples) {
        ripple.radius += ripple.speed;
        ripple.alpha = 1 - ripple.radius / ripple.maxRadius;
        
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(6, 182, 212, ${ripple.alpha * 0.4})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw outer secondary ripple
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius * 0.75, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(147, 51, 234, ${ripple.alpha * 0.2})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 3. Draw Spiral Galaxy at center
      const centerX = width / 2;
      const centerY = height / 2;
      for (const p of galaxyParticles) {
        p.angle += p.speed;
        
        // Compute spiral arms
        // spiral formula: r = a + b * theta
        const currentDistance = p.distance + Math.sin(p.angle * 2) * 15;
        let x = centerX + Math.cos(p.angle) * currentDistance;
        let y = centerY + Math.sin(p.angle) * currentDistance;

        // Interaction with mouse cursor (gravity attraction)
        if (mouse.x !== -1000) {
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            // Pull slightly towards mouse
            x += (dx / dist) * force * 18;
            y += (dy / dist) * force * 18;
          }
        }

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        
        // Add tiny core highlight
        if (Math.random() > 0.98) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(x, y, 1, 1);
        }
      }

      // Draw faint center glowing black hole event horizon
      ctx.beginPath();
      const holeGlow = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 80);
      holeGlow.addColorStop(0, "rgba(0,0,0,1)");
      holeGlow.addColorStop(0.1, "rgba(10,5,30,0.8)");
      holeGlow.addColorStop(0.5, "rgba(147,51,234,0.15)");
      holeGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
      ctx.fillStyle = holeGlow;
      ctx.fill();

      // Cosmic ring around central core
      ctx.beginPath();
      ctx.arc(centerX, centerY, 82, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(6, 182, 212, 0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="background-universe-canvas"
      className="fixed inset-0 w-full h-full -z-50 block pointer-events-auto"
    />
  );
}
