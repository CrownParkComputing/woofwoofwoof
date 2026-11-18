"use client";

import { useEffect, useState } from "react";
import Paw from "./Paw";

interface Step {
  x: number;
  y: number;
  rot: number;
  delay: number;
  size: number;
}

function makeTrail(width: number, height: number): Step[] {
  const steps: Step[] = [];
  // Start off-screen left, end off-screen right, wandering vertically
  let x = -80;
  let y = height * (0.15 + Math.random() * 0.7);
  let i = 0;
  while (x < width + 80) {
    const nextY = Math.min(
      height * 0.92,
      Math.max(height * 0.08, y + (Math.random() - 0.5) * 110)
    );
    const stepX = 85 + Math.random() * 45;
    const rot = (Math.atan2(nextY - y, stepX) * 180) / Math.PI + 90;
    // Alternate left/right paw offset perpendicular to travel
    const side = i % 2 === 0 ? 1 : -1;
    const perp = rot - 90;
    const ox = Math.sin((perp * Math.PI) / 180) * 18 * side;
    const oy = -Math.cos((perp * Math.PI) / 180) * 18 * side;
    steps.push({
      x: x + ox,
      y: y + oy,
      rot,
      delay: i * 0.32,
      size: 26 + Math.random() * 10,
    });
    x += stepX;
    y = nextY;
    i++;
  }
  return steps;
}

export default function PawTrail() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const generate = () => {
      setSteps(makeTrail(window.innerWidth, window.innerHeight));
    };
    generate();
  }, [run]);

  useEffect(() => {
    if (steps.length === 0) return;
    const total = steps.length * 320 + 2600 + 2500; // trail + fade + pause
    const t = setTimeout(() => setRun((r) => r + 1), total);
    return () => clearTimeout(t);
  }, [steps]);

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden="true">
      {steps.map((s, i) => (
        <div
          key={`${run}-${i}`}
          className="paw-step absolute text-amber-700/50"
          style={
            {
              left: s.x,
              top: s.y,
              animationDelay: `${s.delay}s`,
              "--rot": `${s.rot}deg`,
            } as React.CSSProperties
          }
        >
          <Paw size={s.size} />
        </div>
      ))}
    </div>
  );
}
