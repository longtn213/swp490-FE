// ** MUI Imports
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material'

// ** MUI Imports

const DialogAlert = props => {
    const {
        nameDialog,
        open,
        handleClose,
        onChangeFrom,
        onChangeTo,
        name,
        valueFrom,
        allertContent,
        callFilterFromProps
    } = props

    const handleUpdate = () => {
        callFilterFromProps()
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle id='alert-dialog-title'>{nameDialog ? nameDialog : 'Quên chưa đặt tên nè'}</DialogTitle>
            <DialogContent>
                <DialogContentText id='alert-dialog-description'>{allertContent}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Đóng</Button>
                <Button onClick={handleUpdate}>Update</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogAlert
