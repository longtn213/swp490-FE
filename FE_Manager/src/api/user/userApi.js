import callApi from '../callApi'
import callApiNotAuth from '../callApiNotAuth'

export function filterUser(queryParam, page, size, sortInfo) {
  let url = `/user?sort=${sortInfo.sortBy},${sortInfo.sortDirection}&page=${page ? page : 0}&size=${size ? size : 10}`

  if (queryParam.fullName.value) {
    url += `&fullName.${queryParam.fullName.operator}=${queryParam.fullName.value}`
  }
  if (queryParam.phoneNumber.value) {
    url += `&phoneNumber.${queryParam.phoneNumber.operator}=${queryParam.phoneNumber.value}`
  }
  if (queryParam.username.value) {
    url += `&username.${queryParam.username.operator}=${queryParam.username.value}`
  }
  if (queryParam.email.value) {
    url += `&email.${queryParam.email.operator}=${queryParam.email.value}`
  }
  if (queryParam.role.value) {
    url += `&roleCode.${queryParam.role.operator}=${queryParam.role.value}`
  }

  const options = {
    method: 'GET'
  }

  return callApi(url, options)
}

export function getListUser() {
  let url = `/user?size=1000`

  const options = {
    method: 'GET'
  }

  return callApi(url, options)
}

export function getListUserByRole(roleCode) {
  let url = `/user?size=1000&roleCode.contains=${roleCode}`

  const options = {
    method: 'GET'
  }

  return callApi(url, options)
}

export function createUser(data) {
  let url = `/user/create`

  const options = {
    method: 'POST',
    data: data
  }

  return callApi(url, options)
}


export function forgotPassword(username) {
  let url = `/user/forgot-password`

  const options = {
    method: 'POST',
    data: {username: username}
  }

  return callApiNotAuth(url, options)
}