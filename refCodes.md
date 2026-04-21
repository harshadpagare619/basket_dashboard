router.post('/create', async (req, res) => {
    const brand = await Brand.findById(req.body.brand);
    if (!brand) return res.status(404).send('Invalid brand');

    const category = await Category.findById(req.body.category);
    if (!category) return res.status(404).send('Invalid category');

    const subCategory = await SubCategory.findById(req.body.subCategory);
    if (!subCategory) return res.status(404).send('Invalid SubCategory');

    // Step 1: Upload images to Cloudinary and get URLs
    let imageLinks = [];

    if (req.body.images && req.body.images.length > 0) {
        try {
            const uploadPromises = req.body.images.map((base64Img) =>
                cloudinary.uploader.upload(base64Img, {
                    folder: 'products'
                })
            );

            const uploadResults = await Promise.all(uploadPromises);
            imageLinks = uploadResults.map(result => result.secure_url);
        } catch (err) {
            return res.status(500).send('Image upload failed');
        }
    } else {
        return res.status(400).send('No images provided');
    }

    // Step 2: Save the product
    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        brand: req.body.brand,
        category: req.body.category,
        subCategory: req.body.subCategory,
        price: req.body.price,
        newPrice: req.body.newPrice,
        countInStock: req.body.countInStock,
        size: req.body.size,
        sizeUnit: req.body.sizeUnit,
        isFeatured: req.body.isFeatured,
        images: imageLinks // 👈 Add cloudinary image links here
    });

    product = await product.save();

    if (!product) {
        return res.status(500).json({
            success: false,
            message: 'The product cannot be created'
        });
    }

    res.status(201).json(product);
});


import React, { useState, useEffect, useContext } from 'react';
import { MyContext } from '../../context/MyProvider';
import { fetchDataFromApi, postProductData } from '../../utils/api';
import { Button, Select, MenuItem, CircularProgress, Breadcrumbs } from '@mui/material';
import { MdCloudUpload, MdImage, MdClose } from 'react-icons/md';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StyledBreadcrumb from '../../components/StyledBreadcrumb'; // Assumes this is your custom breadcrumb component

function ProductAdd() {
  const context = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(false);
  const [brandData, setBrandData] = useState([]);
  const [catData, setCatData] = useState([]);
  const [subCatData, setSubCatData] = useState([]);
  const [filteredSubCatData, setFilteredSubCatData] = useState([]);
  const [brandVal, setBrandVal] = useState('');
  const [categoryVal, setCategoryVal] = useState('');
  const [subCategoryVal, setSubCategoryVal] = useState('');
  const [sizeUnitVal, setSizeUnitVal] = useState('');
  const [isFeaturedVal, setIsFeaturedVal] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [formFields, setFormFields] = useState({
    name: '',
    description: '',
    brand: '',
    category: '',
    subCategory: '',
    price: '',
    newPrice: '',
    countInStock: '',
    size: '',
    sizeUnit: '',
    isFeatured: false
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    context.setProgress(20);
    fetchDataFromApi('/api/brands').then((res) => setBrandData(res));
    fetchDataFromApi('/api/category').then((res) => setCatData(res));
    fetchDataFromApi('/api/subcategory').then((res) => {
      setSubCatData(res);
      context.setProgress(100);
    });
  }, []);

  useEffect(() => {
    if (files.length === 0) return;
    const objectUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);
    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  const onChangeFile = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const removeImage = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setPreviews(updatedPreviews);
  };

  const inputChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value });
  };

  const handleChangeBrand = (e) => {
    const value = e.target.value;
    setBrandVal(value);
    setFormFields({ ...formFields, brand: value });
  };

  const handleChangeCategory = (e) => {
    const value = e.target.value;
    setCategoryVal(value);
    setFormFields({ ...formFields, category: value });
    const filtered = subCatData.filter((sub) => sub.category.id === value);
    setFilteredSubCatData(filtered);
  };

  const handleChangeSubCategory = (e) => {
    const value = e.target.value;
    setSubCategoryVal(value);
    setFormFields({ ...formFields, subCategory: value });
  };

  const handleChangeSizeUnitVal = (e) => {
    const value = e.target.value;
    setSizeUnitVal(value);
    setFormFields({ ...formFields, sizeUnit: value });
  };

  const handleChangeIsFeaturedVal = (e) => {
    const value = e.target.value === 'true' || e.target.value === true;
    setIsFeaturedVal(value);
    setFormFields({ ...formFields, isFeatured: value });
  };

  const addProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    context.setProgress(20);

    const formdata = new FormData();
    Object.entries(formFields).forEach(([key, value]) => {
      formdata.append(key, value);
    });

    files.forEach((file) => {
      formdata.append('images', file); // backend expects 'images' as the field name
    });

    try {
      const res = await postProductData(`/api/products/create`, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      context.setProgress(100);
      context.setAlertBox({
        open: true,
        color: 'success',
        msg: 'Product is created'
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Error uploading product:', error);
      context.setProgress(100);
      context.setAlertBox({
        open: true,
        color: 'error',
        msg: 'Failed to create product'
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="right-content w-100">
      <div className="card shadow border-0 w-100 flex-row p-4">
        <h5>Product Upload</h5>
        <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
          <StyledBreadcrumb component="a" href="#" label="Dashboard" icon={<HomeIcon fontSize="small" />} />
          <StyledBreadcrumb component="a" href="#" label="Products" deleteIcon={<ExpandMoreIcon />} />
          <StyledBreadcrumb label="Product Upload" />
        </Breadcrumbs>
      </div>

      <form className="form" onSubmit={addProduct}>
        {/* Form Sections like before — name, brand, category, subcategory, etc */}
        {/* I'm skipping the repeated JSX from your post here to keep it concise */}

        {/* Image Upload Section */}
        <div className="row mb-4">
          <div className="col">
            <h6>Product Images</h6>
            <div className="imagesUploadSec">
              <div className="imgUploadBox d-flex align-items-center">
                {previews.map((img, index) => (
                  <div className="uploadBox" key={index}>
                    <img src={img} alt="preview" className="w-100" />
                    <button className="remove-btn" type="button" onClick={() => removeImage(index)}>
                      <MdClose />
                    </button>
                  </div>
                ))}
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

        {/* Submit Button */}
        <Button className="btn-blue btn-big btn-lg w-100" type="submit">
          {isLoading ? (
            <CircularProgress color="inherit" className="ml-3 loader" />
          ) : (
            <div className="d-flex justify-content-center sbtbtn">
              <MdCloudUpload className="mr-2" />
              Add Product
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}

export default ProductAdd;





const addProduct = (e) => {
  e.preventDefault();
  setIsLoading(true);
  context.setProgress(20);

  const formdata = new FormData();

  formdata.append('name', formFields.name);
  formdata.append('description', formFields.description);
  formdata.append('brand', formFields.brand);
  formdata.append('category', formFields.category);
  formdata.append('subCategory', formFields.subCategory);
  formdata.append('price', formFields.price);
  formdata.append('newPrice', formFields.newPrice);
  formdata.append('countInStock', formFields.countInStock);
  formdata.append('size', formFields.size);
  formdata.append('sizeUnit', formFields.sizeUnit);
  formdata.append('isFeatured', formFields.isFeatured);

  files.forEach((file) => {
    formdata.append('images', file);
  });

  postProductData(`/api/products/create`, formdata)
    .then((res) => {
      context.setProgress(100);
      context.setAlertBox({
        open: true,
        color: 'success',
        msg: 'Product is created',
      });
      setIsLoading(false);

      // reset form
      setFormFields({
        name: '',
        description: '',
        brand: '',
        category: '',
        subCategory: '',
        price: '',
        newPrice: '',
        countInStock: '',
        size: '',
        sizeUnit: '',
        isFeatured: false,
      });
      setBrandVal('');
      setCategoryVal('');
      setSubCategoryVal('');
      setSizeUnitVal('');
      setIsFeaturedVal('');
      setFiles([]);
      setPreviews([]);
    });
};


const [formFields, setFormFields] = useState({
    name: '',
    description: '',
    brand: '',
    category: '',
    subCategory: '',
    price: '',
    newPrice: '',
    countInStock: '',
    size: '',
    sizeUnit: '',
    isFeatured: false
  })


  const addProdict = async (e) => {
    e.prevetnDefault();

    const formdata = new FormData();

    formdata.append('name', formFields.name);
    formdata.append('description', formFields.description);
    formdata.append('brand', formFields.brand);
    formdata.append('category', formFields.category);
    formdata.append('subCategory', formFields.subCategory);
    formdata.append('price', formFields.price);
    formdata.append('newPrice', formFields.newPrice);
    formdata.append('countInStock', formFields.countInStock);
    formdata.append('size', formFields.size);
    formdata.append('sizeUnit', formFields.sizeUnit);
    formdata.append('isFeatured', formFields.isFeatured);

    await axios.post(`${import.meta.env.VITE_BASE_URL}/api/products/create`, formdata);

  }

  

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  //image preview
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


const addProduct = async (e) => {
  files.forEach((file) => {
      formdata.append('images', file);
    });
}

UI compoenent - 

<div className='row mb-4'>
            <div className='col'>
              <h6>Product Images</h6>
              <div className='imagesUploadSec'>
                <div className='imgUploadBox d-flex align-items-center'>
                  {previews.map((img, index) => (
                    <div className='uploadBox' key={index}>
                      <img src={img} alt='preview' className='w-100' />
                      <button className='remove-btn' type="button" onClick={() => removeImage(index)}>
                      <MdClose />
                      </button>
                    </div>  
                  ))
                  }
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


--------- edit product page -------------------

const [files, setFiles] = useState([]); // new files (File objects)
const [previews, setPreviews] = useState([]); // local previews

const [existingImages, setExistingImages] = useState([]); // image URLs from backend

setExistingImages(product.images); // assuming product.images is an array of URLs

const removeImage = (index, type) => {
  if (type === 'existing') {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);
  } else if (type === 'new') {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setPreviews(updatedPreviews);
  }
};

🖼 Modified UI Rendering
In the upload box section:

{existingImages.map((img, index) => (
  <div className='uploadBox' key={`existing-${index}`}>
    <img src={img} alt='preview' className='w-100' />
    <button className='remove-btn' type="button" onClick={() => removeImage(index, 'existing')}>
      <MdClose />
    </button>
  </div>  
))}

{previews.map((img, index) => (
  <div className='uploadBox' key={`new-${index}`}>
    <img src={img} alt='preview' className='w-100' />
    <button className='remove-btn' type="button" onClick={() => removeImage(index, 'new')}>
      <MdClose />
    </button>
  </div>  
))}

📤 Submitting FormData on Update
Here's how to send data to backend:

const formdata = new FormData();

// Append all form fields
Object.entries(formFields).forEach(([key, value]) => {
  formdata.append(key, value);
});

// Append existing images (as URLs)
existingImages.forEach(url => formdata.append('existingImages', url));

// Append new files
files.forEach((file) => {
  formdata.append('images', file);
});

// Submit with axios
await axios.put(`${BASE_URL}/api/products/update/${productId}`, formdata);