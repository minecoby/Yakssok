
import { useState, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SidebarLeft.css";
import LogoIcon from "../assets/LogoIcon";
import OpenButton from "../assets/OpenButton";
import CloseButton from "../assets/CloseButton";
import NewButton from "../assets/NewButton";
import NewButtonClosed from "../assets/NewButtonClosed";
import CalendarIcon from "../assets/CalendarIcon";
import ListIcon from "../assets/ListIcon";
import CalendarIconSelected from "../assets/CalendarIconSelected";
import ListIconSelected from "../assets/ListIconSelected";
import ListDot from "../assets/listDot";
import profileImage from "../assets/profile.jpg";

const SidebarLeft = ({ events = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);

  // 사이드바 상태
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  // 달력 및 약속 상태
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const toDateStr = (start) => {
    if (!start) return "";
    const s =
      typeof start === "string"
        ? start
        : start?.dateTime ?? start?.date ?? "";
    return s ? String(s).slice(0, 10) : "";
  };

  const todayStr = new Date().toLocaleDateString("sv-SE");
  const appointments = useMemo(() => {
    return events
      .map((e, idx) => {
        const date = toDateStr(e.start);
        return {
          id: e.id ?? idx + 1,
          text: e.title ?? e.summary ?? "(제목 없음)",
          date,
        };
      })
      .filter((app) => {
        if (!app.date) return false;
        const appDate = new Date(app.date);
        return (
          appDate.getFullYear() === currentYear &&
          appDate.getMonth() === currentMonth
        );
      })
      .sort((a, b) => {
        if (a.date < todayStr && b.date >= todayStr) return 1;
        if (a.date >= todayStr && b.date < todayStr) return -1;
        return a.date.localeCompare(b.date);
      });
  }, [events, currentYear, currentMonth, todayStr]);

  const appointmentDateSet = useMemo(() => {
    return new Set(appointments.map((a) => a.date));
  }, [appointments]);

  // 달력 렌더링
  const renderCalendar = () => {
    const days = [];
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // 앞쪽 공백 채우기 (이전 달 자리)
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="empty"></div>);
    }

    // 날짜 채우기
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
        2,
        "0"
      )}-${String(d).padStart(2, "0")}`;

      // 약속이 있는 날짜인지 확인
      const hasAppointment = appointmentDateSet.has(dateStr);

      // 요일 구하기
      const dayOfWeek = new Date(currentYear, currentMonth, d).getDay();
      let dayClass = "day";
      if (dayOfWeek === 0) dayClass += " sunday";
      else if (dayOfWeek === 6) dayClass += " saturday";

      if (hasAppointment) dayClass += " hasAppointment";

      days.push(
        <div key={d} className={dayClass}>
          {d}
        </div>
      );
    }

    return days;
  };

  // 달력 월 이동
  const handlePrevMonth = () => {
    if (currentMonth == 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth == 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // 달력 요일
  const daysofWeek = ["일", "월", "화", "수", "목", "금", "토"];

  // 오늘 날짜로 이동
  const handleGoToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  return (
    <>
      <div
        ref={sidebarRef}
        className={`sidebarLeft ${isOpen ? "open" : "closed"}`}
      >
        <div
          className={`sidebarLeftLogo ${isOpen ? "open" : ""} ${isLogoHovered ? "hovered" : ""}`}
          onMouseEnter={() => !isOpen && setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
        >
          <button className="sidebarButton" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <CloseButton /> : <OpenButton />}
          </button>
          <LogoIcon className="logoIcon" />
        </div>

        {/* 새로운 약속 생성 버튼 */}
        <button className="newButton" onClick={() => navigate("/create")}>
          {isOpen ? (
            <div className="buttonIcon">
              <NewButton />
            </div>
          ) : (
            <div className="buttonIconClosed">
              <NewButtonClosed />
            </div>
          )}
          {isOpen ? <div className="buttonText">새로운 약속 만들기</div> : null}
        </button>

        <div className="iconRow">
          <button className="iconButton" onClick={() => navigate("/home")}>
            {location.pathname === "/home" ? <CalendarIconSelected /> : <CalendarIcon />}
            <span className="iconText">약속 달력</span>
          </button>
          <button className="iconButton" onClick={() => navigate("/list")}>
            {location.pathname === "/list" ? <ListIconSelected /> : <ListIcon /> }
            <span className="iconText">약속 목록</span>
          </button>
        </div>

        {/* 달력 */}
        <div className="calendar">
          <div className="calendarHeader">
            <button className="moveMonth" onClick={handlePrevMonth}>
              {"<"}
            </button>
            <span>{currentMonth + 1}월</span>
            <button className="moveMonth" onClick={handleNextMonth}>
              {">"}
            </button>
            <button className="todayButton" onClick={handleGoToday}>
              오늘
            </button>
          </div>

          {/* 요일 */}
          <div className="calendarGrid daysofWeek">
            {daysofWeek.map((day, index) => (
              <div key={index} className="dayName">
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 */}
          <div className="calendarGrid">{renderCalendar()}</div>
        </div>

        {/* 약속 목록 */}
        <div className="appointments">
          <div className="appointmentsBox">
            <ul>
              {appointments.map((app) => (
                <li key={app.id}
                  className={`appointmentItem ${app.date < todayStr ? "past" : "future"}`}>
                  <ListDot />
                  <span className="appointmentText">{app.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 프로필 */}
        <div className="profile">
          <img src={profileImage} alt="profileImage" />
        </div>
      </div>
    </>
  );
};

export default SidebarLeft;
