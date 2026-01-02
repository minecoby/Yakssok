import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LogoIconWhite from "../assets/LogoIconWhite";
import EditIcon from "../assets/EditIcon";
import CreateEvent from '../components/CreateEvent';
import UpdateEvent from '../components/UpdateEvent';
import ExclamationIcon from '../assets/ExclamationIcon';
import CheckCircleIcon from '../assets/CheckCircleIcon';
import EmptyCircleIcon from '../assets/EmptyCircleIcon';
import './Invited.css'; 

const Invited = () => {
  const location = useLocation();  
  const initialEvents = location.state ? location.state.events : []; 

  // 초기 데이터 로드 (ID가 없으면 강제로 생성)
  const [allEvents, setAllEvents] = useState(() => {
    return initialEvents.map((event, index) => ({
      ...event,
      id: event.id || `generated-${index}-${Date.now()}`
    }));
  });

  const partyName = "앱티브 팀플 회의"; 

  const partyDateRange = React.useMemo(() => ({
    startDate: new Date(2025, 11, 1), 
    endDate: new Date(2025, 12, 1),   
  }), []);

  const [dates, setDates] = useState([]); 
  const [filteredEvents, setFilteredEvents] = useState([]); 
  
  const [activeMenuId, setActiveMenuId] = useState(null);

  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });
  const [menuTargetDate, setMenuTargetDate] = useState(null);

  const [viewMode, setViewMode] = useState('list');

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [selectedDeleteIds, setSelectedDeleteIds] = useState([]);

  useEffect(() => {
    const dateArray = [];
    let currentDate = new Date(partyDateRange.startDate);
    while (currentDate <= partyDateRange.endDate) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1); 
    }
    setDates(dateArray); 
  }, [partyDateRange]); 

  useEffect(() => {
    const filtered = allEvents.filter((event) => {
      if (!event.start) return false;
      const eventDate = new Date(event.start);
      if (isNaN(eventDate.getTime())) return false;

      const start = new Date(partyDateRange.startDate);
      const end = new Date(partyDateRange.endDate);

      eventDate.setHours(0, 0, 0, 0);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      return eventDate >= start && eventDate <= end;
    });
    setFilteredEvents(filtered); 
  }, [allEvents, partyDateRange]); 

  const getEventsForDate = (date) => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    return filteredEvents.filter(event => {
      const eventDate = new Date(event.start);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === targetDate.getTime(); 
    });
  };
  
  const getEventTitleForDate = (date) => {
    const dayEvents = getEventsForDate(date);
    return dayEvents.length > 0 
      ? dayEvents.map(e => e.title).join(", ") 
      : "약속 없음";
  };

  const toggleMenu = (e, date) => {
    e.stopPropagation(); 

    if (viewMode === 'delete') return;

    const dateMs = date.getTime();

    if (activeMenuId === dateMs) {
      setActiveMenuId(null);
      return;
    }

    const eventBox = e.currentTarget.closest('.event-box');
    const rect = e.currentTarget.getBoundingClientRect();
    setPopupPos({
      top: rect.top -155, 
      left: rect.left + 50 
    });

    setMenuTargetDate(date);
    setActiveMenuId(dateMs);
  };

  const handleAddClick = (date) => {
    setSelectedDate(date);
    setViewMode('create'); 
    setActiveMenuId(null);
  };

  const handleEditClick = (date, eventTitleString) => {
    const targetEvent = allEvents.find(event => {
      const eDate = new Date(event.start);
      eDate.setHours(0,0,0,0);
      const dDate = new Date(date);
      dDate.setHours(0,0,0,0);
      return eDate.getTime() === dDate.getTime() && eventTitleString.includes(event.title);
    });

    if (targetEvent) {
      setSelectedEvent(targetEvent);
      setViewMode('update');
      setActiveMenuId(null);
    } else {
        alert("수정할 약속이 없습니다.");
    }
  };

  const enterDeleteMode = (date) => {
    const dayEvents = getEventsForDate(date);
    if (dayEvents.length === 0) {
        alert("삭제할 약속이 없습니다.");
        return;
    }
    
    setSelectedDeleteIds([]); 
    setViewMode('delete');
    setActiveMenuId(null);
  };

  const toggleDeleteSelection = (date) => {
    const targetEvents = allEvents.filter(event => {
      const eDate = new Date(event.start);
      eDate.setHours(0,0,0,0);
      const dDate = new Date(date);
      dDate.setHours(0,0,0,0);
      return eDate.getTime() === dDate.getTime();
    });

    if (targetEvents.length === 0) return;

    const targetIds = targetEvents.map(e => e.id);
    const isSelected = targetIds.every(id => selectedDeleteIds.includes(id));

    if (isSelected) {
      setSelectedDeleteIds(prev => prev.filter(id => !targetIds.includes(id)));
    } else {
      setSelectedDeleteIds(prev => [...prev, ...targetIds]);
    }
  };

  const confirmDelete = () => {
    if (selectedDeleteIds.length === 0) {
        alert("선택된 일정이 없습니다.");
        return;
    }
    const updatedEvents = allEvents.filter(e => !selectedDeleteIds.includes(e.id));
    setAllEvents(updatedEvents);
    setViewMode('list');
    setSelectedDeleteIds([]);
  };

  const saveNewEvent = (eventData) => {
    const newEvent = { ...eventData, id: Date.now() };
    setAllEvents([...allEvents, newEvent]); 
    setViewMode('list');
  };

  const updateEvent = (updatedEvent) => {
    setAllEvents(allEvents.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
    setViewMode('list');
  };


  if (viewMode === 'create') {
    return <CreateEvent date={selectedDate} onSave={saveNewEvent} onCancel={() => setViewMode('list')} />;
  }

  if (viewMode === 'update') {
    return <UpdateEvent event={selectedEvent} onSave={updateEvent} onCancel={() => setViewMode('list')} />;
  }

  const isDeleteMode = viewMode === 'delete';

  return (
    <div className="invite-container" onClick={() => setActiveMenuId(null)}>
      
      <header className="invite-header">
        {isDeleteMode ? (
          <div className="delete-header-container">
            <div className="delete-icon-wrapper">
              <ExclamationIcon />
            </div>
            <h2 className="delete-header-title">
              선택된 일정을<br/>삭제할까요?
            </h2>
          </div>
        ) : (
          <>
            <div className="invitedLogo"> <LogoIconWhite /> </div>
            <h1>{partyName}</h1>
            <p>{partyName}에 초대되었어요</p>
            <p>약속 범위 안에서 나의 일정이예요</p>
          </>
        )}
      </header>
      
      <main className="main-content">
        <div className="date-selector-container">
          {dates.length > 0 ? (
            dates.map((date, index) => {
              const dayEvents = getEventsForDate(date); 
              const hasEvent = dayEvents.length > 0;
              const joinedTitles = dayEvents.map(e => e.title).join(", "); 

              const isSelectedForDelete = hasEvent && allEvents.some(e => {
                  const eDate = new Date(e.start);
                  eDate.setHours(0,0,0,0);
                  const dDate = new Date(date);
                  dDate.setHours(0,0,0,0);
                  return eDate.getTime() === dDate.getTime() && selectedDeleteIds.includes(e.id);
              });

              return (
                <div 
                  key={index} 
                  className="event-box"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isDeleteMode && hasEvent) toggleDeleteSelection(date);
                  }}
                  style={{ 
                    backgroundColor: hasEvent ? "#F9CBAA" : "#EAEEE0", 
                    color: hasEvent ? "#FFFFFF" : "#C4C5B7",
                    cursor: isDeleteMode && hasEvent ? 'pointer' : 'default',
                    opacity: isDeleteMode && !hasEvent ? 0.5 : 1 
                  }}
                >
                  {isDeleteMode ? (
                      hasEvent && (
                          <div className="edit-icon-pos">
                              {isSelectedForDelete ? <CheckCircleIcon /> : <EmptyCircleIcon />}
                          </div>
                      )
                  ) : (
                      <button 
                        className="edit-icon-pos" 
                        onClick={(e) => toggleMenu(e, date)}
                      >
                        <EditIcon />
                      </button>
                  )}

                  <div className="event-date">{date.getDate()}</div> 
                  
                  <div className="event-info">
                    {hasEvent ? (
                      dayEvents.map((evt, i) => (
                        <span key={i} className="event-title">
                          {evt.title}
                        </span>
                      ))
                    ) : (
                      <span className="event-title">약속 없음</span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-event-box"><div className="event-date">No Dates</div></div>
          )}
        </div>
      </main>

      {activeMenuId && menuTargetDate && !isDeleteMode && (
        <div 
          className="popup-menu" 
          style={{ 
            position: 'fixed', 
            top: `${popupPos.top}px`, 
            left: `${popupPos.left}px` 
          }}
          onClick={(e) => e.stopPropagation()} 
        >
          <button className="popup-btn add" onClick={() => handleAddClick(menuTargetDate)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
            추가하기
          </button>
          
          <button className="popup-btn normal" onClick={() => handleEditClick(menuTargetDate, getEventTitleForDate(menuTargetDate))}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            수정하기
          </button>
          
          <button className="popup-btn normal" onClick={() => enterDeleteMode(menuTargetDate)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            삭제하기
          </button>
        </div>
      )}

      <footer>
        {isDeleteMode ? (
            <>
                <button 
                    className="confirm-btn" 
                    style={{ background: '#1F1F1F', width: '100px' }}
                    onClick={confirmDelete}
                >
                    네
                </button>
                <button 
                    className="edit-btn" 
                    style={{ width: '100px', background: '#F4F8E9', color: '#555' }}
                    onClick={() => {
                        setViewMode('list');
                        setSelectedDeleteIds([]);
                    }}
                >
                    아니오
                </button>
            </>
        ) : (
            <>
                <button className="confirm-btn">확인</button>
                <button className="edit-btn">나의 일정 수정하기</button>
            </>
        )}
      </footer>
    </div>
  );
};

export default Invited;