import React from 'react'
import { IoSearch } from 'react-icons/io5'


function SearchBox() {
  return (
    <div className='searchBox postion-relative d-flex align-items-center' > 
      <input type="text" placeholder='Search here...' />
      <IoSearch  className='mr-1'/>
  </div>
  )
}

export default SearchBox