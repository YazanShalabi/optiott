import React from 'react'


const ContentPageExperience: React.FC<any> = ({ data, children }) => {
  return (
    <main className="min-h-screen bg-[#0e0e0e]">
      {children}
    </main>
  )
}

ContentPageExperience.displayName = 'ContentPageExperience'
export default ContentPageExperience
