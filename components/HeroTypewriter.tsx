'use client';

import { useState, useEffect, useRef } from 'react';

const TEXT_BUILD = "Go on you good thing — let's build";
const TEXT_TALK = "Go on you good thing — let's talk";
const TEXT_DONE = "Go on you good thing — you've done it.";
const PREFIX_LEN = "Go on you good thing — ".length;
const HOLD_MS = 4000;
const REPEAT_COUNT = 3;
const CHAR_MS_MIN = 36;
const CHAR_MS_MAX = 58;
const PAUSE_AFTER_EM_DASH_MS = 320;

const getTextForCycle = (cycleIndex: number) =>
  cycleIndex === 1 ? TEXT_TALK : cycleIndex === 2 ? TEXT_DONE : TEXT_BUILD;

const getCharDelay = (index: number): number => {
  if (index === PREFIX_LEN) return PAUSE_AFTER_EM_DASH_MS;
  return CHAR_MS_MIN + Math.random() * (CHAR_MS_MAX - CHAR_MS_MIN);
};

export default function HeroTypewriter() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [currentText, setCurrentText] = useState(TEXT_BUILD);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cycleCountRef = useRef(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisibleCount(TEXT_BUILD.length);
      setCurrentText(TEXT_BUILD);
      return;
    }

    cycleCountRef.current = 0;

    const scheduleNext = (charIndex: number, fullText: string) => {
      if (charIndex >= fullText.length) {
        cycleCountRef.current += 1;
        const hasMoreCycles = cycleCountRef.current < REPEAT_COUNT;
        timeoutRef.current = setTimeout(() => {
          if (hasMoreCycles) {
            const nextText = getTextForCycle(cycleCountRef.current);
            setCurrentText(nextText);
            setVisibleCount(0);
            scheduleNext(0, nextText);
          }
        }, HOLD_MS);
        return;
      }
      const delay = getCharDelay(charIndex);
      timeoutRef.current = setTimeout(() => {
        setVisibleCount(charIndex + 1);
        scheduleNext(charIndex + 1, fullText);
      }, delay);
    };

    const runCycle = () => {
      setCurrentText(TEXT_BUILD);
      setVisibleCount(0);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      scheduleNext(0, TEXT_BUILD);
    };

    runCycle();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const prefix = currentText.slice(0, Math.min(visibleCount, PREFIX_LEN));
  const suffix = visibleCount > PREFIX_LEN ? currentText.slice(PREFIX_LEN, visibleCount) : '';
  const isComplete = visibleCount >= currentText.length;

  return (
    <div className="hero-title-3d-wrapper">
      <h1
        id="hero-heading"
        className="hero-title-3d-typewriter font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-50 max-w-4xl leading-[1.1]"
      >
        {prefix}
        {suffix && (
          <span className="bg-gradient-to-r from-accent-blue via-accent-violet to-accent-violet bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            {suffix}
          </span>
        )}
        {!isComplete && (
          <span
            className="inline-block w-0.5 h-[0.9em] bg-accent-blue ml-0.5 align-baseline animate-pulse"
            aria-hidden
          />
        )}
      </h1>
    </div>
  );
}
