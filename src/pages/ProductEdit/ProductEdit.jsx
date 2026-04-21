import { useState, useEffect, useContext } from "react";
import {MyContext} from '../../App';
import { editData, fetchDataFromApi} from "../../utils/api";
import { useParams } from "react-router-dom";
import { emphasize,styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip'
import HomeIcon from '@mui/icons-material/Home'
import ExpandMoreIcon  from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { MdClose, MdCloudUpload } from 'react-icons/md';
import CircularProgress from '@mui/material/CircularProgress';
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


function ProductEdit() {

 const context = useContext(MyContext);

 let {id} = useParams();

 const [isLoading, setIsLoading] = useState(false);
 const [productData, setProductData] = useState([]);
 const [brandData, setBrandData] = useState([]);
 const [catData, setCatData] = useState([]);
 const [sizeUnitVal, setSizeUnitVal] = useState('');
 const [isFeaturedVal, setIsFeaturedVal] = useState('');
 const [files, setFiles] = useState([]);
 const [previews, setPreviews] = useState([]);
 const [existingImages, setExistingImages] = useState([]);

 const [formFields, setFormFields] = useState({
  name: '',
  description: '',
  brand: '',
  category: '',
  price: '',
  newPrice: '',
  countInStock: '',
  size: '',
  sizeUnit: '',
  isFeatured: null,
 });

 useEffect(() => {
  context.setProgress(20);

  fetchDataFromApi(`/api/brands`).then((res) => {
    setBrandData(res);
    console.log("Brand List: ", res);
  });

  fetchDataFromApi(`/api/category`).then((res) => {
    setCatData(res);
    console.log("Category List: ", res);
  });

  fetchDataFromApi(`/api/products/${id}`).then((res) => {
    setProductData(res);
    console.log("Produt Data:", res);

    setFormFields({
      name: res.name,
      description: res.description,
      brand: res.brand?._id || res.brand,
      category: res.category?._id || res.category,
      price: res.price,
      newPrice: res.newPrice,
      countInStock: res.countInStock,
      size: res.size,
      sizeUnit: res.sizeUnit,
      isFeatured: res.isFeatured
    })

    setIsFeaturedVal(res.isFeatured);
    setSizeUnitVal(res.sizeUnit);
    setExistingImages(res.images);

  })

  context.setProgress(100);
 }, []);


//  Image preview
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

 const getNameById = (id, dataArray) => {
  return dataArray.find((item) => item._id === id)?.name || "Unknown";
  };

  const handleChangeSizeUnitVal = (event) => {
    setSizeUnitVal(event.target.value);
    setFormFields(() => (
      {
        ...formFields,
        sizeUnit: event.target.value
      }
    ))
  }

  const handleChangeIsFeaturedVal = (event) => {
    setIsFeaturedVal(event.target.value);
    setFormFields(() => (
      {
        ...formFields,
        isFeatured: event.target.value
      }
    ))
  }

  const inputChange = (e) => {
    setFormFields(() => (
      {
        ...formFields,
        [e.target.name]: e.target.value
      }
    ))
  }

  const editProduct = async (e) => {
    e.preventDefault();
    context.setProgress(20);

    const formdata = new FormData();
    existingImages.forEach(url => formdata.append('existingImages', url));

    files.forEach((file) => {
      formdata.append('images', file);
    });

    Object.entries(formFields).forEach(([key, value]) => {
      formdata.append(key, value);
    });

    // formdata.append('name', formFields.name);
    // formdata.append('description', formFields.description);
    // formdata.append('brand', formFields.brand);
    // formdata.append('category', formFields.category);
    // formdata.append('subCategory', formFields.subCategory);
    // formdata.append('price', formFields.price);
    // formdata.append('newPrice', formFields.newPrice);
    // formdata.append('countInStock', formFields.countInStock);
    // formdata.append('size', formFields.size);
    // formdata.append('sizeUnit', formFields.sizeUnit);
    // formdata.append('isFeatured', formFields.isFeatured);


    editData(`/api/products/${id}`, formdata).then((res) => {
      context.setProgress(100);
      context.setAlertBox({
        open: true,
        color: 'success',
        msg: 'Product is updated!'
      })
    })
  }


  return (
    <div className='right-content w-100'>
      <div className='card shadow border-0 w-100 flex-row p-4'>
        <h5>Product Details</h5>
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
        label='Product Details'
        />
        </Breadcrumbs>
      </div>

      <div className="card p-4">
      <form className="form" onSubmit={editProduct}>

        <div className="row">
          <div className="col-md-12">
            <div>
              <h5 className="mb-4">Basic Information</h5>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col">
            <div className="form-group">
              <h6>Product Name</h6>
              <input type="text" name="name" value={formFields.name} onChange={inputChange} />
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col">
            <div className="form-group">
              <h6>Product Description</h6>
              <textarea name="description" type="text" value={formFields.description} onChange={inputChange}></textarea>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col">
            <div className="form-group">
              <h6>Product Brand</h6>
              <input type="text" name='brand' value={getNameById(formFields.brand, brandData)} readOnly/>
            </div>
          </div>

          <div className="col">
            <div className="form-group">
              <h6>Product Category</h6>
              <input type="text" name='category' value={getNameById(formFields.category, catData)} readOnly/>
            </div>
          </div>

        </div>

        <div className="row mb-4">
          <div className="col">
            <div className="form-group">
              <h6>Product Price</h6>
              <input type="number" name="price" value={formFields.price}  onChange={inputChange}/>
            </div>
          </div>

          <div className="col">
            <div className="form-group">
              <h6>Product Discounted Price</h6>
              <input type="number" name="newPrice" value={formFields.newPrice} onChange={inputChange}/>
            </div>
          </div>

           <div className='col'>
              <div className='form-group'>
                <h6>Product Stocks</h6>
                <input type="text" name='countInStock' value={formFields.countInStock} onChange={inputChange} />
              </div>
            </div>

        </div>

        <div className="row mb-4">
          <div className="col">
            <div className="form-group">
              <h6>Product Size</h6>
              <input type="text" name="size" value={formFields.size}  onChange={inputChange}/>
            </div>
          </div>

          <div className="col">
            <div className='form-group'>
              <h6>Product Size Unit</h6>
              <Select
              value={sizeUnitVal}
              onChange={handleChangeSizeUnitVal}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              className='w-100'
              >
                <MenuItem value="">
                  <em>Select Size unit</em>
                </MenuItem>
              <MenuItem value='ml'>ml</MenuItem>
              <MenuItem value='ltr'>ltr</MenuItem>
              <MenuItem value='grams'>grams</MenuItem>
              <MenuItem value='kg'>kg</MenuItem>
              <MenuItem value='piece'>piece</MenuItem>
              <MenuItem value='dozen'>dozen</MenuItem>
              </Select>
            </div>
          </div>

           <div className='col'>
              <div className='form-group'>
                <h6>Is Product Featured</h6>
                  <Select
                    value={isFeaturedVal}
                    onChange={handleChangeIsFeaturedVal}
                    displayEmpty
                    inputProps={{'aria-label':'Without label'}}
                    className='w-100'
                    >
                    <MenuItem value={true}>True</MenuItem>
                    <MenuItem value={false}>False</MenuItem>
                  </Select>
                </div>
            </div>

        </div>

        {/* Image upload and preview section */}
        
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

      </form>
      </div>

    </div>
 
  )
}

export default ProductEdit