// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import { useRouter } from 'next/router'
import { Alert, TextField } from '@mui/material'
import { changePassword, login } from '../../api/auth/authApi'

const TabSecurity = () => {
  const router = useRouter()

  // ** States
  const [values, setValues] = useState({
    newPassword: '',
    currentPassword: '',
    showNewPassword: false,
    confirmNewPassword: '',
    showCurrentPassword: false,
    showConfirmNewPassword: false
  })

  const [currentPasswordError, setCurrentPasswordError] = useState(false)
  const [newPasswordError, setNewPasswordError] = useState(false)
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState(false)
  const [changeSuccess, setChangeSuccess] = useState(false)

  // Handle Current Password
  const handleCurrentPasswordChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowCurrentPassword = () => {
    setValues({ ...values, showCurrentPassword: !values.showCurrentPassword })
  }

  const handleMouseDownCurrentPassword = event => {
    event.preventDefault()
  }

  // Handle New Password
  const handleNewPasswordChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }

  const handleMouseDownNewPassword = event => {
    event.preventDefault()
  }

  // Handle Confirm New Password
  const handleConfirmNewPasswordChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
  }

  const handleMouseDownConfirmNewPassword = event => {
    event.preventDefault()
  }

  //Xử lý việc đổi mật khẩu

  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{7,19}$/

  const [displayPasswordInfo, setDisplayPasswordInfo] = useState(false)

  const handleChangePassword = () => {
    setCurrentPasswordError(false)
    setNewPasswordError(false)
    setConfirmNewPasswordError(false)
    setChangeSuccess(false)
    if (!localStorage.getItem('username')) router.push(`/login`)

    if (!values.currentPassword) {
      setCurrentPasswordError(true)
      setValues({ ...values, currentPassword: '', newPassword: '', confirmNewPassword: '' })
      if (!values.newPassword) {
        setNewPasswordError(true)
        if (values.confirmNewPassword) {
          setConfirmNewPasswordError(true)

          return
        }

        return
      }

      return
    }

    callApiLogin(localStorage.getItem('username'), values.currentPassword)

    
  }

  const callApiLogin = async (username, password) => {
    const res = await login(username, password)
    if (!res) return
    if (res.meta.code != 200) {
      setCurrentPasswordError(true)
      setValues({ ...values, currentPassword: '', newPassword: '', confirmNewPassword: '' })

      return
    }

    if (!passwordRegex.test(values.newPassword) || values.currentPassword === values.newPassword) {
      setNewPasswordError(true)
    }

    if (values.confirmNewPassword) {
      if (values.newPassword !== values.confirmNewPassword) {
        setConfirmNewPasswordError(true)
      }
    } else {
      // setConfirmNewPasswordError(true)
    }
    if (values.newPassword && !values.confirmNewPassword) {
      setConfirmNewPasswordError(true)
    }

    if (
      values.newPassword === values.confirmNewPassword &&
      passwordRegex.test(values.newPassword) &&
      passwordRegex.test(values.confirmNewPassword)
    ) {
      callApiChangePassword(localStorage.getItem('username'), values.newPassword)
    }
  }

  const callApiChangePassword = async (username, newPassword) => {
    const res = await changePassword(username, newPassword)
    if (!res) return

    if (res.meta.code == 200) {
      setChangeSuccess(true)
      setValues({ ...values, currentPassword: '', newPassword: '', confirmNewPassword: '' })
    }

    console.log(res)
  }

  return (
    <form>
      <CardContent sx={{ paddingBottom: 0 }}>
        <Box>
          {changeSuccess && (
            <Alert severity='success'>
              Đổi mật khẩu thành công
            </Alert>
          )}
        </Box>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={5}>
              <Grid item xs={12} sx={{ marginTop: 4.75 }}>
                <FormControl fullWidth>
                  {/* <InputLabel htmlFor='account-settings-current-password'>Mật khẩu hiện tại</InputLabel> */}
                  <TextField
                    label='Mật khẩu hiện tại'
                    value={values.currentPassword}
                    id='account-settings-current-password'
                    type={values.showCurrentPassword ? 'text' : 'password'}
                    onChange={handleCurrentPasswordChange('currentPassword')}
                    onFocus={() => setCurrentPasswordError(false)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            aria-label='toggle password visibility'
                            onClick={handleClickShowCurrentPassword}
                            onMouseDown={handleMouseDownCurrentPassword}
                          >
                            {values.showCurrentPassword ? <EyeOutline /> : <EyeOffOutline />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    error={currentPasswordError}
                    helperText={currentPasswordError && 'Mật khẩu hiện tại không đúng, vui lòng kiểm tra lại'}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sx={{ marginTop: 6 }}>
                <FormControl fullWidth>
                  {/* <InputLabel htmlFor='account-settings-new-password'>Mật khẩu mới</InputLabel> */}
                  <TextField
                    label='Mật khẩu mới'
                    value={values.newPassword}
                    id='account-settings-new-password'
                    onChange={handleNewPasswordChange('newPassword')}
                    onFocus={() => {
                      setDisplayPasswordInfo(true)
                      setNewPasswordError(false)
                    }}
                    onBlur={() => setDisplayPasswordInfo(false)}
                    type={values.showNewPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowNewPassword}
                            aria-label='toggle password visibility'
                            onMouseDown={handleMouseDownNewPassword}
                          >
                            {values.showNewPassword ? <EyeOutline /> : <EyeOffOutline />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    error={newPasswordError}
                    helperText={newPasswordError && 'Mật khẩu mới không hợp lệ.'}
                  />
                </FormControl>
                {displayPasswordInfo && (
                  <Alert severity='info' sx={{ marginTop: 4 }} icon={false}>
                    <ul>
                      <li>
                        <Typography variant='caption'>Có từ 8 - 20 ký tự</Typography>
                      </li>
                      <li>
                        <Typography variant='caption'>Bắt đầu bằng chữ cái hoặc chữ số</Typography>
                      </li>
                      <li>
                        <Typography variant='caption'>Có ít nhất 1 chữ cái, 1 chữ số và 1 ký tự đặc biệt</Typography>
                      </li>
                    </ul>
                  </Alert>
                )}
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  {/* <InputLabel htmlFor='account-settings-confirm-new-password'>Nhập lại mật khẩu mới</InputLabel> */}
                  <TextField
                    label='Nhập lại mật khẩu mới'
                    value={values.confirmNewPassword}
                    id='account-settings-confirm-new-password'
                    type={values.showConfirmNewPassword ? 'text' : 'password'}
                    onChange={handleConfirmNewPasswordChange('confirmNewPassword')}
                    onFocus={() => setConfirmNewPasswordError(false)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            aria-label='toggle password visibility'
                            onClick={handleClickShowConfirmNewPassword}
                            onMouseDown={handleMouseDownConfirmNewPassword}
                          >
                            {values.showConfirmNewPassword ? <EyeOutline /> : <EyeOffOutline />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    error={confirmNewPasswordError}
                    helperText={confirmNewPasswordError && 'Mật khẩu nhập lại không trùng khớp với mật khẩu mới.'}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          <Grid item sm={6} xs={12} mt={3} sx={{ display: 'flex', justifyContent: 'center' }}>
            <img width={183} alt='avatar' height={256} src='/images/pages/pose-m-1.png' />
          </Grid>
        </Grid>
      </CardContent>

      <CardContent>
        <Box sx={{ mt: 11 }}>
          <Button variant='contained' sx={{ marginRight: 3.5 }} onClick={() => handleChangePassword()}>
            Đổi mật khẩu
          </Button>
          <Button type='reset' variant='outlined' color='secondary' onClick={() => router.back()}>
            Hủy
          </Button>
        </Box>
      </CardContent>
    </form>
  )
}

export default TabSecurity
