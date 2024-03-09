
import callApiNotAuth from "../callApiNotAuth"

export function filterService(queryParam, page, size) {
    let url = `/service?isActive.equals=true&page=${page ? page : 0}&size=${size ? size : 200}`

    if (queryParam.sort.value) {
        url += `&sort=${queryParam.sort.value}`
    }

    //các trường bình thường
    if (queryParam.serviceName.value) {
        url += `&name.${queryParam.serviceName.operator}=${queryParam.serviceName.value}`
    }
    if (queryParam.serviceCategory.value) {
        url += `&categoryCode.${queryParam.serviceCategory.operator}=${queryParam.serviceCategory.value}`
    }
    if (queryParam.currentPriceGreaterThan.value) {
        url += `&currentPrice.${queryParam.currentPriceGreaterThan.operator}=${queryParam.currentPriceGreaterThan.value}`
    }
    if (queryParam.currentPriceLowerThan.value) {
        url += `&currentPrice.${queryParam.currentPriceLowerThan.operator}=${queryParam.currentPriceLowerThan.value}`
    }

    console.log(url);

    const options = {
        method: 'GET'
    }

    return callApiNotAuth(url, options)
}
