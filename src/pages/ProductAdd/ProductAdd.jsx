import { useState, useEffect, useContext } from "react"
import { MyContext } from "../../App"
import { fetchDataFromApi, postProductData } from "../../utils/api"
import { emphasize,styled } from '@mui/material/styles'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip'
import HomeIcon from '@mui/icons-material/Home'
import ExpandMoreIcon  from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { MdCloudUpload } from 'react-icons/md';
import { MdImage } from 'react-icons/md';
import CircularProgress from '@mui/material/CircularProgress';
import { MdClose } from "react-icons/md";

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


function ProductAdd() {

  const context = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(false);
  const [brandData, setBrandData] = useState([]);
  const [catData, setCatData] = useState([]);
  const [brandVal, setBrandVal] = useState('');
  const [categoryVal, setCategoryVal] = useState('');
  const [sizeUnitVal, setSizeUnitVal] = useState('');
  const [isFeaturedVal, setIsFeaturedVal] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [images, setImages] = useState([]);

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
    isFeatured: false
  })
 
  // Fetching brand and category data

  useEffect(() => {
    window.scrollTo(0,0);
    context.setProgress(20);

    fetchDataFromApi(`/api/brands`).then((res) => {
      setBrandData(res);
      console.log("Brand List: ", res);
    });

    fetchDataFromApi(`/api/category`).then((res) => {
      setCatData(res);
      console.log("Category data:", res);
    })

    context.setProgress(100);

  }, []);


  // Image Previews

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

    const updatedPreviews = previews.filter((__, i) => i !== index);
    setPreviews(updatedPreviews)
  }


  const inputChange = (e) => {
    setFormFields(() => (
      {
        ...formFields,
        [e.target.name]: e.target.value
      }
    ))
  }
 

  // monitor brands dropdown

  const handleChangeBrand = (event) => {
    setBrandVal(event.target.value);
    setFormFields(() => (
      {
        ...formFields,
        brand: event.target.value
      }
    ))
  }

  // monitor category dropdown

  const handleChangeCategory = (event) => {
    const selectedCategory = event.target.value;
    setCategoryVal(selectedCategory);
    console.log(selectedCategory);

    setFormFields(() => (
      {
        ...formFields,
        category: selectedCategory
      }
    ))
  }


  // monitor sizeUnit dropdown

  const handleChangeSizeUnitVal = (event) => {
    setSizeUnitVal(event.target.value);

    setFormFields(() => (
      {
        ...formFields,
        sizeUnit: event.target.value
      }
    ))
  }

  // monitor isFeatured dropdown

  const handleChangeIsFeaturedVal = (event) => {
    setIsFeaturedVal(event.target.value);

    setFormFields(() => (
      {
        ...formFields,
        isFeatured: event.target.value
      }
    ))
  }

  // Add Product in the database

  const addProduct = async(e) => {
    e.preventDefault();

    setIsLoading(true);
    context.setProgress(20)

    const formdata = new FormData();

    files.forEach((file) => {
      formdata.append('images', file);
    });

    Object.entries(formFields).forEach(([key, value]) => {
      formdata.append(key, value);
    });

    try {
       postProductData(`/api/products/create`, formdata).then((res) => {
      context.setProgress(100);
      console.log("product details :", res);

      context.setAlertBox({
        open: true,
        color: 'success',
        msg: 'Product is added'
      })
      setIsLoading(false);

      setFormFields({
        name: '',
        description: '',
        brand: '',
        category: '',
        price: '',
        newPrice: '',
        countInStock: '',
        size: '',
        sizeUnit: '',
        isFeatured: false,
      });
      setBrandVal('');
      setCategoryVal('');
      setSizeUnitVal('');
      setIsFeaturedVal('');
      setFiles([]);
      setPreviews([]);
    })
    } catch (error) {
      console.log("error in adding product :", error);

      context.setAlertBox({
        open: true,
        color: 'error',
        msg: 'Productcannot add'
      })
      setIsLoading(false);
    }
  

    postProductData(`/api/products/create`, formdata).then((res) => {
      context.setProgress(100);
      console.log("product details :", res);

      context.setAlertBox({
        open: true,
        color: 'success',
        msg: 'Product is added'
      })
      setIsLoading(false);

      setFormFields({
        name: '',
        description: '',
        brand: '',
        category: '',
        price: '',
        newPrice: '',
        countInStock: '',
        size: '',
        sizeUnit: '',
        isFeatured: false,
      });
      setBrandVal('');
      setCategoryVal('');
      setSizeUnitVal('');
      setIsFeaturedVal('');
      setFiles([]);
      setPreviews([]);
    })
  }

return (
 <div className="right-content w-100">
  <div className='card shadow border-0 w-100 flex-row p-4'>
      <h5>Product Upload</h5>
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
        label='Product Upload'
        />
        </Breadcrumbs>
    </div>


    <form className="form" onSubmit={addProduct}>
      <div className="row">
        <div className="col-md-12">

          <div className="card p-4">
            <h5 className="mb-4">Basic Information</h5>

            <div className="row mb-4">
              <div className="col">
                <div className="form-group">
                  <h6>Product Name</h6>
                  <input type="text" name='name' value={formFields.name} onChange={inputChange} />
                </div>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col">
                <div className="form-group">
                  <h6>Product Description</h6>
                  <textarea name="description" type='text' value={formFields.description} onChange={inputChange} />
                </div>
              </div>
            </div>

            <div className="row mb-4">

              <div className="col">
                <div className="form-group">
                  <h6>Product Brand</h6>
                  <Select
                    value={brandVal}
                    onChange={handleChangeBrand}
                    displayEmpty
                    inputProps={{'aria-label' : 'Without label'}}
                    className="w-100"
                  >
                    {
                      brandData?.lenght !== 0 && brandData?.map((item, index) => {
                        return (
                          <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                        )
                      })
                    }
                  </Select>
                </div>
              </div>

              <div className="col">
                <div className="form-group">
                  <h6>Product Category</h6>
                  <Select
                    value={categoryVal}
                    onChange={handleChangeCategory}
                    displayEmpty
                    inputProps={{"aria-label": "Without label"}}
                    className="w-100"
                  >
                    {
                      catData?.length !==0 && catData?.map((item, index) => (
                        <MenuItem key={index} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))
                    }
                  </Select>
                </div>
              </div>

            </div>


            <div className="row mb-4">

             <div className="col">
              <div className="form-group">
                <h6>Product Price</h6>
                <input type="text" name="price" value={formFields.price} onChange={inputChange} />
              </div>
             </div>

             <div className="col">
              <div className="form-group">
                <h6>Product Discount Price</h6>
                <input type="text" name="newPrice" value={formFields.newPrice} onChange={inputChange} />
              </div>
             </div>
            
             <div className="col">
              <div className="form-group">
                <h6>Product Stocks</h6>
                <input type="text" name="countInStock" value={formFields.countInStock} onChange={inputChange} />
              </div>
             </div>

            </div>

            <div className="row mb-4">

            <div className="col">
              <div className="form-group">
                <h6>Product Size</h6>
                <input type="text" name="size" value={formFields.size} onChange={inputChange} />
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <h6>Product Size Unit</h6>
                <Select
                  value={sizeUnitVal}
                  onChange={handleChangeSizeUnitVal}
                  displayEmpty
                  inputProps={{'aria-label': 'Without label'}}
                  className="w-100"
                >
                  <MenuItem value=""><em>Select size unit</em></MenuItem>
                  <MenuItem value='ml'>ml</MenuItem>
                  <MenuItem value='ltr'>ltr</MenuItem>
                  <MenuItem value='grams'>grams</MenuItem>
                  <MenuItem value='kg'>kg</MenuItem>
                  <MenuItem value='piece'>piece</MenuItem>
                  <MenuItem value='dozen'>dozen</MenuItem>
                </Select>
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <h6>Is Product Featured</h6>
                <Select
                  value={isFeaturedVal}
                  onChange={handleChangeIsFeaturedVal}
                  displayEmpty
                  inputProps={{'aria-label': 'Without label'}}
                  className="w-100"
                >
                  <MenuItem value={true}>True</MenuItem>
                  <MenuItem value={false}>False</MenuItem>
                </Select>
              </div>
            </div>

            </div>

            {/* Image upload and preview section */}
            
            <div className="row mb-4">
              <div className="col">
                <h6>Product Images</h6>
                <div className="imagesUploadSec">
                  <div className="imgUploadBox d-flex align-items-center">
                    {
                      previews.map((img, index) => (
                        <div className="uploadBox" key={index}>
                          <img />
                          <button className="remove-btn" type="button" onClick={() => removeImage(index)}>
                            <MdClose />
                          </button>
                          </div>
                      ))
                    }
                    <div className="uploadBox">
                      <input type="file" multiple onChange={onChangeFile} />
                      <div className="info">
                        <MdImage />
                        <h5>Images Upload</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button className="btn-blue btn-big btn-lg w-100" type="submit">
              {
                isLoading === true
                ?
                <CircularProgress color="inherit" className="ml-3 loader" />
                :
                <div className="d-flex justify-content-center sbtbtn">
                  <MdCloudUpload className="mr-2"/> Add Product
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

export default ProductAdd