import * as React from "react";
const OpenButton = (props) => (
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
      d="m26 34 10-10-10-10M12 34l10-10-10-10"
    />
  </svg>
)
export default OpenButton
