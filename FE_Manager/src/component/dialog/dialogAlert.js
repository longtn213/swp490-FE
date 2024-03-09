import { useState, useEffect } from 'react'

// ** MUI Imports
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import { Box, Grid } from 'mdi-material-ui'
import Typography from 'src/@core/theme/typography'

// ** MUI Imports

const DialogAlert = props => {
  const { nameDialog, open, handleClose, onChangeFrom, onChangeTo, name, valueFrom, allertContent } = props

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{nameDialog ? nameDialog : 'Quên chưa đặt tên nè'}</DialogTitle>
      <DialogContent>
        {/* eslint-disable-next-line react/no-danger-with-children */}
        <p dangerouslySetInnerHTML={{__html: allertContent}}>{}</p> 
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogAlert
