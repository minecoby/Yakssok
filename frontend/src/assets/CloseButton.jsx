import * as React from "react";
const CloseButton = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={25}
    viewBox="0 0 48 48"
    fill="none"
    {...props}
  >
    <path
      stroke="#1E1E1E"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      d="M22 34 12 24l10-10m14 20L26 24l10-10"
    />
  </svg>
)
export default CloseButton
