import React from 'react'

function Sidebar() {
  return (
    <div className='w-64 h-screen bg-gray-500 text-white p-4'>
     
      <ul className='space-y-4 text-center'>
        <li>School Logo</li>
        <li>Dashboard</li>
        <li>Students</li>
        <li>Transactions</li>   
        <li>Reports</li>

      </ul>
    </div>
  )
}

export default Sidebar