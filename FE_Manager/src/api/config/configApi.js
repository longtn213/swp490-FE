import callApi from '../callApi'
import callApiNotAuth from '../callApiNotAuth'

export function filterConfig(queryParam, page, size) {
  let url = `/config?page=${page ? page : 0}&size=200`

  if (queryParam.id.value) {
    url += `&id.${queryParam.id.operator}=${queryParam.id.value}`
  }
  if (queryParam.configKey.value) {
    url += `&configKey.${queryParam.configKey.operator}=${queryParam.configKey.value}`
  }
  if (queryParam.configValue.value) {
    url += `&configValue.${queryParam.configValue.operator}=${queryParam.configValue.value}`
  }
  if (queryParam.configDesc.value) {
    url += `&configDesc.${queryParam.configDesc.operator}=${queryParam.configDesc.value}`
  }
  if (queryParam.branchName.value) {
    url += `&branchName.${queryParam.branchName.operator}=${queryParam.branchName.value}`
  }

  console.log(url)

  const options = {
    method: 'GET'
  }

  return callApiNotAuth(url, options)
}

export function getListConfig() {
  let url = `/config?size=200`

  const options = {
    method: 'GET'
  }

  return callApiNotAuth(url, options)
}

export function getListConfigbyBranchCode(branchCode) {
  let url = `/config?branchCode.contains=${branchCode}`

    const options = {
      method: 'GET'
    }

    return callApiNotAuth(url, options)
}

export function getConfigDetail(id) {
  const url = `/config/${id}`

  const options = {
    method: 'GET'
  }

  return callApi(url, options)
}

export function editConfig(data) {
  const url = `/config`

  const options = {
    method: 'POST',
    data: data
  }

  return callApi(url, options)
}
