import React, { useState } from 'react';

const DateSelector = ({ event }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(event.title);

  // 수정 버튼 클릭 시 상태 변경
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // 삭제 버튼 클릭 시 처리
  const handleDeleteClick = () => {
    console.log(`삭제된 일정: ${event.title}`);
    // 삭제 로직 추가 
  };

  // 저장 버튼 클릭 시 처리
  const handleSaveClick = () => {
    setIsEditing(false);
    console.log(`저장된 일정: ${newTitle}`);
    // 상태 업데이트 로직 추가 
  };

  return (
    <div className="date-selector">
      <div className="date-box">
        <span className="date">{new Date(event.start).toLocaleDateString()}</span>
        <span className="time">
          {new Date(event.start).toLocaleTimeString()} - {new Date(event.end).toLocaleTimeString()}
        </span>

        {isEditing ? (
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="status-input"
          />
        ) : (
          <span className="status">{newTitle}</span>
        )}

        <button onClick={handleEditClick} className="edit-btn">수정하기</button>
        <button onClick={handleDeleteClick} className="delete-btn">삭제하기</button>

        {isEditing && (
          <button onClick={handleSaveClick} className="save-btn">저장하기</button>
        )}
      </div>
    </div>
  );
};

export default DateSelector;
