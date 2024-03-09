import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {CardActionArea} from "@mui/material";
import styles from "./spaService-card.module.scss";
import {useRouter} from "next/router";

const ServiceCard = (props) => {
    const router = useRouter();

    const item = props.item

    const currencyFormatter = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    });

    return (
        <CardActionArea onClick={() => router.push(`/service/${item.id}`)} sx={{mx: 1, my: 1}}>

            <Card
                className={styles.card}
                sx={{
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <CardContent sx={{}}>
                    <Typography className={styles.title} gutterBottom variant="body2">
                        {item.name}
                    </Typography>
                </CardContent>
                <Typography
                    className={styles.price}
                    variant="h6"
                    component="div"
                    sx={{mb: 2}}
                >
                    {currencyFormatter.format(item.currentPrice)}
                </Typography>
            </Card>
        </CardActionArea>

    );
};

export default ServiceCard;
