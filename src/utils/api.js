import axios from 'axios';

export const fetchDataFromApi = async (url) => {
    try {
        const {data} = await axios.get(import.meta.env.VITE_BASE_URL + url);

        return data;
    } catch (error) {
        console.error(error);
        
        return error;
    }
}

export const postData = async (url, formData) => {
    const response = await axios.post(import.meta.env.VITE_BASE_URL + url, formData);
  
    return response.formData;
  };

  export const postProductData = async (url, data) => {

    const response = await axios.post(import.meta.env.VITE_BASE_URL + url, data);

    return response.data;
  };

export const editData = async (url, updatedData) => {
    const response = await axios.put(import.meta.env.VITE_BASE_URL+ url, updatedData)

    return response.data;
}

export const editProductData = async (url, formData) => {
  const response = await axios.put(
    import.meta.env.VITE_BASE_URL + url,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const deleteData = async (url) => {
    const {res} = await axios.delete(import.meta.env.VITE_BASE_URL+url)

    return res;
}