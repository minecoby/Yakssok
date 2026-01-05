import React, { useEffect, useMemo, useRef, useState } from "react";
import "./SelectRange.css";

const toISO = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildMonthMatrix(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDay = first.getDay();

  const days = [];

  for (let i = startDay - 1; i >= 0; i--) {
    days.push(new Date(year, month, 1 - (i + 1)));
  }

  for (let d = 1; d <= last.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  while (days.length < 42) {
    const next = new Date(
      year,
      month,
      last.getDate() + (days.length - (startDay + last.getDate())) + 1
    );
    days.push(next);
  }

  const weeks = [];
  for (let w = 0; w < 6; w++) {
    weeks.push(days.slice(w * 7, w * 7 + 7));
  }
  return weeks;
}

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const isPastDay = (day) => startOfDay(day) < startOfDay(new Date());

export default function SelectRange({
  value,
  onChange,
  initialMonth = new Date(),
}) {
  const [cursorMonth, setCursorMonth] = useState(
    new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1)
  );

  const selected = useMemo(() => {
    if (!value) return new Set();
    return value instanceof Set ? new Set(value) : new Set(value);
  }, [value]);

  const weeks = useMemo(
    () =>
      buildMonthMatrix(cursorMonth.getFullYear(), cursorMonth.getMonth()),
    [cursorMonth]
  );

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef(null);
  const dragModeRef = useRef("add");
  const [dragRange, setDragRange] = useState(null);

  const commitSelection = (nextSet) => {
    onChange?.(nextSet);
  };

  const getRangeDates = (start, end) => {
    let s = new Date(start);
    let e = new Date(end);
    if (s > e) [s, e] = [e, s];

    const list = [];
    const cur = new Date(s);
    while (cur <= e) {
      list.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return list;
  };

  const handlePointerDown = (day) => {
    if (isPastDay(day)) {
      alert("과거의 날짜는 선택할 수 없어요. "); 
      return; 
    }
    
    setIsDragging(true);
    dragStartRef.current = day;
    setDragRange({ start: day, end: day });

    const iso = toISO(day);
    dragModeRef.current = selected.has(iso) ? "remove" : "add";
  };

  const handlePointerEnter = (day) => {
    if (!isDragging || !dragStartRef.current) return;
    setDragRange({ start: dragStartRef.current, end: day });
  };

  const handlePointerUp = () => {
    if (!isDragging || !dragRange) {
      setIsDragging(false);
      return;
    }

    const { start, end } = dragRange;
    const rangeDates = getRangeDates(start, end);

    const next = new Set(selected);
    for (const d of rangeDates) {
      if (isPastDay(d)) {
        alert("과거의 날짜는 선택할 수 없어요. "); 
        continue; 
      }

      const iso = toISO(d);
      if (dragModeRef.current === "add") next.add(iso);
      else next.delete(iso);
    }
    commitSelection(next);

    setIsDragging(false);
    setDragRange(null);
    dragStartRef.current = null;
  };

  useEffect(() => {
    const up = () => handlePointerUp();
    window.addEventListener("pointerup", up);
    return () => window.removeEventListener("pointerup", up);
  });

  const isInDragRange = (day) => {
    if (!dragRange) return false;
    let { start, end } = dragRange;

    let s = new Date(start);
    let e = new Date(end);
    if (s > e) [s, e] = [e, s];

    return day >= s && day <= e;
  };

  const isCurrentMonth = (day) =>
    day.getMonth() === cursorMonth.getMonth();

  return (
    <div className="sr-container">
      <div className="sr-header">
        <button
          type="button"
          className="sr-nav"
          onClick={() =>
            setCursorMonth(
              (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
            )
          }
        >
          ‹
        </button>
        <div className="sr-title">
          {cursorMonth.getFullYear()}년 {cursorMonth.getMonth() + 1}월
        </div>
        <button
          type="button"
          className="sr-nav"
          onClick={() =>
            setCursorMonth(
              (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
            )
          }
        >
          ›
        </button>
      </div>

      {/* <div className="sr-weekdays">
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <div key={d} className="sr-weekday">
            {d}
          </div>
        ))}
      </div> */}

      <div className="sr-grid">
        {weeks.flat().map((day) => {
          const iso = toISO(day);
          const picked = selected.has(iso);
          const dragging = isInDragRange(day);
          const past = isPastDay(day);

          return (
            <div
              key={iso + day.getMonth()}
              className={[
                "sr-cell",
                isCurrentMonth(day) ? "sr-current" : "sr-muted",
                picked ? "sr-picked" : "",
                dragging ? "sr-drag" : "",
                past ? "sr-muted" : "",
              ].join(" ")}
              onPointerDown={() => handlePointerDown(day)}
              onPointerEnter={() => handlePointerEnter(day)}
            >
              <span className="sr-date">{day.getDate()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}