import * as React from 'react';
import styles from "./post-card.module.scss";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const PostCard = () => {

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Card className={styles.card} my={4} sx={{ textAlign: "center", margin: "0 auto" }} onClick={handleClickOpen}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        image="https://bucket.nhanh.vn/store/24031/art/gio%CC%9B%CC%80_na%CC%80o_du%CC%9Bo%CC%9B%CC%83ng_na%CC%82%CC%81y-01.jpeg"
                        alt="Mặt nạ chuẩn bài dành cho mùa hè"
                    />
                    <CardContent>
                        <Typography className={styles.date} variant="body2" textAlign={"left"} component="div">
                            11.07.2022
                        </Typography>
                        <Typography className={styles.title} gutterBottom textAlign={"left"}>
                            Mặt nạ chuẩn bài dành cho mùa hè
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Thông báo"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Chức năng sẽ sớm được cập nhật
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PostCard;
