import React from 'react'
import DarkBtn from './light/dark_btn'

const App = () => {
  return (
    <div className='bg-red-100 dark:bg-blue-100 h-[100vh] w-full'>
      <DarkBtn/>
    </div>
  )
}

export default App
