import {useState} from 'react';
import { MdMoreVert } from 'react-icons/md';
import Button from '@mui/material/Button';
import { MdTrendingUp } from 'react-icons/md';
import { MdTrendingDown } from 'react-icons/md';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { MdHistory } from 'react-icons/md';

const ITEM_HEIGHT = 48;

function DashboardBox(props) {
const [anchorEl,setAnchorEl] = useState(null);
const open = Boolean(anchorEl);
   
const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
}
   
const handleClose = () => {
    setAnchorEl(null)
}

return (
<div className='dashboardBox' style={{backgroundImage: `linear-gradient(to right, ${props.color?.[0]}, ${props.color?.[1]})`}}>
    {
    props.chart === true ?
    <span className='chart'><MdTrendingUp /></span>
    :<span className='chart'><MdTrendingDown /></span>
    }

    <div className='d-flex w-100'>
       <div className='col1'>
        <h4 className='text-white'>Total Users</h4>
        <span className='text-white'>277</span>
       </div>

       <div className='ml-auto'>
       {
        props.icon?
        <span className='icon'>{props.icon}</span>
        : ''
       }
       </div> 

      </div>

      <div className='d-flex align-items-center bottomBox'>
      <h6 className='text-white'>Last Month</h6>
      <div className='ml-auto d-flex'>
      <Button className='ml-auto toggleIcon'>
        <MdMoreVert onClick={handleClick} />
        <Menu
        id="long-menu"
        className='dropdownMenu'
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '20ch',
            },
          },
        }}
      >
        <MenuItem onClick={handleClose}>
        <MdHistory />Last Day
        </MenuItem>
        <MenuItem onClick={handleClose}>
        <MdHistory />Last Week
        </MenuItem>
        <MenuItem onClick={handleClose}>
        <MdHistory />Last Month
        </MenuItem>
        <MenuItem onClick={handleClose}>
        <MdHistory />Last Year
        </MenuItem>
      </Menu>
      </Button>  
      </div>  
      </div> 

    </div>
  )
}

export default DashboardBox