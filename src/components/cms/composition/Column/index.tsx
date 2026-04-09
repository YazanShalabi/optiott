import React from 'react'


const Column: React.FC<any> = ({ children }) => {
  return (
    <div className="flex flex-col gap-4">
      {children}
    </div>
  )
}

Column.displayName = 'DefaultColumn'
export default Column
