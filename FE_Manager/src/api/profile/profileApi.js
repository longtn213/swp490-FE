import callApi from "../callApi";
import callApiNotAuth from "../callApiNotAuth";

export function updateProfile(data) {
    const url = '/user/update-info'
  
    const options = {
      method: 'POST',
      data: data
    }
  
    return callApi(url, options);
  
  }

  export function uploadImage(file) {
    const url = `/file/upload-image/avatar`
    console.log(file)
    let formData = new FormData();
    formData.append('file', file, "filename");
  
    const options = {
        method: 'POST',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
    };
  
    return callApiNotAuth(url, options)
  }

