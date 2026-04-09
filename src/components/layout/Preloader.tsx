'use client'

import { useState, useEffect } from 'react'

export default function Preloader() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0e0e0e] flex items-center justify-center transition-opacity duration-500">
      <div className="w-12 h-12 border-4 border-[#e50914] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
