import React from 'react'

export default function ErrorMsg({ children }: { children?: React.ReactNode }) {
  if (!children) return null
  return (
    <div className="error-left mt-2 text-sm" role="alert">{children}</div>
  )
}
