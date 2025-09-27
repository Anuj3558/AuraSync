"use client"

import React from "react"

export default function Timer({ seconds, onTimeout, running }) {
  const [remaining, setRemaining] = React.useState(seconds)

  React.useEffect(() => {
    if (!running) return
    setRemaining(seconds)
  }, [seconds, running])

  React.useEffect(() => {
    if (!running) return
    if (remaining <= 0) {
      onTimeout?.()
      return
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(t)
  }, [remaining, running, onTimeout])

  const pct = Math.max(0, Math.min(100, (remaining / seconds) * 100))

  return (
    <div aria-live="polite" className="w-full">
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-neutral600">Time remaining</span>
        <span className="font-mono">{remaining}s</span>
      </div>
      <div className="h-2 bg-neutral600/10 rounded-full overflow-hidden">
        <div className="h-2 bg-accent" style={{ width: `${pct}%`, transition: "width 1s linear" }} />
      </div>
    </div>
  )
}
