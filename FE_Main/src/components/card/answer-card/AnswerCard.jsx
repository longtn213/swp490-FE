import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Button, Grid } from "@mui/material";
import styles from "./answer-card.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import { format, fromUnixTime } from 'date-fns';
import { Box } from "@mui/system";

const AnswerCard = (props) => {
    const router = useRouter();
    const item = props.item

    const navigate = () => {
        router.push({
            pathname: '/sca-history/detail',
            query: { id: item.id },
        })
    }

    return (

        <Card className={styles.card + " " + (props.item.status.code === "WAITING_FOR_RESULT" ? styles.pending : "")} sx={{ boxShadow: "0px 0px 8px 2px #dcdbff" }} onClick={(e) => {
            navigate()
        }}>
            <CardContent sx={{ width: "100%" }}>
                <Grid container>
                    <Grid
                        item
                        xs={10}
                    >
                        <Typography className={styles.description} component="div">

                            Nhân viên {props.item.status.name}
                        </Typography>
                        {props.item.comment !== "" ?
                            <Typography className={styles.title}>
                                <Box sx={{ fontWeight: "bold", display: "flex" }}>
                                    Nội dung tư vấn: &nbsp; <Typography>{props.item.comment}</Typography>
                                </Box>
                            </Typography>
                            :
                            <Typography className={styles.title}>
                                Chưa có tư vấn
                            </Typography>
                        }
                        <Typography className={styles.description} component="div">
                            <Box sx={{ fontWeight: "bold", display: "flex" }}>
                                Bạn đã trả lời bộ câu hỏi vào lúc : &nbsp; <Typography>{format(fromUnixTime(props.item.createdDate / 1000), 'EEEE P HH:mm')}</Typography>
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item xs={2} sx={{ display: "flex", flexDirection: "row-reverse" }}>
                        <Link href={{ pathname: '/sca-history/detail', query: { id: item.id } }} passHref>
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