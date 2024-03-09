import callApiNotAuth from "../callApiNotAuth";

export function getAppMasterStatus() {
    let url = `/common/list-selection/apptMasterStatus`;

    const options = {
        method: 'GET',
    }

    return callApiNotAuth(url, options);
}

export function getAppMasterReasonCancel() {
    let url = `/common/list-selection/reasonMessage`;

    const options = {
        method: 'GET',
    }

    return callApiNotAuth(url, options);
}

export function getPaymentMethod() {
    let url = `/common/list-selection/paymentMethod`;
    
    const options = {
        method: 'GET',
    }

    return callApiNotAuth(url, options);
}

export function getAppMasterConfirmAction() {
    let url = `/common/list-selection/confirmAction`;

    const options = {
        method: 'GET',
    }

    return callApiNotAuth(url, options);
}
