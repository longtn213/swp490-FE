import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { booking, getListConfig } from "../src/api/booking/bookingApi";
import { getAllServices } from "../src/api/common/commonApi";

export const BookingContext = createContext({});

export const BookingProvider = ({ children }) => {
  //StepControl

  const [activeStep, setActiveStep] = useState(0);
  const [isNextable0, setIsNextable0] = useState(false);
  const [isNextable1, setIsNextable1] = useState(false);
  const [isNextable2, setIsNextable2] = useState(false);
  const [isFinishable, setIsFinishable] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const checkDisabled = (step) => {
    switch (step) {
      case 0:
        isNextable0 === true ? setIsDisabled(false) : setIsDisabled(true);
        break;
      case 1:
        isNextable1 === true ? setIsDisabled(false) : setIsDisabled(true);
        break;
      case 2:
        isNextable2 === true ? setIsDisabled(false) : setIsDisabled(true);
        break;
      case 3:
        isFinishable === true ? setIsDisabled(false) : setIsDisabled(true);
        break;

      default:
        break;
    }

    return isDisabled;
  };

  useEffect(() => {
    checkDisabled(activeStep);
  }, [isNextable0, isNextable1, isNextable2, isFinishable, activeStep]);

  const handleNext = () => {
    window.scrollTo(0, 0);
    setOpen(false);
    setActiveStep((prevActiveStep) =>
      activeStep < 3 ? prevActiveStep + 1 : prevActiveStep
    );
    if (activeStep === 3) handleBooking();
    checkDisabled(activeStep + 1);
    console.log(activeStep + 1);
  };

  const handleBack = () => {
    window.scrollTo(0, 0);
    setOpen(false);
    setActiveStep((prevActiveStep) =>
      activeStep > 0 ? prevActiveStep - 1 : prevActiveStep
    );
    checkDisabled(activeStep - 1);
    console.log(activeStep - 1);
  };

  //BookingInfo

  const [nameState, setNameState] = useState("");
  const [phoneState, setPhoneState] = useState("");
  const [emailState, setEmailState] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [duration, setDuration] = useState();

  useEffect(() => {
    if (
      nameError === "" &&
      phoneError === "" &&
      emailError === "" &&
      nameState !== "" &&
      phoneState !== ""
    ) {
      setIsNextable0(true);
      // setIsDisabled(false);
    } else {
      setIsNextable0(false);
      // setIsDisabled(true)
    }
  }, [nameError, phoneError, emailError, nameState, phoneState, emailState]);

  const validateName = (e, regex) => {
    if (e.target.value !== "") {
      if (!regex.test(e.target.value)) {
        setNameError("Họ tên không hợp lệ!");
        setNameState(e.target.value);
      } else if (e.target.value.trim().length > 255) {
        setNameError("Họ tên không được vượt quá 255 ký tự");
        setNameState(e.target.value);
      } else {
        setNameError("");
        setNameState(e.target.value);
        checkDisabled(0);
      }
    } else {
      setNameError("Họ tên không được để trống!");
      setNameState("");
    }
  };

  const validatePhone = (e, regex) => {
    if (e.target.value !== "") {
      if (regex.test(e.target.value)) {
        setPhoneError("");
        setPhoneState(e.target.value);
        checkDisabled(0);
      } else {
        setPhoneError("Số điện thoại không hợp lệ!");
        setPhoneState(e.target.value);
      }
    } else {
      setPhoneError("Số điện thoại không được để trống!");
      setPhoneState("");
    }
  };

  const validateEmail = (e, regex) => {
    if (e.target.value !== "") {
      if (e.target.value.trim().length > 100) {
        setEmailError("Email không được vượt quá 100 ký tự");
        setEmailState(e.target.value);

        return;
      }
      if (!regex.test(e.target.value)) {
        setEmailError("Email không hợp lệ!");
        setEmailState(e.target.value);

        return;
      }
      setEmailError("");
      setEmailState(e.target.value);
      checkDisabled(0);
    } else {
      setEmailError("");
      setEmailState("");
      checkDisabled(0);
    }
  };

  //BookingBranch

  const [selectedBranch, setSelectedBranch] = useState();

  useEffect(() => {
    if (selectedBranch) {
      callApiGetListConfig(selectedBranch?.code);
    }
  }, [selectedBranch]);

  const callApiGetListConfig = async (branchCode) => {
    const res = await getListConfig(branchCode);
    if (!res) return;
    if (!res.data) return;
    setStartTime(
      res.data.filter((el) => el.configKey == "START_WORKING_TIME_IN_DAY")[0]
        .configValue
    );
    setEndTime(
      res.data.filter((el) => el.configKey == "END_WORKING_TIME_IN_DAY")[0]
        .configValue
    );
    console.log(res.data);
  };

  //BookingService

  const [servicesState, setServicesState] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [selectedServicesList, setSelectedServicesList] = useState([]);
  const [configsList, setConfigsList] = useState([]);

  const callGetAllServices = async () => {
    const data = await getAllServices();
    if (!data) return;
    if (!data.data) return;
    setServicesState(data.data);
    const currentSelectedService = JSON.parse(
      localStorage.getItem("selectedService")
    );
    if (currentSelectedService) {
      setSelectedServicesList([currentSelectedService]);

      var temp = [];
      data.data.map((service) => {
        if (service.code !== currentSelectedService.code) {
          temp.push(service);
        }
      });
      setServicesList(temp);
      localStorage.removeItem("selectedService");
    } else {
      setServicesList(data.data);
      setSelectedServicesList([]);
    }
  };

  const [openServiceError, setOpenServiceError] = useState(false);

  const selectService = (id) => {
    console.log("reset timestamp");
    setSelectedTimestamp(0);
    let tempSelectedList = [...selectedServicesList];
    let tempServicesList = [...servicesList];
    const item = servicesState.find((x) => x.id === id);
    let sum = 0;
    tempSelectedList.map((item) => {
      sum += item.duration;
    });
    var a = startTime.split(":"); // split it at the colons
    var minute1 = +a[0] * 60 + +a[1];
    var b = endTime.split(":"); // split it at the colons
    var minute2 = +b[0] * 60 + +b[1];

    console.log(minute2 - minute1);
    console.log(sum);
    if (sum + item.duration <= minute2 - minute1 - 15) {
      tempSelectedList.push(item);
      setSelectedServicesList(tempSelectedList);
      const index = tempServicesList.indexOf(
        servicesList.find((x) => x.id === id)
      );
      if (index > -1) {
        tempServicesList.splice(index, 1);
      }
      setServicesList(tempServicesList);
    } else {
      setOpenServiceError(true);
    }

    // setIsNextable2(true);
    // console.log(selectedServicesList);
    // var tempIsFinishable = isFinishable;
    // if (tempIsFinishable) setIsFinishable(false);
  };

  const unselectService = (id) => {
    console.log("reset timestamp");
    setSelectedTimestamp(0);
    let tempSelectedList = [...selectedServicesList];
    let tempServicesList = [...servicesList];
    const item = selectedServicesList.find((x) => x.id === id);
    tempServicesList.push(item);
    tempServicesList.sort((a, b) => a.id - b.id);
    setServicesList(tempServicesList);
    const index = tempSelectedList.indexOf(
      selectedServicesList.find((x) => x.id === id)
    );
    if (index > -1) {
      tempSelectedList.splice(index, 1);
    }
    setSelectedServicesList(tempSelectedList);
    if (tempSelectedList.length === 0) {
      // setIsNextable2(false);
    }
    // var tempIsFinishable = isFinishable;
    // if (tempIsFinishable) setIsFinishable(false);
    // console.log("servicesList");
    // console.log(tempServicesList);
    console.log(selectedServicesList);
  };

  //BookingTime

  const [timestampsList, setTimestampsList] = useState([]);
  // const [currentDayTimestampsList, setCurrentDayTimestampsList] = useState();
  const [currentTimestampsList, setCurrentTimestampsList] = useState([]);
  const [currentDatesList, setCurrentDatesList] = useState([]);

  // var currentTimestampsList = [];
  // var currentDatesList = [];

  const [timestampState, setTimestampState] = useState([]);
  const [selectedTimestamp, setSelectedTimestamp] = useState(0);

  const handleChangeDay = (e) => {
    var tempCurrentTimestampsList = Object.entries(currentTimestampsList);
    const keys = Object.keys(tempCurrentTimestampsList);
    setTimestampState(tempCurrentTimestampsList[keys[e.target.value]][1]);
    console.log(e.target.value);
    console.log(tempCurrentTimestampsList[keys[e.target.value]][1]);
  };

  //BookingFinish

  const [bookingStatus, setBookingStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("Có lỗi xảy ra, vui long thử lại sau!");

  const router = useRouter();

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

  const handleBooking = () => {
    var servicesArray = [];
    var recentAppointmentServiceArray = [];
    currentServices?.map((item, index) => {
      // endTime = new Date(currentTimestamp + item.duration * 60);
      servicesArray.push({
        expectedStartTime: bookingTimeUTC,
        expectedEndTime: bookingTimeUTC,
        spaServiceId: item.id,
      });
      recentAppointmentServiceArray.push(item);
    });
    var data = {
      expectedStartTime: bookingTimeUTC,
      customer: {
        fullName: currentName.trim(),
        phoneNumber: currentPhone.trim(),
      },
      appointmentServices: servicesArray,
      branchId: currentBranch?.id,
    };
    var recentAppointment = {
      expectedStartTime: currentTimestamp,
      customer: {
        fullName: currentName.trim(),
        phoneNumber: currentPhone.trim(),
      },
      appointmentServices: recentAppointmentServiceArray,
      branch: currentBranch,
    };
    if (currentEmail !== "") {
      data.customer.email = currentEmail.trim();
      recentAppointment.customer.email = currentEmail.trim();
    }
    console.log(data);

    callApiBooking(data, recentAppointment);

    // var config = {
    //   method: "post",
    //   url: "https://api.widen.dev/public/web/v1/appointment-master",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   data: data,
    // };

    // axios(config)
    //   .then(function (response) {
    //     console.log(response);
    //     // console.log("ok? ", response.ok);
    //     if (response.status === 200) {
    //       router.push("/booking/finished");
    //       // clearBookingData()
    //     }
    //     console.log(response.data.data.status.code);
    //     if (response.data.data.status.code === "WAITING_FOR_CONFIRMATION") {
    //       setBookingStatus(
    //         "Đặt lịch thành công! Nhân viên spa sẽ sớm liên hệ với bạn để xác nhận thông tin lịch hẹn. Cảm ơn bạn đã lựa chọn sử dụng dịch vụ của chúng tôi"
    //       );
    //     }
    //     if (response.data.data.status.code === "READY") {
    //       setBookingStatus("Đã đặt lịch thành công!");
    //     }
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //     setError(error);
    //     handleDisplaySnackbar();
    //   });
  };

  const callApiBooking = async (data, recentAppointment) => {
    const res = await booking(data);
    if (!res) return;
    if (res.meta.code != 200) {
      setError(res.meta.message);
      handleDisplaySnackbar();

      return;
    }
    localStorage.setItem(
      "recent_appointment",
      JSON.stringify(recentAppointment)
    );
    router.push("/booking/finished");
  };

  const handleDisplaySnackbar = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (
      !nameState ||
      !phoneState ||
      !selectedBranch ||
      !selectedServicesList ||
      selectedTimestamp === 0
    ) {
      setIsFinishable(false);
    } else {
      console.log("Finishable");

      setIsFinishable(true);
    }
  }, [
    nameState,
    phoneState,
    selectedBranch,
    selectedServicesList,
    selectedTimestamp,
  ]);

  // useState(() => {
  //   if(activeStep === 3) {
  //     if(selectedTimestamp !== 0) {
  //       setIsDisabled(false)
  //     } else {
  //       setIsDisabled(true)
  //     }
  //   }
  // }, [activeStep, selectedTimestamp, isFinishable])

  return (
    <BookingContext.Provider
      value={{
        activeStep,
        handleNext,
        handleBack,
        checkDisabled,
        isDisabled,
        nameState,
        setNameState,
        phoneState,
        setPhoneState,
        emailState,
        setEmailState,
        setIsNextable0,
        setIsNextable1,
        setIsNextable2,
        setIsDisabled,
        validateName,
        validatePhone,
        validateEmail,
        nameError,
        phoneError,
        emailError,
        selectedBranch,
        setSelectedBranch,
        selectedServicesList,
        servicesState,
        setServicesState,
        setSelectedServicesList,
        unselectService,
        servicesList,
        setServicesList,
        selectService,
        callGetAllServices,
        timestampsList,
        setTimestampsList,
        handleChangeDay,
        currentDatesList,
        currentTimestampsList,
        setCurrentTimestampsList,
        setCurrentDatesList,
        // currentDayTimestampsList,
        timestampState,
        setTimestampState,
        selectedTimestamp,
        setSelectedTimestamp,
        setIsFinishable,
        // currentDayTimestampsList,
        // setCurrentDayTimestampsList
        setActiveStep,
        bookingStatus,
        setBookingStatus,
        open,
        setOpen,
        error,
        setError,
        handleBooking,
        startTime,
        setStartTime,
        endTime,
        setEndTime,
        duration,
        setDuration,
        openServiceError,
        setOpenServiceError,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
