import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import './Calendar.css';

/* 
  ✅ Google API 관련 키는 현재 미사용 상태 (OAuth 방식으로 전환 예정)
  const googleCalendarApiKey = process.env.REACT_APP_GOOGLE_CALENDAR_API_KEY;
  const googleCalendarId = process.env.REACT_APP_GOOGLE_CALENDAR_ID;
*/

const Calendar = ({ events }) => {
  const calendarRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeView, setActiveView] = useState('dayGridMonth');
  const [calendarEvents, setCalendarEvents] = useState([]); // 로컬 저장용

  /*
    🔒 (현재 미사용)
    백엔드 OAuth로 캘린더 데이터를 받아오는 구조
    추후 활성화 시 Google Calendar API를 통해 일정 가져오기
  */
  /*
  const fetchGoogleCalendarEvents = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/calendar/events`, {
        credentials: 'include', 
      });

      if (!response.ok) throw new Error("서버 응답 오류");
      const data = await response.json();

      const events = data.items.map((item) => {
        const startUTC = new Date(item.start.dateTime || item.start.date);
        const endUTC = new Date(item.end.dateTime || item.end.date);

        const startLocal = new Date(startUTC);
        const endLocal = new Date(endUTC);
        startLocal.setHours(startLocal.getHours() + 9);
        endLocal.setHours(endLocal.getHours() + 9);

        return {
          title: item.summary,
          start: startLocal,
          end: endLocal,
        };
      });

      localStorage.setItem("calendarEvents", JSON.stringify(events));
      setCalendarEvents(events);
    } catch (error) {
      console.error("Calendar fetch error:", error);
    }
  };
  */

  // 초기 렌더링 시 현재 날짜 설정 + 로컬 캐시 불러오기
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();
      setCurrentDate(calendarApi.getDate());
    }

    // 로컬 저장된 이벤트 복원
    const cached = localStorage.getItem("calendarEvents");
    if (cached) {
      setCalendarEvents(JSON.parse(cached));
    }

    // fetchGoogleCalendarEvents();  // 🔒 현재 주석 상태
  }, []); 

  // 네비게이션 버튼 핸들러들
  const handleTodayClick = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();
      setCurrentDate(calendarApi.getDate());
    }
  };

  const handlePrevClick = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
      setCurrentDate(calendarApi.getDate());
    }
  };

  const handleNextClick = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
      setCurrentDate(calendarApi.getDate());
    }
  };

  const handleViewChange = (viewName) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(viewName);
      setActiveView(viewName);
    }
  };

  // 월/년도 표시 포맷
  const formatMonthAndYear = (date) => {
    const month = date.toLocaleString('ko-KR', { month: 'long' });
    const year = date.getFullYear();
    return { month, year };
  };

  const { month, year } = formatMonthAndYear(currentDate);

  // 요일 헤더 커스터마이징
  const getDayHeaderContent = (info) => {
    if (info.view.type === 'dayGridMonth') {
      const dayNames = ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'];
      const dayName = dayNames[info.date.getDay()];
      return <span className="monthly-header-dayname">{dayName}</span>;
    } else if (info.view.type === 'timeGridWeek') {
      const dayNames = ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'];
      const dayName = dayNames[info.date.getDay()];
      const dayNumber = info.date.getDate();
      return (
        <div className="weekly-header-day">
          <p className="weekly-header-dayname">{dayName}</p>
          <p className="weekly-header-daynumber">{dayNumber}일</p>
        </div>
      );
    }
    return null;
  };

  // 날짜 셀 안에 숫자 표시
  const renderDayCellContent = (info) => {
    return (
      <div className="custom-day-cell">
        <div className="date-container">
          <span className="date-number">{info.date.getDate()}</span>
        </div>
      </div>
    );
  };

  // 월간 캘린더 이벤트 박스 생성
  const handleDayCellDidMount = (info) => {
    // 월간 캘린더에서는 높이를 계산하지 않음
    if (activeView !== 'timeGridWeek') {
      const eventsForDay = (events || calendarEvents).filter(
        (ev) => ev.start.slice(0, 10) === info.date.toISOString().slice(0, 10)
      );

      if (eventsForDay.length > 0) {
        const eventBox = createEventBox(info);

        // 최대 2개만 표시
        eventsForDay.slice(0, 2).forEach((ev, index) => {
          const item = createEventItem(ev.title, index); // 약속 이름 동적으로 bottom 값 조정
          eventBox.appendChild(item);   // 날짜 비교 함수
        });

        info.el.querySelector('.fc-daygrid-day-frame')?.appendChild(eventBox);
      }
    }
  };

  // 주간 캘린더 이벤트 박스 생성
  const handleSlotLaneDidMount = (info) => {
    if (activeView === 'timeGridWeek') {
      const eventsForSlot = events.filter(
        (ev) => ev.start.slice(0, 10) === info.date.toISOString().slice(0, 10)
      );

      if (eventsForSlot.length > 0) {
        // 주간 캘린더에서 색상 적용하려면 eventBox를 생성하지 않고 
        // fc-timegrid-event-harness에 직접 색상을 추가해야 함
        const eventBox = document.createElement('div');
        eventBox.className = 'fc-timegrid-event-harness';

        // 날짜 비교 후 과거/현재/미래에 맞는 색상 적용
        const cellLocal = new Date(info.date.getFullYear(), info.date.getMonth(), info.date.getDate());
        if (isPast(cellLocal)) {
          eventBox.classList.add('past-event');  
        } else if (isToday(cellLocal)) {
          eventBox.classList.add('today-event');
        } else if (isFuture(cellLocal)) {
          eventBox.classList.add('future-event'); 
        }

        // 주간 캘린더에서만 높이 계산
        eventsForSlot.slice(0, 2).forEach((ev, index) => {
          const item = createEventItem(ev.title, index, ev.start, ev.end); 
          eventBox.appendChild(item);  
        });

        info.el.querySelector('.fc-timegrid-slot-lane')?.appendChild(eventBox);
      }
    }
  };

  // 날짜 비교 함수
  const isPast = (cellLocal) => {
    const now = new Date();
    const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return cellLocal.getTime() < todayLocal.getTime();
  };

  const isToday = (cellLocal) => {
    const now = new Date();
    const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return cellLocal.getTime() === todayLocal.getTime();
  };

  const isFuture = (cellLocal) => {
    return !isPast(cellLocal) && !isToday(cellLocal);
  };

  // 이벤트 박스를 생성하는 함수
  const createEventBox = (info) => {
    const eventBox = document.createElement('div');
    eventBox.className = 'event-box';

    const cellLocal = new Date(info.date.getFullYear(), info.date.getMonth(), info.date.getDate());

    if (isPast(cellLocal)) {
      eventBox.classList.add('past-event');
    } else if (isToday(cellLocal)) {
      eventBox.classList.add('today-event');
    } else if (isFuture(cellLocal)) {
      eventBox.classList.add('future-event');
    }

    return eventBox;
  };

  // 이벤트 아이템을 생성하는 함수
  const createEventItem = (title, index, start, end) => {
    const item = document.createElement('div');
    item.className = 'event-item';
    item.innerText = title;

    // 주간 캘린더에서만 높이 계산
    if (activeView === 'timeGridWeek') {
      const startTime = start.getHours() + start.getMinutes() / 60;
      const endTime = end.getHours() + end.getMinutes() / 60;
      const height = (endTime - startTime) * 60; 
      item.style.height = `${height}px`;
    }

    // 여러 이벤트가 있을 경우 bottom 값 조정
    item.style.bottom = `${5 + index * 20}px`;

    return item;
  };

  const handleDatesSet = (dateInfo) => {
    setCurrentDate(dateInfo.start);
    setActiveView(dateInfo.view.type);

    // 주간 캘린더에서만 이벤트를 보이게 하고, 월간 캘린더에서는 숨김
    if (dateInfo.view.type === 'timeGridWeek') {
      const timeGridEvents = document.querySelectorAll('.fc-timegrid-event-harness');
      timeGridEvents.forEach(event => {
        event.style.display = 'block';
      });

      const dayGridEvents = document.querySelectorAll('.fc-daygrid-event-harness');
      dayGridEvents.forEach(event => {
        event.style.display = 'none';
      });
    } else {
      const timeGridEvents = document.querySelectorAll('.fc-timegrid-event-harness');
      timeGridEvents.forEach(event => {
        event.style.display = 'none';
      });

      const dayGridEvents = document.querySelectorAll('.fc-daygrid-event-harness');
      dayGridEvents.forEach(event => {
        event.style.display = 'none';
      });
    }
  };

  return (
    <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-xl">
      <div className="calendar-container">
        {/* 커스텀 헤더 영역 */}
        <div className="custom-header">
          <div className="custom-title-container">
            <span className="month">{month}</span>
            <span className="year">{year}</span>
          </div>

          <div className="view-toggle-buttons">
            <button
              onClick={() => handleViewChange('dayGridMonth')}
              className={activeView === 'dayGridMonth' ? 'active' : ''}
            >
              월간
            </button>
            <button
              onClick={() => handleViewChange('timeGridWeek')}
              className={activeView === 'timeGridWeek' ? 'active' : ''}
            >
              주간
            </button>
          </div>

          <div className="nav-buttons">
            <button onClick={handlePrevClick} className="nav-arrow">&lt;</button>
            <button onClick={handleTodayClick} className="today-button">오늘</button>
            <button onClick={handleNextClick} className="nav-arrow">&gt;</button>
          </div>
        </div>

        {/* 실제 FullCalendar */}
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          initialDate={new Date()} 
          events={events || calendarEvents}
          eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
          locale="ko"
          datesSet={handleDatesSet}
          headerToolbar={false}
          dayHeaderContent={getDayHeaderContent}
          dayCellDidMount={handleDayCellDidMount}
          slotLaneDidMount={handleSlotLaneDidMount}
          eventDisplay="block"
          dayCellContent={renderDayCellContent}
          allDaySlot={false}
          slotLabelContent={(arg) => `${arg.date.getHours()}시`}
          slotLabelFormat={{
            hour: 'numeric',
            omitZeroMinute: true,
            meridiem: false,
            hour12: false
          }}
          slotMinTime="00:00:00"
          slotMaxTime="24:00:00"
          slotDuration="01:00:00"
          contentHeight="auto"
        />
      </div>
    </div>
  );
};

export default Calendar;
