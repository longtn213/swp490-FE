import { useState, useEffect } from 'react'

// ** MUI Imports
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import { Box, Grid } from 'mdi-material-ui'
import Typography from 'src/@core/theme/typography'

// ** MUI Imports

const DialogFormSearch = props => {
  const { nameDialog, open, handleClose, onChangeFrom, onChangeTo, name, valueFrom, valueTo } = props

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{nameDialog ? nameDialog : 'Quên chưa đặt tên nè'}</DialogTitle>
      <DialogContent>
        {/* <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
          </DialogContentText> */}
        <TextField
          margin={'dense'}
          id='datetime-local'
          label='Từ ngày'
          type='datetime-local'
          size='small'
          sx={{ width: 250 }}
          InputLabelProps={{
            shrink: true
          }}
          value={valueFrom}
          name={name}
          onChange={onChangeFrom}
        />
        <span style={{ margin: '10px' }}>&nbsp;</span>
        <TextField
          margin={'dense'}
          id='datetime-local'
          label='Đến ngày'
          type='datetime-local'
          size='small'
          sx={{ width: 250 }}
          InputLabelProps={{
            shrink: true
          }}
          value={valueTo}
          name={name}
          onChange={onChangeTo}
          format='MM/dd/yyyy'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogFormSearch
