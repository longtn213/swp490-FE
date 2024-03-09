// ** MUI Imports
import { Button, Dialog, DialogActions, DialogContent, DialogTitle,  } from '@mui/material'

// ** MUI Imports

const CustomDialogConfirm1 = props => {
  const { nameDialog, open, handleConfirm, children, id } = props

  return (
    <Dialog
      open={open}
      onClose={handleConfirm}
    >
      <DialogTitle id='alert-dialog-title'>{nameDialog ? nameDialog : 'Quên chưa đặt tên nè'}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button variant='contained' style={{ backgroundColor: 'red' }} onClick={() => handleConfirm(false)}>
          Đóng
        </Button>
        <Button variant='contained' onClick={() => handleConfirm(true)}>
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CustomDialogConfirm1