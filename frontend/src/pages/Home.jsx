import React from 'react';
import { Link } from 'react-router-dom'; 
import Calendar from '../components/Calendar';
import SidebarLeft from '../components/SidebarLeft';
import SidebarRight from '../components/SidebarRight';
import { useState } from "react";
import './Home.css';

// const googleCalendarApiKey = process.env.REACT_APP_GOOGLE_CALENDAR_API_KEY;
// const googleCalendarId = process.env.REACT_APP_GOOGLE_CALENDAR_ID;

const Home = () => {
  const sampleEvents = [
    { 
      title: '11월 약속 1', 
      start: '2025-11-07T09:00:00', 
      end: '2025-11-07T11:00:00', 
      className: 'color-point-1' 
    },
    { 
      title: '11월 약속 2', 
      start: '2025-11-08T19:00:00', 
      end: '2025-11-08T21:00:00', 
      className: 'color-point-2' 
    },
    { 
      title: '11월 약속 3', 
      start: '2025-11-09T16:30:00', 
      end: '2025-11-09T18:00:00', 
      className: 'color-point-3'
    },
    { 
      title: '11월 약속 4', 
      start: '2025-11-10T16:30:00', 
      end: '2025-11-10T18:00:00', 
      className: 'color-point-3'
    },
    { 
      title: '11월 약속 5', 
      start: '2025-11-10T10:30:00', 
      end: '2025-11-10T13:00:00', 
      className: 'color-point-3'
    },
    { 
      title: '11월 약속 6', 
      start: '2025-11-24T10:30:00', 
      end: '2025-11-24T13:00:00', 
      className: 'color-point-3'
    },
    { 
      title: '11월 약속 7', 
      start: '2025-11-26T10:30:00', 
      end: '2025-11-26T13:00:00', 
      className: 'color-point-3'
    },
    { 
      title: '11월 약속 8', 
      start: '2025-11-27T10:30:00', 
      end: '2025-11-27T13:00:00', 
      className: 'color-point-3'
    },
    { 
      title: '11월 약속 9', 
      start: '2025-11-29T10:30:00', 
      end: '2025-11-29T13:00:00', 
      className: 'color-point-3'
    },
    { 
      title: '11월 약속 10', 
      start: '2025-11-29T17:30:00', 
      end: '2025-11-29T19:00:00', 
      className: 'color-point-3'
    },
    { 
      title: '11월 약속 11', 
      start: '2025-11-29T13:30:00', 
      end: '2025-11-29T15:00:00', 
      className: 'color-point-3'
    },
    { 
      title: '12월 약속 1', 
      start: '2025-12-02T13:30:00', 
      end: '2025-12-02T15:00:00', 
      className: 'color-point-3'
    },
    { 
      title: '12월 약속 2', 
      start: '2025-12-31T13:30:00', 
      end: '2025-12-31T15:00:00', 
      className: 'color-point-3'
    },
    { 
      title: '1월 약속 1', 
      start: '2026-01-01T13:30:00', 
      end: '2026-01-01T15:00:00', 
      className: 'color-point-3'
    }
  ];

  const [open, setOpen] = useState(false);

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header"></header>

      {/* SidebarLeft */}
      <SidebarLeft events={sampleEvents} />

      {/* 캘린더 영역 */}
      <main className="main-content">
        <Calendar
          /*
          googleCalendarApiKey={googleCalendarApiKey}
          googleCalendarId={googleCalendarId}
          */
          // 임시 이벤트 데이터, props로 전달
          events={sampleEvents}
        />
      </main>

      <SidebarRight open={open} onClose={() => setOpen(false)}>
        {/* 여기에 캘린더/시간 선택 컴포넌트 넣기 */}
      </SidebarRight>
      
      {/*우측 사이드바 임시 버튼*/}
      <button onClick={() => setOpen(true)}></button>

      {/* 파티원의 초대 페이지로 이동하는 임시 링크 */}
      <Link to="/Invited" state={{ events: sampleEvents }}>
        link
      </Link>
      
    </div>
  );
};

export default Home;