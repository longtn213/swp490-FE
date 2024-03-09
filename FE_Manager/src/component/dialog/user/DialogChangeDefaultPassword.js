import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import { changePassword } from 'src/api/auth/authApi'
import { Grid, TextField } from '@mui/material'

function DialogChangeDefaultPassword(props) {
  const { open, setOpen, handleClose, onSuccess, error, setError, openError, setOpenError } = props

  const [usernameState, setUsernameState] = useState('')
  const [passwordState, setPasswordState] = useState('Abc@12345')
  const [usernameError, setUsernameError] = useState('')
  const [ErrorMessage, setErrorMessage] = useState([])

  const usernameRegex = /^([a-zA-Z0-9,:\S/-]*)$/gim
  const SpaceRegex = /^[^\s]+(\s+[^\s]+)*$/g

  const handleChangeDefaultPassword = async () => {
    let isValid = true

    if (usernameState.trim() === '') {
      isValid = false
      setUsernameError(true)
      setErrorMessage(['Tên đăng nhập không được để trống. Vui lòng kiểm tra lại'])
      console.log('11')
    } else if (usernameState.length > 50) {
      isValid = false
      setUsernameError(true)
      setErrorMessage(['Trường này chỉ được nhập tối đa 50 kí tự'])
      console.log('22')
    } else if (!usernameRegex.test(usernameState) || !SpaceRegex.test(usernameState)) {
      isValid = false
      setUsernameError(true)
      setErrorMessage(['Tên đăng nhập không hợp lệ. Vui lòng kiểm tra lại'])
      console.log('33')
    } else {
      setUsernameError(false)
      setErrorMessage([''])
    }

    if (isValid) {

      const res = await changePassword(usernameState, passwordState)

      if (!res) return
      if (res.meta.code != 200) {
        setError(res.meta.code)
        setOpenError(true)

        return
      }

      setError('')
      setOpenError(false)
      handleCloseDialog()

      return
    }
  }

  const handleCloseDialog = () => {
    setOpen(false)
    handleClose()
    setUsernameState('')
    setPasswordState('')
    onSuccess()
  }

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
      onKeyPress={ev => {
        if (ev.key === 'Enter') {
          ev.preventDefault()
        }
      }}
    >
      <DialogTitle>Đổi mật khẩu mặc định</DialogTitle>
      <DialogContent>
        <Grid item xs={12}>
          <Grid item xs={6}>
            <TextField
              
              id='username'
              label='Tên đăng nhập'
              required
              value={usernameState}
              error={usernameError}
              helperText={ErrorMessage[0]}
              onChange={e => {
                setUsernameState(e.target.value)
              }}
              sx={{ marginBottom: 4, width: '250px' }}
            />
          </Grid>
          {/* <Grid item xs={6}>
          <TextField
              fullWidth
              id='password'
              label='Mật khẩu'
              required
              value={passwordState}
              onChange={e => {
                setPasswordState(e.target.value)
              }}
              sx={{ marginBottom: 4, width: '250px' }}
            />
          </Grid> */}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleCloseDialog()
          }}
          variant='outlined'
        >
          Đóng
        </Button>
        <Button variant='contained' onClick={() => handleChangeDefaultPassword()}>
          Đổi mật khẩu
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogChangeDefaultPassword
