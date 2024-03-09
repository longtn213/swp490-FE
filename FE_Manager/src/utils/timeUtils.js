import { getUnixTime } from "date-fns"

export function timestampToString(timestamp) {
  //đầu vào : 1669525200000
  //đầu ra : 27/11/2022 12:00:00
  if (!timestamp) return ''

  var date = new Date(timestamp)

  let timeStr =
    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
    '/' +
    (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +
    '/' +
    date.getFullYear() +
    ' ' +
    (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
    ':' +
    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
    ':' +
    (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())

  return timeStr
}

export function timestampToDatetimeLocal(timestamp) {
  //đầu vào : 1669525200000
  //đầu ra : 27-11-2022T12:00
  if (!timestamp) return ''

  var date = new Date(timestamp)

  let timeStr =
    date.getFullYear() +
    '-' +
    (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +
    '-' +
    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
    'T' +
    (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
    ':' +
    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())

  return timeStr
}

export function datetimeLocalToTimestamp(datetimeLocal) {

  let dateInTimeStamp = Date.parse(datetimeLocal)

    //parse timestamp sang date để còn thực hiện phép tính
    var date = new Date(dateInTimeStamp)

    function addZero(i) {
      if (i < 10) {
        i = '0' + i
      }

      return i
    }

    let year = addZero(date.getUTCFullYear())
    let month = addZero(date.getUTCMonth() + 1)
    let day = addZero(date.getUTCDate())

    let hour = addZero(date.getUTCHours())
    let min = addZero(date.getUTCMinutes())
    let second = addZero(date.getUTCSeconds())

    const dateString = year + '-' + month + '-' + day + 'T' + hour + ':' + min + ':' + second + 'Z'
    
    return dateString
}

export function reformatDateForView(dateFromTextField) {
  // data trả về của TextField dạng date : 2022-11-10T03:19
  // kết quả trả ra : 10/11/2022 03:19
  const dateAndTime = dateFromTextField.split('T')
  const dateElement = dateAndTime[0].split('-')
  const dateReformat = dateElement[2] + '/' + dateElement[1] + '/' + dateElement[0]

  return dateReformat + ' ' + dateAndTime[1]
}

export function timestampToStringQuery(timestamp) {
  //đầu vào : 1669525200000
  //đầu ra : 27/11/2022 12:00:00
  if (!timestamp) return ''

  var date = new Date(timestamp)

  let timeStrQuery =
    date.getFullYear() +
    '-' +
    (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +
    '-' +
    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
    'T' +
    (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
    '%3A' +
    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
    '%3A' +
    (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()) +
    '%2B0700'

  return timeStrQuery
}

export function reformatDateForQuery(dateFromTextField) {
  // data trả về của TextField dạng date : 2022-11-11T19:01
  // kết quả trả ra : 2022-11-11T12%3A01%3A00%2B0700

  //parse date text về timestamp
  let dateInTimeStamp = Date.parse(dateFromTextField)

  //parse timestamp sang date để còn thực hiện phép tính
  var date = new Date(dateInTimeStamp)

  // //trừ 7 tiếng cho match với tgian trong DB
  // date.setHours(date.getHours() - 7);

  //thực hiện phép tính xong thì parse trở lại timestamp
  dateInTimeStamp = Date.parse(date)

  //gọi hàm từ timestamp ra stringQuery
  return timestampToStringQuery(dateInTimeStamp)
}

export function validateDateInput(from, to) {
  console.log('from', from)
  console.log('to', to)
  if (from && to) {
    console.log('errrrrrrrrrrrrrrrrr')
    let fromTimeStamp = Date.parse(from)
    let toTimeStamp = Date.parse(to)
    if (fromTimeStamp.getTime() < toTimeStamp.getTime()) {
      return false
    }
  }

  return true
}

// Dasboard's time utils

export function reformatDateForQueryDashboard(dateFromTextField) {
  // data trả về của TextField dạng date : 2022-11-11T19:01
  // kết quả trả ra : 2022-11-11T12:01:00%2B0700

  //parse date text về timestamp
  let dateInTimeStamp = Date.parse(dateFromTextField)

  //parse timestamp sang date để còn thực hiện phép tính
  var date = new Date(dateInTimeStamp)

  // //trừ 7 tiếng cho match với tgian trong DB
  // date.setHours(date.getHours() - 7);

  //thực hiện phép tính xong thì parse trở lại timestamp
  dateInTimeStamp = Date.parse(date)

  //gọi hàm từ timestamp ra stringQuery
  return timestampToStringQueryDashboard(dateInTimeStamp)
}

function timestampToStringQueryDashboard(timestamp) {
  //đầu vào : 1669525200000
  //đầu ra : 27/11/2022 12:00:00
  if (!timestamp) return ''

  var date = new Date(timestamp)

  let timeStrQuery =
    date.getFullYear() +
    '-' +
    (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +
    '-' +
    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
    'T' +
    (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
    ':' +
    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
    ':' +
    (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()) +
    '%2B0700'

  return timeStrQuery
}

//=========================================================================

export function datetimeToTimestamp (datetime) {
  //parse date text về timestamp
  let dateInTimeStamp = Date.parse(datetime)

  //parse timestamp sang date để còn thực hiện phép tính
  var date = new Date(dateInTimeStamp)

  const timestamp = getUnixTime(date) * 1000

  return timestamp
}

export const convertDurationToTextTime = (time) => {
  //đầu vào : 150
  //đầu ra : 2 giờ 30 phút
  var convertedTime = "";
  if (Math.floor(time / 60) >= 1) {
    convertedTime += String(Math.floor(time / 60)) + " giờ ";
    if (time % 60 !== 0) {
      convertedTime += String(time % 60) + " phút";
    }
  } else {
    convertedTime += String(time) + " phút";
  }

  return convertedTime;
};