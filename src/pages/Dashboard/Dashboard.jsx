import { useState, useEffect, useContext } from "react"
import { MyContext } from "../../App"
import { fetchDataFromApi } from "../../utils/api"
import { DashboardBox } from '../../components'
import { MdAccountCircle } from 'react-icons/md'
import { MdShoppingCart } from 'react-icons/md'
import { MdShoppingBag } from 'react-icons/md'
import { MdHotelClass } from 'react-icons/md'
import Button from '@mui/material/Button';
import { MdVisibility } from 'react-icons/md'
import { MdEdit } from 'react-icons/md'
import { MdDelete } from 'react-icons/md'
import Pagination from '@mui/material/Pagination'
import Logo from '../../assets/images/Logo.png';


function Dashboard() {

  const context = useContext(MyContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [productData, setProductData] = useState([]);
  const tableProducts = productData.slice(0,6);
  const open = Boolean(anchorEl);

  useEffect(() => {
    window.scrollTo(0,0);

    context.setIsHideSidebarAndHeader(false);
  }, [])

  useEffect(() => {
    fetchDataFromApi(`/api/products`).then((res) => {
      setProductData(res);
    })
  }, []);


  
  return (
    <div className="right-content w-100">

      <div className='row dashboardBoxWrapperRow'>
      <div className='col-md-12'>
        <div className='dashboardBoxWrapper d-flex'>
          <DashboardBox color={['#1da256','#48d483']} icon={<MdAccountCircle />} chart={true}/>
          <DashboardBox color={['#c012e2','#eb64fe']} icon={<MdShoppingCart />} chart={true}/>
          <DashboardBox color={['#2c78e5','#60aff5']} icon={<MdShoppingBag />} />
          <DashboardBox color={['#e1950e','#f3cd29']} icon={<MdHotelClass />} />
        </div>
      </div>

      {/* <div className='col-md-4 pl-0'>
        <div className='card'></div>
      </div> */}
    </div>

    <div className="card shadow border-0 p-3 mt-4">
      <h3 className="hd">Best Selling Products</h3>

      {/* <div className="row cardFilters mt-3">
        
        <div className='row mt-3'>
        <div className='col-md-3 filterSection'>
        <h4>Show By</h4>
        <FormControl size='small' className='w-100'>
          <Select
          value={showBy}
          onChange={showByChange}
          className='w-100'
          inputProps={{'aria-label' : 'Without label'}}
          >
            <MenuItem value=''><em>None</em></MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
        </div>

        <div className='col-md-3 filterSection'>
        <h4>Category By</h4>
        <FormControl size='small' className='w-100'>
          <Select
          value={categoryBy}
          onChange={categoryByChange}
          className='w-100'
          inputProps={{'aria-label' : 'Without label'}}
          >
            <MenuItem value=''><em>None</em></MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
        </div>
      </div>

      </div> */}

      <div className="table-responsive mt-4">
        <table className="table table-bordered v-align">
          <thead className="thead-dark">
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Order</th>
              <th>Sales</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {
              tableProducts?.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="d-flex align-items-center productBox">
                      <div className="imgWrapper">
                        <div className="img">
                        <img src={item.images?.[0]} className="w-100" />
                        </div>
                      </div>
                      <div className="info">
                        <h6>{item.name}</h6>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  </td>
                  <td>{item.category.name}</td>
                  <td>{item.brand.name}</td>
                  <td>
                    <div style={{width: '60px'}}>
                      {
                        item.price == item.newPrice ?
                        <span className="new">{item.price}</span> :
                        <>
                        <del className="old">{item.price}</del>
                        <span className="new text-danger">{item.newPrice}</span>
                        </>
                      }
                    </div>
                  </td>
                  <td>{item.countInStock}</td>
                  <td>4.9(16)</td>
                  <td>380</td>
                  <td>$38K</td>
                  <td>
                    <div className='actions d-flex align-items0center'>
                    <Button className='secondary' color='secondary'><MdVisibility /></Button>
                    <Button className='success' color='success'><MdEdit /></Button>
                    <Button className='error' color='error'><MdDelete /></Button>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>

        <div className='d-flex tableFooter'>
          <p>Showing <b>{tableProducts?.length}</b> of <b>{productData?.length}</b> results</p>
          {/* <Pagination count={productData?.length/ tableProducts?.length} color='primary' className='pagiantion' /> */}
          <Pagination count="10" color='primary' className='pagiantion' />
        </div>
      </div>


      
    </div>

    </div>
  )
}

export default Dashboard