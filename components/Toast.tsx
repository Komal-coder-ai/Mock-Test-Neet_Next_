import React, { useEffect } from 'react'

export default function Toast({ message, type = 'info', onClose }: { message: string | null; type?: 'info' | 'success' | 'error'; onClose?: () => void }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => onClose && onClose(), 3500)
    return () => clearTimeout(t)
  }, [message, onClose])

  if (!message) return null

  const cls = type === 'error' ? 'toast-error' : type === 'success' ? 'toast-success' : 'toast-info'

  return (
    <div className={`fixed right-4 top-4 z-50 p-3 rounded shadow-sm border ${cls}`} role="status">
      {message}
    </div>
  )
}
