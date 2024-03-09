import React, {useEffect, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

function CommonAlert(props) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(props.open);
    }, [props]);

    const handleOk = () => {
        if (props.okCallback) {
            props.okCallback(props.param ? props.param : null);
        }
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
        if (props.cancelCallback) {
            props.cancelCallback();
        }
    };

    return (
        <Dialog open={open} onClose={handleCancel}>
            <DialogTitle>{props.title || "Chú ý"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {props.message || "Bạn có muốn tiếp tục không?"}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{display: "flex", justifyContent: "center"}}>
                <Button variant="outlined" onClick={handleOk}>{props.okLabel || "OK"}</Button>
                {!props.variant &&
                    <Button onClick={handleCancel}>{props.cancelLabel || "Cancel"}</Button>}
            </DialogActions>
        </Dialog>
    );
}

export default CommonAlert;