'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring, useVelocity } from 'framer-motion';

/* ─── WebGL Aura Shader ─────────────────────────────────────────────────── */
function AuraShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true });
    if (!gl) return;

    const vsSource = `
      attribute vec4 aVertexPosition;
      void main() {
        gl_Position = aVertexPosition;
      }
    `;

    const fsSource = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;

      float random (in vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      float noise (in vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          vec2 u = f*f*(3.0-2.0*f);
          return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      float fbm (in vec2 st) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < 4; i++) {
              value += amplitude * noise(st);
              st *= 2.0;
              amplitude *= 0.5;
          }
          return value;
      }

      void main() {
          vec2 st = gl_FragCoord.xy/u_resolution.xy;
          
          // Animate the plasma/aura
          vec2 q = vec2(0.0);
          q.x = fbm(st + 0.1 * u_time);
          q.y = fbm(st + vec2(1.0));
          
          vec2 r = vec2(0.0);
          r.x = fbm(st + 1.0*q + vec2(1.7,9.2)+ 0.15*u_time);
          r.y = fbm(st + 1.0*q + vec2(8.3,2.8)+ 0.126*u_time);
          
          float f = fbm(st+r);
          
          // Genolcare Palette: Blue #1A3B8B, Green #6DBE45
          vec3 colorBlue = vec3(0.102, 0.231, 0.545);
          vec3 colorGreen = vec3(0.427, 0.745, 0.271);
          
          vec3 color = mix(colorBlue, colorGreen, clamp(f*1.5, 0.0, 1.0));
          
          // Glow mask: strong at the bottom (st.y = 0), fades out at top (st.y = 1)
          float glowMask = smoothstep(1.0, 0.0, st.y);
          float alpha = glowMask * f * 1.5;
          
          // Output with premultiplied alpha for seamless canvas blending
          gl_FragColor = vec4(color * alpha, alpha);
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

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ─── Velocity Title Component ──────────────────────────────────────────── */
const VelocityTitle = ({ title }: { title: string }) => {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  
  // Transform velocity into a skew and scale stretch
  const skewX = useTransform(smoothVelocity, [-2000, 2000], [12, -12]);
  const scaleY = useTransform(smoothVelocity, [-2000, 0, 2000], [1.15, 1, 1.15]);

  return (
    <motion.h2 
      style={{ skewX, scaleY }} 
      className="font-satoshi font-black text-6xl md:text-8xl lg:text-[9rem] xl:text-[11rem] text-white uppercase tracking-tighter leading-[0.85] origin-bottom will-change-transform"
    >
      {title}
    </motion.h2>
  );
};

/* ─── Editorial Block Component ─────────────────────────────────────────── */
const StepBlock = ({ step, index }: { step: { title: string; subtitle: string; desc: string }, index: number }) => {
  return (
    <div className="w-screen h-full flex flex-col justify-end px-6 md:px-20 pb-20 md:pb-32 shrink-0 relative z-20">
      <div className="flex flex-col max-w-6xl w-full mx-auto">
        
        {/* The Kinetic Velocity Title */}
        <VelocityTitle title={step.title} />
        
        {/* Stagger Reveal Details */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } }
          }}
          className="mt-8 md:mt-12 flex flex-col md:flex-row md:items-start gap-4 md:gap-16 relative z-30"
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", delay: index * 0.1 } } }}>
             <span className="font-mono text-xs md:text-sm tracking-[0.2em] text-[#6DBE45] uppercase bg-[#050505]/50 px-4 py-2 rounded-full border border-[#6DBE45]/20 backdrop-blur-md">
                {step.subtitle}
             </span>
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", delay: index * 0.1 + 0.1 } } }} className="max-w-2xl">
             <p className="text-xl md:text-3xl text-white/80 font-light leading-relaxed drop-shadow-lg">
                {step.desc}
             </p>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
};

/* ─── Main Component ────────────────────────────────────────────────────── */
const steps = [
  {
    title: "01. LISTEN",
    subtitle: "Strategic Intake",
    desc: "Decoding therapeutic history, physiological context, and patient priorities."
  },
  {
    title: "02. ANALYZE",
    subtitle: "Diagnostic Evaluation",
    desc: "Synthesizing data against Eugene Apasi Eromosele\u0026apos;s evidence-based clinical guidelines."
  },
  {
    title: "03. FORMULATE",
    subtitle: "Wellness Architecture",
    desc: "Structuring the personalized therapeutic blueprint and integration plan."
  },
  {
    title: "04. MONITOR",
    subtitle: "Proactive Oversight",
    desc: "Dynamic therapeutic evaluation for continuous optimization."
  }
];

export default function DialogueFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  // Spring physics for viscous horizontal scrolling
  const springProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  // Map scroll progress to horizontal translation
  // Since there are 4 panels (each 100vw wide), we need to translate by -300vw to see the 4th panel
  // -75% of a 400vw track equals -300vw.
  const x = useTransform(springProgress, [0, 1], ["0%", "-75%"]);
  
  // Subtle vertical kinetic shift for the background image
  const yShift = useTransform(springProgress, [0, 1], ["-2%", "2%"]);
  
  return (
    // 400vh forces the user to scroll vertically to traverse the 4 horizontal panels
    <section ref={containerRef} className="relative h-[400vh] bg-[#050505] w-full">
       
       <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">
          
          {/* Static Title: The Protocol of Listening */}
          <div className="absolute top-12 md:top-20 left-6 md:left-20 z-40">
            <h2 className="font-mono text-[10px] md:text-xs tracking-[0.4em] text-white/50 uppercase flex items-center gap-3">
              [ THE_PROTOCOL_OF_LISTENING ]
              <span className="w-1.5 h-1.5 rounded-full bg-genolcare-green animate-pulse" />
            </h2>
          </div>

          {/* Background Image Layer */}
          <motion.div style={{ y: yShift }} className="absolute inset-0 z-0">
             <Image 
                src="/TheEngagement.png" 
                alt="Consulting Engagement" 
                fill 
                className="object-cover opacity-50 mix-blend-luminosity" 
                priority
             />
             {/* Deep contrast vignette to ensure text pops */}
             <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-transparent to-[#050505]/90" />
          </motion.div>
          
          {/* The Aura Shader Strip at bottom (Dark Contrast Strip) */}
          <div className="absolute bottom-0 left-0 w-full h-[50vh] z-10 overflow-hidden mix-blend-screen pointer-events-none">
             <AuraShader />
          </div>

          {/* Background Darkness Gradient for Text Block Legibility */}
          <div className="absolute bottom-0 left-0 w-full h-[60vh] z-10 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent pointer-events-none" />

          {/* Horizontal Track Container */}
          {/* w-[400vw] contains 4 children, each 100vw wide */}
          <motion.div style={{ x }} className="absolute bottom-0 left-0 flex w-[400vw] h-full z-20">
             {steps.map((step, index) => (
                <StepBlock key={index} step={step} index={index} />
             ))}
          </motion.div>

       </div>

    </section>
  );
}
