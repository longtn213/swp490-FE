
import callApiNotAuth from "../callApiNotAuth";

export function getAllCategories() {
    let url = `/category`;

    const options = {
        method: "GET",
    };

    return callApiNotAuth(url, options);
}

export function getAllServices() {
    let url = `/service?size=200&isActive.equals=true`;

    const options = {
        method: "GET",
    };

    return callApiNotAuth(url, options);
}

// export function getAllSca() {
//     let url = `/sca-form`;
//
//     const options = {
//         method: "GET",
//     };
//
//     return callApi(url, options);
// }

export function getAllBranches() {
    let url = `/branch?isActive.equals=true`;

    const options = {
        method: "GET",
    };

    return callApiNotAuth(url, options);
}

export function getTimestamps(data) {
    let url = `/appointment-tracking/available-time`;
    const options = {
        method: "GET",
        data: data,
    };

    return callApiNotAuth(url, options);
}

export function getAppMasterReasonCancel() {
    let url = `/common/list-selection/reasonMessage`;

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
