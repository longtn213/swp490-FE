// import { Typography } from "@material-ui/core";
import { Box, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import { BookingContext } from "../../context/BookingContext";
// import { BookingProvider } from "../../../context/BookingContext";
import BookingBranch from "../../src/components/booking/booking-branch/BookingBranch";
import BookingInfo from "../../src/components/booking/booking-info/BookingInfo";
import BookingService from "../../src/components/booking/booking-service/BookingService";
import BookingStepperControl from "../../src/components/booking/booking-stepper-control/BookingStepperControl";
import BookingTime from "../../src/components/booking/booking-time/BookingTime";
import styles from "./booking.module.css";
import DefaultLayout from "../../src/components/layout/DefaultLayout/index";
import Head from "next/head";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";

function getSteps() {
  return [
    "Thông tin khách hàng",
    "Chọn chi nhánh",
    "Chọn dịch vụ",
    "Chọn thời gian",
  ];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return <BookingInfo />;
    case 1:
      return <BookingBranch />;
    case 2:
      return <BookingService />;
    case 3:
      return <BookingTime />;
    default:
      return;
  }
}

const Booking = () => {
  const steps = getSteps();

  const {
    activeStep,
    setActiveStep,
    setNameState,
    setPhoneState,
    setEmailState,
    setSelectedBranch,
    setSelectedServicesList,
    setSelectedTimestamp,
    setServicesState,
    setServicesList,
    callGetAllServices,
    bookingStatus,
    setBookingStatus,
    openServiceError,
        setOpenServiceError
  } = useContext(BookingContext);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpenServiceError(false);
  };

  const clearBookingData = () => {
    setActiveStep(0);
    setNameState("");
    setPhoneState("");
    setEmailState("");
    setSelectedBranch();
    setSelectedServicesList([]);
    setSelectedTimestamp(0);
    setServicesState([]);
    setServicesList([]);
  };

  useEffect(() => {
    clearBookingData();
  }, []);

  useEffect(() => {
    callGetAllServices();
    // console.log("get services");
  }, []);

  // Check nếu có thông tin người dùng trong localStorage thì set luôn và bỏ qua BookingInfo
  useEffect(() => {
    if (localStorage.getItem("full_name") !== null) {
      setNameState(localStorage.getItem("full_name"));
    }
    if (localStorage.getItem("phone_number") !== null) {
      setPhoneState(localStorage.getItem("phone_number"));
    }
    if (localStorage.getItem("email") !== null) {
      setEmailState(localStorage.getItem("email"));
    }
    if (
      localStorage.getItem("full_name") !== null &&
      localStorage.getItem("phone_number") !== null
    ) {
      setActiveStep(1);
    }
  }, []);

  return (
    <DefaultLayout>
      <Head>
        <title>Đặt lịch - SSDS</title>
      </Head>
      <div className="container">
        <Stepper
          className={styles.stepper}
          nonLinear
          activeStep={activeStep}
          alternativeLabel
        >
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            return (
              <Step key={index} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <div>
          <div>
            <Box>{getStepContent(activeStep)}</Box>
            <BookingStepperControl />
          </div>
        </div>
      </div>
      <Dialog
        open={openServiceError}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Thông báo"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn không thể chọn quá nhiều dịch vụ, vì số thời gian để thực hiện
            lịch hẹn sẽ vượt quá khoảng thời gian làm việc của chúng tôi
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </DefaultLayout>
  );
};

export default Booking;
