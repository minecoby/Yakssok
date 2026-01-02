import * as React from "react"
const ListDot = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0 3.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
    />
  </svg>
)
export default ListDot
