import React from 'react'

export default function ErrorMsg({ children }: { children?: React.ReactNode }) {
  if (!children) return null
  return (
    <div className="text-sm text-red-600 mt-1">{children}</div>
  )
}
