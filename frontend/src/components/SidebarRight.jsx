import React from "react";
import "./SidebarRight.css";
import closeButton from "../assets/closeButton.svg";
import logo from "../assets/titleIcon.svg";

const SidebarRight = ({ open, onClose, children }) => {
  if (!open) return null;

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
            <span className="title-text">앱티브 팀플 회의</span>
        </div>

        <div className="temp-space"></div>

        <div className="info">
            <span className="info-text">9월 8일</span>
            <span className="info-divider">|</span>
            <span className="info-text">월요일</span>
            <span className="info-divider">|</span>
            <span className="info-text">오후 8시</span>
        </div>
      </aside>
    </div>
  );
};

export default SidebarRight;