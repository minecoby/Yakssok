import React, { useMemo } from "react";

export default function ClockStatic({ time }) {
  const hour = time.getHours();
  const minute = time.getMinutes();

  const { ticks, hourAngle, minuteAngle } = useMemo(() => {
    const arr = [];
    const cx = 120, cy = 120, r = 92;
    for (let n = 1; n <= 12; n++) {
      const angle = ((n / 12) * 360 - 90) * (Math.PI / 180);
      arr.push({
        n,
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
      });
    }
    const hAngle = ((hour % 12) + minute / 60) * 30; // 360/12
    const mAngle = minute * 6;                        // 360/60
    return { ticks: arr, hourAngle: hAngle, minuteAngle: mAngle };
  }, [hour, minute]);

  return (
    <div className="clock clock-static">
      {ticks.map(({ n, x, y }) => (
        <div key={n} className="clock-number" style={{ left: x, top: y }}>
          {n}
        </div>
      ))}
      <div className="clock-center" />
      <div
        className="clock-hand hour"
        style={{ transform: `translate(-50%, -100%) rotate(${hourAngle}deg)` }}
      />
      <div
        className="clock-hand minute"
        style={{ transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)` }}
      />
    </div>
  );
}