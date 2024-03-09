import callApi from '../callApi'
import { reformatDateForQuery, validateDateInput } from '../../utils/timeUtils'
import callApiNotAuth from '../callApiNotAuth'

export function filterAppointmentMaster(queryParam, page, size, sortInfo) {
  let url = `/appointment-master?sort=${sortInfo.sortBy},${sortInfo.sortDirection}&page=${page ? page : 0}&size=${
    size ? size : 10
  }`

  //các trường thời gian
  if (queryParam.actualStartTime.value.from) {
    url += `&actualStartTime.${queryParam.actualStartTime.operator[0]}=${reformatDateForQuery(
      queryParam.actualStartTime.value.from
    )}`
  }
  if (queryParam.actualStartTime.value.to) {
    url += `&actualStartTime.${queryParam.actualStartTime.operator[1]}=${reformatDateForQuery(
      queryParam.actualStartTime.value.to
    )}`
  }
  if (queryParam.actualEndTime.value.from) {
    url += `&actualEndTime.${queryParam.actualEndTime.operator[0]}=${reformatDateForQuery(
      queryParam.actualEndTime.value.from
    )}`
  }
  if (queryParam.actualEndTime.value.to) {
    url += `&actualEndTime.${queryParam.actualEndTime.operator[1]}=${reformatDateForQuery(
      queryParam.actualEndTime.value.to
    )}`
  }
  if (queryParam.cancelTime.value.from) {
    url += `&cancelTime.${queryParam.cancelTime.operator[0]}=${reformatDateForQuery(
      queryParam.cancelTime.value.from
    )}`
  }
  if (queryParam.cancelTime.value.to) {
    url += `&cancelTime.${queryParam.cancelTime.operator[1]}=${reformatDateForQuery(
      queryParam.cancelTime.value.to
    )}`
  }
  if (queryParam.expectedStartTime.value.from) {
    url += `&expectedStartTime.${queryParam.expectedStartTime.operator[0]}=${reformatDateForQuery(
      queryParam.expectedStartTime.value.from
    )}`
  }
  if (queryParam.expectedStartTime.value.to) {
    url += `&expectedStartTime.${queryParam.expectedStartTime.operator[1]}=${reformatDateForQuery(
      queryParam.expectedStartTime.value.to
    )}`
  }
  if (queryParam.expectedEndTime.value.from) {
    url += `&expectedEndTime.${queryParam.expectedEndTime.operator[0]}=${reformatDateForQuery(
      queryParam.expectedEndTime.value.from
    )}`
  }
  if (queryParam.expectedEndTime.value.to) {
    url += `&expectedEndTime.${queryParam.expectedEndTime.operator[1]}=${reformatDateForQuery(
      queryParam.expectedEndTime.value.to
    )}`
  }
  if (queryParam.createdDate.value.from) {
    url += `&createdDate.${queryParam.createdDate.operator[0]}=${reformatDateForQuery(
      queryParam.createdDate.value.from
    )}`
  }
  if (queryParam.createdDate.value.to) {
    url += `&createdDate.${queryParam.createdDate.operator[1]}=${reformatDateForQuery(queryParam.createdDate.value.to)}`
  }
  if (queryParam.lastModifiedDate.value.from) {
    url += `&lastModifiedDate.${queryParam.lastModifiedDate.operator[0]}=${reformatDateForQuery(
      queryParam.lastModifiedDate.value.from
    )}`
  }
  if (queryParam.lastModifiedDate.value.to) {
    url += `&lastModifiedDate.${queryParam.lastModifiedDate.operator[1]}=${reformatDateForQuery(
      queryParam.lastModifiedDate.value.to
    )}`
  }

  //các trường bình thường
  if (queryParam.customerFullName.value) {
    url += `&customerName.${queryParam.customerFullName.operator}=${queryParam.customerFullName.value}`
  }
  if (queryParam.customerPhoneNumber.value) {
    url += `&customerPhoneNumber.${queryParam.customerPhoneNumber.operator}=${queryParam.customerPhoneNumber.value}`
  }
  if (queryParam.statusName.value) {
    url += `&statusCode.${queryParam.statusName.operator}=${queryParam.statusName.value}`
  }
  if (queryParam.overdueStatus.value) {
    url += `&overdueStatus.${queryParam.overdueStatus.operator}=${queryParam.overdueStatus.value}`
  }
  if (queryParam.total.value) {
    url += `&total.${queryParam.total.operator}=${queryParam.total.value}`
  }
  if (queryParam.payAmount.value) {
    url += `&payAmount.${queryParam.payAmount.operator}=${queryParam.payAmount.value}`
  }

  //3 cái này chưa có trong form search
  //   queryParam.cancelNote
  //   queryParam.canceledReason
  //   queryParam.note

  //3 cái này ko biết từ đâu ra
  // cancelTime
  // cancelBy
  // branchCode

  if (queryParam.createdBy.value) {
    url += `&createdBy.${queryParam.createdBy.operator}=${queryParam.createdBy.value}`
  }
  if (queryParam.lastModifiedBy.value) {
    url += `&lastModifiedBy.${queryParam.lastModifiedBy.operator}=${queryParam.lastModifiedBy.value}`
  }

  const options = {
    method: 'GET'
  }

  return callApi(url, options)
}

export function verifyAppointmentMaster(props) {
  const url = `/appointment-master/confirm-appointment`
  const req = []
  props.forEach(item => {
    item = { ...item, apptMasterId: item.id, canceledReason: { ['id']: item.canceledReason } }
    req.push(item)
  })

  const options = {
    method: 'POST',
    data: JSON.stringify(req)
  }

  return callApi(url, options)
}

export function cancelAppointmentMaster(props) {
  const url = `/appointment-master/cancel`
  const req = []
  props.forEach(item => {
    let itemTemp = { id: item.id, canceledReason: { ['id']: item.canceledReason }, note: item.note ? item.note : '' }
    req.push(itemTemp)
  })

  const options = {
    method: 'POST',
    data: JSON.stringify(req)
  }

  return callApi(url, options)
}

export function getAppointmentMasterDetail(id) {
  const url = `/appointment-master/${id}`

  const options = {
    method: 'GET'
  }

  return callApi(url, options)
}

// Phần này là tạm thời thôi nhé

export function checkinAppointmentMaster(data) {
  const url = `/appointment-master/${data.id}/checkin`

  const options = {
    method: 'POST',
    data: data
  }

  return callApi(url, options)
}

export function checkoutAppointmentMaster(data) {
  const url = `/appointment-master/${data.id}/checkout`
  console.log(data)

  const options = {
    method: 'POST',
    data: data
  }

  return callApi(url, options)
}

export function cancelAppointmentService(data) {
  const url = `/appointment-service/cancel`

  const options = {
    method: 'POST',
    data: data
  }

  return callApi(url, options)
}

export function getAvailableSpecialist(startTime, endTime, serviceId, branchId) {
  const url = `/user/available-specialist?startTime=${startTime}&endTime=${endTime}&serviceId=${serviceId}&branchId=${branchId}`

  const options = {
    method: 'GET'
  }

  return callApi(url, options)
}

export function uploadImage(file) {
  const url = `/file/upload-image/invoice`
  console.log(file)
  let formData = new FormData()
  formData.append('file', file, 'filename')

  const options = {
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }

  return callApiNotAuth(url, options)
}

export function getTimestamps(data) {
  const url = `/appointment-tracking/available-time`

  const options = {
    method: 'POST',
    data: data
  }

  return callApiNotAuth(url, options)
}

export function booking(data) {
  const url = `/appointment-master`

  const options = {
    method: 'POST',
    data: data
  }

  return callApiNotAuth(url, options)
}
