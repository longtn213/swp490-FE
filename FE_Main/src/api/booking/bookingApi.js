import callApiNotAuth from "../callApiNotAuth";
import callApi from "../callApi"

export function booking(data) {
    let url = `/appointment-master`;

    const options = {
        method: 'POST',
        data: data
    }

    return callApiNotAuth(url, options);
}

export function getListConfig(branchCode) {
    let url = `/config?branchCode.contains=${branchCode}`
  
    const options = {
      method: 'GET'
    }
  
    return callApiNotAuth(url, options)
  }