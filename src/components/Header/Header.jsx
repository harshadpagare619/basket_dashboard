import {useState, useContext} from 'react';
import { MyContext } from '../../App';
import {SearchBox, UserAvatarImg} from '../index'
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { MdMenuOpen } from 'react-icons/md';
import { MdOutlineMenu } from 'react-icons/md';
import { IoMdCart } from 'react-icons/io';
import { IoMdMail } from 'react-icons/io';
import { IoMdNotifications } from 'react-icons/io';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Logout from '@mui/icons-material/Logout';
import Logo from '../../assets/images/Logo.png';
import UserImg from '../../assets/images/userImg.png'


function Header() {

  const [anchorEl, setAnchorEl] = useState(false);
  const [isOpenNotificationDrop, setIsOpenNotificationDrop] = useState(false);
  const openMyAcc = Boolean(anchorEl);
  const openNotifications = Boolean(isOpenNotificationDrop);

  const context = useContext(MyContext);


  const handleOpenNotificationsDrop = () => {
    setIsOpenNotificationDrop(true);
  }

  const handleCloseNotificationsDrop =() => {
    setIsOpenNotificationDrop(false);
  }

  return (
    <header className='d-flex align-items-center'>
    <div className='container-fluid w-100'>
      <div className='row d-flex align-items-center w-100'>
        
        <div className='col-sm-2 part1'>
          <Link to={'/'} className='d-flex align-items-center logo'>
          <img src={Logo} />
          <span className='ml-2'>HOTASH</span>
          </Link>
        </div>

        <div className='col-sm-3 d-flex align-items-center part2'>
          <SearchBox />
        </div>

        <div className='col-sm-7 d-flex align-items-center justify-content-end part3'>
          <Button className='rounded-circle mr-3'><IoMdCart /></Button>
          <Button className='rounded-circle mr-3'><IoMdMail /></Button>

          <div className='dropdownWrapper postion-relative'>
            <Button className='rounded-circle mr-3' onClick={handleOpenNotificationsDrop}>
            <IoMdNotifications />
            </Button>

            <Menu
            anchorEl={isOpenNotificationDrop}
            className='notifications dropdownList'
            id='notifications'
            open={openNotifications}
            onClose={handleCloseNotificationsDrop}
            onClick={handleCloseNotificationsDrop}
            transformOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            >
              <div className='head pl-3 pb-0'>
                <h4>Orders(12)</h4>
              </div>

              <Divider className='mb-1' />

              <div className='scroll'>
              <MenuItem onClick={handleCloseNotificationsDrop}>
              <div className='d-flex'>
                <div>
                  <UserAvatarImg img={UserImg} />
                </div>

                <div className='dropdownInfo'>
                  <h4><span><b>Mahmudul</b> added to his favorite list <b>Leather belt steve madden</b></span></h4>
                  <p className='text-sky mb-0'>few seconds ago</p>
                </div>
              </div>
              </MenuItem>

              <MenuItem onClick={handleCloseNotificationsDrop}>
              <div className='d-flex'>
                <div>
                  <UserAvatarImg img={UserImg} />
                </div>

                <div className='dropdownInfo'>
                  <h4><span><b>Mahmudul</b> added to his favorite list <b>Leather belt steve madden</b></span></h4>
                  <p className='text-sky mb-0'>few seconds ago</p>
                </div>
              </div>
              </MenuItem>

              <MenuItem onClick={handleCloseNotificationsDrop}>
              <div className='d-flex'>
                <div>
                  <UserAvatarImg img={UserImg} />
                </div>

                <div className='dropdownInfo'>
                  <h4><span><b>Mahmudul</b> added to his favorite list <b>Leather belt steve madden</b></span></h4>
                  <p className='text-sky mb-0'>few seconds ago</p>
                </div>
              </div>
              </MenuItem>

              <MenuItem onClick={handleCloseNotificationsDrop}>
              <div className='d-flex'>
                <div>
                  <UserAvatarImg img={UserImg} />
                </div>

                <div className='dropdownInfo'>
                  <h4><span><b>Mahmudul</b> added to his favorite list <b>Leather belt steve madden</b></span></h4>
                  <p className='text-sky mb-0'>few seconds ago</p>
                </div>
              </div>
              </MenuItem>

              <MenuItem onClick={handleCloseNotificationsDrop}>
              <div className='d-flex'>
                <div>
                  <UserAvatarImg img={UserImg} />
                </div>

                <div className='dropdownInfo'>
                  <h4><span><b>Mahmudul</b> added to his favorite list <b>Leather belt steve madden</b></span></h4>
                  <p className='text-sky mb-0'>few seconds ago</p>
                </div>
              </div>
              </MenuItem>
              </div>

              <div className='pl-2 pr-2 pt-2 w-100'>
                <Button className='btn-blue w-100'>View all notifications</Button>
              </div>

            </Menu>

          </div>

          {
            context.isLogin === false ?
            <Link to={'/login'}>
              <Button className='btn-blue btn-lg btn-round'>Hi Admin</Button>
            </Link>
            :
            <div className='myAccWrapper'>
              Hi, {context.adminData.name}
            </div>
            
          }

        </div>

      </div>
    </div>
  </header>
  )
}

export default Header