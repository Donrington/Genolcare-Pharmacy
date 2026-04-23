'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';

/* ─── WebGL Molecular Noise Shader ──────────────────────────────────────── */
function MolecularNoise() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    // Vertex shader
    const vsSource = `
      attribute vec4 aVertexPosition;
      void main() {
        gl_Position = aVertexPosition;
      }
    `;

    // Fragment shader (Molecular Noise)
    const fsSource = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;

      vec2 random2(vec2 st){
          st = vec2( dot(st,vec2(127.1,311.7)),
                     dot(st,vec2(269.5,183.3)) );
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
          st *= 4.0;

          float n = noise(st + u_time * 0.15);
          float n2 = noise(st * 2.5 - u_time * 0.1);
          float f = n * 0.5 + n2 * 0.5;
          
          f = smoothstep(-0.2, 0.4, f);

          // Genolcare Brand Colors
          vec3 colorBlue = vec3(0.102, 0.231, 0.545); // #1A3B8B
          vec3 colorGreen = vec3(0.427, 0.745, 0.271); // #6DBE45
          
          vec3 mixedColor = mix(colorBlue, colorGreen, f);
          // Boost intensity for dark card illumination
          mixedColor *= 1.5;

          gl_FragColor = vec4(mixedColor, f * 0.4); // Higher alpha for dark card background
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
      gl.uniform1f(timeUniformLocation, (Date.now() - startTime) / 1000);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(shaderProgram);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full rounded-[inherit] pointer-events-none" />;
}

/* ─── Glass Slab Component ──────────────────────────────────────────────── */
interface LiquidCardProps {
  className?: string;
  children: React.ReactNode;
  imageSrc?: string;
}

function LiquidCard({ className, children, imageSrc }: LiquidCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isTapped, setIsTapped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Magnetic tilt physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), { stiffness: 120, damping: 20 });

  function handleMouseMove(e: React.MouseEvent) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    setMousePosition({ x: px, y: py });
    
    x.set((px / rect.width) - 0.5);
    y.set((py / rect.height) - 0.5);
  }

  const toggleTapped = () => {
    // Only toggle on mobile/touch devices or small screens
    if (window.innerWidth < 768) {
      setIsTapped(!isTapped);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={toggleTapped}
      initial="initial"
      whileHover="hover"
      animate={isTapped ? "hover" : "rest"}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`group relative rounded-[2rem] p-[1px] bg-[#0a0a0a]/40 shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:shadow-[0_16px_48px_rgba(26,59,139,0.2)] transition-shadow duration-500 will-change-transform cursor-pointer ${className}`}
    >
      {/* Liquid Laser Border (Cursor Follower) */}
      <motion.div
        className="absolute inset-0 z-0 rounded-[2rem] pointer-events-none overflow-hidden"
        variants={{
          initial: { opacity: 0 },
          hover: { opacity: 1 }
        }}
        transition={{ duration: 0.4 }}
      >
        <div 
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl will-change-transform"
          style={{
            background: 'radial-gradient(circle, rgba(109,190,69,0.5) 0%, rgba(26,59,139,0.5) 50%, transparent 70%)',
            left: mousePosition.x - 300,
            top: mousePosition.y - 300,
            transform: 'translateZ(0)' // Force hardware acceleration
          }}
        />
      </motion.div>

      {/* Inner Glass Slab - Dark Mode inside */}
      <div className="relative z-10 w-full h-full rounded-[calc(2rem-1px)] bg-black/40 backdrop-blur-3xl shadow-[inset_0_0_1px_rgba(255,255,255,0.15)] p-8 sm:p-10 md:p-12 overflow-hidden flex flex-col items-start border border-white/10">
        
        {/* Background Image Layer - Normal Blending, Highly Visible */}
        {imageSrc && (
          <motion.div 
            className="absolute inset-0 z-0 pointer-events-none"
            variants={{
              initial: { scale: 1, opacity: 0.3, filter: 'grayscale(100%)' },
              hover: { scale: 1.05, opacity: 0.8, filter: 'grayscale(0%)' }
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Image
              src={imageSrc}
              alt="Expertise Background"
              fill
              className="object-cover"
            />
            {/* Dark gradient overlays to create depth and protect white text legibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/95 via-[#050505]/60 to-[#050505]/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/40 to-transparent" />
          </motion.div>
        )}

        {/* Molecular Noise Shader - Screen blend for dark background */}
        <motion.div 
          className="absolute inset-0 z-0 pointer-events-none mix-blend-screen"
          variants={{
            initial: { opacity: 0, scale: 1.05 },
            hover: { opacity: 1, scale: 1 }
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
           <MolecularNoise />
           {/* Fade overlay to keep text legible */}
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </motion.div>

        {/* Content Container (Elevated via 3D transform for parallax) */}
        <div 
          className="relative z-10 h-full w-full flex flex-col pointer-events-auto"
          style={{ transform: "translateZ(30px)" }}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Animation Variants ────────────────────────────────────────────────── */
const contentVariants = {
  initial: { opacity: 0 },
  hover: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1, delayChildren: 0.1 } 
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 15 },
  hover: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

/* ─── Main Component ────────────────────────────────────────────────────── */
export default function ExpertiseMatrix() {
  return (
    // Light Mode Background
    <section className="relative w-full py-28 px-6 md:px-12 bg-[#FAFAFA] overflow-hidden">
      
      {/* Title */}
      <div className="w-full max-w-7xl mx-auto mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="font-mono text-xs md:text-sm tracking-[0.4em] text-gray-400 uppercase">
            [ THE_CONSULTATION_AXIS ]
          </h2>
        </motion.div>
      </div>

      {/* Grid Flow */}
      <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-6 w-full max-w-7xl mx-auto relative z-10 perspective-1000">
          
          {/* ─── Card 01: Chronic Management (The Hero) ─── */}
          <LiquidCard imageSrc="/ChronicOversight.png" className="md:col-span-8 md:row-span-2 min-h-[450px] md:min-h-[600px]">
            <div className="flex flex-col h-full w-full justify-between">
              <div>
                <span className="font-mono text-[10px] tracking-widest uppercase text-[#4F7CFF] bg-[#1A3B8B]/30 px-3 py-1.5 rounded-full border border-[#1A3B8B]/40">
                  Primary Node
                </span>
                {/* White text since the card is dark */}
                <h3 className="font-satoshi font-black text-4xl sm:text-5xl md:text-7xl text-white mt-8 leading-[0.9] tracking-tighter uppercase">
                  Chronic Disease<br />Management
                </h3>
                
                {/* Initial state helper text */}
                <motion.div variants={{ initial: { opacity: 1, y: 0 }, hover: { opacity: 0, y: -10 } }} className="mt-8 absolute">
                  <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-white/70 bg-white/10 px-4 py-2 rounded-full border border-white/20 backdrop-blur-sm shadow-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-genolcare-green rounded-full animate-pulse" />
                    Initialize Diagnostic ↘
                  </span>
                </motion.div>
              </div>

              {/* Hover Expansion */}
              <motion.div variants={contentVariants} className="mt-20 flex flex-col gap-6">
                <motion.p variants={itemVariants} className="text-white/80 text-lg md:text-2xl font-medium leading-relaxed max-w-2xl">
                  Long-term oversight of hypertension, diabetes, and infectious diseases. We architect personalized therapeutic pathways for sustained clinical stability.
                </motion.p>
                <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mt-4">
                  {['Hypertension', 'Diabetes', 'Infectious Diseases', 'Biochemical Tracking'].map((tag, i) => (
                    <span key={i} className="font-mono text-[10px] tracking-widest uppercase px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/90 shadow-sm backdrop-blur-md">
                      {tag}
                    </span>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </LiquidCard>

          {/* ─── Card 02: MTM (Medication Therapy Management) ─── */}
          <LiquidCard imageSrc="/PolypharmacyReview.png" className="md:col-span-4 md:row-span-1 min-h-[300px]">
            <div className="flex flex-col h-full w-full justify-between">
              <div>
                <span className="font-mono text-[10px] tracking-widest uppercase text-[#6DBE45] bg-[#6DBE45]/20 px-3 py-1.5 rounded-full border border-[#6DBE45]/30">
                  Protocol 02
                </span>
                <h3 className="font-satoshi font-black text-3xl md:text-5xl text-white mt-6 leading-[0.9] tracking-tighter uppercase">
                  MTM
                </h3>
                <p className="font-mono text-[9px] tracking-widest uppercase text-white/60 mt-3">Medication Therapy Mgt</p>
                
                <motion.div variants={{ initial: { opacity: 1, y: 0 }, hover: { opacity: 0, y: -10 } }} className="mt-6 absolute">
                  <span className="text-[9px] tracking-[0.2em] uppercase font-mono text-white/50">
                    Reveal ↘
                  </span>
                </motion.div>
              </div>

              <motion.div variants={contentVariants} className="mt-16">
                <motion.p variants={itemVariants} className="text-white/80 text-sm md:text-base font-medium leading-relaxed">
                  Optimization and cross-checking of complex polypharmacy regimens to eliminate contraindications and maximize efficacy.
                </motion.p>
                <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mt-4">
                  {['Polypharmacy', 'Cross-checking'].map((tag, i) => (
                    <span key={i} className="font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/80 shadow-sm">
                      {tag}
                    </span>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </LiquidCard>

          {/* ─── Card 03: Nutritional Wellness ─── */}
          <LiquidCard imageSrc="/BiochemicalBalance.png" className="md:col-span-4 md:row-span-1 min-h-[300px]">
            <div className="flex flex-col h-full w-full justify-between">
              <div>
                <span className="font-mono text-[10px] tracking-widest uppercase text-white/80 bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                  Protocol 03
                </span>
                <h3 className="font-satoshi font-black text-3xl md:text-5xl text-white mt-6 leading-[0.9] tracking-tighter uppercase">
                  Nutritional<br/>Wellness
                </h3>
                
                <motion.div variants={{ initial: { opacity: 1, y: 0 }, hover: { opacity: 0, y: -10 } }} className="mt-6 absolute">
                  <span className="text-[9px] tracking-[0.2em] uppercase font-mono text-white/50">
                    Reveal ↘
                  </span>
                </motion.div>
              </div>

              <motion.div variants={contentVariants} className="mt-16">
                <motion.p variants={itemVariants} className="text-white/80 text-sm md:text-base font-medium leading-relaxed">
                  Biochemical alignment of diet and therapeutic plans. Precision nutrition to support cellular recovery and drug metabolism.
                </motion.p>
                <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mt-4">
                  {['Dietary Alignment', 'Metabolism'].map((tag, i) => (
                    <span key={i} className="font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/80 shadow-sm">
                      {tag}
                    </span>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </LiquidCard>

      </div>
    </section>
  );
}
