'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import ContactModal from '@/components/ContactModal';

/* ─── WebGL Viscous Liquid Shader ───────────────────────────────────────── */
function LiquidShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true });
    if (!gl) return;

    const vsSource = `
      attribute vec4 aVertexPosition;
      void main() { gl_Position = aVertexPosition; }
    `;

    const fsSource = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;

      vec2 random2(vec2 st){
          st = vec2(dot(st,vec2(127.1,311.7)), dot(st,vec2(269.5,183.3)));
          return -1.0 + 2.0*fract(sin(st)*43758.5453123);
      }
      
      float noise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          vec2 u = f*f*(3.0-2.0*f);
          return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                           dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                      mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                           dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
      }

      void main() {
          vec2 st = gl_FragCoord.xy/u_resolution.xy;
          st.x *= u_resolution.x/u_resolution.y;
          st *= 3.0; // Zoom out slightly for more swirls
          
          // Domain warping to create viscous liquid currents
          vec2 q = vec2(0.);
          q.x = noise(st + 0.5 * u_time);
          q.y = noise(st + vec2(1.0));
          
          vec2 r = vec2(0.);
          r.x = noise(st + 2.0*q + vec2(1.7,9.2)+ 0.15*u_time);
          r.y = noise(st + 2.0*q + vec2(8.3,2.8)+ 0.126*u_time);
          
          float f = noise(st+r*2.0);
          
          // Genolcare Colors: Deep clinical blue & electric green
          vec3 colorBlue = vec3(0.102, 0.231, 0.545); // #1A3B8B
          vec3 colorGreen = vec3(0.427, 0.745, 0.271); // #6DBE45
          
          vec3 color = mix(colorBlue, colorGreen, clamp(f*2.0 + 0.2, 0.0, 1.0));
          
          // Boost alpha for strong liquid presence
          float alpha = smoothstep(0.1, 0.9, f);
          gl_FragColor = vec4(color * alpha * 1.5, alpha);
      }
    `;

    function loadShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if(!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const shaderProgram = gl.createProgram();
    
    if(!shaderProgram || !vertexShader || !fragmentShader) return;
    
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    const positions = new Float32Array([
      -1.0,  1.0,
       1.0,  1.0,
      -1.0, -1.0,
       1.0, -1.0,
    ]);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const timeUniformLocation = gl.getUniformLocation(shaderProgram, "u_time");
    const resolutionUniformLocation = gl.getUniformLocation(shaderProgram, "u_resolution");

    let animationFrameId: number;
    const startTime = Date.now();

    function render() {
      if(!canvas || !gl) return;
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      }

      gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
      // Faster time multiplier for energetic fluid dynamics
      gl.uniform1f(timeUniformLocation, (Date.now() - startTime) / 800);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen rounded-full" />;
}

/* ─── Main Component ────────────────────────────────────────────────────── */
export default function SecureInsightCTA() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Magnetic Button Physics
  const buttonX = useSpring(0, { stiffness: 150, damping: 15, mass: 0.5 });
  const buttonY = useSpring(0, { stiffness: 150, damping: 15, mass: 0.5 });
  // The scale handles both proactive magnetic swelling and hover states
  const scale = useSpring(1, { stiffness: 200, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Proactive Magnetic Zone: If cursor is within 250px, button reaches for it
    if (dist < 250) {
      buttonX.set(dx * 0.15); 
      buttonY.set(dy * 0.15);
      // Calculate a slight swell that peaks right before the actual hover
      const proximitySwell = 1 + (1 - dist / 250) * 0.05;
      scale.set(proximitySwell); 
    } else {
      buttonX.set(0);
      buttonY.set(0);
      scale.set(1);
    }
  };

  const handleMouseLeave = () => {
    buttonX.set(0);
    buttonY.set(0);
    scale.set(1);
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-screen h-screen bg-[#0A0A0A] overflow-hidden flex flex-col items-center justify-center border-t border-white/5"
    >
      {/* Abstract Floating Background Image */}
      <motion.div 
        animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 z-0 pointer-events-none mix-blend-screen"
      >
        <Image 
          src="/ConsultingInsignia.png" 
          alt="Insignia Aura" 
          width={700} 
          height={700} 
          className="object-contain filter blur-xl"
        />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full">
        
        {/* The Narrative Hook */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-mono text-[10px] md:text-xs tracking-[0.4em] text-slate-400 uppercase">
            [ SECURING_INSIGHT // WAPCP_OVERSIGHT ]
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 mb-16 md:mb-24 max-w-4xl"
        >
          <h2 className="font-serif italic font-medium text-4xl sm:text-5xl md:text-7xl lg:text-[5rem] text-slate-200 tracking-wide drop-shadow-2xl leading-[1.1]">
            Expertise formulated.<br />Secure the blueprint.
          </h2>
        </motion.div>

        {/* The Liquid Morph CTA */}
        <motion.button 
          ref={buttonRef}
          onClick={() => setIsModalOpen(true)}
          style={{ x: buttonX, y: buttonY, scale }}
          whileHover={{ scale: 1.08 }} // Expands slightly further on true hover
          whileTap={{ scale: 0.92, filter: "brightness(1.5)" }} // Clean liquid snap
          className="relative px-10 md:px-20 py-6 md:py-8 rounded-full bg-white/5 border border-white/20 backdrop-blur-3xl overflow-hidden group shadow-[0_0_40px_rgba(255,255,255,0.03)] transition-shadow duration-500 hover:shadow-[0_0_80px_rgba(109,190,69,0.25)] hover:border-white/40"
        >
          {/* Viscous Liquid Shader (Melts and Swirls on Hover) */}
          <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out pointer-events-none overflow-hidden rounded-[inherit]">
            <LiquidShader />
          </div>
          
          <span className="relative z-10 text-white font-satoshi font-bold text-lg md:text-2xl lg:text-3xl tracking-tight flex items-center gap-4">
            Secure your Clinical Insight
            <span className="text-[#6DBE45] group-hover:translate-x-3 transition-transform duration-500 ease-out text-xl md:text-3xl">→</span>
          </span>
        </motion.button>

      </div>

      {/* The Inquiry Portal */}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
