import { GOONG_API_KEY, TOKEN } from 'public/constant'
import callApi from '../callApi'
import callApiNotAuth from '../callApiNotAuth'

export function filterBranch(queryParam, page, size) {
  let url = `/branch?page=${page ? page : 0}&size=${size ? size : 10}`

  if (queryParam.name.value) {
    url += `&name.${queryParam.name.operator}=${queryParam.name.value}`
  }
  if (queryParam.detailAddress.value) {
    url += `&detailAddress.${queryParam.detailAddress.operator}=${queryParam.detailAddress.value}`
  }
  if (queryParam.hotline.value) {
    url += `&hotline.${queryParam.hotline.operator}=${queryParam.hotline.value}`
  }

  const options = {
    method: 'GET'
  }

  return callApi(url, options)
}

export function getAllBranch() {
  let url = `/branch`

  const options = {
    method: 'GET'
  }

  return callApiNotAuth(url, options)
}

export function addBranch(data) {
  let url = `/branch`

  const options = {
    method: 'POST',
    data: data
  }

  return callApi(url, options)
}

export function editBranch(data) {
    let url = `/branch`

    const options = {
      method: 'POST',
      data: data
    }

    return callApi(url, options)
  }

export function getListDivision(divisionId) {
  let url = `/location/get_child_division_list?division_id=${divisionId}`

  const options = {
    method: 'GET',
  }

  return callApi(url, options)
}

export function getAutocompletePlaces(input) {
  let url = `https://rsapi.goong.io/Place/AutoComplete?api_key=${GOONG_API_KEY}&input=${encodeURIComponent(input)}`

  const options = {
    method: 'GET'
  }

  return callApi(url, options)
}

export function getPlaceLatLong(placeId) {
  let url = `https://rsapi.goong.io/Place/Detail?api_key=${GOONG_API_KEY}&place_id=${encodeURIComponent(placeId)}`

  const options = {
    method: 'GET'
  }

  return callApi(url, options)
}
