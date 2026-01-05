import React, { useMemo } from "react";

const KOR_DOW = ["일", "월", "화", "수", "목", "금", "토"];

export default function CalendarStatic({ dates = [] }) {
  const anchor = dates[0] ? new Date(dates[0]) : new Date();

  const year = anchor.getFullYear();
  const month = anchor.getMonth();

  const selectedSet = useMemo(() => {
    const set = new Set();
    for (const dt of dates) {
      const d = new Date(dt);
      d.setHours(0, 0, 0, 0);
      set.add(d.toISOString().slice(0, 10));
    }
    return set;
  }, [dates]);

  const { firstDay, daysInMonth } = useMemo(() => {
    const first = new Date(year, month, 1);
    return {
      firstDay: first.getDay(),
      daysInMonth: new Date(year, month + 1, 0).getDate(),
    };
  }, [year, month]);

  const cells = useMemo(() => {
    const arr = [];
    for (let i = 0; i < firstDay; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [firstDay, daysInMonth]);

  return (
    <div className="cal cal-static">
      <div className="cal-header">{month + 1}월</div>

      <div className="cal-dow">
        {KOR_DOW.map((d) => (
          <div key={d} className="cal-dow-cell">{d}</div>
        ))}
      </div>

      <div className="cal-grid">
        {cells.map((dayNum, idx) => {
          if (!dayNum) {
            return (
              <div key={idx} className="cal-cell is-empty">
                {""}
              </div>
            );
          }

          const key = new Date(year, month, dayNum).toISOString().slice(0, 10);
          const isSel = selectedSet.has(key);

          return (
            <div
              key={idx}
              className={`cal-cell ${isSel ? "is-selected" : ""}`}
            >
              {dayNum}
            </div>
          );
        })}
      </div>
    </div>
  );
}