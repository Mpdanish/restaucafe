import React from 'react'
import "./SpinnerOnly.css"

function SpinnerOnly() {
  return (
      <div className="spinner-container">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
          <span className="visually-hidden"></span>
        </div>
      </div>
  )
}

export default SpinnerOnly
