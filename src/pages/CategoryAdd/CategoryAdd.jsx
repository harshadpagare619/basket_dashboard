import { useState, useContext, useEffect } from 'react'
import { MyContext } from '../../App';
import { postData } from '../../utils/api';
import { emphasize,styled } from '@mui/material/styles'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip'
import HomeIcon from '@mui/icons-material/Home'
import ExpandMoreIcon  from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button'
import { MdCloudUpload} from 'react-icons/md';
import { MdImage } from 'react-icons/md';
import { MdClose } from "react-icons/md";
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

function CategoryAdd() {

const context = useContext(MyContext);

const [isLoading, setIsLoading] = useState(false);
const [files, setFiles] = useState([]);
const [previews, setPreviews] = useState([]);

const [formFields, setFormFields] = useState({
  name: ''
})

useEffect(() => {
  if(files.length === 0) return;

  const objectUrls = files.map((file) => URL.createObjectURL(file));
  setPreviews(objectUrls);

  return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
}, [files]);

  const onChangeFile = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  }

  const removeImage = (index) => {
    const updatedFiles = files.filter((__, i) => i !== index);
    setFiles(updatedFiles);

    const updatedPreviews = previews.filter((_, i) => i !== index);
    setPreviews(updatedPreviews);
  }

const inputChange = (e) => {
  setFormFields(() => (
    {
      ...formFields,
      [e.target.name]:e.target.value
    }
  ))
}

const addCategory = (e) => {
  e.preventDefault();

  setIsLoading(true);
  context.setProgress(20);

  const formdata = new FormData();

  files.forEach((file) => {
    formdata.append('images', file);
  });

  Object.entries(formFields).forEach(([key, value]) => {
    formdata.append(key, value);
  });

  if(formFields.name !== '') {
    postData(`/api/category/create`, formdata).then((res) => {
      console.log(res);

      context.setAlertBox({
        open: true,
        color: 'success',
        msg: 'Category is created!'
      })

      setFormFields({
        name: ''
      })
      setFiles([]);
      setPreviews([]);

      setIsLoading(false);
      context.setProgress(100);
    })
  } else {
    context.setAlertBox({
      open: true,
      color: 'error',
      msg: 'Please fill all the fields'
    })

    setIsLoading(false);
    context.setProgress(100);
  }
}

  return (
    <div className='right-content w-100'>
    <div className='card shadow border-0 w-100 flex-row p-4'>
        <h5 className='mb-0'>Categorise</h5>
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
    label='Add a category'
    deleteIcon={<ExpandMoreIcon />}
    />
    </Breadcrumbs>
    </div>

    <form className='form' onSubmit={addCategory}>
        <div className='row'>
            <div className='col-md-12'>
                <div className='card p-4'>
                  <h5 className='mb-4'>Basic Information</h5>

                  <div className='row mb-4'>
                    <div className='form-group w-100'>
                        <h6>Category Name</h6>
                        <input type="text" name='name' value={formFields.name} onChange={inputChange} />
                    </div>
                  </div>

                  {/* Image Preview Section */}

                  <div className='row mb-4'>
                    <div className='col'>
                      <h6>Product Images</h6>
                      <div className='imagesUploadSec'>
                        <div className='imgUploadBox d-flex align-items-center'>
                          {
                            previews.map((img, index) => (
                              <div className='uploadBox' key={index}>
                                <img src={img} alt="preview" className='w-100' />
                                <button className='remove-btn' type='button' onClick={() => removeImage(index)}>
                                  <MdClose />
                                </button>
                              </div>  
                            ))
                          }

                          <div className='uploadBox'>
                            <input type="file" multiple  onChange={onChangeFile}/>
                            <div className='info'>
                              <MdImage />
                              <h5>Images Upload</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                    

                    <Button type='submit' className='btn-blue btn-lg btn-big w-100'>
                       {
                        isLoading === true ?
                        <CircularProgress color='inherit' className='ml-3 loader' /> :
                        <div className='d-flex justify-content-center'>
                            <MdCloudUpload className='mr-2'/> Add Category
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

export default CategoryAdd