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

export function reformatDateForView(dateFromTextField) {
    // data trả về của TextField dạng date : 2022-11-10T03:19
    // kết quả trả ra : 10/11/2022 03:19
    const dateAndTime = dateFromTextField.split('T')
    const dateElement = dateAndTime[0].split('-')
    const dateReformat = dateElement[2] + '/' + dateElement[1] + '/' + dateElement[0]

    return dateReformat + ' ' + dateAndTime[1]
}

function timestampToStringQuery(timestamp) {
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