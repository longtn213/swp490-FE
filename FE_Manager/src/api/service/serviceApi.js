import callApi from '../callApi'
import callApiNotAuth from "../callApiNotAuth";

export function filterService(queryParam, page, size, sortInfo) {
  let url = `/service?sort=${sortInfo.sortBy},${sortInfo.sortDirection}&page=${page ? page : 0}&size=${size ? size : 10}`

  //các trường bình thường
  if (queryParam.serviceName.value) {
    url += `&name.${queryParam.serviceName.operator}=${queryParam.serviceName.value}`
  }
  if (queryParam.serviceDesc.value) {
    url += `&description.${queryParam.serviceDesc.operator}=${queryParam.serviceDesc.value}`
  }
  if (queryParam.serviceCategory.value) {
    url += `&categoryCode.${queryParam.serviceCategory.operator}=${queryParam.serviceCategory.value}`
  }
  if (queryParam.serviceEquipment.value) {
    url += `&equipmentCode.${queryParam.serviceEquipment.operator}=${queryParam.serviceEquipment.value}`
  }

  const options = {
    method: 'GET'
  }

  return callApiNotAuth(url, options)
}


export function getAllServices() {
  let url = `/service?size=200`

  const options = {
    method: 'GET'
  }

  return callApiNotAuth(url, options)

}

export function addService(data) {
  let url = `/service`;

  const options = {
      method: 'POST',
      data: data
  }

  return callApi(url, options);
}

export function editService(data) {
  let url = `/service`;

  const options = {
      method: 'POST',
      data: data
  }

  console.log(data)

  return callApi(url, options);
}

export function getNotAssignCategorySetvice() {
  let url = `/service/not-assign-category`;

  const options = {
      method: 'GET',
  }

  return callApi(url, options);
}

export function uploadImage(file) {
  const url = `/file/upload-image/service`
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
