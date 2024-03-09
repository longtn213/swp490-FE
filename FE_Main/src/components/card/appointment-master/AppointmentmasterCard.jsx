import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Button, Grid } from "@mui/material";
import styles from "./appointmentmaster-card.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import { format, fromUnixTime } from 'date-fns';
import { Box } from "@mui/system";
import {
    Check,
    ClockOutline,
    Close,
    CurrencyUsd,
    DotsHorizontal,
    FormatListBulleted,
    ProgressClock
} from 'mdi-material-ui'

const AnswerCard = (props) => {
    const router = useRouter();
    const item = props.item

    const navigate = () => {
        router.push({
            pathname: '/appointment-history/detail',
            query: { id: item.id },
        })
    }

    return (


        // + " "
        //     + (props.item.status.code === "WAITING_FOR_CONFIRMATION" ? styles.pending : "") + " " +
        //     (props.item.status.code === "CANCELED" ? styles.pending1 : "") + " " +
        //     (props.item.status.code === "CLOSED" ? styles.pending2 : "") + " " +
        //     (props.item.status.code === "IN_PROGRESS" ? styles.pending3 : "") + " " +
        //     (props.item.status.code === "READY" ? styles.pending4 : "") + " " +
        //     (props.item.status.code === "PENDING" ? styles.pending5 : "") + " " +
        //     (props.item.status.code === "COMPLETED" ? styles.pending6 : "")

        <Card className={styles.card}
            sx={{ boxShadow: "0px 0px 8px 2px #dcdbff" }} onClick={(e) => {
                navigate()
            }}>
            <CardContent sx={{ width: "100%" }}>
                <Grid container>
                    <Grid
                        item
                        xs={10}
                    >
                        <Typography className={styles.description} component="div">
                            {props.item.status.code === "CLOSED" && (
                                <Box sx={{ fontWeight: "bold", display: "flex" }}>
                                    Trạng thái lịch hẹn: &nbsp; <CurrencyUsd fontSize='50px' sx={{ color: '#51B14F' }} /> &nbsp; <Typography>{props.item.status.name}</Typography>&nbsp;
                                    
                                </Box>
                            )}
                            {props.item.status.code === "WAITING_FOR_CONFIRMATION" && (
                                <Box sx={{ fontWeight: "bold", display: "flex" }}>
                                    Trạng thái lịch hẹn: &nbsp; <FormatListBulleted fontSize='50px' sx={{ color: '#FD8B08' }} /> &nbsp;  <Typography>{props.item.status.name}</Typography>&nbsp;
                                </Box>
                            )}
                            {props.item.status.code === "READY" && (
                                <Box sx={{ fontWeight: "bold", display: "flex" }}>
                                    Trạng thái lịch hẹn: &nbsp; <ClockOutline fontSize='50px' sx={{ color: '#FD8B08' }} /> &nbsp;  <Typography>{props.item.status.name}</Typography>&nbsp;
                                </Box>
                            )}
                            {props.item.status.code === "IN_PROGRESS" && (
                                <Box sx={{ fontWeight: "bold", display: "flex" }}>
                                    Trạng thái lịch hẹn: &nbsp; <ProgressClock fontSize='50px' sx={{ color: '#51B14F' }} /> &nbsp; <Typography>{props.item.status.name}</Typography>&nbsp;
                                </Box>
                            )}
                            {props.item.status.code === "COMPLETED" && (
                                <Box sx={{ fontWeight: "bold", display: "flex" }}>
                                    Trạng thái lịch hẹn: &nbsp; <Check fontSize='50px' sx={{ color: '#D1CABB' }} /> &nbsp; <Typography>{props.item.status.name}</Typography>&nbsp;
                                </Box>
                            )}
                            {props.item.status.code === "CANCELED" && (
                                <Box sx={{ fontWeight: "bold", display: "flex" }}>
                                    Trạng thái lịch hẹn: &nbsp; <Close fontSize='50px' sx={{ color: '#C91310' }} /> &nbsp; <Typography>{props.item.status.name}</Typography>&nbsp;
                                    
                                </Box>
                            )}
                            {props.item.status.code === "PENDING" && (
                                <Box sx={{ fontWeight: "bold", display: "flex" }}>
                                    Trạng thái lịch hẹn: &nbsp; <DotsHorizontal fontSize='50px' sx={{ color: '#51B14F' }} /> &nbsp; <Typography>{props.item.status.name}</Typography>&nbsp;
                                </Box>
                            )}
                        </Typography>
                        <Typography className={styles.description} component="div">
                            <Box sx={{ fontWeight: "bold", display: "flex" }}>
                                Bạn đã đặt lịch vào lúc :  &nbsp; <Typography>{format(fromUnixTime(props.item.createdDate / 1000), 'EEEE P HH:mm')}</Typography>
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item xs={2} sx={{ display: "flex", flexDirection: "row-reverse" }}>
                        <Link href={{ pathname: '/appointment-history/detail', query: { id: item.id } }} passHref>
                            <Button variant="solid"
                                sx={{
                                    border: "30px",
                                    backgroundColor: "rgb(218, 190, 12)",
                                }}>
                                Xem chi tiết
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>

    );
};

export default AnswerCard;