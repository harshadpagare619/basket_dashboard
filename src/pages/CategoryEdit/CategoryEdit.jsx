import {useState, useEffect, useContext} from 'react';
import { MyContext } from '../../App';
import {editData, fetchDataFromApi} from '../../utils/api';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { emphasize,styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip'
import HomeIcon from '@mui/icons-material/Home'
import ExpandMoreIcon  from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { MdClose, MdCloudUpload } from 'react-icons/md';
import CircularProgress from '@mui/material/CircularProgress';
import { useParams } from 'react-router-dom';
import { MdImage } from 'react-icons/md';


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


function CategoryEdit() {

  const context = useContext(MyContext);
  let {id} = useParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const [catData, setCatData] = useState([]);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [formFields, setFormFields] = useState({
    name: ''
  });

  useEffect(() => {
    context.setProgress(20);

    fetchDataFromApi(`/api/category/${id}`).then((res) => {
        setCatData(res);
        console.log("Category data: ", res);

        setFormFields({
          name: res.name,
        })

        setExistingImages(res.images);

        context.setProgress(100);
    })
  },[]);

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

  const removeImage = (index, type) => {
    if(type === 'existing') {
      const updated = [...existingImages];
      updated.splice(index,1);
      setExistingImages(updated);
    } else if (type === 'new') {
      const updatedFiles = files.filter((_,i) => i !== index);
      setFiles(updatedFiles);

      const updatedPreviews = previews.filter((_,i) => i !== index);
      setPreviews(updatedPreviews);
    }
  };


  const inputChange = (e) => {
    setFormFields(() => (
      {
        ...formFields,
        [e.target.name]: e.target.value
      }
    ))
  };

  const editCategory = async (e) => {
    e.preventDefault();
    context.setProgress(20);

    const formdata = new FormData();

    Object.entries(formFields).forEach(([key, value]) => {
      formdata.append(key,value);
    });

    existingImages.forEach(url => formdata.append('existingImages', url));
    
    files.forEach((file) => {
      formdata.append('images', file);
    });

    editData(`/api/category/${id}`, formdata).then((res) => {
      context.setProgress(100);
      context.setAlertBox({
        open: true,
        color: 'success',
        msg: 'Category is updated!'
      })
    })
  }

  return (
    <div className='right-content w-100'>
        <div className='card shadow border-0 w-100 flex-row p-4'>
            <h5>Category Details</h5>
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
            label='Category Details'
            />
            </Breadcrumbs>
        </div>


        <form className='form' onSubmit={editCategory}>
            <div className='row'>
                <div className='col-md-12'>
                    <div className='card p-4'>
                        <h5 className='mb-4'>Basic Information</h5>

                        <div className='row mb-4'>
                            <div className='col'>
                                <div className='form-group'>
                                    <h6>Category Name</h6>
                                    <input 
                                    type="text" 
                                    name='name'
                                    value={formFields.name}
                                    onChange={inputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='row mb-4'>
                          <div className='col'>
                            <h6>Product Images</h6>
                            <div className='imagesUploadSec'>
                            <div className='imgUploadBox d-flex align-items-center'>
                              {existingImages.map((img, index) => (
                                <div className='uploadBox' key={`existing-${index}`}>
                                  <img src={img} alt='preview' className='w-100' />
                                  <button className='remove-btn' type="button" onClick={() => removeImage(index, 'existing')}>
                                    <MdClose />
                                  </button>
                                </div>  
                                ))
                              }
                        
                              {previews.map((img, index) => (
                                <div className='uploadBox' key={`new-${index}`}>
                                  <img src={img} alt="img" className='w-100' />
                                    <button className='remove-btn' type='button' onClick={() => removeImage(index, 'new')}><MdClose /></button>
                                </div>
                                ))}
                        
                              <div className='uploadBox'>
                                <input type="file" multiple  onChange={onChangeFile} />
                                  <div className='info'>
                                    <MdImage />
                                    <h5>Images Upload</h5>
                                  </div>
                              </div>
                              </div>
                            </div>
                                            
                            </div>
                            </div>


                       <Button className='btn-blue btn-big btn-lg w-100' type='submit'>
                        {
                         isLoading === true ?
                        <CircularProgress color='inherit' className='ml-3 loader' />
                        :
                        <div className='d-flex justify-content-center sbtbtn' >
                        <MdCloudUpload className='mr-2'/>Update Product
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

export default CategoryEdit