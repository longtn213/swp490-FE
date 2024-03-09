import callApi from '../callApi'

export function filterfeedback(queryParam, page, size, sortInfo) {
    console.log(sortInfo);
    let url = `/sca-result?statusCode.equals=${sortInfo.statusCode}&page=${page ? page : 0}&size=${size ? size : 500}&sort=createdDate,asc`
  
    //các trường bình thường
    if (queryParam.customer.value) {
      url += `&customer.${queryParam.customer.operator}=${queryParam.customer.value}`
    }
    if (queryParam.repliedBy.value) {
      url += `&repliedBy.${queryParam.repliedBy.operator}=${queryParam.repliedBy.value}`
    }
    if (queryParam.status.value) {
      url += `&status.${queryParam.status.operator}=${queryParam.status.value}`
    }
    if (queryParam.comment.value) {
        url += `&comment.${queryParam.comment.operator}=${queryParam.comment.value}`
    }

    const options = {
        method: 'GET'
    }
  
    return callApi(url, options);
}

export function getAllSCAs (){
    const url = `/sca-result`;

    const options = {
        method: 'GET'
    }
  
    return callApi(url, options);
}
  
export function getSCAById (id){
    const url = `/sca-result/${id}`;

    const options = {
        method: 'GET'
    }
  
    return callApi(url, options);
}

export function submitComment (sca){
    const newSca = Object.assign({}, sca, { ...sca, 
        customer: {id: sca.customer.id},
        repliedBy: {id: sca.repliedBy}
    })
    console.log(sca);
    const url = `/sca-result`;
 
    const options = {
        method: 'POST',
        data: newSca
    }
  
    return callApi(url, options);
}