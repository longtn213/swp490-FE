import callApi from "../callApi"
import callApiNotAuth from "../callApiNotAuth"

export function filterSCA(queryParam, page, size) {
    let url = `/sca-form/?page=${page ? page : 0}&size=${size ? size : 10}`

    //các trường bình thường
    if (queryParam.scaId.value) {
        url += `&id.${queryParam.scaId.operator}=${queryParam.scaId.value}`
    }
    if (queryParam.scaName.value) {
        url += `&name.${queryParam.scaName.operator}=${queryParam.scaName.value}`
    }
    if (queryParam.scaDesc.value) {
        url += `&description.${queryParam.scaDesc.operator}=${queryParam.scaDesc.value}`
    }
    if (queryParam.scaQuestion.value) {
        url += `&question.${queryParam.scaQuestion.operator}=${queryParam.scaQuestion.value}`
    }

    const options = {
        method: 'GET'
    }
    console.log("data get sca")
    return callApi(url, options)
}

export function getSCAdetail(id) {
    const url = `/sca-form/${id}`

    const options = {
        method: 'GET'
    }

    return callApi(url, options)
}

export function submitSCA(userId, answer, question, newFile) {
    
    const url = `/sca-result`

    const data = {
        customer: {
            id: userId
        },
        answerSet: [
            {
                textAnswer: answer,
                textQuestion: question
            }
        ],
        files: [
            ...newFile
        ]
    };

    const options = {
        method: 'POST',
        data: JSON.stringify(data).replaceAll("\\", "")
    };

    return callApi(url, options)
}

export function uploadImage(file) {
    const url = `/file/upload-image/sca-result`

    let formData = new FormData();
    formData.append('file', file, "filename");

    const options = {
        method: 'POST',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
    };

    return callApiNotAuth(url, options)
}



