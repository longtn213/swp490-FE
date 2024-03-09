import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import {
  Autocomplete,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  NativeSelect,
  Paper,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import { Label } from 'mdi-material-ui'
import DeleteIcon from '@mui/icons-material/Delete'
import { getProfile } from 'src/api/auth/authApi'
import { getAllServices } from 'src/api/service/serviceApi'
import { booking, getTimestamps } from 'src/api/appointment_master/appointmentMasterApi'
import { convertNumberToVND } from 'src/utils/currencyUtils'
import { useRef } from 'react'

import { getListConfigbyBranchCode } from 'src/api/config/configApi'
import { useRouter } from 'next/router'

function DialogBooking(props) {
  const { open, setOpen, setError, setOpenError, onSuccess } = props

  const router = useRouter() 

  const [name, setName] = useState('')
  const [nameError, setNameError] = useState()
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState()
  const [branchData, setBranchData] = useState()
  const [servicesList, setServicesList] = useState([])
  const [selectedServicesList, setSelectedServicesList] = useState([])
  const [serviceError, setServiceError] = useState()

  const [timestampsList, setTimestampsList] = useState([])
  const [currentTimestampsList, setCurrentTimestampsList] = useState([])
  const [currentDatesList, setCurrentDatesList] = useState([])
  const [timestampState, setTimestampState] = useState([])
  const [selectedTimestamp, setSelectedTimestamp] = useState(0)
  const [timestampError, setTimestampError] = useState()

  const [startTime, setStartTime] = useState()
  const [endTime, setEndTime] = useState()

  useEffect(() => {
    if (localStorage.getItem('branch_code')) {
      callApiGetListConfig(localStorage.getItem('branch_code'))
    } else {
      //router.push(`/pages/login`)
    }
  }, [])

  const callApiGetListConfig = async branchCode => {
    const res = await getListConfigbyBranchCode(branchCode)
    if (!res) return
    if (!res.data) return
    setStartTime(res.data.filter(el => el.configKey == 'START_WORKING_TIME_IN_DAY')[0].configValue)
    setEndTime(res.data.filter(el => el.configKey == 'END_WORKING_TIME_IN_DAY')[0].configValue)
    console.log(res.data)
  }

  // Regex
  const nameRegex =
    /^[a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđA-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ0-9]*(?:[ a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđA-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ0-9]*)*$/

  const phoneRegex = /(03|05|07|08|09|01[2|6|8|9]|\+843|\+845|\+847|\+848|\+849|\+841[2|6|8|9])+([0-9]{8})\b/

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

  useEffect(() => {
    if (open) {
      callApiGetProfile()
      callApiGetServices()
    }
  }, [open])

  const callApiGetProfile = async () => {
    const res = await getProfile()
    if (!res) return
    if (!res.data) return
    if (!res.data.branch) {
      setError('Tài khoản này không được phân cho một chi nhánh cụ thể nào, không thể thực hiện việc đặt lịch')
      setOpenError(true)
    }
    if (res.data.branch) {
      setBranchData(res.data.branch)
    }
  }

  const callApiGetServices = async () => {
    const res = await getAllServices()
    if (!res) return
    if (!res.data) return
    console.log(res.data)
    setServicesList(res.data)
  }

  const handleBooking = () => {
    setNameError()
    setPhoneError()
    setEmailError()
    setServiceError()
    setTimestampError()
    if (name.trim() !== '') {
      if (nameRegex.test(name.trim())) {
        setName(name.trim())
      } else {
        setNameError('Tên khách hàng không hợp lệ')
      }
      if (name.trim().length > 255) {
        setNameError('Tên khách hàng không được quá 255 ký tự')
      }
    } else {
      setNameError('Tên khách hàng không được để trống')
    }

    if (phone.trim() !== '') {
      if (phoneRegex.test(phone.trim())) {
        setPhone(phone.trim())
      } else {
        setPhoneError('Số điện thoại không hợp lệ')
      }
    } else {
      setPhoneError('Số điện thoại không được để trống')
    }

    if (email.trim() !== '') {
      if (emailRegex.test(email.trim())) {
        setEmail(email.trim())
      } else {
        setEmailError('Email không hợp lệ')
      }
      if (email.trim().length > 100) {
        setEmailError('Email không được quá 100 ký tự')
      }
    }

    if (selectedServicesList.length == 0) {
      setServiceError('Chưa chọn dịch vụ')
    }

    if (selectedTimestamp == 0) {
      setTimestampError('Chưa chọn thời gian bắt đầu dự kiến')
    }

    if (
      name.trim() === '' ||
      !nameRegex.test(name.trim()) ||
      name.trim().length > 255 ||
      phone.trim() === '' ||
      !phoneRegex.test(phone.trim()) ||
      (email.trim() !== '' && (!emailRegex.test(email.trim()) || email.trim().length > 100)) ||
      selectedServicesList.length == 0 ||
      selectedTimestamp == 0
    )
      return

    console.log('Bookable')
    callApiBooking()
  }

  // Xử lý phần booking
  var datetime = new Date(selectedTimestamp)
  var currentMonth = ('0' + (datetime.getUTCMonth() + 1)).slice(-2) //months from 1-12
  var currentDay = ('0' + datetime.getUTCDate()).slice(-2)
  var currentYear = datetime.getUTCFullYear()

  var timeUTC =
    ('0' + datetime.getUTCHours()).slice(-2) +
    ':' +
    ('0' + datetime.getUTCMinutes()).slice(-2) +
    ':' +
    ('0' + datetime.getUTCSeconds()).slice(-2)

  let bookingTimeUTC = currentYear + '-' + currentMonth + '-' + currentDay + 'T' + timeUTC + 'Z'

  const callApiBooking = async () => {
    var servicesArray = []
    selectedServicesList?.map((item, index) => {
      // endTime = new Date(currentTimestamp + item.duration * 60);
      servicesArray.push({
        expectedStartTime: bookingTimeUTC,
        expectedEndTime: bookingTimeUTC,
        spaServiceId: item.id
      })
    })

    var bookingData = {
      expectedStartTime: bookingTimeUTC,
      customer: {
        fullName: name,
        phoneNumber: phone
      },
      appointmentServices: servicesArray,
      branchId: branchData?.id
    }
    if (email !== '') {
      data.customer.email = email
    }
    console.log(data)

    const data = await booking(bookingData)
    if (!data) return
    console.log(data.meta)
    if (data.meta.code != 200) {
      setError(data.meta.message)
      setOpenError(true)
    }
    if (!data.data) return
    handleClose()
  }

  const handleClose = () => {
    setName('')
    setPhone('')
    setEmail('')
    setNameError()
    setPhoneError()
    setEmailError()
    setBranchData()
    setServicesList([])
    setTimestampsList([])
    setCurrentTimestampsList([])
    setCurrentDatesList([])
    setSelectedServicesList([])
    setTimestampState([])
    setSelectedTimestamp(0)
    setServiceError()
    setTimestampError()
    setOpen(false)
    onSuccess()
  }

  // Xử lý việc chọn và bỏ chọn dịch vụ

  const selectService = id => {
    // console.log("reset timestamp");
    setSelectedTimestamp(0)
    let tempSelectedList = [...selectedServicesList]
    let tempServicesList = [...servicesList]
    const item = servicesList.find(x => x.id === id)
    let sum = 0
    tempSelectedList.map(item => {
      sum += item.duration
    })
    var a = startTime.split(':') // split it at the colons
    var minute1 = +a[0] * 60 + +a[1]
    var b = endTime.split(':') // split it at the colons
    var minute2 = +b[0] * 60 + +b[1]

    console.log(minute2 - minute1)
    console.log(sum)
    if (sum + item.duration <= minute2 - minute1 - 15) {
      tempSelectedList.push(item)
      setSelectedServicesList(tempSelectedList)

      const index = tempServicesList.indexOf(servicesList.find(x => x.id === id))
      if (index > -1) {
        tempServicesList.splice(index, 1)
      }
      setServicesList(tempServicesList)
    } else {
      setServiceError('Bạn không thể chọn quá nhiều dịch vụ, vì số thời gian để thực hiện lịch hẹn sẽ vượt quá khoảng thời gian làm việc của chúng tôi')
    }
  }

  const unselectService = id => {
    // console.log("reset timestamp");
    setServiceError()
    setSelectedTimestamp(0)
    let tempSelectedList = [...selectedServicesList]
    let tempServicesList = [...servicesList]
    const item = selectedServicesList.find(x => x.id === id)
    tempServicesList.push(item)
    tempServicesList.sort((a, b) => a.id - b.id)
    setServicesList(tempServicesList)

    const index = tempSelectedList.indexOf(selectedServicesList.find(x => x.id === id))
    if (index > -1) {
      tempSelectedList.splice(index, 1)
    }
    setSelectedServicesList(tempSelectedList)

    console.log(selectedServicesList)
  }

  // Xử lý chọn thời gian
  const handleChangeDay = e => {
    var tempCurrentTimestampsList = Object.entries(currentTimestampsList)
    const keys = Object.keys(tempCurrentTimestampsList)
    setTimestampState(tempCurrentTimestampsList[keys[e.target.value]][1])
    console.log(e.target.value)
    console.log(tempCurrentTimestampsList[keys[e.target.value]][1])
  }

  useEffect(() => {
    if (branchData && selectedServicesList) {
      if (selectedServicesList.length > 0) {
        callApiGetTimestamps()
      } else {
        setTimestampsList([])
        setCurrentTimestampsList([])
        setCurrentDatesList([])
        setTimestampState([])
        setSelectedTimestamp(0)
      }
    }
  }, [branchData, selectedServicesList])

  const callApiGetTimestamps = async () => {
    let selectedServicesId = []
    selectedServicesList.map(item => {
      selectedServicesId.push(item.id)

      return null
    })

    const data = {
      branchCode: branchData.code,
      listServicesId: selectedServicesId
    }
    const res = await getTimestamps(data)
    if (!res) return
    if (res.meta.code != 200) {
      setError(res.meta.message)
      setOpenError(true)
    }
    if (!res.data) return
    console.log(res.data)
    setTimestampsList(res.data)
  }

  useEffect(() => {
    setCurrentTimestampsList([])
    setCurrentDatesList([])

    const groupByDate = list => {
      var currentGroups
      list?.reduce((groups, timestamp) => {
        const date = new Date(timestamp).toLocaleDateString('vi-VN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
        if (!groups.hasOwnProperty(date)) {
          groups[date] = []
          setCurrentDatesList(currentDatesList => [...currentDatesList, date])
        }

        const time = new Date(timestamp).toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit'
        })
        groups[date].push({
          timestamp: timestamp,
          time: time
        })
        currentGroups = groups

        return groups
      }, [])
      setCurrentTimestampsList(currentGroups)
      var temp = timestampsList
      if (currentGroups !== undefined && temp !== []) {
        var tempCurrentTimestampsList = Object.entries(currentGroups)
        const keys = Object.keys(tempCurrentTimestampsList)
        setTimestampState(tempCurrentTimestampsList[keys[0]][1])
      }
    }

    let tempTimeStampsList = timestampsList
    groupByDate(tempTimeStampsList)
  }, [timestampsList])

  const handleChooseTime = timestamp => {
    setSelectedTimestamp(timestamp)
    setTimestampError(false)
  }

  var tempTimestamp = selectedTimestamp

  // input value của autocomplete

  const [inputValue, setInputValue] = useState('')

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      onKeyPress={ev => {
        if (ev.key === 'Enter') {
          ev.preventDefault()
        }
      }}
      fullWidth
      maxWidth='md'
    >
      <DialogTitle sx={{ textAlign: 'center' }}>Đặt lịch</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} my='auto'>
            <Typography variant='h6'>Thông tin khách hàng</Typography>
          </Grid>
          <Grid item xs={5} my='auto'>
            Tên khách hàng:
          </Grid>
          <Grid item xs={7}>
            <TextField
              sx={{ width: '95%' }}
              required
              id='name'
              label='Nhập tên khách hàng'
              value={name}
              onChange={e => {
                setName(e.target.value)
              }}
              variant='standard'
              error={nameError ? true : false}
              helperText={nameError}
              onFocus={() => setNameError()}
            />
          </Grid>
          <Grid item xs={5} my='auto'>
            Số điện thoại:
          </Grid>
          <Grid item xs={7}>
            <TextField
              sx={{ width: '95%' }}
              required
              id='phone'
              label='Nhập số điện thoại'
              value={phone}
              onChange={e => {
                setPhone(e.target.value)
              }}
              variant='standard'
              error={phoneError ? true : false}
              helperText={phoneError}
              onFocus={() => setPhoneError()}
            />
          </Grid>
          <Grid item xs={5} my='auto'>
            Email:
          </Grid>
          <Grid item xs={7}>
            <TextField
              sx={{ width: '95%' }}
              id='email'
              label='Nhập email'
              value={email}
              onChange={e => {
                setEmail(e.target.value)
              }}
              variant='standard'
              error={emailError ? true : false}
              helperText={emailError}
              onFocus={() => setEmailError()}
            />
          </Grid>
          <Grid item xs={12} my='auto'>
            <Typography variant='h6'>Thông tin lịch hẹn</Typography>
          </Grid>
          <Grid item xs={5} my='auto'>
            Chi nhánh:
          </Grid>
          {branchData && (
            <Grid item xs={7}>
              <Typography>{branchData.name}</Typography>
            </Grid>
          )}
          <Grid item xs={5}>
            Dịch vụ:
          </Grid>
          <Grid item xs={7}>
            <Autocomplete
              inputValue={inputValue}
              disablePortal
              id='combo-box-demo'
              options={servicesList}
              sx={{ width: '95%' }}
              renderInput={params => (
                <TextField
                  error={serviceError ? true : false}
                  helperText={serviceError}
                  onFocus={() => setServiceError()}
                  {...params}
                  onChange={e => {
                    setInputValue(e.target.value)
                  }}
                  onBlur={() => setServiceError()}
                  size='small'
                  label='Chọn dịch vụ'
                />
              )}
              getOptionLabel={service => service.name || ''}
              renderOption={(props, option) => (
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }} {...props}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography>{option.name}</Typography>
                  </Box>
                  <Box>
                    <Typography color='red'>{convertNumberToVND(option.currentPrice)}</Typography>
                  </Box>
                </Box>
              )}
              isOptionEqualToValue={(option, value) => {
                option.code === value.code
              }}
              noOptionsText='Không tìm thấy dịch vụ'
              onChange={(event, newValue) => {
                if (newValue) {
                  selectService(newValue?.id)
                  setInputValue('')
                }
              }}
            />
            {/* {serviceError && (
              <Typography variant='caption' color='red'>
                {serviceError}
              </Typography>
            )} */}
            {selectedServicesList &&
              selectedServicesList.length >= 1 &&
              selectedServicesList.map(item => {
                return (
                  <Box
                    key={item?.id}
                    my={2}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      border: '2px solid black',
                      borderRadius: '8px',
                      paddingLeft: '12px',
                      width: '95%'
                    }}
                  >
                    <Typography my='auto'>{item?.name}</Typography>
                    <Box sx={{ display: 'flex' }}>
                      <Typography my='auto' color='red'>
                        {convertNumberToVND(item?.currentPrice)}
                      </Typography>

                      <Tooltip title='Bỏ chọn dịch vụ này'>
                        <Button my='auto' aria-label='delete' onClick={() => unselectService(item?.id)}>
                          <DeleteIcon sx={{ color: '#000000' }} />
                        </Button>
                      </Tooltip>
                    </Box>
                  </Box>
                )
              })}
          </Grid>
          <Grid item xs={5}>
            Thời gian:
          </Grid>
          <Grid item xs={7}>
            <FormControl variant='standard' sx={{ m: 1, display: 'flex', justifyContent: 'center' }}>
              <NativeSelect
                id='day-select'
                onChange={e => handleChangeDay(e)}
                defaultValue={0}
                sx={{ textAlign: 'center' }}
                error={timestampError ? true : false}
                helperText={timestampError}
                onFocus={() => setTimestampError()}
              >
                {currentDatesList?.map((key, index) => {
                  return (
                    <option key={key} value={index}>
                      {key}
                    </option>
                  )
                })}
              </NativeSelect>
            </FormControl>
            {timestampError && (
              <Typography variant='caption' color='red'>
                {timestampError}
              </Typography>
            )}
            <Paper sx={{ m: 1, display: 'flex', justifyContent: 'center', maxHeight: 200, overflow: 'auto' }}>
              <Grid container spacing={{ xs: 2, sm: 3, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {timestampState?.map((time, index) => (
                  <Grid item sx={{ display: 'flex', justifyContent: 'center' }} xs={2} sm={2} md={3} key={index}>
                    <Button
                      variant={tempTimestamp === time.timestamp ? 'contained' : 'text'}
                      onClick={() => {
                        handleChooseTime(time.timestamp)
                      }}
                    >
                      {time.time}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleClose()
          }}
          variant='outlined'
        >
          Đóng
        </Button>
        <Button variant='contained' onClick={handleBooking}>
          Đặt lịch
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogBooking
