export const postProductData = async (url, data) => {
  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error posting product:", error);
    throw error;
  }
};

useEffect(() => {
    if(files.length === 0) return;

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

   const updatedPreviews = previews.filter((_, i) => i !==index);
   setPreviews(updatedPreviews);
  };

  <div className='row mb-4'>
            <div className='col'>
              <h6>Product Images</h6>
              <div className='imagesUploadSec'>
                <div className='imgUploadBox d-flex align-items-center'>
                  {previews.map((img, index) => (
                    <div className='uploadBox' key={index}>
                      <img src={img} alt='preview' className='w-100' />
                      <button className='remove-btn' onClick={() => removeImage(index)}>
                      <MdClose />
                      </button>
                    </div>  
                  ))
                  }
                  <div className='uploadBox'>
                    <input type="file" multiple onChange={onChangeFile} />
                    <div className='info'>
                      <MdImage />
                      <h5>Images Upload</h5>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>


export const postProductData = async (url, data) => {
  try {
    const response = await axios.post(import.meta.env.VITE_BASE_URL + url, data); // <-- No headers here
    return response.data;
  } catch (error) {
    console.log("Error posting product:", error);
    throw error;
  }
};          