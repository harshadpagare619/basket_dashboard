import {useState, useContext, useEffect,} from 'react'
import { MyContext } from '../../App';
import { fetchDataFromApi, editData, deleteData } from '../../utils/api';
import { emphasize,styled } from '@mui/material/styles'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip'
import HomeIcon from '@mui/icons-material/Home'
import ExpandMoreIcon  from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button'
import { MdCloudUpload, MdEdit, MdDelete} from 'react-icons/md';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

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

function BrandList() {

const context = useContext(MyContext);
const [brandData, setBrandData] = useState([]);
const [open, setOpen] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [editId, setEditId] = useState(null);
const [formFields, setFormFields] = useState({
  name: ''
})

useEffect(() => {
  window.scrollTo(0,0);
  context.setProgress(20);
  fetchDataFromApi('/api/brands').then((res) => {
    setBrandData(res);
    context.setProgress(100);
    
  })
}, [])

const handleClose =() => {
  setOpen(false);
}

const editBrand = (id) => {
  setOpen(true);
  setEditId(id);

  fetchDataFromApi(`/api/brands/${id}`).then((res) => {
    setFormFields({
      name: res.name
    })

    console.log(res);
  })
}

const inputChange = (e) => {
  setFormFields(() => (
    {
      ...formFields,
      [e.target.name] : e.target.value
    }
  ))
}

const brandEdit = (e) => {
  e.preventDefault();
  setIsLoading(true);

  editData(`/api/brands/${editId}`, formFields).then((res) => {
    fetchDataFromApi(`/api/brands`).then((res) => {
      setBrandData(res);
      setIsLoading(false);
      setOpen(false);
      console.log(res);
      
    })
  })
}

const deleteBrand = (id) => {
  context.setProgress(40);

  deleteData(`/api/brands/${id}`).then((res) => {
    context.setAlertBox({
      open:true,
      color: 'error',
      msg: 'Brand is deleted!'
    })

    fetchDataFromApi(`/api/brands`).then((res) => {
      setBrandData(res);
    })

    context.setProgress(100);
  })
}

  return (
    <div className='right-content w-100'>
    <div className='card shadow border-0 w-100 flex-row p-4'>
    <h5 className='mb-0'>Brands List</h5>
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
    label='Brands List'
    deleteIcon={<ExpandMoreIcon />}
    />
    </Breadcrumbs>
    </div>

    <div className='card shadow border-0 p-3 mt-4'>
        <div className='table-responsive mt-4'>
            <table className='table table-bordered v-align'>

            <thead className='thead-dark'>
                <tr>
                    <th>Brand Name</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
            {
                brandData?.length!==0 && brandData?.map((item, index) => {
                    return (
                    <tr key={index}>
                    <td>{item.name}</td>
                    <td>
                        <div className='actions d-flex align-items-center'>
                            <Button className='success' color='success' onClick={() => editBrand(item.id)}><MdEdit /></Button>
                            <Button className='error' color='error' onClick={() => deleteBrand(item.id)}><MdDelete /></Button>
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

<form onSubmit={brandEdit}>
<Dialog
open={open}
onClose={handleClose}
slotProps={{
paper: {
component: 'form',
onSubmit: (event) => {
event.preventDefault();
const formData = new FormData(event.currentTarget);
const formJson = Object.fromEntries(formData.entries());
const email = formJson.email;
console.log(email);
handleClose();
},
},
}}
>

<DialogTitle>Edit Brand</DialogTitle>


<DialogContent>
<h6 className='mb-1'>Brand Name</h6>
<TextField
autoFocus
required
margin="dense"
id="name"
name="name"
type="text"
value={formFields.name}
onChange={inputChange}
fullWidth
/>
</DialogContent>
<DialogActions>
<Button onClick={handleClose}>Cancel</Button>
<Button type="submit" variant='contained' className='btn-blue' onClick={brandEdit} >{isLoading === true ? <CircularProgress color='inherit' className='ml-3 loader' /> : 'Update Brand Name'}</Button>
</DialogActions>
</Dialog>
</form>
</div>          
  )
}

export default BrandList