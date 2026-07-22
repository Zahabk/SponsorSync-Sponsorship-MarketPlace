import React from 'react'

const StatCards = ({ label, value, sub, icon, iconBg, iconColor }) => {
  return (
    <>
      <div className="bg-base-200 rounded-xl p-5 flex flex-col gap-3">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-xs text-base-content/50 uppercase tracking-wide mb-1">
            {label}
          </p>
          <p className="text-3xl font-semibold text-base-content leading-none">
            {value}
          </p>
          <p className="text-xs text-base-content/40 mt-1.5">{sub}</p>
        </div>
      </div>
    </>
  )
}

export default StatCards
