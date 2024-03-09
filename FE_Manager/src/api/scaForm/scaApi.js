import callApi from '../callApi'

// import { reformatDateForQuery, validateDateInput } from '../../utils/timeUtils'

export function filterSCA(queryParam, page, size) {
  let url = `/equipment-type?page=${page ? page : 0}&size=${size ? size : 10}`

  //các trường bình thường
  if (queryParam.scaName.value) {
    url += `&name.${queryParam.scaName.operator}=${queryParam.scaName.value}`
  }
  if (queryParam.scaCode.value) {
    url += `&code.${queryParam.scaCode.operator}=${queryParam.scaCode.value}`
  }
  if (queryParam.scaDesc.value) {
    url += `&description.${queryParam.scaDesc.operator}=${queryParam.scaDesc.value}`
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

export function getListSca() {
  let url = `/sca-form`

  const options = {
    method: 'GET'
  }

  return callApi(url, options)
}

export function addSca(data) {
  let url = `/sca-form`

  const options = {
    method: 'POST',
    data: data
  }

  return callApi(url, options)
}

export function editSca(data) {
  let url = `/sca-form`

  const options = {
    method: 'POST',
    data: data
  }

  console.log(data)

  return callApi(url, options)
}

export function deleteQuestion(Id) {
  let url = `/sca-question/delete/${Id}`

  const options = {
      method: 'POST',
      data: Id
  }

  return callApi(url, options);
}


export function deleteOption(deleteId) {
  let url = `/option/delete`

  const options = {
      method: 'POST',
      data: deleteId
  }

  return callApi(url, options);
}

export function addOption(newOpt) {
  let url = `/option/create`;
  console.log(newOpt)
  
  const options = {
      method: 'POST',
      data: newOpt
  }

  return callApi(url, options);
}