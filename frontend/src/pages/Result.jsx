import { useState } from "react";
import SidebarLeft from "../components/SidebarLeft";
import "./Result.css";

const Result = () => {
  const sampleEvents = [
    {
      title: "11월 약속 1",
      start: "2025-11-07T09:00:00",
      end: "2025-11-07T11:00:00",
      className: "color-point-1",
    },
    {
      title: "11월 약속 2",
      start: "2025-11-08T19:00:00",
      end: "2025-11-08T21:00:00",
      className: "color-point-2",
    },
    {
      title: "11월 약속 3",
      start: "2025-11-09T16:30:00",
      end: "2025-11-09T18:00:00",
      className: "color-point-3",
    },
    {
      title: "11월 약속 4",
      start: "2025-11-10T16:30:00",
      end: "2025-11-10T18:00:00",
      className: "color-point-3",
    },
    {
      title: "11월 약속 5",
      start: "2025-11-10T10:30:00",
      end: "2025-11-10T13:00:00",
      className: "color-point-3",
    },
    {
      title: "11월 약속 6",
      start: "2025-11-25T10:30:00",
      end: "2025-11-25T13:00:00",
      className: "color-point-3",
    },
    {
      title: "11월 약속 7",
      start: "2025-11-26T10:30:00",
      end: "2025-11-26T13:00:00",
      className: "color-point-3",
    },
    {
      title: "11월 약속 8",
      start: "2025-11-27T10:30:00",
      end: "2025-11-27T13:00:00",
      className: "color-point-3",
    },
    {
      title: "11월 약속 9",
      start: "2025-11-29T10:30:00",
      end: "2025-11-29T13:00:00",
      className: "color-point-3",
    },
    {
      title: "11월 약속 10",
      start: "2025-11-29T17:30:00",
      end: "2025-11-29T19:00:00",
      className: "color-point-3",
    },
    {
      title: "11월 약속 11",
      start: "2025-11-29T13:30:00",
      end: "2025-11-29T15:00:00",
      className: "color-point-3",
    },
    {
      title: "12월 약속 1",
      start: "2025-12-03T13:30:00",
      end: "2025-12-03T15:00:00",
      className: "color-point-3",
    },
    {
      title: "12월 약속 2",
      start: "2025-12-05T13:30:00",
      end: "2025-12-05T15:00:00",
      className: "color-point-3",
    },
  ];

  const sampleDays = [
    { day: 7, selectedDay: false, dayOfWeek: 0 },
    { day: 8, selectedDay: true, dayOfWeek: 1 },
    { day: 9, selectedDay: true, dayOfWeek: 2 },
    { day: 10, selectedDay: true, dayOfWeek: 3 },
    { day: 11, selectedDay: true, dayOfWeek: 4 },
    { day: 12, selectedDay: false, dayOfWeek: 5 },
    { day: 13, selectedDay: false, dayOfWeek: 6 },
  ];

  const sampleResult = [
    { id: 1, start: "2025-12-08T14:00:00" },
    { id: 2, start: "2025-12-10T14:00:00" },
    { id: 3, start: "2025-12-09T13:00:00" },
  ];

  const formatDate = (iso) => {
    const d = new Date(iso);
    return `${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  function formatDay(dateString) {
    const date = new Date(dateString);
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return days[date.getDay()] + "요일";
  }

  const formatTime = (iso) => {
    const d = new Date(iso);
    const hour = d.getHours();
    const meridiem = hour < 12 ? "오전" : "오후";
    const h = hour % 12 === 0 ? 12 : hour % 12;
    return `${meridiem} ${String(h).padStart(2, "0")}시`;
  };

  const [daysNeeded, setDaysNeeded] = useState(""); // 약속에 필요한 일 수
  const [startTime, setStartTime] = useState(""); // 시작 시간
  const [endTime, setEndTime] = useState(""); // 종료 시간

  return (
    <div className="resultPage">
      <SidebarLeft events={sampleEvents} />
      <div className="resultContainer">
        {/* 약속 범위 */}
        <div className="rangeContainer">
          <div className="rangeText">약속 범위</div>
          <div className="weekContainer">
            <div className="monthText">12월</div>

            {/* 날짜 그리드 */}
            <div className="weekGrid">
              {sampleDays.map((day) => (
                <div
                  key={day.date}
                  className={`dayCell ${day.selectedDay ? "selected" : ""}`}
                >
                  <div
                    className={`dayText
                      ${day.dayOfWeek === 0 ? "sunday" : ""} 
                      ${day.dayOfWeek === 6 ? "saturday" : ""}`}
                  >
                    {day.day}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 추가 설정 */}
        <div className="addSetting">
          <div className="noticeText">
            약속 시간을
            <br />더 구체적으로 골라볼까요?
          </div>

          <div className="setText">
            <label>
              약속에
              <input
                type="number"
                min="1"
                value={daysNeeded}
                onChange={(e) => setDaysNeeded(e.target.value)}
                placeholder="0"
                className="setInput"
              />
              일 필요해요.
            </label>
            <br />
            <label>
              약속 시간대는&nbsp;
              <input
                type="number"
                min="0"
                max="23"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="00"
                className="setInput"
              />
              시부터&nbsp;
              <input
                type="number"
                min="0"
                max="23"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="00"
                className="setInput"
              />
              시까지예요.
            </label>
          </div>
        </div>

        {/* 추천 날짜 */}
        <div className="resultContent">
          <div className="noticeText">
            약속하기 좋은 시간대
            <br />
            약쏙이 골라봤어요.
          </div>
          <div className="resultList">
            {sampleResult.map((item, index) => (
              <div key={item.id} className="resultCard">
                <div className="resultNum">{index + 1}</div>
                <div className="resultText">
                  <div className="resultDate">
                    {formatDate(item.start)} {formatDay(item.start)}
                  </div>
                  <div className="resultTime">{formatTime(item.start)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
