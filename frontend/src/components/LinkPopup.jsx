import React from "react";
import "./LinkPopup.css";
import LinkCopy from "../assets/LinkCopy.svg"
import { useNavigate } from "react-router-dom";

export default function LinkPopup({ open, link }) {
  if (!open) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      //alert("링크 복사 성공");
    } catch (e) {
      console.error("copy failed", e);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="lp-overlay">
      <div className="lp-modal" onClick={(e) => e.stopPropagation()}>
        <p className="lp-title">약속 공유 링크가 만들어졌어요</p>

        <div className="lp-input-wrap">
            <input className="lp-input" value={link} readOnly />
            <button
            type="button"
            className="lp-copy-btn"
            onClick={handleCopy}
            aria-label="링크 복사"
            >
            <img
                src={LinkCopy}
                alt="copy icon"
                className="lp-copy-icon"
            />
          </button>
        </div>

        <button type="button" className="lp-close-btn" onClick={() => navigate("/home")}>
          닫기
        </button>
      </div>
    </div>
  );
}