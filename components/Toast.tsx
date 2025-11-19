import React, { useEffect } from 'react'

export default function Toast({ message, type = 'info', onClose }: { message: string | null; type?: 'info' | 'success' | 'error'; onClose?: () => void }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => onClose && onClose(), 3500)
    return () => clearTimeout(t)
  }, [message, onClose])

  if (!message) return null

  const bg = type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border'

  return (
    <div className={`fixed right-4 top-4 z-50 p-3 rounded shadow-sm border ${bg}`} role="status">
      {message}
    </div>
  )
}
