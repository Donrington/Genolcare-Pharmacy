'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import TrueFocus from './TrueFocus';
import ContactModal from './ContactModal';
import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
} from 'framer-motion';

/* ─── WebGL Lustre Shader ─────────────────────────────────────────── */
function LustreShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { premultipliedAlpha: false });
    if (!gl) return;

    const vs = `
      attribute vec4 a_pos;
      void main() { gl_Position = a_pos; }
    `;

    const fs = `
      precision mediump float;
      uniform float u_t;
      uniform vec2 u_res;

      void main() {
        vec2 uv = gl_FragCoord.xy / u_res;

        /* Diagonal sweep bands */
        float band = sin(uv.x * 2.8 - uv.y * 1.2 + u_t * 0.22) * 0.5 + 0.5;
        float band2 = sin(uv.y * 3.5 + u_t * 0.18) * 0.5 + 0.5;

        /* Travelling specular hotspot */
        vec2 lp = vec2(0.5 + sin(u_t * 0.14) * 0.35, 0.38 + cos(u_t * 0.11) * 0.22);
        float spec = pow(max(0.0, 1.0 - distance(uv, lp) * 2.4), 4.0);

        float lustre = band * band2 * 0.45 + spec * 0.9;

        vec3 blue  = vec3(0.102, 0.231, 0.545);
        vec3 green = vec3(0.427, 0.745, 0.271);
        vec3 white = vec3(0.96, 0.99, 1.0);

        vec3 col = mix(blue, green, band2);
        col = mix(col, white, clamp(spec * 1.8, 0.0, 1.0));

        /* Vignette */
        vec2 c = uv - 0.5;
        float vig = 1.0 - smoothstep(0.28, 0.78, length(c) * 1.7);

        float alpha = lustre * vig * 0.72;
        gl_FragColor = vec4(col * alpha, alpha);
      }
    `;

    const glCtx = gl; // capture for closure null-safety
    function compile(type: number, src: string) {
      const sh = glCtx.createShader(type)!;
      glCtx.shaderSource(sh, src);
      glCtx.compileShader(sh);
      return sh;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uT = gl.getUniformLocation(prog, 'u_t');
    const uR = gl.getUniformLocation(prog, 'u_res');

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    let raf: number;
    const t0 = Date.now();

    function render() {
      if (!canvas || !gl) return;
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      }
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uT, (Date.now() - t0) / 1000);
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(raf);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

/* ─── Status Badge ────────────────────────────────────────────────── */
function StatusBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 2.2, ease: [0.22, 1, 0.36, 1] }}
      className="absolute top-8 right-6 sm:right-10 z-50
        flex items-center gap-2.5
        bg-white/70 backdrop-blur-2xl border border-white/40
        rounded-full px-4 py-2 shadow-sm"
    >
      <motion.div
        animate={{ scale: [1, 1.6, 1], opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="w-1.5 h-1.5 rounded-full bg-genolcare-green flex-shrink-0"
      />
      <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.2em] text-[#0F1830]/60 uppercase whitespace-nowrap select-none">
        SYSTEM_STATUS: RAPID_RESPONSE_ACTIVE
      </span>
    </motion.div>
  );
}

/* ─── Main Component ──────────────────────────────────────────────── */

export default function HeroOTC() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const bgRef    = useRef<HTMLDivElement>(null);
  const headRef  = useRef<HTMLDivElement>(null);
  const subRef   = useRef<HTMLParagraphElement>(null);

  /* ── Velocity-based directional blur ── */
  const { scrollY } = useScroll();
  const velocity    = useVelocity(scrollY);
  const smoothVel   = useSpring(velocity, { damping: 50, stiffness: 400 });
  const blurPx      = useTransform(smoothVel, [-3000, 0, 3000], [16, 0, 16]);
  const scaleYVal   = useTransform(smoothVel, [-3000, 0, 3000], [1.12, 1, 1.12]);
  const blurFilter  = useTransform(blurPx, (b) => `blur(${b}px)`);

  /* ── GSAP entry timeline ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* 1. Velocity-snap background */
      gsap.from(bgRef.current, {
        scale: 1.15,
        filter: 'blur(40px) brightness(1.5)',
        duration: 1.9,
        ease: 'power4.out',
      });

      /* 2. Sub-headline slide */
      gsap.from(subRef.current, {
        x: -64,
        opacity: 0,
        duration: 1.05,
        ease: 'power3.out',
        delay: 0.93,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="relative w-full h-screen min-h-[600px] overflow-hidden
        flex flex-col items-center justify-center bg-[#F8F9FB]"
      aria-label="OTC Medications Hero"
    >
      {/* ── Layer 1: Background Image (velocity-snap via GSAP) ─── */}
      <div ref={bgRef} className="absolute inset-0 z-0 will-change-transform">
        <Image
          src="/BaseOfVitality.png"
          alt="Genuine OTC medications — Genolcare Pharmacy"
          fill
          priority
          quality={100}
          className="object-cover object-center"
        />
        {/* High-key wash — keeps the scene clinical & bright */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white/50" />
      </div>

      {/* ── Layer 2: Lustre Shader — z-10, mix-blend: screen ─────
          Renders BEHIND the z-20 headline layer so the lustrous
          light appears to emanate from beneath the letterforms,
          giving them physical depth (elevation over the light plane). */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <LustreShader />
      </div>

      {/* ── Status Badge ─────────────────────────────────────────── */}
      <StatusBadge />

      {/* ── Layer 3: Content — z-20 (above shader) ───────────────── */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 w-full max-w-7xl">

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="font-mono text-[9px] sm:text-[10px] tracking-[0.42em] text-[#1A3B8B]/55 uppercase mb-8 md:mb-10"
        >
          SERVICE_003 // OTC MEDICATIONS
        </motion.p>

        {/* ── Headline with velocity blur + TrueFocus ──────────────
            Layer z-20 sits above the Lustre Shader (z-10).
            TrueFocus cycles the corner-frame between IMMEDIATE and CARE.
            The velocity blur wrapper applies directional stretch on scroll,
            maintaining the "Immediate" kinetic theme throughout.
        */}
        <motion.div
          ref={headRef}
          style={{
            filter: blurFilter,
            scaleY: scaleYVal,
            willChange: 'filter, transform',
          }}
          className="w-full"
        >
          <h1
            className="font-satoshi font-black tracking-tighter text-center uppercase"
            style={{
              fontSize: 'clamp(3.8rem, 12.5vw, 13.5rem)',
              lineHeight: 0.88,
              color: '#0F1830',
              letterSpacing: '-0.045em',
              // Drop-shadow lifts text above the lustre light plane
              filter: 'drop-shadow(0 6px 24px rgba(15,24,48,0.09))',
            }}
          >
            <TrueFocus
              sentence="IMMEDIATE CARE"
              separator=" "
              manualMode={false}
              blurAmount={7}
              borderColor="#0F1830"
              glowColor="rgba(109, 190, 69, 0.55)"
              animationDuration={0.75}
              pauseBetweenAnimations={2}
              inline={true}
              className="justify-center"
            />
          </h1>
        </motion.div>

        {/* ── Sub-headline ───────────────────────────────────────── */}
        <p
          ref={subRef}
          className="mt-8 md:mt-10 font-satoshi font-light text-[#0F1830]/70"
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.45rem)',
            letterSpacing: '0.005em',
          }}
        >
          Genuine essentials. Delivered at the{' '}
          <span
            style={{ color: '#6DBE45', fontWeight: 600 }}
          >
            speed
          </span>{' '}
          of life.
        </p>

        {/* ── CTA Row ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 1.85, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex items-center gap-6 flex-wrap justify-center"
        >
          <motion.button
            onClick={() => setIsContactOpen(true)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full
              font-satoshi font-semibold text-sm text-white
              bg-gradient-to-br from-[#6DBE45] via-[#5BA838] to-[#4A9430]
              border border-white/20 backdrop-blur-xl
              shadow-[0_20px_50px_rgba(109,190,69,0.25),inset_0_1px_0_rgba(255,255,255,0.3)]
              hover:shadow-[0_28px_64px_rgba(109,190,69,0.35),inset_0_1px_0_rgba(255,255,255,0.4)]
              transition-all duration-300 overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
              translate-x-full group-hover:translate-x-0 transition-transform duration-500 pointer-events-none" />
            <span className="relative">Need a consultation?</span>
            <svg className="w-4 h-4 relative transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </motion.button>
        </motion.div>

        {/* ── Trust pills ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.1 }}
          className="mt-8 flex flex-wrap gap-2 justify-center"
        >
          {['100% Genuine', 'NAFDAC Sourced', 'Fast Turnaround', 'Specialist Verified'].map((tag) => (
            <span
              key={tag}
              className="font-mono text-[9px] tracking-[0.18em] uppercase
                px-3 py-1.5 rounded-full border border-[#0F1830]/12
                text-[#0F1830]/45 bg-white/60 backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3"
      >
        <span className="font-mono text-[8px] tracking-[0.3em] text-[#0F1830]/25 uppercase">
          Scroll
        </span>
        <div className="relative w-px h-14 bg-[#0F1830]/10 overflow-hidden rounded-full">
          <motion.div
            className="absolute top-0 left-0 w-full rounded-full"
            style={{ background: 'linear-gradient(to bottom, #1A3B8B, #6DBE45)' }}
            animate={{ height: ['0%', '100%', '0%'], top: ['0%', '0%', '100%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4 }}
          />
        </div>
      </motion.div>

      {/* ── Contact Modal ────────────────────────────────────────── */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </section>
  );
}
