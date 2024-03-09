import { Button, Grid, Typography } from "@mui/material";
import { filterAppointmentMaster } from "../../src/api/appointment-master/appointmentmasterApi";
import DialogAlert from "../../src/components/dialog/dialogAlert";
import { useEffect, useState } from "react";
import AppointmentmasterCard from "../../src/components/card/appointment-master/AppointmentmasterCard";
import DefaultLayout from "../../src/components/layout/DefaultLayout";
import Head from "next/head";
import { textAlign } from "@mui/system";
import Link from "next/link";

const AppointmentHistory = () => {
  const defaultQueryParam = {
    customerFullName: {
      value: "",
      operator: "contains",
    },
    customerPhoneNumber: {
      value: "",
      operator: "contains",
    },
    statusName: {
      value: "",
      operator: "in",
    },
    total: {
      value: "",
      operator: "equals",
    },
    payAmount: {
      value: "",
      operator: "equals",
    },
    expectedStartTime: {
      value: {
        from: "",
        to: "",
        fromText: "",
        toText: "",
      },
      operator: ["greaterOrEqual", "lessOrEqual"],
    },
    expectedEndTime: {
      value: {
        from: "",
        to: "",
        fromText: "",
        toText: "",
      },
      operator: ["greaterOrEqual", "lessOrEqual"],
    },
    actualStartTime: {
      value: {
        from: "",
        to: "",
        fromText: "",
        toText: "",
      },
      operator: ["greaterOrEqual", "lessOrEqual"],
    },
    actualEndTime: {
      value: {
        from: "",
        to: "",
        fromText: "",
        toText: "",
      },
      operator: ["greaterOrEqual", "lessOrEqual"],
    },
    canceledReason: {
      value: "",
      operator: "in",
    },
    cancelNote: {
      value: "",
      operator: "contains",
    },
    note: {
      value: "",
      operator: "contains",
    },
  };

  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(1000);

  const [list, setList] = useState([]);
  const [error, setError] = useState("");
  const [openError, setOpenError] = useState(false);

  const [queryParam, setQueryParam] = useState(defaultQueryParam);

  const {
    customerFullName,
    customerPhoneNumber,
    statusName,
    total,
    payAmount,
    expectedStartTime,
    expectedEndTime,
    actualStartTime,
    actualEndTime,
    canceledReason,
    cancelNote,
    note,
    createdDate,
    createdBy,
    lastModifiedDate,
    lastModifiedBy,
  } = queryParam;

  const handleClose = () => {
    setOpenError(false);
  };

  const callFilter = async (pageProp, sizeProp) => {
    console.log(localStorage.getItem("full_name"));

    const data = await filterAppointmentMaster(
      queryParam ? queryParam : defaultQueryParam,
      pageProp,
      sizeProp,
      localStorage.getItem("id")
    );
    if (!data) return;
    if (data.meta.code != 200) {
      setError(data.meta.message);
      setOpenError(true);
      return;
    }
    if (!data.data) return;
    setCount(data.meta.total);
    var tempList = [];
    console.log("AM : ", data);
    tempList = [...data.data].sort((a, b) => b.createdDate - a.createdDate);
    setList([...tempList]);
  };

  //First call when go into this page customerName,
  useEffect(() => {
    callFilter(page, size);
  }, []);

  return (
    <DefaultLayout>
      <Head>
        <title>Lịch sử cuộc hẹn - SSDS</title>
      </Head>
      <Typography variant="h4" sx={{ textAlign: "center", mt: 4 }}>
        Lịch sử cuộc hẹn
      </Typography>
      <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {list?.length === 0 && (
          <Grid item xs={12} ml={10} mr={10}>
            <Typography variant="h4" sx={{ textAlign: "center", mt: 4 }}>
              Hiện tại bạn không có lịch hẹn nào
            </Typography>
            <br></br>
            <Grid item xs={12} ml={105} mr={10}>
              <Link href="/booking">
                <Button
                  variant="contained"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    textAlign: "center",
                    px: 5.5,
                  }}
                >
                  {"Đến trang lịch hẹn"}
                </Button>
              </Link>
            </Grid>
          </Grid>
        )}
        {list
          ?.filter((el) => el.customer.id == localStorage.getItem("id"))
          .map((item, key) => {
            // Chỉ show appointment của user id 5
            return (
              <Grid key={key} item xs={12} ml={10} mr={10}>
                <AppointmentmasterCard item={item} />
                {}
              </Grid>
            );
          })}
      </Grid>
      <DialogAlert
        nameDialog={"Có lỗi xảy ra"}
        open={openError}
        allertContent={error}
        handleClose={handleClose}
      />
    </DefaultLayout>
  );
};

export default AppointmentHistory;
