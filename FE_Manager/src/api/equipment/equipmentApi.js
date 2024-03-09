import axios from 'axios'
import callApi from '../callApi'
import callApiNotAuth from '../callApiNotAuth'

// import { reformatDateForQuery, validateDateInput } from '../../utils/timeUtils'

export function filterEquipment(queryParam, page, size, sortInfo) {
  let url = `/equipment-type?sort=${sortInfo.sortBy},${sortInfo.sortDirection}&page=${page ? page : 0}&size=${size ? size : 10}`

  //các trường bình thường
  if (queryParam.equipmentName.value) {
    url += `&name.${queryParam.equipmentName.operator}=${queryParam.equipmentName.value}`
  }
  if (queryParam.equipmentCode.value) {
    url += `&code.${queryParam.equipmentCode.operator}=${queryParam.equipmentCode.value}`
  }
  if (queryParam.equipmentDesc.value) {
    url += `&description.${queryParam.equipmentDesc.operator}=${queryParam.equipmentDesc.value}`
  }

  //3 cái này chưa có trong form search
  //   queryParam.cancelNote
  //   queryParam.canceledReason
  //   queryParam.note

  //3 cái này ko biết từ đâu ra
  // cancelTime
  // cancelBy
  // branchCode

  const options = {
    method: 'GET'
  }

  return callApi(url, options)
}

export function deleteEquipment(deleteId) {
    let url = `/equipment-type/delete`;

  const options = {
      method: 'POST',
      data: deleteId
  }

  return callApi(url, options);
}

export function getListEquipment() {
  let url = `/equipment-type`;

  const options = {
      method: 'GET',
  }

  return callApi(url, options);
}

export function addEquipment(data) {
  let url = `/equipment-type`;

  const options = {
      method: 'POST',
      data: data
  }

  return callApi(url, options);
}

export function editEquipment(data) {
  let url = `/equipment-type`;

  const options = {
      method: 'POST',
      data: data
  }

  return callApi(url, options);
}
