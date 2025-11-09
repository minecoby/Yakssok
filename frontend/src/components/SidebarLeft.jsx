import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SidebarLeft.css";
import LogoIcon from "../assets/LogoIcon";
import NewButton from "../assets/NewButton";
import NewButtonClosed from "../assets/NewButtonClosed";
import CalendarIcon from "../assets/CalendarIcon";
import MyCalendarIcon from "../assets/MyCalendarIcon";
import ListIcon from "../assets/ListIcon";
import CalendarIconSelected from "../assets/CalendarIconSelected";
import MyCalendarIconSelected from "../assets/MyCalendarIconSelected";
import ListIconSelected from "../assets/ListIconSelected";
import profileImage from "../assets/profile.jpg";

const Sidebar = ({ events = [] }) => {
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  // 사이드바 상태
  const [isOpen, setIsOpen] = useState(false);

  // 사이드바 닫힘 영역 hover 시 자동 열기
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isOpen && e.clientX < 30) {
        setIsOpen(true);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isOpen]);

  // 사이드바 열림 영역 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 달력 상태
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

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
      const hasAppointment = appointments.some((app) => app.date === dateStr);

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

  // 약속 목록 상태
  const appointments = events.map((e, idx) => ({
    id: idx + 1,
    text: e.title,
    date: e.start.slice(0, 10),
  }));

  return (
    <>
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>
      )}

      <div ref={sidebarRef} className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="logo">
          <LogoIcon />
        </div>

        <div className="logo">
          <LogoIcon />
        </div>

        {/* 새로운 약속 생성 버튼 */}
        <button className="newButton" onClick={() => navigate("/new")}>
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
          <button className="iconButton" onClick={() => navigate("/calendar")}>
            {location.pathname === "/calendar" ? (
              <CalendarIconSelected />
            ) : (
              <CalendarIcon />
            )}
            <span className="iconText">약속 달력</span>
          </button>
          <button className="iconButton" onClick={() => navigate("/mycalendar")}>
            {location.pathname === "/calendar" ? (
              <MyCalendarIconSelected />
            ) : (
              <MyCalendarIcon />
            )}
            <span className="iconText">나의 달력</span>
          </button>
          <button className="iconButton" onClick={() => navigate("/list")}>
            {location.pathname === "/calendar" ? (
              <ListIconSelected />
            ) : (
              <ListIcon />
            )}
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
                <li key={app.id} className="appointmentItem">
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

export default Sidebar;
