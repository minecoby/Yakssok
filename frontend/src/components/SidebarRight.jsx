import {useEffect, useState} from "react";
import "./SidebarRight.css";
import closeButton from "../assets/closeButton.svg";
import logo from "../assets/titleIcon.svg";
import CalendarStatic from "./CalendarStatic";
import ClockStatic from "./ClockStatic";

const formatKoreanDateInfo = (date) => {
  const d = new Date(date);

  const month = d.getMonth() + 1;
  const day = d.getDate();

  const weekdays = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const weekday = weekdays[d.getDay()];

  let hours = d.getHours();
  let minutes = d.getMinutes(); 
  const ampm = hours >= 12 ? "오후" : "오전";
  hours = hours % 12;
  if (hours === 0) hours = 12;

  return {
    dateLabel: `${month}월 ${day}일`,
    weekday,
    timeLabel: minutes !== 0 ? `${ampm} ${hours}시 ${minutes}분` : `${ampm} ${hours}시`,
  };
};

const SidebarRight = ({ open, onClose, selectedPayload }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [selectedPayload]);

  if (!open) return null;

  const selectedEvents =
    selectedPayload?.type === "events"
      ? (selectedPayload.events ?? [])
      : selectedPayload?.type === "event"
        ? (selectedPayload.event ? [selectedPayload.event] : [])
        : [];

  const total = selectedEvents.length;
  const selectedEvent = selectedEvents[activeIndex] ?? null;

  const startDate = selectedEvent?.start ? new Date(selectedEvent.start) : null;
  const endDate = selectedEvent?.end ? new Date(selectedEvent.end) : null;
  const isAllDay = selectedEvent?.extendedProps?.isAllDay;
  const info = startDate ? formatKoreanDateInfo(startDate) : null;

  const buildDateArray = (startDate, endDate, isAllDay) => {
    if (!startDate) return [];

    const result = [];
    const cur = new Date(startDate);
    cur.setHours(0, 0, 0, 0);

    let end = endDate ? new Date(endDate) : new Date(startDate);
    end.setHours(0, 0, 0, 0);

    if (isAllDay && endDate) {
      end.setDate(end.getDate() - 1);
    }

    while (cur <= end) {
      result.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }

    return result;
  };

  const startToEnd = buildDateArray(startDate, endDate, isAllDay);

  return (
    <div className="background" onClick={onClose}>
      <aside className="sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="close-button-area">
            <button className="close-button" onClick={onClose} aria-label="닫기">
                <img src={closeButton} alt="닫기" className="close-icon" />
            </button>
        </div>

        <div className="title">
            <img src={logo} alt="logo" className="logo"/>
            <span className="title-text">{selectedEvent?.title ?? "일정이 존재하지 않아요."}</span>
        </div>

        <div className="content-area">
          {startDate ? (
            <>
              <CalendarStatic dates={startToEnd} />
              <br />
              <ClockStatic time={startDate} />
            </>
          ) : (
            <div style={{ padding: "12px", color: "#666" }}>
              캘린더에서 일정을 클릭하면 여기에서 상세 정보를 확인할 수 있어요.
            </div>
          )}
        </div>

        {info && (
          <div className="info">
            <span className="info-text">{info.dateLabel}</span>
            <span className="info-divider">|</span>
            <span className="info-text">{info.weekday}</span>
            <span className="info-divider">|</span>
            <span className="info-text">{info.timeLabel}</span>
          </div>
        )}

        {total > 1 && (
          <div className="index-container">
            <button
              type="button"
              className="index-button"
              onClick={() =>
                setActiveIndex((prev) => Math.max(0, prev - 1))
              }
              disabled={activeIndex === 0}
            >
              ‹
            </button>

            <div className="index-text">
              {`${activeIndex + 1} / ${total}`}
            </div>

            <button
              type="button"
              className="index-button"
              onClick={() =>
                setActiveIndex((prev) => Math.min(total - 1, prev + 1))
              }
              disabled={activeIndex === total - 1}
            >
              ›
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};

export default SidebarRight;