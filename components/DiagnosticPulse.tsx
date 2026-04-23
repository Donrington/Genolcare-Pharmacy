'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useVelocity, useTransform } from 'framer-motion';

/* ─── WebGL / Canvas Diagnostic Waveform ───────────────────────────────── */
function Waveform({ mouseX, velocityX }: { mouseX: any, velocityX: any }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let time = 0;
    let animationFrameId: number;

    const render = () => {
      // Handle high DPI displays for a razor-sharp clinical line
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      }
      
      const width = rect.width;
      const height = rect.height;
      const centerY = height / 2;

      // Deep OLED Black clear
      ctx.clearRect(0, 0, width, height);

      const mx = mouseX.get(); 
      const vel = Math.abs(velocityX.get() || 0);
      // Glitch factor increases with aggressive mouse movement
      const glitchFactor = Math.min(vel / 2000, 1); 

      // 3 overlapping telemetry lines for depth
      const colors = ['#6DBE45', 'rgba(109,190,69,0.4)', 'rgba(255,255,255,0.05)'];
      const blurAmounts = [15, 10, 0];

      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, centerY);

        for (let x = 0; x < width; x += 2) {
          // Calculate distance from cursor X to spike amplitude
          const dist = Math.abs(x - mx);
          const influenceRadius = 400 + glitchFactor * 200;
          const influence = Math.max(0, 1 - dist / influenceRadius); 
          const easedInfluence = influence * influence * (3 - 2 * influence); // Smoothstep curve

          // Base resting wave
          const phase = i * Math.PI * 0.5;
          const baseWave = Math.sin(x * 0.005 + time + phase) * 15;
          
          // Highly active EKG Spike simulation near the cursor
          const spikeFreq = 0.03 + (i * 0.01) + glitchFactor * 0.02;
          const spikeAmp = 100 + (2 - i) * 30 + glitchFactor * 150;
          
          const activeWave = Math.sin(x * spikeFreq - time * (5 + i)) * spikeAmp 
                           * Math.cos(x * 0.02) * easedInfluence;

          // Introduce chaotic static noise based on velocity
          const noise = (Math.random() - 0.5) * (glitchFactor * (80 + i * 20)) * easedInfluence;

          const y = centerY + baseWave * (1 - easedInfluence) + activeWave + noise;

          ctx.lineTo(x, y);
        }

        ctx.lineWidth = i === 0 ? 2 + glitchFactor * 2 : 1;
        ctx.strokeStyle = colors[i];
        ctx.shadowBlur = blurAmounts[i] + glitchFactor * 15;
        ctx.shadowColor = i < 2 ? '#6DBE45' : '#ffffff';
        ctx.stroke();
      }

      time += 0.05;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [mouseX, velocityX]);

  return <canvas ref={canvasRef} className="w-full h-full pointer-events-none" />;
}

/* ─── Main Component ────────────────────────────────────────────────────── */
export default function DiagnosticPulse() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Motion Values for cursor tracking
  const mouseX = useMotionValue(-1000); // Start offscreen
  const velocityX = useVelocity(mouseX);
  
  // Spring physics for the tracking line and data pills
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  // Glitch shifting for the data pills based on velocity
  const springGlitch = useSpring(useTransform(velocityX, [-2000, 2000], [40, -40]), { stiffness: 300, damping: 10 });

  // Simulated Real-Time Metric State
  const [bpm, setBpm] = useState(72);
  const [spo2, setSpo2] = useState(98);
  const [bpSys, setBpSys] = useState(120);

  // Randomize vitals slightly based on how aggressively the user moves the mouse
  useEffect(() => {
    const interval = setInterval(() => {
      const vel = Math.abs(velocityX.get());
      if (vel > 500) {
         setBpm(Math.floor(72 + Math.random() * 15 + (vel / 200)));
         setSpo2(Math.floor(98 - Math.random() * 2));
         setBpSys(Math.floor(120 + Math.random() * 10 + (vel / 300)));
      } else {
         setBpm(prev => prev > 72 ? prev - 1 : 72);
         setSpo2(prev => prev < 98 ? prev + 1 : 98);
         setBpSys(prev => prev > 120 ? prev - 1 : 120);
      }
    }, 400); // Fast clinical tick rate
    return () => clearInterval(interval);
  }, [velocityX]);

  function handleMouseMove(e: React.MouseEvent) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
  }

  // Ensure initial cursor position centers after hydration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      mouseX.set(window.innerWidth / 2);
    }
  }, [mouseX]);

  return (
    <section 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      className="relative w-screen h-screen bg-[#0A0A0A] overflow-hidden flex flex-col justify-between cursor-crosshair"
    >
      {/* 1. Header: Live Telemetry */}
      <div className="absolute top-12 md:top-20 left-8 md:left-20 z-20">
        <h2 className="font-mono text-[10px] md:text-xs tracking-[0.4em] text-white/50 uppercase flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-genolcare-green animate-pulse" />
          [ LIVE_TELEMETRY // SYNCHRONIZED OVERSIGHT ]
        </h2>
      </div>

      {/* 2. Interactive Waveform Canvas */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
         <Waveform mouseX={mouseX} velocityX={velocityX} />
      </div>

      {/* 3. Floating Data Markers (Scanner Reticle) */}
      <motion.div 
        style={{ x: springX }}
        className="absolute top-0 bottom-0 w-px bg-white/5 z-20 pointer-events-none"
      >
         {/* Vertical Glowing Scanning Beam */}
         <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[60vh] bg-gradient-to-b from-transparent via-[#6DBE45]/20 to-transparent" />
         
         {/* Top Marker: BPM */}
         <motion.div style={{ x: springGlitch }} className="absolute top-[30vh] left-6 whitespace-nowrap">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 text-white/90 font-mono text-[10px] md:text-xs px-4 py-2 rounded-full shadow-[0_0_20px_rgba(109,190,69,0.15)] flex items-center gap-3">
               <span className="text-[#6DBE45] font-bold">BPM</span> {bpm}
            </div>
         </motion.div>

         {/* Middle Marker: SPO2 */}
         {/* Inverse glitch translation for organic chaos */}
         <motion.div style={{ x: useTransform(springGlitch, v => -v) }} className="absolute top-[45vh] right-6 whitespace-nowrap">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 text-white/90 font-mono text-[10px] md:text-xs px-4 py-2 rounded-full shadow-[0_0_20px_rgba(109,190,69,0.15)] flex items-center gap-3">
               <span className="text-[#6DBE45] font-bold">SPO2</span> {spo2}%
            </div>
         </motion.div>

         {/* Bottom Marker: BP */}
         <motion.div style={{ x: springGlitch }} className="absolute top-[60vh] left-6 whitespace-nowrap">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 text-white/90 font-mono text-[10px] md:text-xs px-4 py-2 rounded-full shadow-[0_0_20px_rgba(109,190,69,0.15)] flex items-center gap-3">
               <span className="text-[#6DBE45] font-bold">BP</span> {bpSys}/80
            </div>
         </motion.div>
      </motion.div>

      {/* 4. Text & Narrative */}
      <div className="absolute bottom-12 md:bottom-24 left-0 w-full flex justify-center z-20 pointer-events-none">
        <h3 className="font-serif italic text-3xl md:text-5xl lg:text-6xl text-white/80 tracking-wide drop-shadow-2xl">
          Expertise synchronized with your vitals.
        </h3>
      </div>
      
      {/* Deep OLED Vignette to blend the edges out completely */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-[#0A0A0A] pointer-events-none z-0 opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A] pointer-events-none z-0 opacity-80" />
      
    </section>
  );
}
