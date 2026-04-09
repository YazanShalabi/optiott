import React from 'react'


const BlankExperience: React.FC<any> = ({ data, children }) => {
  return (
    <main className="min-h-screen bg-[#0e0e0e]">
      {children}
    </main>
  )
}

BlankExperience.displayName = 'BlankExperience'
export default BlankExperience
