import React from 'react';

const ExclamationIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 배경 원 (장식용/경고 의미 #EEB1B1) */}
    <circle cx="12" cy="12" r="12" fill="#EEB1B1"/>
    {/* 느낌표 (흰색) */}
    <path d="M12 7V13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 16V16.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default ExclamationIcon;