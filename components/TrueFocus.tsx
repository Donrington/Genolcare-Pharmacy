'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface TrueFocusProps {
  sentence: string;
  separator?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  className?: string;
  inline?: boolean;
}

export default function TrueFocus({
  sentence = 'True Focus',
  separator = ' ',
  manualMode = false,
  blurAmount = 5,
  borderColor = '#1A3B8B',
  glowColor = 'rgba(26, 59, 139, 0.6)',
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  className = '',
  inline = false,
}: TrueFocusProps) {
  const words = sentence.split(separator);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Recalculate focus rect using offsetLeft/offsetTop (accurate for wrapped text)
  const updateFocusRect = useCallback(() => {
    if (currentIndex === null || currentIndex === -1) return;

    const activeElement = wordRefs.current[currentIndex];
    if (!activeElement || !containerRef.current) return;

    setFocusRect({
      x: activeElement.offsetLeft,
      y: activeElement.offsetTop,
      width: activeElement.offsetWidth,
      height: activeElement.offsetHeight,
    });
  }, [currentIndex]);

  // Auto-animation interval
  useEffect(() => {
    if (!manualMode) {
      const interval = setInterval(
        () => {
          setCurrentIndex((prev) => (prev + 1) % words.length);
        },
        (animationDuration + pauseBetweenAnimations) * 1000
      );

      return () => clearInterval(interval);
    }
    return undefined;
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  // Update focus rect when current index changes
  useEffect(() => {
    updateFocusRect();
  }, [currentIndex, updateFocusRect]);

  // ResizeObserver: recalculate on container resize (responsive typography)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      updateFocusRect();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateFocusRect]);

  const handleMouseEnter = (index: number) => {
    if (manualMode) {
      setLastActiveIndex(index);
      setCurrentIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (manualMode && lastActiveIndex !== null) {
      setCurrentIndex(lastActiveIndex);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-wrap ${inline ? 'gap-[0.25em]' : 'gap-[0.5em]'} ${inline ? '' : 'justify-center'} items-center select-none outline-none ${className}`}
    >
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        return (
          <span
            key={index}
            ref={(el) => {
              wordRefs.current[index] = el;
            }}
            className="relative cursor-pointer select-none outline-none"
            style={{
              filter: isActive ? `blur(0px)` : `blur(${blurAmount}px)`,
              transitionProperty: 'filter',
              transitionDuration: `${animationDuration}s`,
              transitionTimingFunction: 'ease',
              willChange: 'filter',
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {word}
          </span>
        );
      })}

      {/* Focus Frame with Animated Corners */}
      <motion.div
        className="absolute top-0 left-0 pointer-events-none"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: currentIndex >= 0 ? 1 : 0,
        }}
        transition={{
          duration: animationDuration,
          ease: 'easeOut',
        }}
      >
        {/* Top Left Corner */}
        <div
          className="absolute"
          style={{
            top: '-10px',
            left: '-10px',
            width: '1rem',
            height: '1rem',
            borderTop: `3px solid ${borderColor}`,
            borderLeft: `3px solid ${borderColor}`,
            borderRadius: '3px',
            filter: `drop-shadow(0px 0px 4px ${glowColor})`,
          }}
        />
        {/* Top Right Corner */}
        <div
          className="absolute"
          style={{
            top: '-10px',
            right: '-10px',
            width: '1rem',
            height: '1rem',
            borderTop: `3px solid ${borderColor}`,
            borderRight: `3px solid ${borderColor}`,
            borderRadius: '3px',
            filter: `drop-shadow(0px 0px 4px ${glowColor})`,
          }}
        />
        {/* Bottom Left Corner */}
        <div
          className="absolute"
          style={{
            bottom: '-10px',
            left: '-10px',
            width: '1rem',
            height: '1rem',
            borderBottom: `3px solid ${borderColor}`,
            borderLeft: `3px solid ${borderColor}`,
            borderRadius: '3px',
            filter: `drop-shadow(0px 0px 4px ${glowColor})`,
          }}
        />
        {/* Bottom Right Corner */}
        <div
          className="absolute"
          style={{
            bottom: '-10px',
            right: '-10px',
            width: '1rem',
            height: '1rem',
            borderBottom: `3px solid ${borderColor}`,
            borderRight: `3px solid ${borderColor}`,
            borderRadius: '3px',
            filter: `drop-shadow(0px 0px 4px ${glowColor})`,
          }}
        />
      </motion.div>
    </div>
  );
}
