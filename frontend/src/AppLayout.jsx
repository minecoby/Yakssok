// 사이드바 고정 레이아웃 

import { Outlet } from "react-router-dom";
import { useState } from "react";
import SidebarLeft from "./components/SidebarLeft";

export default function AppLayout() {
  const [sidebarEvents] = useState([
    { 
      title: '팀 회의', 
      start: '2025-12-31T17:00:00', 
      end: '2025-12-31T18:00:00', 
      className: 'yakssok-1' 
    },
    { 
      title: '팀 회의', 
      start: '2026-01-05T17:00:00', 
      end: '2026-01-05T18:00:00', 
      className: 'yakssok-2' 
    },
    { 
      title: '카페', 
      start: '2026-01-03T14:00:00', 
      end: '2026-01-03T18:00:00', 
      className: 'yakssok-3'
    }, 
    { 
      title: '와플', 
      start: '2026-02-05T18:00:00', 
      end: '2026-02-06T11:00:00', 
      className: 'yakssok-4'
    }
  ]);

  return (
    <div className="appLayout">
      <SidebarLeft events={sidebarEvents} className="sidebar"/>
      <Outlet className="content"/>
    </div>
  );
}
