import {useContext, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { MdDashboard } from 'react-icons/md';
import {FaAngleRight} from 'react-icons/fa6';
import { MdOutlinePix } from 'react-icons/md';
import { MdShoppingCart } from 'react-icons/md';
import { MdMail } from 'react-icons/md';
import { MdNotifications } from 'react-icons/md';
import { MdSettings } from 'react-icons/md';
import { MdLogout } from 'react-icons/md';
import { FaTag } from "react-icons/fa6";
import { MdCategory } from "react-icons/md";
import { MdPlaylistAddCircle } from "react-icons/md";

import {MyContext} from '../../App';
import { colors } from '@mui/material';

function Sidebar() {

  const context = useContext(MyContext);

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(null);
  const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);

  const isOpenSubmenu = (index) => {
    setActiveTab(index);
    setIsToggleSubmenu(!isToggleSubmenu)
  }

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");

    context.setIsLogin(false);
    context.setAdminData(null);
    context.setIsHideSidebarAndHeader(true);

    context.setAlertBox({
      open: true,
      colors: "success",
      msg: "Logged out successfully!",
    });

    navigate("/login");
  }


  return (
    <div className='sidebar'>
      <ul>

        <li>
         <Link to='/'>
         <Button className={`w-100 ${activeTab === 0 ? 'active' : ''}`}>
          <span className='icon'><MdDashboard /></span>Dashboard<span className='arrow'><FaAngleRight /></span>
         </Button>
          </Link>
        </li>

        <li>
          <Button className={`w-100 ${activeTab === 1 && isToggleSubmenu ? 'active' : ''}`} onClick={() => isOpenSubmenu(1)}>
            <span className='icon'><FaTag /></span>Brands<span className='arrow'><FaAngleRight /></span>
          </Button>
          <div className={`submenuWrapper ${activeTab === 1 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
            <ul className='submenu'>
              <li><Link to={'/brands/addbrand'}>Add Brand</Link></li>
              <li><Link to={'/brands/brandlist'}>Brand List</Link></li>
            </ul>
          </div>
        </li>

        <li>
          <Button className={`w-100 ${activeTab === 2 && isToggleSubmenu  ? 'active' : ''}`} onClick={() => isOpenSubmenu(2)}>
            <span className='icon'><MdCategory /></span>Category<span className='arrow'><FaAngleRight/></span>
          </Button>
          <div className={`submenuWrapper ${activeTab === 2 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
            <ul className='submenu'>
              <li><Link to={'/category/addcategory'}>Add Category</Link></li>
              <li><Link to={'/category/categorylist'}>Category List</Link></li>
            </ul>
          </div>
        </li>

        {/* <li>
          <Button className={`w-100 ${activeTab === 3 && isToggleSubmenu ? 'active' : ''}`} onClick={() => isOpenSubmenu(3)}>
            <span className='icon'><MdPlaylistAddCircle /></span>Sub-Category<span className='arrow'><FaAngleRight /></span>
          </Button>
          <div className={`submenuWrapper ${activeTab === 3 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
            <ul className='submenu'>
              <li><Link to={'/subcategory/addsubcategory'}>Add Sub-Category</Link></li>
              <li><Link to={'/subcategory/subcategorylist'}>Sub-Category List</Link></li>
            </ul>
          </div>
        </li> */}

        <li>
         <Button className={`w-100 ${activeTab === 3 && isToggleSubmenu ? 'active' : ''}`} onClick={() => isOpenSubmenu(4)}>
          <span className='icon'><MdOutlinePix /></span>Products<span className='arrow'><FaAngleRight /></span>
         </Button>
         <div className={`submenuWrapper ${activeTab === 4 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
          <ul className='submenu'>
            <li><Link to={'/products/addproduct'}>Add Product</Link></li>
            <li><Link to={'/products/productlist'}>Products List</Link></li>
          </ul>
         </div>         
        </li>

        <li>
         <Link to='/orders'>
         <Button className={`w-100 ${activeTab === 4 ? 'active' : ''}`}>
          <span className='icon'><MdShoppingCart /></span>Orders<span className='arrow'><FaAngleRight /></span>
         </Button>
          </Link>
        </li>

        <li>
         <Link to='/'>
         <Button className={`w-100 ${activeTab === 5 ? 'active' : ''}`}>
          <span className='icon'><MdMail /></span>Messages<span className='arrow'><FaAngleRight /></span>
         </Button>
          </Link>
        </li>

        <li>
         <Link to='/'>
         <Button className={`w-100 ${activeTab === 6 ? 'active' : ''}`}>
          <span className='icon'><MdNotifications /></span>Notifications<span className='arrow'><FaAngleRight /></span>
         </Button>
          </Link>
        </li>

        <li>
         <Link to='/'>
         <Button className={`w-100 ${activeTab === 7 ? 'active' : ''}`}>
          <span className='icon'><MdSettings /></span>Settings<span className='arrow'><FaAngleRight /></span>
         </Button>
          </Link>
        </li>

      </ul>

      <div className='logoutWrapper'>
        <div className='logoutBox'>
          <Button variant='contained' onClick={handleLogout}><MdLogout /> &nbsp; Logout</Button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar