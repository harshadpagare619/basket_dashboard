import { useState, useEffect, useContext } from 'react';
import {MyContext} from '../../App';
import { fetchDataFromApi, deleteData } from '../../utils/api';
import { Link } from 'react-router-dom';
import { emphasize,styled } from '@mui/material/styles'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip'
import HomeIcon from '@mui/icons-material/Home'
import ExpandMoreIcon  from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button'
import { MdEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});


function ProductList() {

  const context = useContext(MyContext);

  const [productList, setProductList] = useState([]);

  useEffect(() => {
    window.scrollTo(0,0);

    fetchDataFromApi(`/api/products`).then((res) => {
      setProductList(res);
    })
  }, [])
 
  const deleteProduct = (id) => {
    context.setProgress(40);

    deleteData(`/api/products/${id}`).then((res) => {
      fetchDataFromApi(`/api/products`).then((res) => {
        setProductList(res);
        context.setProgress(100);
        context.setAlertBox({
          open: true,
          color: 'error',
          msg: 'Product is deleted!'
        })
      })
    })
  }




  return (
    <div className='right-content w-100'>
      <div className='card shadow border-0 w-100 flex-row p-4'>
        <h5 className='mb-0'>Product List</h5>
        <Breadcrumbs aria-label='breadcrumb' className='ml-auto breadcrumbs_'>
        <StyledBreadcrumb
        component='a'
        href='#'
        label='Dashboard'
        icon={<HomeIcon fontSize='small'/>}
        />
        <StyledBreadcrumb
        component='a'
        href='#'
        label='Products'
        deleteIcon={<ExpandMoreIcon />}
        />
        <StyledBreadcrumb
        label='Product List'
        />
        </Breadcrumbs>
      </div>

      <div className='card shadow border-0 p-3 mt-4'>
        <h3 className='hd'>Best Selling Products</h3>

        <div className='table-responsive mt-4'>
          <table className='table table-bordered v-align'>
            <thead className='thead-dark'>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stocks</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
            {
              productList?.length !==0 && productList?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <div className='d-flex align-items-center productBox'>
                        <div className='imgWrapper'>
                          <div className='img'>
                            <img src={item.images[0]} alt="product iamge" className='w-100' />
                          </div>
                        </div>
                        <div className='info'>
                          <h6>{item.name}</h6>
                          <p>{item.description}</p>
                        </div>
                      </div>
                    </td>

                    <td>{item.category.name}</td>
                    <td>{item.brand.name}</td>
                    <td>
                      <div style={{width: '60px'}}>
                        <del className='old'>{item.price}</del>
                        <span className='new text-danger'>{item.newPrice}</span>
                      </div>
                    </td>
                    <td>{item.countInStock}</td>
                    <td>
                      <div className='actions d-flex align-items-center'>
                        <Link to={`/products/productedit/${item.id}`}>
                        <Button className='success' color='success'><MdEdit /></Button>
                        </Link>
                        <Button className='error' color='error' onClick={() => deleteProduct(item.id)}><MdDelete /></Button>
                
                      </div>
                    </td>
                  </tr>
                )
              })
            }

            </tbody>

          </table>
        </div>
      </div>

    </div>
  )
}

export default ProductList