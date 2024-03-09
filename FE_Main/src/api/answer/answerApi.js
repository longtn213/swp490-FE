import callApi from "../callApi"


export function filterAnswer(queryParam, page, size, id) {
    let url = `/sca-result?customerId.equals=${id}&page=${page ? page : 0}&size=${
        size ? size : 100
      }`
    
    //các trường bình thường
    if (queryParam.answerId.value) {
        url += `&id.${queryParam.answerId.operator}=${queryParam.answerId.value}`
    }
    if (queryParam.answerCName.value) {
        url += `&customer.${queryParam.answerCName.operator}=${queryParam.answerCName.value}`
    }
    if (queryParam.answerRepliedBy.value) {
        url += `&repliedBy.${queryParam.answerRepliedBy.operator}=${queryParam.answerRepliedBy.value}`
    }
    if (queryParam.answerStatus.value) {
        url += `&status.${queryParam.answerStatus.operator}=${queryParam.answerStatus.value}`
    }
    if (queryParam.answerAnswerSet.value) {
        url += `&answerSet.${queryParam.answerAnswerSet.operator}=${queryParam.answerAnswerSet.value}`
    }
    if (queryParam.answerSpaServices.value) {
        url += `&spaServices.${queryParam.answerSpaServices.operator}=${queryParam.answerSpaServices.value}`
    }

    const options = {
        method: 'GET'
    }

    return callApi(url, options)
}

export function getAnswerdetail(id) {
    const url = `/sca-result/${id}`

    const options = {
        method: 'GET'
    }

    return callApi(url, options)
}




