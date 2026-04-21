import React from 'react'

function UserAvatarImg(props) {
  return (
    <div className={`userImg ${props.lg === true && 'lg'}`}>
    <span className='rounded-circle'>
      <img src={props.img} />
    </span>
  </div>
  )
}

export default UserAvatarImg