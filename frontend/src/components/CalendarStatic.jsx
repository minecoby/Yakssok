import React, { useMemo } from "react";

const KOR_DOW = ["일", "월", "화", "수", "목", "금", "토"];

export default function CalendarStatic({ date }) {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0~11
  const selectedDay = date.getDate();

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
        {cells.map((d, idx) => {
          const isSel = d === selectedDay;
          return (
            <div
              key={idx}
              className={`cal-cell ${d ? "" : "is-empty"} ${isSel ? "is-selected" : ""}`}
            >
              {d ?? ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}