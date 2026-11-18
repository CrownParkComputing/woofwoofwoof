"use client";

import { useRef, useState, useCallback } from "react";

let audioCtx: AudioContext | null = null;

function yip(ctx: AudioContext, at: number) {
  const t = ctx.currentTime + at;

  // Main bark voice: sawtooth sweeping down, like a dog's "wuff"
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(700, t);
  osc.frequency.exponentialRampToValueAtTime(140, t + 0.12);

  const oscGain = ctx.createGain();
  oscGain.gain.setValueAtTime(0.0001, t);
  oscGain.gain.exponentialRampToValueAtTime(0.6, t + 0.012);
  oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);

  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 2600;

  // Second harmonic for body
  const sub = ctx.createOscillator();
  sub.type = "triangle";
  sub.frequency.setValueAtTime(280, t);
  sub.frequency.exponentialRampToValueAtTime(90, t + 0.12);
  const subGain = ctx.createGain();
  subGain.gain.setValueAtTime(0.0001, t);
  subGain.gain.exponentialRampToValueAtTime(0.4, t + 0.012);
  subGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);

  osc.connect(lp).connect(oscGain).connect(ctx.destination);
  sub.connect(subGain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.16);
  sub.start(t);
  sub.stop(t + 0.15);

  // Breath noise burst
  const dur = 0.1;
  const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 800;
  bp.Q.value = 0.9;
  const nGain = ctx.createGain();
  nGain.gain.setValueAtTime(0.25, t);
  nGain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  noise.connect(bp).connect(nGain).connect(ctx.destination);
  noise.start(t);
}

async function bark() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") await audioCtx.resume();
    if (audioCtx.state !== "running") return;
    yip(audioCtx, 0.02);
    yip(audioCtx, 0.28);
  } catch {
    // Audio unavailable — animation still plays
  }
}

interface Bubble {
  id: number;
  text: string;
  x: number;
}

const WOOF_TEXTS = ["WOOF WOOF!", "WOOF!", "BORK BORK!", "ARF ARF!", "WOOF WOOF WOOF!"];

export default function BarkDog({ size = 220 }: { size?: number }) {
  const [barking, setBarking] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const idRef = useRef(0);

  const handleClick = useCallback(() => {
    void bark();
    setBarking(true);
    const id = ++idRef.current;
    setBubbles((b) => [
      ...b,
      { id, text: WOOF_TEXTS[Math.floor(Math.random() * WOOF_TEXTS.length)], x: (Math.random() - 0.5) * 60 },
    ]);
    setTimeout(() => setBubbles((b) => b.filter((bb) => bb.id !== id)), 1100);
    setTimeout(() => setBarking(false), 950);
  }, []);

  return (
    <div className="relative inline-block select-none" style={{ width: size, height: size }}>
      {/* Speech bubbles */}
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="woof-bubble pointer-events-none absolute -top-8 left-1/2 z-10 whitespace-nowrap rounded-2xl border-4 border-amber-900 bg-white px-4 py-1.5 text-xl font-black text-amber-900 shadow-lg"
          style={{ marginLeft: b.x, transform: "translateX(-50%)" }}
        >
          {b.text}
          <div className="absolute -bottom-3 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b-4 border-r-4 border-amber-900 bg-white" />
        </div>
      ))}

      <button
        onClick={handleClick}
        aria-label="Click the dog to bark"
        title="Click me!"
        className="block h-full w-full cursor-pointer rounded-full transition-transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500"
      >
        <svg
          viewBox="0 0 220 210"
          className={`h-full w-full drop-shadow-xl ${barking ? "dog-barking" : ""}`}
        >
          {/* Tail — sticking out behind, wagging */}
          <g className="dog-tail">
            <path
              d="M52 158 Q16 152 10 116 Q26 130 54 136 Q60 148 52 158 Z"
              fill="#8b5e3c"
            />
          </g>

          <g className="dog-body">
            {/* Haunches (sitting) */}
            <ellipse cx="58" cy="168" rx="30" ry="24" fill="#a06a3d" />
            <ellipse cx="162" cy="168" rx="30" ry="24" fill="#a06a3d" />
            {/* Body */}
            <ellipse cx="110" cy="152" rx="52" ry="44" fill="#b07747" />
            {/* Chest patch */}
            <ellipse cx="110" cy="158" rx="28" ry="32" fill="#e8b887" />
            {/* Front legs */}
            <rect x="86" y="158" width="17" height="40" rx="8.5" fill="#b07747" />
            <rect x="117" y="158" width="17" height="40" rx="8.5" fill="#b07747" />
            {/* Paws */}
            <ellipse cx="94" cy="198" rx="13" ry="7" fill="#8b5e3c" />
            <ellipse cx="126" cy="198" rx="13" ry="7" fill="#8b5e3c" />
            {/* Collar */}
            <path d="M74 116 Q110 132 146 116 L146 128 Q110 144 74 128 Z" fill="#e11d48" />
            <circle cx="110" cy="136" r="8" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
          </g>

          {/* Head group */}
          <g className="dog-head">
            {/* Ears behind head — big floppy */}
            <ellipse cx="62" cy="62" rx="17" ry="36" fill="#6b4226" transform="rotate(28 62 62)" />
            <ellipse cx="158" cy="62" rx="17" ry="36" fill="#6b4226" transform="rotate(-28 158 62)" />
            {/* Head */}
            <circle cx="110" cy="82" r="50" fill="#b07747" />
            {/* Eye patch spot */}
            <circle cx="134" cy="66" r="16" fill="#a06a3d" opacity="0.55" />
            {/* Muzzle */}
            <ellipse cx="110" cy="100" rx="28" ry="22" fill="#e8b887" />
            {/* Eyes */}
            <circle cx="90" cy="72" r="7" fill="#2d1a10" />
            <circle cx="130" cy="72" r="7" fill="#2d1a10" />
            <circle cx="92.5" cy="69.5" r="2.4" fill="white" />
            <circle cx="132.5" cy="69.5" r="2.4" fill="white" />
            {/* Brows */}
            <path d="M80 58 Q90 53 99 58" stroke="#6b4226" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M121 58 Q130 53 140 58" stroke="#6b4226" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            {/* Nose */}
            <ellipse cx="110" cy="92" rx="11" ry="8" fill="#3f2517" />
            <circle cx="106" cy="89" r="2.4" fill="#9a9a9a" opacity="0.7" />
            {/* Mouth — closed: friendly "ω" smile */}
            <g className="dog-mouth-closed">
              <path
                d="M110 100 Q110 110 98 108 M110 100 Q110 110 122 108"
                stroke="#5b3a29"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />
            </g>
            {/* Mouth — open with tongue */}
            <g className="dog-mouth-open">
              <ellipse cx="110" cy="112" rx="15" ry="11" fill="#3f2517" />
              <ellipse cx="110" cy="118" rx="8" ry="9" fill="#f472b6" />
              <ellipse cx="110" cy="115" rx="8" ry="3" fill="#3f2517" opacity="0.3" />
            </g>
          </g>
        </svg>
      </button>
      <p className="mt-1 text-center text-sm font-bold text-amber-800/70">👆 click me — I bark!</p>
    </div>
  );
}
