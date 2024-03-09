import { Alert, Box, Snackbar, Button, Tooltip } from "@mui/material";
import { useContext, useEffect } from "react";
import { BookingContext } from "../../../../context/BookingContext";
import styles from "./booking-preview.module.css";
import { useRouter } from "next/router";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

const BookingPreview = () => {
  const router = useRouter();

  const {
    setActiveStep,
    nameState,
    setNameState,
    phoneState,
    setPhoneState,
    emailState,
    setEmailState,
    selectedBranch,
    setSelectedBranch,
    selectedServicesList,
    setSelectedServicesList,
    unselectService,
    selectedTimestamp,
    setSelectedTimestamp,
    setServicesState,
    setServicesList,
    setBookingStatus,
    open,
    setOpen,
    error,
    setError,
    // handleBooking
  } = useContext(BookingContext);



  const currentName = nameState;
  const currentPhone = phoneState;
  const currentEmail = emailState;
  const currentBranch = selectedBranch;
  const currentServices = [...selectedServicesList];
  const currentTimestamp = selectedTimestamp;

  const currencyFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });


  useEffect(() => {
    //callApiGetListConfig(currentBranch.code)
    console.log(currentBranch)
  }, [])

  var totalPrice = 0;
  var date = new Date(currentTimestamp).toLocaleDateString("vi-VN");
  var time = new Date(currentTimestamp).toLocaleTimeString("vi-VN");
  var timeString = String(date) + " " + String(time);
  var datetime = new Date(selectedTimestamp);
  // var time = new Date(selectedTimestamp).toLocaleTimeString("vi-VN");
  var currentMonth = ("0" + (datetime.getUTCMonth() + 1)).slice(-2); //months from 1-12
  var currentDay = ("0" + datetime.getUTCDate()).slice(-2);
  var currentYear = datetime.getUTCFullYear();
  var timeUTC =
    ("0" + datetime.getUTCHours()).slice(-2) +
    ":" +
    ("0" + datetime.getUTCMinutes()).slice(-2) +
    ":" +
    ("0" + datetime.getUTCSeconds()).slice(-2);
  let bookingTime =
    currentYear + "-" + currentMonth + "-" + currentDay + "T" + time + "Z";
  let bookingTimeUTC =
    currentYear + "-" + currentMonth + "-" + currentDay + "T" + timeUTC + "Z";

  // const handleBooking = () => {
  //   var servicesArray = [];
  //   currentServices?.map((item, index) => {
  //     // endTime = new Date(currentTimestamp + item.duration * 60);
  //     servicesArray.push({
  //       expectedStartTime: bookingTimeUTC,
  //       expectedEndTime: bookingTimeUTC,
  //       spaServiceId: item.id,
  //     });
  //   });
  //   var data = JSON.stringify({
  //     expectedStartTime: bookingTimeUTC,
  //     customer: {
  //       fullName: currentName,
  //       phoneNumber: currentPhone,
  //       // email: currentEmail,
  //     },
  //     appointmentServices: servicesArray,
  //     branchId: currentBranch?.id,
  //   });
  //   console.log(data);

  //   var config = {
  //     method: "post",
  //     url: "http://localhost:8088/api/web/v1/appointment-master",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     data: data,
  //   };

  //   axios(config)
  //     .then(function (response) {
  //       console.log(response);
  //       // console.log("ok? ", response.ok);
  //       if (response.status === 200) {
  //         router.push("/booking/finished");
  //         // clearBookingData()
  //       }
  //       console.log(response.data.data.status.code);
  //       if (response.data.data.status.code === "WAITING_FOR_CONFIRMATION") {
  //         setBookingStatus(
  //           "Đặt lịch thành công! Nhân viên spa sẽ sớm liên hệ với bạn để xác nhận thông tin lịch hẹn. Cảm ơn bạn đã lựa chọn sử dụng dịch vụ của chúng tôi"
  //         );
  //       }
  //       if (response.data.data.status.code === "READY") {
  //         setBookingStatus("Đã đặt lịch thành công!");
  //       }
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //       setError(error);
  //       handleDisplaySnackbar();
  //     });
  // };

  const timeConverter = (time) => {
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

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Box>
      <div className={styles.container}>
        {currentName || currentPhone || currentEmail ? (
          <>
            {currentName ? (
              <p>
                <strong>Tên khách hàng: </strong>
                {currentName}
              </p>
            ) : (
              <></>
            )}
            {currentPhone ? (
              <p>
                <strong>Điện thoại: </strong>
                {currentPhone}
              </p>
            ) : (
              <></>
            )}
            {currentEmail ? (
              <p>
                <strong>Email: </strong>
                {currentEmail}
              </p>
            ) : (
              <></>
            )}
          </>
        ) : (
          <p>Chưa nhập thông tin khách hàng</p>
        )}
        <hr />
        {currentBranch ? (
          <>
            <p>
              <strong>Chi nhánh: </strong>
              {currentBranch?.name}
            </p>
            <p>
              <strong>Điện thoại: </strong>
              {currentBranch?.hotline}
            </p>
            <p>
              <strong>Địa chỉ: </strong>
              {currentBranch?.detailAddress}
            </p>
          </>
        ) : (
          <p>Chưa chọn chi nhánh</p>
        )}
        <hr />
        {currentServices.length !== 0 ? (
          <>
            <strong>Danh sách dịch vụ</strong>

            <div>
              {currentServices?.map((item, index) => {
                totalPrice += item.currentPrice;
                return (
                  <div className={styles.servicecontainer} key={index}>
                    <Box sx={{display: 'flex'}}>
                      <Tooltip title="Bỏ chọn dịch vụ này">
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => unselectService(item?.id)}
                        >
                          <CloseIcon />
                        </Button>
                      </Tooltip>
                      <Box>
                        <Typography my="auto">{item.name}</Typography>
                        <Typography my="auto">
                          {timeConverter(item.duration)}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography my="auto" className={styles.pricecontainer}>
                      {currencyFormatter.format(item.currentPrice)}
                    </Typography>
                  </div>
                );
              })}
            </div>
            <p>
              <strong>Tổng chi phí (dự tính): </strong>
              <span className={styles.pricecontainer}>
                {currencyFormatter.format(totalPrice)}
              </span>
            </p>
          </>
        ) : (
          <p>Chưa chọn dịch vụ nào</p>
        )}
        <hr />
        {currentTimestamp ? (
          <p>
            <strong>Thời gian hẹn (dự tính): </strong>
            {timeString}
          </p>
        ) : (
          <p>Chưa chọn thời gian</p>
        )}
      </div>

      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Có lỗi xảy ra, vui lòng thử lại sau!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BookingPreview;
