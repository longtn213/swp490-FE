import callApi from '../callApi'
import { reformatDateForQueryDashboard } from '../../utils/timeUtils'
import axios from 'axios'
import { BASE_URL } from 'public/constant'
import callApiNotAuth from "../callApiNotAuth";

export function getAMScorecardData(startDate, endDate, branchId) {
  let url = `/dashboard/appt-scorecard?startTime=${reformatDateForQueryDashboard(
    startDate
  )}&endTime=${reformatDateForQueryDashboard(endDate)}&branchId=${branchId}`

  const options = {
    method: 'GET'
  }

  return callApi(url, options)
}

export function getRevenueReport(startDate, endDate, branchId) {
  let url = `/dashboard/revenue-report?startTime=${reformatDateForQueryDashboard(
    startDate
  )}&endTime=${reformatDateForQueryDashboard(endDate)}&branchId=${branchId}`

  const options = {
    method: 'GET'
  }
  console.log("url",url)

  return callApi(url, options)
}

export function getProductivityInDay(branchId) {
  let url = `/dashboard/productivity-in-day?&branchId=${branchId}`

  const options = {
    method: 'GET'
  }

  return callApi(url, options)
}

export const downloadXLSFile = async (urlAfter, fileName, startDate, endDate, branchId) => {
  let url =
    BASE_URL +
    `${urlAfter}?startTime=${reformatDateForQueryDashboard(startDate)}&endTime=${reformatDateForQueryDashboard(
      endDate
    )}`

  var data

  if (branchId) {
    data = [Number(branchId)]
  } else {
    data = []
  }

  axios.post(url, data, { headers: {
    Authorization: localStorage.getItem('access_token')
  }, responseType: 'blob' }).then(function (response) {

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      // IE variant
      window.navigator.msSaveOrOpenBlob(
        new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
        `${fileName}.xlsx`
      )
    } else {
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      )
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${fileName}.xlsx`)
      document.body.appendChild(link)
      link.click()
    }
  })
}

export function getAppointmentPerformance(period, startTime, endTime, branchId) {
  let url = `/dashboard/appointment-performance?period=${period}&branchId=${branchId}&startTime=${startTime}&endTime=${endTime}`

  const options = {
    method: 'GET'
  }

  return callApi(url, options)
}
