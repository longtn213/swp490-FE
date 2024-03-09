import callApi from '../callApi'
import callApiNotAuth from "../callApiNotAuth";

export function filterCategory(queryParam, page, size){
    let url = `/category?page=${page ? page : 0}&size=${size ? size : 10}`

    if(queryParam.name.value){
        url += `&name.${queryParam.name.operator}=${queryParam.name.value}`
    }
    if(queryParam.code.value){
        url += `&code.${queryParam.code.operator}=${queryParam.code.value}`
    }
    if(queryParam.description.value){
        url += `&description.${queryParam.description.operator}=${queryParam.description.value}`
    }

    const options = {
        method: 'GET'
      }

      return callApiNotAuth(url, options)
}

export function getListCategory() {
    let url = `/category`;

    const options = {
        method: 'GET',
    }

    return callApiNotAuth(url, options);
  }

  export function getCategory(id) {
    let url = `/category/${id}`;

    const options = {
        method: 'GET',
    }

    return callApiNotAuth(url, options);
  }

export function addCategory(data) {
  let url = `/category`;

  const options = {
      method: 'POST',
      data: data
  }

  return callApi(url, options);
}

export function deleteCategory(deleteId) {
    let url = `/category/delete`;

  const options = {
      method: 'POST',
      data: deleteId
  }

  return callApi(url, options);
}

export function editCategory(data) {
    let url = `/category`;

    const options = {
        method: 'POST',
        data: data
    }

    return callApi(url, options);
  }

