import { Box, Button, Typography, Grid, Divider } from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useContext, useEffect } from "react";
import { BookingContext } from "../../context/BookingContext";
import DefaultLayout from "../../src/components/layout/DefaultLayout/index";
import { convertNumberToVND } from "../../src/utils/currencyUtils";
import { timestampToString } from "../../src/utils/timeUtils";

const BookingFinished = () => {
  const router = useRouter();

  const {
    setActiveStep,
    nameState,
    setNameState,
    phoneState,
    setPhoneState,
    emailState,
    setEmailState,
    setSelectedBranch,
    setSelectedServicesList,
    setSelectedTimestamp,
    setServicesState,
    setServicesList,
    // bookingStatus,
    setBookingStatus,
  } = useContext(BookingContext);

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

  const [recentAppointment, setRecentAppointment] = useState();

  useEffect(() => {
    clearBookingData();
    const recentAppointmentData = JSON.parse(
      localStorage.getItem("recent_appointment")
    );
    if (!recentAppointmentData) {
      router.push(`/`);
    } else {
      setRecentAppointment(recentAppointmentData);
      console.log(recentAppointmentData);
      localStorage.removeItem("recent_appointment")
    }
  }, []);

  const handleFinish = (e) => {
    e.preventDefault();
    setBookingStatus("");
  };

  return (
    <DefaultLayout>
      <Head>
        <title>Đặt lịch thành công - SSDS</title>
      </Head>
      <Box textAlign="center">
        <Typography variant="h4" mx="auto" my={4}>
          Đặt lịch thành công
        </Typography>
        <Typography variant="body1" mx={5} mb={4} sx={{ color: "red" }}>
          Đặt lịch thành công! Nhân viên spa sẽ sớm liên hệ với bạn để xác nhận
          thông tin lịch hẹn. Cảm ơn bạn đã lựa chọn sử dụng dịch vụ của chúng
          tôi
        </Typography>
        {recentAppointment && (
          <Box sx={{ width: "75%", m: "0 auto", textAlign: "left", mb: 3 }}>
            <Typography variant="h6" ml={4} mb={3}>
              Thông tin lịch hẹn
            </Typography>
            <Grid container spacing={3}>
              <Grid item md={3} xs={6}>
                <Typography textAlign="left">
                  <strong>Tên khách hàng: </strong>
                </Typography>
              </Grid>
              <Grid item md={3} xs={6}>
                <Typography>{recentAppointment.customer.fullName}</Typography>
              </Grid>
              <Grid item md={3} xs={6}>
                <Typography>
                  <strong>Số điện thoại: </strong>
                </Typography>
              </Grid>
              <Grid item md={3} xs={6}>
                <Typography>
                  {recentAppointment.customer.phoneNumber}
                </Typography>
              </Grid>
              {recentAppointment.customer?.email && (
                <>
                  <Grid item md={3} xs={6}>
                    <Typography>
                      <strong>Email: </strong>
                    </Typography>
                  </Grid>
                  <Grid item md={3} xs={6}>
                    <Typography>{recentAppointment.customer.email}</Typography>
                  </Grid>
                </>
              )}
            </Grid>
            <Grid container mt={3} spacing={3}>
              <Grid item md={6} xs={12}>
                <Typography><strong>Chi nhánh:</strong></Typography>
                <Typography ml={3}>{recentAppointment.branch.name}</Typography>
                <Typography ml={3}>Địa chỉ: {`${recentAppointment.branch.detailAddress} - ${recentAppointment.branch.district.divisionName} - ${recentAppointment.branch.city.divisionName} - ${recentAppointment.branch.state.divisionName}`}</Typography>
                <Typography ml={3}>Điện thoại: {recentAppointment.branch.hotline}</Typography>
              </Grid>
              <Grid item md={6} xs={12}>
                <Typography>
                  <strong>Dịch vụ đã chọn:</strong>
                </Typography>
                {recentAppointment.appointmentServices.map((item) => {
                  return (
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography ml={3} key={item.id}>
                        {item.name}
                      </Typography>
                      <Typography mr={3} color="red">
                        {convertNumberToVND(item.currentPrice)}
                      </Typography>
                    </Box>
                  );
                })}
              </Grid>
              <Grid item xs={12}>
                <Typography><strong>Thời gian bắt đầu (dự kiến): </strong>{timestampToString(recentAppointment.expectedStartTime)}</Typography>
              </Grid>
            </Grid>
          </Box>
        )}
        <Link href="/" onClick={(e) => handleFinish}>
          <Button variant="contained" sx={{ px: 5.5 }}>
            Về trang chủ
          </Button>
        </Link>
      </Box>
    </DefaultLayout>
  );
};

export default BookingFinished;
