import {Button, Grid, Paper} from "@mui/material";
import { useState } from "react";
import {useContext} from "react";
import {BookingContext} from "../../../context/BookingContext";

const TimeList = () => {

    const {activeStep, timestampState, selectedTimestamp, setSelectedTimestamp, isFinishable, setIsFinishable, setIsDisabled, 
        startTime, endTime} = useContext(BookingContext)

    // let tempTimestampState = timestampState
    // console.log("timestampState", tempTimestampState);

    const handleChooseTime = (timestamp) => {
        const selectedTime = (new Date(timestamp*1000).toTimeString()).split(" ")[0]
        console.log(selectedTime)
        setSelectedTimestamp(timestamp)
        setIsFinishable(true);
        setIsDisabled(false)
        console.log("timestamp", selectedTimestamp);
    }
    // console.log(list);

    useState(() => {
        if(activeStep === 3) {
          if(selectedTimestamp !== 0 && isFinishable) {
            setIsDisabled(false)
          } else {
            setIsDisabled(true)
          }
        }
      }, [activeStep, selectedTimestamp, isFinishable])

    var tempTimestamp = selectedTimestamp
    console.log("temp", tempTimestamp);

    return (
        <Paper sx={{ m: '16px auto', py: 2, width: "400px", display: "flex", justifyContent: "center", overflow: "auto"}}>
            <Grid
                container
                spacing={{xs: 2, sm: 3, md: 3}}
                columns={{xs: 4, sm: 8, md: 12}}
            >
                {timestampState?.map((time, index) => (
                    <Grid
                        item
                        sx={{display: "flex", justifyContent: "center"}}
                        xs={2}
                        sm={2}
                        md={3}
                        key={index}
                    >
                        <Button variant={tempTimestamp === time.timestamp
                            ? "contained"
                            : "text"}
                            // sx={{
                            //   backgroundColor: (tempTimestamp === time.timestamp)
                            // ? "#EDBB0F"
                            // : "#FFFFFF" ,
                            // }}
                                onClick={() => {
                                    handleChooseTime(time.timestamp)
                                }}>{time.time}</Button>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};

export default TimeList;