import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import {
  Alert,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import { EyeOffOutline, EyeOutline } from 'mdi-material-ui'
import { getAllBranch } from 'src/api/branch/branchApi'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { format } from 'date-fns'
import { createUser } from 'src/api/user/userApi'

function DialogCreateUser(props) {
  const { open, setOpen, handleClose, onSuccess, error, setError, openError, setOpenError } = props

  // ** States
  const [values, setValues] = useState({
    password: '',
    showPassword: false,
    showRePassword: false
  })
  const [username, setUsername] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [ErrorMessage, setErrorMessage] = useState([])

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [ErrorMessage1, setErrorMessage1] = useState([])

  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [ErrorMessage2, setErrorMessage2] = useState([])

  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneNumberError, setPhoneNumberError] = useState('')
  const [ErrorMessage3, setErrorMessage3] = useState([])

  const [passwordError, setPasswordError] = useState('')

  const [branchError, setBranchError] = useState('')
  const [ErrorMessage6, setErrorMessage6] = useState([])

  const [isRePasswordError, setIsRePasswordError] = useState(false)

  const [roleCode, setRoleCode] = useState('CUSTOMER')

  const roleList = [
    // {
    //   id: 1,
    //   name: 'Quản lý',
    //   code: 'MANAGER'
    // },
    {
      id: 2,
      name: 'Khách hàng',
      code: 'CUSTOMER'
    },
    {
      id: 3,
      name: 'Lễ tân',
      code: 'RECEPTIONIST'
    },
    {
      id: 4,
      name: 'Chuyên viên chăm sóc',
      code: 'SPECIALIST'
    }
  ]

  const [branchCode, setBranchCode] = useState('')

  const [branchList, setBranchList] = useState([])

  const [gender, setGender] = useState(null)

  const genderList = [
    {
      id: 0,
      value: true,
      name: 'Nam'
    },
    {
      id: 1,
      value: false,
      name: 'Nữ'
    }
  ]

  const [birthday, setBirthday] = useState(null)

  // Call api get all branch

  useEffect(() => {
    if (open) {
      const callApi = async () => {
        await callApiGetAllBranch()
      }
      callApi()
    }
  }, [open])

  const updateBranchList = data => {
    setBranchList(data)
    console.log(data)
    console.log(branchList)
  }

  const callApiGetAllBranch = async () => {
    const res = await getAllBranch()
    if (!res) return
    if (!res.data) return
    if (res.meta.code != 200) {
      setError(res.meta.message)
      setOpenError(true)

      return
    }

    updateBranchList(res.data)
  }

  const handleCloseDialog = () => {
    setOpen(false)
    handleClose()
    setValues({
      password: '',
      showPassword: false,
      showRePassword: false
    })
    setUsername('')
    setEmail('')
    setName('')
    setPhoneNumber('')
    setIsRePasswordError(false)
    setRoleCode('CUSTOMER')
    setBranchCode('')
    setBranchList([])
    setGender(null)
    setBirthday(null)
    onSuccess()
  }

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  const handleClickShowRePassword = () => {
    setValues({ ...values, showRePassword: !values.showRePassword })
  }

  const handleMouseDownRePassword = event => {
    event.preventDefault()
  }

  // Xử lý đăng ký
  const phoneRegex = /(03|05|07|08|09|01[2|6|8|9]|\+843|\+845|\+847|\+848|\+849|\+841[2|6|8|9])+([0-9]{8})\b/
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  const usernameRegex = /^([a-zA-Z0-9,:\S/-]*)$/gmi
  const SpaceRegex = /^[^\s]+(\s+[^\s]+)*$/g

  const nameRegex =
  /^[a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđA-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ0-9]*(?:[ a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđA-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ0-9]*)*$/

  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{7,19}$/

  const [displayPasswordInfo, setDisplayPasswordInfo] = useState(false)

  const handleCreate = async () => {
    var tempError = []
    var tempError1 = []
    var tempError2 = []
    let isValid = true

    var tempError3 = []
    if (roleCode === 'RECEPTIONIST' || roleCode === 'SPECIALIST') {
      if (branchCode === '') {
        tempError.push('Chi nhánh')
        isValid = false
      }
    }

    if (name.trim() === '') {
      isValid = false
      setNameError(true)
      setErrorMessage2(['Họ tên không được để trống. Vui lòng kiểm tra lại'])
      console.log('1')
    } else if (name.length > 50) {
      isValid = false
      setNameError(true)
      setErrorMessage2(['Trường này chỉ được nhập tối đa 50 kí tự'])
      console.log('2')
    } else if (!nameRegex.test(name)) {
      isValid = false
      setNameError(true)
      setErrorMessage2(['Họ tên không hợp lệ. Vui lòng kiểm tra lại'])
      console.log('3')
    } else {
      setNameError(false)
      setErrorMessage2([''])
    }

    if (roleCode !== 'SPECIALIST') {
      if (username.trim() === '') {
        isValid = false
        setUsernameError(true)
        setErrorMessage(['Tên đăng nhập không được để trống. Vui lòng kiểm tra lại'])
        console.log('11')
      } else if (username.length > 50) {
        isValid = false
        setUsernameError(true)
        setErrorMessage(['Trường này chỉ được nhập tối đa 50 kí tự'])
        console.log('22')
      } else if (!usernameRegex.test(username) || !SpaceRegex.test(username)) {
        isValid = false
        setUsernameError(true)
        setErrorMessage(['Tên đăng nhập không hợp lệ. Vui lòng kiểm tra lại'])
        console.log('33')
      } else {
        setUsernameError(false)
        setErrorMessage([''])
      }

      if (!passwordRegex.test(values.password.trim())) {
        isValid = false
        tempError.push('Mật khẩu')
        setPasswordError(true)
        console.log('111')
      } else if (values.password.length > 20) {
        isValid = false
        tempError1.push('Mật khẩu')
        console.log('222')
      } else {
        setPasswordError(false)
      }

      if (isRePasswordError === true) {
        isValid = false
        tempError.push('Mật khẩu nhập lại')
        console.log('333')
      }
    }
    if (!phoneRegex.test(phoneNumber.trim())) {
      isValid = false
      setPhoneNumberError(true)
      setErrorMessage3(['Số điện thoại không hợp lệ. Vui lòng kiểm tra lại'])
      console.log('1111')
    } else {
      setPhoneNumberError(false)
      setErrorMessage3([''])
    }

    if (Array.isArray(tempError) && tempError.length) {
      setError(tempError.join(', ') + ' không hợp lệ. Vui lòng kiểm tra lại')
      setOpenError(true)

      return
    } else {
      setError('')
      setOpenError(false)
    }

    if (Array.isArray(tempError1) && tempError1.length) {
      setError(tempError1.join(', ') + ' chỉ được nhập tối đa 20 kí tự')
      setOpenError(true)

      return
    } else {
      setError('')
      setOpenError(false)
    }

    if (Array.isArray(tempError3) && tempError3.length) {
      setError(tempError3.join(', ') + ' chỉ được nhập tối đa 256 kí tự')
      setDisplayError(true)

      return
    } else {
      setError('')
      setOpenError(false)
    }
    
    if (isValid) {
      var data = {
        role: {
          code: roleCode
        },
        phoneNumber: phoneNumber,
        fullName: name
      }

      // if (email) {
      //   data.email = email
      // }

      // Xử lý username, password, gender, dob, branch tùy theo role
      if (roleCode !== 'SPECIALIST') {
        data.username = username
        data.password = values.password
      }
      if (roleCode === 'RECEPTIONIST' || roleCode === 'SPECIALIST') {
        data.branch = {
          code: branchCode
        }
      }
      if (gender !== null) {
        data.gender = genderList[gender].value
      }
      if (birthday !== null) {
        data.dob = `${format(birthday, 'yyyy-MM-dd')}T12:00:00Z`
      }

      console.log('api')
      const res = await createUser(data)

      if (!res) return
      console.log(res)
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

  const validationEmail = e => {
    setEmail(e.target.value)
    if (emailRegex.test(e.target.value.trim()) && e.target.value.length <= 50) {
      setEmailError(false)
      setErrorMessage1([''])
    } else {
      setEmailError(true)
      setErrorMessage1(['Sai format và chỉ được nhập số với tối đa 50 kí tự'])
    }
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
      <DialogTitle>Thêm người dùng</DialogTitle>
      <DialogContent>
        <Box mt={3}>
          {/* {displayError && (
                <Alert severity="error" sx={{ marginBottom: 2 }}>
                  {error}
                </Alert>
              )} */}
          <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ marginBottom: 4 }}>
                  <InputLabel required id='demo-simple-select-label'>
                    Vai trò
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={roleCode}
                    label='Vai trò'
                    onChange={e => setRoleCode(e.target.value)}
                  >
                    {roleList.map(item => {
                      return (
                        <MenuItem key={item.id} value={item.code}>
                          {item.name}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </Grid>
              {roleCode !== 'CUSTOMER' && roleCode !== 'MANAGER' && (
                <Grid item xs={12}>
                  {branchList && (
                    <FormControl fullWidth sx={{ marginBottom: 4 }}>
                      <InputLabel required id='demo-simple-select-label'>
                        Chi nhánh
                      </InputLabel>
                      <Select
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        value={branchCode}
                        label='Chi nhánh'
                        onChange={e => setBranchCode(e.target.value)}
                      >
                        {branchList?.map(item => {
                          return (
                            <MenuItem key={item?.id} value={item?.code}>
                              {item?.name}
                            </MenuItem>
                          )
                        })}
                      </Select>
                    </FormControl>
                  )}
                </Grid>
              )}

              <Grid item xs={6}>
                <TextField
                  autoFocus
                  fullWidth
                  label='Họ tên'
                  required
                  value={name}
                  error={nameError}
                  helperText={ErrorMessage2[0]}
                  onChange={e => {
                    setName(e.target.value)
                  }}
                  sx={{ marginBottom: 4 }}
                />
              </Grid>
              {roleCode !== 'SPECIALIST' && (
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id='username'
                    label='Tên đăng nhập'
                    required
                    value={username}
                    error={usernameError}
                    helperText={ErrorMessage[0]}
                    onChange={e => {
                      setUsername(e.target.value)
                    }}
                    sx={{ marginBottom: 4 }}
                  />
                </Grid>
              )}
              {roleCode !== 'SPECIALIST' && (
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor='auth-register-password' required>
                      Mật khẩu
                    </InputLabel>
                    <OutlinedInput
                      label='Mật khẩu'
                      value={values.password}
                      error={passwordError}
                      id='auth-register-password'
                      onChange={handleChange('password')}
                      type={values.showPassword ? 'text' : 'password'}
                      onFocus={() => setDisplayPasswordInfo(true)}
                      onBlur={() => setDisplayPasswordInfo(false)}
                      sx={{ marginBottom: 2 }}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            aria-label='toggle password visibility'
                          >
                            {values.showPassword ? <EyeOutline fontSize='small' /> : <EyeOffOutline fontSize='small' />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
              )}
              {roleCode !== 'SPECIALIST' && (
                <Grid item xs={6}>
                  <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel htmlFor='auth-register-repassword' required error={isRePasswordError}>
                      Nhập lại mật khẩu
                    </InputLabel>
                    <OutlinedInput
                      label='Nhập lại mật khẩu'
                      id='auth-register-repassword'
                      type={values.showRePassword ? 'text' : 'password'}
                      onBlur={e => {
                        e.target.value === values.password ? setIsRePasswordError(false) : setIsRePasswordError(true)
                      }}
                      onChange={e => {
                        if (e.target.value === values.password) setIsRePasswordError(false)
                      }}
                      error={isRePasswordError}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowRePassword}
                            onMouseDown={handleMouseDownRePassword}
                            aria-label='toggle password visibility'
                          >
                            {values.showRePassword ? (
                              <EyeOutline fontSize='small' />
                            ) : (
                              <EyeOffOutline fontSize='small' />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    {isRePasswordError && (
                      <FormHelperText error={isRePasswordError} id='repassword-error'>
                        Không trùng khớp với mật khẩu! Vui lòng kiểm tra lại
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              )}
              {roleCode !== 'SPECIALIST' && (
                <Grid item xs={12}>
                  {displayPasswordInfo && (
                    <Alert severity='info' icon={false}>
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
              )}

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label='Số điện thoại'
                  required
                  value={phoneNumber}
                  error={phoneNumberError}
                  helperText={ErrorMessage3[0]}
                  onChange={e => {
                    setPhoneNumber(e.target.value)
                  }}
                  sx={{ marginBottom: 4 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type='email'
                  label='Email'
                  error={emailError}
                  helperText={ErrorMessage1[0]}
                  onChange={e => validationEmail(e)}
                  sx={{ marginBottom: 4 }}
                />
              </Grid>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Stack spacing={3}>
                    <DesktopDatePicker
                      label='Ngày sinh'
                      inputFormat='dd/MM/yyyy'
                      value={birthday}
                      maxDate={new Date()}
                      inputProps={{readOnly: true}}
                      onChange={value => {
                        setBirthday(value)
                      }}
                      renderInput={params => <TextField onKeyDown={e => e.preventDefault()} {...params} />}
                    />
                  </Stack>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth sx={{ marginBottom: 4 }}>
                  <InputLabel id='demo-simple-select-label'>Giới tính</InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={gender}
                    label='Giới tính'
                    onChange={e => setGender(e.target.value)}
                  >
                    {genderList.map(item => {
                      return (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </form>
        </Box>
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
        <Button variant='contained' onClick={() => handleCreate()}>
          Tạo
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogCreateUser
