import { useState, useEffect, useContext } from "react"
import { fetchDataFromApi, editData, deleteData } from "../../utils/api"
import { MyContext } from "../../App";
import { Link } from "react-router-dom";
import { emphasize,styled } from '@mui/material/styles'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip'
import HomeIcon from '@mui/icons-material/Home'
import ExpandMoreIcon  from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button'
import { MdEdit, MdDelete } from 'react-icons/md';
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


function CategoryList() {

  const context = useContext(MyContext);

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ catData, setCatData] = useState([]);
  const [editId, setEditId] = useState(null);
  
  const [formFields, setFormFields] = useState({
    name: ''
  })

  useEffect(() => {
    window.scrollTo(0,0);
    context.setProgress(20);
    fetchDataFromApi(`/api/category`).then((res) => {
      setCatData(res);
      context.setProgress(100);
    })
  }, [])

  const handleClose = () => {
    setOpen(false);
  }

  const editCategory = (id) => {
    setOpen(true);
    setEditId(id);

    fetchDataFromApi(`/api/category/${id}`).then((res) => {
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

  const categoryEdit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    editData(`/api/category/${editId}`, formFields).then((res) => {
      fetchDataFromApi(`/api/category`).then((res) => {
        setCatData(res);
        setIsLoading(false);
        setOpen(false);
        console.log(res);
      })
    })
  }

  const deleteCategory = (id) => {
    context.setProgress(40);

    deleteData(`/api/category/${id}`).then((res) => {
      context.setAlertBox({
        open: true,
        color: 'error',
        msg: 'Category is deleted!'
      })

      fetchDataFromApi(`/api/category`).then((res) => {
        setCatData(res);
      })

      context.setProgress(100);
    })
  }


  return (
    <div className="right-content w-100">
      <div className='card shadow border-0 w-100 flex-row p-4'>
        <h5 className='mb-0'>Categories</h5>
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
        label='Category'
        deleteIcon={<ExpandMoreIcon />}
        />
        <StyledBreadcrumb
        component='a'
        href='#'
        label='Category List'
        deleteIcon={<ExpandMoreIcon />}
        />
        </Breadcrumbs>
      </div>

      <div className="card shadow border-0 p-3 mt-4">
        <div className="table-responsive mt-4">
          <table className="table table-bordered v-align">
            <thead className="thead-dark">
              <tr>
                <th>Category Name</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {
                catData?.length !==0 && catData?.map((item, index) => {
                  return (
                    <tr key={index}>

                      <td>
                        <div className="d-flex align-items-center productBox">
                          <div className="ml-2 w-100">
                            <h6>{item.name}</h6>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="actions d-flex align-items-center">                 
                          <Button className="success" color="success" onClick={() => editCategory(item.id)}><MdEdit /></Button>
                          <Button className="error" color="error" onClick={() => deleteCategory(item.id)}><MdDelete /></Button>
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

      <form onSubmit={categoryEdit}>
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
    
        <DialogTitle>Edit Category</DialogTitle>

    
        <DialogContent>
          <h6 className='mb-1'>Category Name</h6>
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
          <Button type="submit" variant='contained' className='btn-blue' onClick={categoryEdit}>{isLoading === true ? <CircularProgress color='inherit' className='ml-3 loader' /> : 'Update Category'}</Button>
        </DialogActions>
        </Dialog>
      </form>


    </div>
  )
}

export default CategoryList