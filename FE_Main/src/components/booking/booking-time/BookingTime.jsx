import {Box, FormControl, Grid, NativeSelect, Typography} from "@mui/material";
import {useContext, useEffect} from "react";
import TimeList from "../../../components/time-list/TimeList";
import {BookingContext} from "../../../../context/BookingContext";
import axios from "axios";
import BookingPreview from "../booking-preview/BookingPreview";
import { getListConfig } from "../../../api/booking/bookingApi";
import { useState } from "react";
import { PUBLIC_WITH_TOKEN } from "../../../../public/constant";

const BookingTime = () => {
    const {
        selectedBranch,
        selectedServicesList,
        // timestampsList,
        handleChangeDay,
        currentDatesList,
        setTimestampsList,
        servicesList,
        timestampsList,
        setCurrentDatesList,
        setCurrentTimestampsList,
        currentTimestampsList,
        setTimestampState,
        setSelectedTimestamp,
        setStartTime,
        setEndTime,
        setDuration
    } = useContext(BookingContext);



    const callApiGetListConfig = async (branchCode) => {
        const res = await getListConfig(branchCode)
        if (!res) return
        if (!res.data) return
        setStartTime(res.data.filter(el => el.configKey == "START_WORKING_TIME_IN_DAY")[0].configValue)
        setEndTime(res.data.filter(el => el.configKey == "END_WORKING_TIME_IN_DAY")[0].configValue)
        console.log(res.data)
      }

    useEffect(() => {
        var selectedServicesListId = [];
        const getTimestamps = async () => {
            var currentBranchCode;
            var tempSelectedServicesList;
            currentBranchCode = selectedBranch?.code;
            console.log(currentBranchCode)
            callApiGetListConfig(currentBranchCode)
            tempSelectedServicesList = [...selectedServicesList];
            tempSelectedServicesList.map((item) => {
                selectedServicesListId.push(item.id);
                return null;
            });

            var data = JSON.stringify({
                branchCode: currentBranchCode,
                listServicesId: selectedServicesListId,
            });

            var config = {
                method: "post",
                url: `${PUBLIC_WITH_TOKEN}/appointment-tracking/available-time`,
                headers: {
                    "Content-Type": "application/json",
                },
                data: data,
            };

            axios(config)
                .then(function (response) {
                    setTimestampsList(response.data.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
            // callGetTimestamps(data);
        };
        if(selectedServicesList.length === 0) {
            setTimestampsList([])
            setTimestampState([])
            setSelectedTimestamp(0)
        } else {
            getTimestamps();
        }
    }, [selectedBranch, selectedServicesList, servicesList]);

    useEffect(() => {
        setCurrentTimestampsList([]);
        setCurrentDatesList([]);
        const groupByDate = (list) => {
            var currentGroups;
            list?.reduce((groups, timestamp) => {
                const date = new Date(timestamp).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });
                if (!groups.hasOwnProperty(date)) {
                    groups[date] = [];
                    setCurrentDatesList((currentDatesList) => [
                        ...currentDatesList,
                        date,
                    ]);
                }
                const time = new Date(timestamp).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                });
                groups[date].push({
                    timestamp: timestamp,
                    time: time,
                });
                currentGroups = groups;
                return groups;
            }, []);
            setCurrentTimestampsList(currentGroups);
            var temp = timestampsList;
            if (currentGroups !== undefined && temp !== []) {
                var tempCurrentTimestampsList = Object.entries(currentGroups);
                const keys = Object.keys(tempCurrentTimestampsList);
                setTimestampState(tempCurrentTimestampsList[keys[0]][1]);
            }
        };

        let tempTimeStampsList = timestampsList;
        groupByDate(tempTimeStampsList);
    }, [timestampsList]);

    let tempCurrentDatesList = [...currentDatesList];

    return (
        <Box sx={{maxWidth: 1000, margin: "0 auto"}}>
            <Typography
                variant="h4"
                gutterBottom
                ml={15}
            >
                Chọn thời gian
            </Typography>
            <Grid container sx={{ display: "flex", justifyContent: "center"}}>
                <Grid item xs={7}>
                    <FormControl
                        variant="standard"
                        sx={{m: '0 auto', width: "400px", display: "flex", justifyContent: "center"}}
                    >
                        <p>Ngày</p>
                        <NativeSelect
                            // labelId="day-select"
                            id="day-select"
                            onChange={(e) => handleChangeDay(e)}
                            defaultValue={0}
                            // label="Ngày"
                            sx={{textAlign: "center"}}
                        >
                            {tempCurrentDatesList?.map((key, index) => {
                                return <option key={key} value={index}>{key}</option>;
                            })}
                        </NativeSelect>
                    </FormControl>
                    <TimeList/>
                </Grid>
                <Grid item xs={5}>
                    <BookingPreview/>
                </Grid>
            </Grid>
        </Box>
    );
};

export default BookingTime;
