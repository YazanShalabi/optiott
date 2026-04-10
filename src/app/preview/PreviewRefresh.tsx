'use client'

import { useEffect } from 'react'

export function PreviewRefresh() {
  useEffect(() => {
    const handler = () => {
      setTimeout(() => window.location.reload(), 750)
    }
    window.addEventListener('optimizely:cms:contentSaved', handler)
    return () => window.removeEventListener('optimizely:cms:contentSaved', handler)
  }, [])
  return null
}
