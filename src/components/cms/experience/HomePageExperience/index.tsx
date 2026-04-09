import React from 'react'


const HomePageExperience: React.FC<any> = ({ data, children }) => {
  return (
    <main className="min-h-screen bg-[#0e0e0e]">
      {children}
    </main>
  )
}

HomePageExperience.displayName = 'HomePageExperience'
export default HomePageExperience
