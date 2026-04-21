import {useState, useContext,} from 'react'
import { MyContext } from '../../App';
import { postData } from '../../utils/api';
import { emphasize,styled } from '@mui/material/styles'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip'
import HomeIcon from '@mui/icons-material/Home'
import ExpandMoreIcon  from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button'
import { MdCloudUpload} from 'react-icons/md';
import CircularProgress from '@mui/material/CircularProgress';

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

function BrandAdd() {
  const context = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    name: ''
  })

  const inputChange = (e) => {
    setFormFields(() => (
      {
        ...formFields,
        [e.target.name]:e.target.value
      }
    ))
  }

  const addBrand = (e) => {
    e.preventDefault();

    setIsLoading(true);
    context.setProgress(20);
    if(formFields.name !== ''){
      postData('/api/brands/create', formFields).then((res) => {
        console.log(res);
        
        context.setAlertBox({
          open: true,
          color: 'success',
          msg: 'Brand is created'
        })

        setFormFields({
          name: ''
        })

        context.setProgress(100);
        setIsLoading(false);
      })
    } else {
      context.setAlertBox({
        open:true,
        color: 'error',
        msg: 'Please fill all the fields'
      })

      return false;
    }
  }


  return (
    <div className='right-content w-100'>
        <div className='card shadow border-0 w-100 flex-row p-4'>
        <h5 className='mb-0'>Add Brand</h5>
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
        label='Brands'
        deleteIcon={<ExpandMoreIcon />}
        />
        <StyledBreadcrumb
        component='a'
        href='#'
        label='Add Brand'
        deleteIcon={<ExpandMoreIcon />}
        />
        </Breadcrumbs>
        </div>

        <form className='form' onSubmit={addBrand}>
            <div className='row'>
                <div className='col-md-12'>
                    <div className='card p-4'>
                        
                        <div className='form-group'>
                            <h6>Brand Name</h6>
                            <input type="text" name='name' value={formFields.name} onChange={inputChange} />
                        </div>


                        <Button className='btn-blue btn-lg btn-big w-100' type='submit'>
                           {
                            isLoading === true ?
                            <CircularProgress color='inherit' className='ml-3 loader' /> :
                            <div className='d-flex justify-content-center'>
                                <MdCloudUpload className='mr-2' />Add Brand
                            </div>
                           }
                        </Button>
                    </div>
                </div>
            </div>
        </form>

    </div>
  )
}

export default BrandAdd