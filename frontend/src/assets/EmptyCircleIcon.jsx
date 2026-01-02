import React from 'react';

const EmptyCircleIcon = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 배경 원 (흰색 반투명 or 비움) */}
    <circle cx="15" cy="15" r="14" stroke="#FFFFFF" strokeWidth="1.5" fill="rgba(255, 255, 255, 0.5)"/>
  </svg>
);

export default EmptyCircleIcon;