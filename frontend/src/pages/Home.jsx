import React from 'react';
import Calendar from '../components/Calendar';
import SidebarRight from '../components/SidebarRight';
import { useState } from "react";
import './Home.css';

// const googleCalendarApiKey = process.env.REACT_APP_GOOGLE_CALENDAR_API_KEY;
// const googleCalendarId = process.env.REACT_APP_GOOGLE_CALENDAR_ID;

const Home = () => {
  const [open, setOpen] = useState(false);
  const [selectedPayload, setSelectedPayload] = useState(null);

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header"></header>

      {/* 캘린더 영역 */}
      <main className="main-content">
        <Calendar
          onEventSelect={(payload) => {
            setSelectedPayload(payload);
            setOpen(true);
          }}
        />
      </main>

      <SidebarRight 
        open={open} 
        onClose={() => setOpen(false)} 
        selectedPayload={selectedPayload}
      />
      
    </div>
  );
};

export default Home;