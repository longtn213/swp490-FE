import { Box, Button, Grid, List, ListItem, ListItemButton, ListItemText, Paper, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useContext, useEffect } from "react";
// import axios from "axios";
import { BookingContext } from "../../../../context/BookingContext";
import BookingPreview from "../booking-preview/BookingPreview";

const style = {
    width: "400px",
    maxWidth: 360,
    bgcolor: "background.paper",
    margin: "0 auto 16px auto"
};

const BookingService = () => {
    const {
        selectedServicesList,
        servicesList,
        selectService,
        unselectService,
        setIsNextable2,
        setIsDisabled
    } = useContext(BookingContext);

    const currencyFormatter = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    });

    // var temp = [...selectedServicesList];

    // useEffect(() => {
    //     temp = [...selectedServicesList];
    // }, []);

    // useEffect(() => {
    //     temp = [...selectedServicesList];
    // }, [selectedServicesList]);

    useEffect(() => {
        if (selectedServicesList.length !== 0) {
            setIsNextable2(true);
            setIsDisabled(false)
        } else {
            setIsNextable2(false)
            setIsDisabled(true)
        }
    }, [selectedServicesList])

    return (
        <Box sx={{ maxWidth: 1000, margin: "0 auto" }}>
            <Typography
                ml={15}
                variant="h4"
                gutterBottom
            >
                Chọn dịch vụ
            </Typography>
            <Grid
                container
                sx={{ display: "flex", justifyContent: "center" }}
            >
                <Grid item xs={7}>
                    {/* <Box
                        sx={temp.length !== 0 ? {display: "block"} : {display: "none"}}
                    >
                        <Typography variant="h5" sx={{textAlign: "center"}}>Dịch vụ đã chọn</Typography>
                        <List sx={style} component="nav" aria-label="mailbox folders">
                            {selectedServicesList?.map((service, index) => {
                                // console.log(service);
                                return (
                                    <ListItem key={index}>
                                        <ListItemText primary={service?.name}/>
                                        <Button
                                            variant="outline"
                                            onClick={() => unselectService(service?.id)}
                                        >
                                            <CloseIcon/>
                                        </Button>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box> */}
                    <Typography variant="h5" sx={{ textAlign: "center" }}>Danh sách dịch vụ</Typography>
                    <Paper style={{ maxWidth: 400, maxHeight: 400, overflow: "auto", margin: "0 auto" }}>
                        <List sx={style} component="nav" aria-label="mailbox folders">
                            {servicesList?.map((service, index) => {
                                if (service.isActive === true) {
                                    return (
                                        <ListItemButton key={index} onClick={() => selectService(service?.id)}>
                                            <ListItem>
                                                <ListItemText primary={service?.name} />
                                                <p style={{ color: "red" }}>
                                                    {currencyFormatter.format(service?.currentPrice)}{" "}
                                                </p>
                                            </ListItem>
                                        </ListItemButton>
                                    );
                                }
                            })}
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={5}>
                    <BookingPreview />
                </Grid>
            </Grid>
        </Box>
    );
};

export default BookingService;
