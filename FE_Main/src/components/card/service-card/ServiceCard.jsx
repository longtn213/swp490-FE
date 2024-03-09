import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import styles from "./service-card.module.scss";
import { useRouter } from "next/router";

const ServiceCard = (props) => {
    const router = useRouter();
    const { url } = props


    var item = props.item;

    const currencyFormatter = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    });

    const handleClick = () => {
        router.push(`/service/${item.id}`)
        
    }

    return (
        <CardActionArea onClick={handleClick} sx={{ mx: 1, my: 1 }}>

            <Card
                className={styles.card}
                sx={{
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                {url !== undefined ?
                    <CardMedia
                        component="img"
                        height="auto"
                        image={url}
                        alt={item?.name}
                        sx={{ padding: "1em 1em 0 1em", objectFit: "contain", m: "auto 0" }}
                    ></CardMedia> :
                    <CardMedia
                        component="img"
                        image={"https://bucket.nhanh.vn/store/24031/ps/20220808/08082022040820_thumb_web_01__1__thumb.jpg"}
                        alt={item.name}
                        sx={{ padding: "0.5em 0.5em 0 1em", objectFit: "contain", m: "auto 0" }}
                    ></CardMedia>
                }
                <CardContent sx={{}}>
                    <Typography className={styles.title} gutterBottom variant="body2">
                        {item.name}
                    </Typography>
                    <Typography
                    className={styles.price}
                    variant="h6"
                    component="div"
                    sx={{ mb: 2 }}
                >
                    {currencyFormatter.format(item.currentPrice)}
                </Typography>
                </CardContent>
                
            </Card>
        </CardActionArea>

    );
};

export default ServiceCard;
