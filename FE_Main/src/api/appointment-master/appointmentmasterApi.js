import callApi from "../callApi";
import { reformatDateForQuery } from "../../utils/timeUtils";

export function filterAppointmentMaster(queryParam, page, size, id) {

   

  let url = `/appointment-master?customerId.equals=${id}&page=${page ? page : 0}&size=${
    size ? size : 1000
  }`

  //customerName.contains=${customerName}&

  if (queryParam.actualStartTime.value.from) {
    url += `&actualStartTime.${
      queryParam.actualStartTime.operator[0]
    }=${reformatDateForQuery(queryParam.actualStartTime.value.from)}`;
  }
  if (queryParam.actualStartTime.value.to) {
    url += `&actualStartTime.${
      queryParam.actualStartTime.operator[1]
    }=${reformatDateForQuery(queryParam.actualStartTime.value.to)}`;
  }
  if (queryParam.actualEndTime.value.from) {
    url += `&actualEndTime.${
      queryParam.actualEndTime.operator[0]
    }=${reformatDateForQuery(queryParam.actualEndTime.value.from)}`;
  }
  if (queryParam.actualEndTime.value.to) {
    url += `&actualEndTime.${
      queryParam.actualEndTime.operator[1]
    }=${reformatDateForQuery(queryParam.actualEndTime.value.to)}`;
  }
  if (queryParam.expectedStartTime.value.from) {
    url += `&expectedStartTime.${
      queryParam.expectedStartTime.operator[0]
    }=${reformatDateForQuery(queryParam.expectedStartTime.value.from)}`;
  }
  if (queryParam.expectedStartTime.value.to) {
    url += `&expectedStartTime.${
      queryParam.expectedStartTime.operator[1]
    }=${reformatDateForQuery(queryParam.expectedStartTime.value.to)}`;
  }
  if (queryParam.expectedEndTime.value.from) {
    url += `&expectedEndTime.${
      queryParam.expectedEndTime.operator[0]
    }=${reformatDateForQuery(queryParam.expectedEndTime.value.from)}`;
  }
  if (queryParam.expectedEndTime.value.to) {
    url += `&expectedEndTime.${
      queryParam.expectedEndTime.operator[1]
    }=${reformatDateForQuery(queryParam.expectedEndTime.value.to)}`;
  }

  //các trường bình thường
  if (queryParam.customerFullName.value) {
    url += `&customerName.${queryParam.customerFullName.operator}=${queryParam.customerFullName.value}`;
  }
  if (queryParam.customerPhoneNumber.value) {
    url += `&customerPhoneNumber.${queryParam.customerPhoneNumber.operator}=${queryParam.customerPhoneNumber.value}`;
  }
  if (queryParam.statusName.value) {
    url += `&statusCode.${queryParam.statusName.operator}=${queryParam.statusName.value}`;
  }
  if (queryParam.total.value) {
    url += `&total.${queryParam.total.operator}=${queryParam.total.value}`;
  }
  if (queryParam.payAmount.value) {
    url += `&payAmount.${queryParam.payAmount.operator}=${queryParam.payAmount.value}`;
  }

  const options = {
    method: "GET",
  };

  return callApi(url, options);
}

export function getAppointmentMasterDetails(id) {
  const url = `/appointment-master/${id}`;

  const options = {
    method: "GET",
  };

  return callApi(url, options);
}

export function verifyAppointmentMaster(props) {
  const url = `/appointment-master/confirm-appointment`;
  const req = [];
  props.forEach((item) => {
    item = {
      ...item,
      apptMasterId: item.id,
      canceledReason: { ["id"]: item.canceledReason },
    };
    req.push(item);
  });

  const options = {
    method: "POST",
    data: JSON.stringify(req),
  };

  return callApi(url, options);
}

export function cancelAppointmentMaster(appointmentId, cancelArray, note) {
  const url = `/appointment-master/cancel`;

  const data = [
    {
      id: appointmentId,
      canceledReason: cancelArray,
      note: note
    },
  ];

  console.log(data);
  const options = {
    method: "POST",
    data: JSON.stringify(data),
  };

  return callApi(url, options);
}
