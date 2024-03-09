import { useEffect, useState } from "react";

// ** Next Import
import { useRouter } from "next/router";
import DefaultLayout from "../../src/components/layout/DefaultLayout";
// ** MUI Imports
import {
  Button,
  Card,
  Grid,
  Typography,
  FormControl,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

//API import
import {
  getAppointmentMasterDetails,
  cancelAppointmentMaster,
} from "../../src/api/appointment-master/appointmentmasterApi";

import {
  getAppMasterConfirmAction,
  getAppMasterReasonCancel,
} from "../../src/api/common/commonApi";

import { format, fromUnixTime } from "date-fns";

import CommonAlert from "../../src/components/common/Alert";

const Detailform = () => {
  const [expectedStartTimeState, setExpectedStartTimeState] = useState("");
  const [expectedEndTimeState, setExpectedEndTimeState] = useState("");
  const [totalState, setTotalState] = useState("");
  const [statusState, setStatusState] = useState("");
  const [payAmountState, setPayAmountState] = useState("");
  const [branchState, setBranchState] = useState("");
  const [appointmentServicesState, setAppointmentServicesState] = useState([]);
  const [appointmentMaster, setAppointmentMaster] = useState({});
  // const [confirmActions, setConfirmActions] = useState([]);

  // const callGetAppMasterConfirmAction = async () => {
  //   const data = await getAppMasterConfirmAction();
  //   if (!data) return;
  //   if (!data.data) return;
  //   console.log(data.data);
  //   setConfirmActions(data.data);
  // };

  const [listReasonCancel, setReasonCancel] = useState([]);
  const [listSelectedReasonCancel, setSelectedReasonCancel] = useState({});
  const [currentReason, setCurrentReason] = useState("");
  const [note, setNote] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [alertProps, setAlertProps] = useState(["", ""]);
  const [displayCancel, setDisplayCancel] = useState(true);

  const handleDisplayCancel = async () => {
    setDisplayCancel(!displayCancel);
  };

  const callGetAppMasterReasonCancel = async () => {
    const data = await getAppMasterReasonCancel();
    if (!data) return;
    if (!data.data) return;
    setReasonCancel(data.data);
  };

  const currencyFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const router = useRouter();

  const getDetails = async () => {
    const paramsArray = window.location.search.split("&");
    let id = -1;
    paramsArray.map((pr) => {
      if (pr.indexOf("id=") !== -1) {
        id = pr.replace("?", "").replace("id=", "");
      }
    });
    const data = await getAppointmentMasterDetails(id);
    if (!data) return;
    if (!data.data) return;

    setExpectedStartTimeState(data.data.expectedStartTime);
    setExpectedEndTimeState(data.data.expectedEndTime);
    setTotalState(data.data.total);
    setPayAmountState(data.data.payAmount);
    setStatusState(data.data.status.name);
    setBranchState(data.data.branchName);
    setAppointmentServicesState([...data.data.appointmentServices]);
    console.log(data);
    console.log(data.data.status.code);
    setAppointmentMaster(data.data);
  };

  const changeSelectedReasonCancel = (e) => {
    setCurrentReason(e.target.value);
    console.log(e.target.value);

    const newlistReasonCancel = {
      id: listReasonCancel.filter((sv) => sv.id === e.target.value)[0].id,
    };
    setSelectedReasonCancel(newlistReasonCancel);
    console.log(newlistReasonCancel);
  };

  const handleCancel = async () => {
    const paramsArray = window.location.search.split("&");
    let id = -1;
    paramsArray.map((pr) => {
      if (pr.indexOf("id=") !== -1) {
        id = pr.replace("?", "").replace("id=", "");
      }
    });

    const data = await cancelAppointmentMaster(
      id,
      listSelectedReasonCancel,
      note
    );
    

    if (!data || data.meta.code != 200) {
      setAlertProps([
        "Internal Error",
        "Có lỗi khi vận hành, xin hãy liên lạc với quản trị của trang web.",
      ]);
    } else {
      setAlertProps(["Bạn đã huỷ lịch thành công", "Cảm ơn."]);
    }
    setOpenAlert(true);
    return;
  };

  const alertCallback = () => {
    setOpenAlert(false);
    router.push("/appointment-history");
  };

  const navigateBack = () => {
    router.push({
      pathname: "/appointment-history",
    });
  };

  useEffect(() => {
    getDetails();
    //callGetAppMasterConfirmAction();
    callGetAppMasterReasonCancel();
  }, []);

  return (
    <DefaultLayout>
      <Grid item xs={12} pl={15}>
        <Typography variant="h5" style={{ marginBottom: 10 }}></Typography>
      </Grid>
      <Grid
        container
        xs={12}
        sx={{ display: "flex", flexDirection: "row" }}
        pl={40}
      >
        <Grid item xs={8} pl={6}>
          {appointmentMaster.status && (
            <Card
              sx={{ padding: "40px", marginLeft: "30px", paddingLeft: "40px" }}
            >
              <Grid
                item
                xs={12}
                ml={10}
                mr={10}
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: "35px",
                }}
              >
                {"Chi tiết lịch hẹn"}
              </Grid>
              <CommonAlert
                open={openAlert}
                okCallback={alertCallback}
                param={""}
                okLabel={"Ok"}
                message={alertProps[1]}
                title={alertProps[0]}
                variant={"oneButton"}
              />
              {/* chia 1000 de convert tu ms sang s */}
              <Grid
                item
                xs={8}
                md={10}
                sx={{
                  textAlign: "left",
                  color: "red",
                  marginBottom: "30px",
                }}
              >
                {"Trạng thái lịch hẹn: " + statusState}
              </Grid>
              <Grid item xs={8} md={10} sx={{ textAlign: "left" }}>
                {"Thời gian bắt đầu dự kiến: " +
                  format(
                    fromUnixTime(expectedStartTimeState / 1000),
                    "EEEE P HH:mm"
                  )}
              </Grid>
              <Grid item xs={8} md={10} sx={{ textAlign: "left" }}>
                {"Thời gian kết thúc dự kiến: " +
                  format(
                    fromUnixTime(expectedEndTimeState / 1000),
                    "EEEE P HH:mm"
                  )}
              </Grid>
              <Grid item xs={8} md={10} sx={{ textAlign: "left" }}>
                {"Tổng tiền: " + currencyFormatter.format(totalState)}
              </Grid>
              <Grid item xs={8} md={10} sx={{ textAlign: "left" }}>
                {"Cơ sở thực hiện: " + branchState}
              </Grid>
              <>
                <Grid
                  item
                  xs={12}
                  md={10}
                  sx={{ fontWeight: "bold", textAlign: "left" }}
                >
                  {"Dịch vụ bạn đã lựa chọn:"}
                </Grid>
                {appointmentServicesState.map((sv, index) => {
                  return (
                    <Grid
                      item
                      key={index}
                      xs={12}
                      sx={{ display: "flex", flexDirection: "row" }}
                    >
                      <Grid item xs={8} md={10} sx={{ textAlign: "left" }}>
                        {sv.spaServiceName}
                      </Grid>
                    </Grid>
                  );
                })}
              </>
              {appointmentMaster.status.code !== "CANCELED" &&
                appointmentMaster.status.code !== "CLOSED" &&
                appointmentMaster.status.code !== "IN_PROGRESS" &&(
                  <Grid>
                    <Grid
                      item
                      xs={12}
                      md={10}
                      sx={{ fontWeight: "bold", textAlign: "left" }}
                    >
                      <Button variant="contained" onClick={handleDisplayCancel}>
                        {"Bạn có thể huỷ lịch hẹn kèm lý do:"}
                      </Button>
                    </Grid>
                    <Grid sx={{ display: displayCancel ? "none" : "block"  }} >
                      <Grid item xs={8}>
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          sx={{ display: "inline" }}
                        >
                          Lý do hủy
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          sx={{ display: "inline", color: "red" }}
                        >
                          *
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <FormControl sx={{ minWidth: 120 }}>
                          <Select
                            labelId="status-select-label"
                            id="demo-simple-select"
                            name="canceledReason"
                            sx={{ width: 150 }}
                            value={currentReason}
                            onChange={changeSelectedReasonCancel}
                          >
                            {listReasonCancel &&
                              listReasonCancel.length > 0 &&
                              listReasonCancel.map((item, index) => {
                                return (
                                  <MenuItem key={index} value={item?.id}>
                                    {item?.name}
                                  </MenuItem>
                                );
                              })}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="subtitle1" gutterBottom>
                          Ghi chú
                        </Typography>
                        <TextareaAutosize
                          id="outlined-search"
                          type="search"
                          style={{ width: 500, height: 50 }}
                          name="note"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                        />
                      </Grid>
                      <br></br>
                      <Button
                        onClick={handleCancel}
                        variant="contained"
                        style={{ marginRight: 10 }}
                      >
                        Xác nhận
                      </Button>
                    </Grid>
                  </Grid>
                )}
              <Button
                variant="text"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  textAlign: "center",
                }}
                onClick={() => navigateBack()}
              >
                {"Quay lại"}
              </Button>
            </Card>
          )}
        </Grid>
      </Grid>
    </DefaultLayout>
  );
};

export default Detailform;
