// ** MUI Imports
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Popover,
  Button,
  Select,
  MenuItem,
  FormControl,
  CardActions,
  CardActionArea,
  List,
  ListItem,
  ListItemButton,
  TextField
} from '@mui/material'

// ** Icons Imports
import {
  AccountOutline,
  AccountGroupOutline,
  CellphoneLink,
  ClipboardListOutline,
  FormatListBulleted,
  ClockOutline,
  ProgressClock,
  Check,
  Close,
  ClockRemoveOutline
} from 'mdi-material-ui'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useEffect } from 'react'
import { useState } from 'react'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'
import { getAllServices } from 'src/api/service/serviceApi'
import { getListEquipment } from 'src/api/equipment/equipmentApi'

import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css' // theme css file
import { DateRangePicker, defaultStaticRanges } from 'react-date-range'
import { vi } from 'date-fns/locale'
import {
  areIntervalsOverlapping,
  endOfMonth,
  endOfWeek,
  format,
  getDate,
  getMonth,
  getUnixTime,
  getYear,
  isAfter,
  isBefore,
  isEqual,
  isSameDay,
  setHours,
  setMinutes,
  setSeconds,
  startOfMonth,
  startOfWeek,
  subDays
} from 'date-fns'
import { getAllBranch } from 'src/api/branch/branchApi'
import {
  downloadXLSFile,
  getAMScorecardData,
  getAppointmentPerformance,
  getProductivityInDay
} from 'src/api/dashboard/dashboardApi'
import DialogAlert from 'src/component/dialog/dialogAlert'
import ProductivityInDayChart from 'src/@core/components/dashboard/productivity-in-day-chart'
import RevenueByServiceList from 'src/@core/components/dashboard/revenue-by-service-list'
import { ServiceChart } from 'src/@core/components/dashboard/service-chart'
import { callApiGetProfile, isAccessible } from 'src/api/auth/authApi'
import { useRouter } from 'next/router'
import { DatePicker, LocalizationProvider, PickersDay, StaticDatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { styled } from '@mui/material/styles'
import AppointmentPerformance from 'src/@core/components/dashboard/appointment-performance'
import { getListUserByRole } from 'src/api/user/userApi'
import { timestampToDatetimeLocal, timestampToString } from 'src/utils/timeUtils';

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: prop => prop !== 'dayIsBetween' && prop !== 'isFirstDay' && prop !== 'isLastDay'
})(({ theme, dayIsBetween, isFirstDay, isLastDay }) => ({
  ...(dayIsBetween && {
    borderRadius: 0,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.dark
    }
  }),
  ...(isFirstDay && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.dark
    },
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  }),
  ...(isLastDay && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.dark
    },
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%'
  })
}))

const Dashboard = () => {
  const router = useRouter()

  // Page Authorization
  useEffect(() => {
    callApiGetProfile()

    if (!isAccessible('SSDS_P_DASHBOARD')) {
      router.push('/pages/login')
    }
  }, [router.asPath])

  //=================================================

  // Xác định xem user có phải receptionist hay không, và có được đính kèm branchId hay không

  const [branchList, setBranchList] = useState([])
  const [currentBranchId, setCurrentBranchId] = useState(1)
  const [currentBranchName, setCurrentBranchName] = useState('')

  const [isManager, setIsManager] = useState(true)

  useEffect(() => {
    if (localStorage.getItem('role') == 'RECEPTIONIST') {
      setIsManager(false)
      if (localStorage.getItem('branch_id') === null) {
        router.push(`pages/login`)
      } else {
        setCurrentBranchId(localStorage.getItem('branch_id'))
        setCurrentBranchName(localStorage.getItem('branch_name'))
      }
    }
  }, [router.asPath])

  // ===================================================

  const [serviceAmount, setServiceAmount] = useState(0)
  const [equipmentAmount, setEquipmentAmount] = useState(0)

  // const [specialistState, setSpecialistState] = useState({
  //   working: 0,
  //   idle: 0
  // })

  const [accountState, setAccountState] = useState({
    // customer: 0,
    manager: 0,
    specialist: 0,
    receptionist: 0
  })

  // Xử lý chọn thời gian

  const [timeState, setTimeState] = useState([
    {
      startDate: setSeconds(setMinutes(setHours(new Date(), 0),0),0),
      endDate: setSeconds(setMinutes(setHours(new Date(), 59),59),23),
      key: 'selection'
    }
  ])

  const [period, setPeriod] = useState({
    value: 'day',
    text: 'ngày'
  })

  const [value, setValue] = useState(new Date())

  const renderPickerDay = (date, selectedDates, pickersDayProps) => {
    if (!value) {
      return <PickersDay {...pickersDayProps} />
    }

    var start
    var end

    if (period.value == 'day') {
      start = selectedDates[0]
      end = selectedDates[0]
    }
    if (period.value == 'week') {
      start = startOfWeek(selectedDates[0], { weekStartsOn: 1 })
      if (isAfter(endOfWeek(selectedDates[0], { weekStartsOn: 1 }), new Date())) {
        end = new Date()
      } else {
        end = endOfWeek(selectedDates[0], { weekStartsOn: 1 })
      }
    }
    if (period.value == 'month') {
      start = startOfMonth(selectedDates[0])
      if (isAfter(endOfMonth(selectedDates[0]), new Date())) {
        end = new Date()
      } else {
        end = endOfMonth(selectedDates[0])
      }
    }

    const dayIsBetween = isAfter(date, start) && isBefore(date, end)

    const isFirstDay = isSameDay(start, date)
    const isLastDay = isSameDay(end, date)

    return (
      <CustomPickersDay
        {...pickersDayProps}
        disableMargin
        dayIsBetween={dayIsBetween}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
      />
    )
  }

  useEffect(() => {
    let tempTimestate = timeState
    let tempValue = value
    if (period.value == 'day') {
      tempTimestate[0].startDate = setHours(setMinutes(setSeconds(tempValue, 0),0),0)
      tempTimestate[0].endDate = setHours(setMinutes(setSeconds(tempValue, 59),59),23)
    }
    if (period.value == 'week') {
      tempTimestate[0].startDate = startOfWeek(tempValue, { weekStartsOn: 1 })
      if (isAfter(endOfWeek(tempValue, { weekStartsOn: 1 }), new Date())) {
        tempTimestate[0].endDate = setHours(setMinutes(setSeconds(new Date(), 59),59),23)
      } else {
        tempTimestate[0].endDate = endOfWeek(tempValue, { weekStartsOn: 1 })
      }
    }
    if (period.value == 'month') {
      tempTimestate[0].startDate = startOfMonth(tempValue)
      if (isAfter(endOfMonth(tempValue), new Date())) {
        tempTimestate[0].endDate = setHours(setMinutes(setSeconds(new Date(), 59),59),23)
      } else {
        tempTimestate[0].endDate = endOfMonth(tempValue)
      }
    }
    console.log(tempTimestate)
    setTimeState(tempTimestate)
  }, [value, period])

  // Handle popover
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  //==========================================================

  // Handle dropdown

  const handleChange = event => {
    setCurrentBranchId(event.target.value)
  }

  //===========================================================

  const [appointmentMasterData, setAppointmentMasterData] = useState({
    totalWaitForConfirm: 0,
    totalReady: 0,
    totalInprocess: 0,
    totalClosed: 0,
    totalCanceled: 0,
    totalOverdue: 0
  })

  // Load data khi tải trang
  useEffect(() => {
    callApiService()
    callApiEquipment()
    callApiGetAllUser()
    callApiBranch()
    callApiGetProductivityInDay()
  }, [])

  //Load data khi date range và branch thay đổi
  useEffect(() => {
    callApiGetAMScorecardData()
  }, [timeState, value, period, currentBranchId])

  const callApiService = async () => {
    const data = await getAllServices()
    if (!data) return
    if (data.meta.code != 200) {
      setError(data.meta.message)
      setOpenError(true)

      return
    }
    if (!data.data) return
    const tempList = [...data.data]
    setServiceAmount(tempList?.length)
  }

  const callApiEquipment = async () => {
    const data = await getListEquipment()
    if (!data) return

    // if (data.meta.code !== 200) {
    //   setError(data.meta.message)
    //   setOpenError(true)

    //   return
    // }
    if (!data.data) return
    const tempList = [...data.data]
    setEquipmentAmount(tempList?.length)
  }

  const callApiBranch = async () => {
    const data = await getAllBranch()
    if (!data) return
    if (data.meta.code != 200) {
      setError(data.meta.message)
      setOpenError(true)

      return
    }
    if (!data.data) return

    const tempList = data.data.filter(item => item.isActive === true)
    setBranchList(tempList)

    // setCurrentBranchId(tempList[0].id)
  }

  const callApiGetAMScorecardData = async () => {
    const data = await getAMScorecardData(
      setSeconds(setMinutes(setHours(timeState[0].startDate, 0), 0), 0),
      setSeconds(setMinutes(setHours(timeState[0].endDate, 23), 59), 59),
      currentBranchId
    )
    if (!data) return
    if (data.meta.code != 200) {
      setError(data.meta.message)
      setOpenError(true)

      return
    }
    if (!data.data) return
    const tempList = []
    tempList = data.data
    setAppointmentMasterData(tempList)
  }

  const scorecardData = [
    // {
    //   title: 'Chuyên viên',
    //   data: [
    //     { key: 'Đang làm việc', value: specialistState.working },
    //     { key: 'Chưa có ca', value: specialistState.idle }
    //   ]
    // },
    {
      title: 'Dịch vụ',
      data: [{ key: 'Tổng số dịch vụ', value: serviceAmount }],
      viewAll: '/manage/service'
    },
    {
      title: 'Thiết bị',
      data: [{ key: 'Tổng số loại thiết bị', value: equipmentAmount }],
      viewAll: '/manage/equipment'
    },
    {
      title: 'Tài khoản',
      data: [
        { key: 'Quản lý', value: accountState.manager },
        { key: 'Chuyên viên', value: accountState.specialist },
        { key: 'Lễ tân', value: accountState.receptionist }
      ],
      viewAll: '/manage/user'
    }
  ]

  const callApiGetAllUser = async () => {
    const res1 = await getListUserByRole('MANAGER')
    const res2 = await getListUserByRole('SPECIALIST')
    const res3 = await getListUserByRole('RECEPTIONIST')

    if (!res1) return
    if (!res1.meta) return
    if (!res2) return
    if (!res2.meta) return
    if (!res3) return
    if (!res3.meta) return

    setAccountState({
      manager: res1.meta.total,
      specialist: res2.meta.total,
      receptionist: res3.meta.total
    })
  }

  // Chart
  const [productivityData, setProductivityData] = useState([])

  const callApiGetProductivityInDay = async () => {
    const data = await getProductivityInDay(currentBranchId)
    if (!data) return
    if (data.meta.code != 200) {
      setError(data.meta.message)
      setOpenError(true)

      return
    }
    if (!data.data) return
    const tempList = []
    tempList = data.data
    setProductivityData(tempList)
  }

  // Load callApiGetProductivityInDay khi branchId thay đổi

  useEffect(() => {
    callApiGetProductivityInDay()
  }, [currentBranchId])

  //=============================================================

  // Appointment performance

  const [appointmentPerformanceData, setAppointmentPerformanceData] = useState()

  useEffect(() => {
    callApiGetAppointmentPerformance()
  }, [timeState, value, period, currentBranchId])

  const callApiGetAppointmentPerformance = async () => {
    var startDate = setSeconds(setMinutes(setHours(timeState[0].startDate, 0), 0), 0)
    var endDate = setSeconds(setMinutes(setHours(timeState[0].endDate, 23), 59), 59)

    console.log('Start date: ', startDate)
    console.log('End date: ', endDate)
    console.log('Current date: ', new Date())

    if (getDate(startDate) == getDate(new Date())) {
      setAppointmentPerformanceData()

      return
    }

    if (getDate(endDate) == getDate(new Date()))
      endDate = setSeconds(setMinutes(setHours(subDays(new Date(), 1), 23), 59), 59)

    // if (
    //   areIntervalsOverlapping(
    //     {
    //       start: setSeconds(setMinutes(setHours(timeState[0].startDate, 0), 0), 0),
    //       end: setSeconds(setMinutes(setHours(timeState[0].endDate, 23), 59), 59)
    //     },
    //     {
    //       start: setSeconds(setMinutes(setHours(new Date(), 0), 0), 0),
    //       end: setSeconds(setMinutes(setHours(new Date(), 23), 59), 59)
    //     }
    //   )
    // ) {
    //   console.log('overlapped')
    //   if (
    //     !(
    //       isAfter(
    //         setSeconds(setMinutes(setHours(timeState[0].startDate, 0), 0), 0),
    //         setSeconds(setMinutes(setHours(new Date(), 0), 0), 0)
    //       ) ||
    //       isEqual(
    //         setSeconds(setMinutes(setHours(timeState[0].startDate, 0), 0), 0),
    //         setSeconds(setMinutes(setHours(new Date(), 0), 0), 0)
    //       )
    //     )
    //   ) {
    //     let tempStartDate = startDate
    //     startDate = subDays(tempStartDate, 1)
    //     endDate = setSeconds(setMinutes(setHours(subDays(new Date(), 1), 23), 59), 59)

    //     // if(isEqual(setSeconds(setMinutes(setHours(startDate, 0), 0), 0), setSeconds(setMinutes(setHours(endDate, 0), 0), 0))) {
    //     //   setAppointmentPerformanceData()

    //     //   return
    //     // }
    //   } else {
    //     setAppointmentPerformanceData()

    //     return
    //   }
    // } else {
    //   console.log('not overlapped')
    //   if (
    //     isAfter(
    //       {
    //         start: setSeconds(setMinutes(setHours(timeState[0].startDate, 0), 0), 0),
    //         end: setSeconds(setMinutes(setHours(timeState[0].endDate, 23), 59), 59)
    //       },
    //       {
    //         start: setSeconds(setMinutes(setHours(new Date(), 0), 0), 0),
    //         end: setSeconds(setMinutes(setHours(new Date(), 23), 59), 59)
    //       }
    //     )
    //   ) {
    //     setAppointmentPerformanceData()

    //     return
    //   }
    // }

    const data = await getAppointmentPerformance(
      period.value,
      Date.parse(startDate),
      Date.parse(endDate),
      currentBranchId
    )

    if (!data) return
    if (data.meta.code != 200) {
      setError(data.meta.message)
      setOpenError(true)
      setAppointmentPerformanceData()

      return
    }
    if (!data.data) return

    // console.log(data.data)
    setAppointmentPerformanceData(data.data.performanceByBranch)
  }

  // Export ra file excel

  const handleExportProductivity = () => {
    downloadXLSFile(
      `/dashboard/download-productivity-in-day`,
      `Nang_suat_trong_ngay`,
      setSeconds(setMinutes(setHours(timeState[0].startDate, 0), 0), 0),
      setSeconds(setMinutes(setHours(timeState[0].endDate, 23), 59), 59),
      currentBranchId
    )
  }

  const handleExportRevenueByService = () => {
    downloadXLSFile(
      `/dashboard/download-revenue-by-service`,
      `Doanh_thu_theo_dich_vu_${getDate(timeState[0].startDate)}_${getMonth(timeState[0].startDate)}_${getYear(
        timeState[0].startDate
      )}-${getDate(timeState[0].endDate)}_${getMonth(timeState[0].endDate)}_${getYear(timeState[0].endDate)}`,
      setSeconds(setMinutes(setHours(timeState[0].startDate, 0), 0), 0),
      setSeconds(setMinutes(setHours(timeState[0].endDate, 23), 59), 59),
      currentBranchId
    )
  }

  // Dialog khi có lỗi
  const [error, setError] = useState('')
  const [openError, setOpenError] = useState(false)

  //đóng dialog
  const handleCloseErrorDialog = () => {
    setOpenError(false)
  }

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Typography variant='body1' sx={{ my: 'auto' }}>
            Chọn thời gian:{' '}
          </Typography>
          <Button aria-describedby={id} variant='text' onClick={handleClick}>
            {format(timeState[0].startDate, 'EEEE, dd/MM/yyyy', { locale: vi })} -{' '}
            {format(timeState[0].endDate, 'EEEE, dd/MM/yyyy', { locale: vi })}
          </Button>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
          >
            <Grid container spacing={6}>
              <Grid item xs={4}>
                <List>
                  <ListItemButton
                    sx={period.value == 'day' && { backgroundColor: '#B5B5B5' }}
                    onClick={() => {
                      setPeriod({ value: 'day', text: 'ngày' })
                    }}
                  >
                    Theo ngày
                  </ListItemButton>
                  <ListItemButton
                    sx={period.value == 'week' && { backgroundColor: '#B5B5B5' }}
                    onClick={() => {
                      setPeriod({ value: 'week', text: 'tuần' })
                    }}
                  >
                    Theo tuần
                  </ListItemButton>
                  <ListItemButton
                    sx={period.value == 'month' && { backgroundColor: '#B5B5B5' }}
                    onClick={() => {
                      setPeriod({ value: 'month', text: 'tháng' })
                    }}
                  >
                    Theo tháng
                  </ListItemButton>
                </List>
              </Grid>
              <Grid item xs={8}>
                <LocalizationProvider locale={vi} dateAdapter={AdapterDateFns}>
                  <StaticDatePicker
                    displayStaticWrapperAs='desktop'
                    showDaysOutsideCurrentMonth
                    label={`Chọn ${period.text}`}
                    value={value}
                    onChange={newValue => {
                      setValue(newValue)
                      console.log(newValue)
                    }}
                    maxDate={new Date()}
                    renderDay={renderPickerDay}
                    renderInput={params => <TextField {...params} />}
                    inputFormat="'Week of' MMM d"
                    dayOfWeekFormatter={day => {
                      ;`${day.charAt(0).toUpperCase()}${day.charAt(1).toUpperCase()}`
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Popover>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {isManager ? (
            <>
              <Typography variant='body1' sx={{ my: 'auto', mr: 4 }}>
                Chọn chi nhánh:
              </Typography>
              <FormControl>
                <Select
                  size='small'
                  value={currentBranchId}
                  defaultValue={currentBranchId}
                  onChange={e => handleChange(e)}
                >
                  {branchList?.map((item, key) => {
                    return (
                      <MenuItem key={key} value={item?.id}>
                        {item?.name}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </>
          ) : (
            <Typography variant='body1' sx={{ my: 'auto', mr: 4 }}>
              Chi nhánh: {currentBranchName}
            </Typography>
          )}
        </Box>
      </Box>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Grid container spacing={6}>
            {/* <Grid item xs={6} lg={3}>
              <CardStatisticsVerticalComponent
                icon={<AccountOutline sx={{ fontSize: '1.75rem' }} />}
                color='success'
                title='Chuyên viên'
                data={scorecardData[0].data}
                height={180}
              />
            </Grid> */}
            {/* <Grid item xs={6} lg={3}> */}
            <Grid item xs={4}>
              <CardStatisticsVerticalComponent
                title='Dịch vụ'
                color='secondary'
                icon={<ClipboardListOutline sx={{ fontSize: '1.75rem' }} />}
                data={scorecardData[0].data}
                height={180}
                action={scorecardData[0].viewAll}
              />
            </Grid>
            {/* <Grid item xs={6} lg={3}> */}
            <Grid item xs={4}>
              <CardStatisticsVerticalComponent
                title='Thiết bị'
                icon={<CellphoneLink sx={{ fontSize: '1.75rem' }} />}
                data={scorecardData[1].data}
                height={180}
                action={scorecardData[1].viewAll}
                color='primary'
              />
            </Grid>
            {/* <Grid item xs={6} lg={3}> */}
            <Grid item xs={4}>
              <CardStatisticsVerticalComponent
                color='warning'
                title='Tài khoản'
                icon={<AccountGroupOutline sx={{ fontSize: '1.75rem' }} />}
                data={scorecardData[2].data}
                action={scorecardData[2].viewAll}
                height={180}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <CardHeader
                title='Thống kê lịch hẹn'
                titleTypographyProps={{ sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' } }}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <CardContent>
                {isAccessible('SSDS_C_DASHBOARD_SCORE_CARD') && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      flexWrap: 'wrap'
                    }}
                  >
                    <Grid container>
                      <Grid item xs={4}>
                        <Box>
                          <CardActionArea
                            sx={{ display: 'flex', mb: 3, width: 'fit-content', padding: 3 }}
                            onClick={() => {
                              localStorage.setItem('AM_init_status_code', 'WAITING_FOR_CONFIRMATION')
                              localStorage.setItem('AM_init_created_date_from', timestampToDatetimeLocal(getUnixTime(timeState[0].startDate) * 1000))
                              localStorage.setItem('AM_init_created_date_to', timestampToDatetimeLocal(getUnixTime(timeState[0].endDate) * 1000))
                              localStorage.setItem('AM_init_created_date_from_text', timestampToString(getUnixTime(timeState[0].startDate) * 1000))
                              localStorage.setItem('AM_init_created_date_to_text', timestampToString(getUnixTime(timeState[0].endDate) * 1000))
                              router.push('/manage/appointment_master/')
                            }}
                          >
                            <Avatar sx={{ boxShadow: 3, marginRight: 4, color: 'black' }}>
                              <FormatListBulleted />
                            </Avatar>
                            <Typography variant='body1' my='auto'>
                              Chờ xác nhận: <strong>{appointmentMasterData.totalWaitForConfirm}</strong>
                            </Typography>
                          </CardActionArea>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box>
                          <CardActionArea
                            sx={{ display: 'flex', mb: 3, width: 'fit-content', padding: 3 }}
                            onClick={() => {
                              localStorage.setItem('AM_init_status_code', 'READY')
                              localStorage.setItem('AM_init_created_date_from', timestampToDatetimeLocal(getUnixTime(timeState[0].startDate) * 1000))
                              localStorage.setItem('AM_init_created_date_to', timestampToDatetimeLocal(getUnixTime(timeState[0].endDate) * 1000))
                              localStorage.setItem('AM_init_created_date_from_text', timestampToString(getUnixTime(timeState[0].startDate) * 1000))
                              localStorage.setItem('AM_init_created_date_to_text', timestampToString(getUnixTime(timeState[0].endDate) * 1000))
                              router.push('/manage/appointment_master/')
                            }}
                          >
                            <Avatar sx={{ boxShadow: 3, marginRight: 4, color: 'black' }}>
                              <ClockOutline />
                            </Avatar>
                            <Typography variant='body1' my='auto'>
                              Chờ thực hiện: <strong>{appointmentMasterData.totalReady}</strong>
                            </Typography>
                          </CardActionArea>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box>
                          <CardActionArea
                            sx={{ display: 'flex', mb: 3, width: 'fit-content', padding: 3 }}
                            onClick={() => {
                              localStorage.setItem('AM_init_status_code', 'IN_PROGRESS')
                              localStorage.setItem('AM_init_actual_start_time_from', timestampToDatetimeLocal(getUnixTime(timeState[0].startDate) * 1000))
                              localStorage.setItem('AM_init_actual_start_time_to', timestampToDatetimeLocal(getUnixTime(timeState[0].endDate) * 1000))
                              localStorage.setItem('AM_init_actual_start_time_from_text', timestampToString(getUnixTime(timeState[0].startDate) * 1000))
                              localStorage.setItem('AM_init_actual_start_time_to_text', timestampToString(getUnixTime(timeState[0].endDate) * 1000))
                              router.push('/manage/appointment_master/')
                            }}
                          >
                            <Avatar sx={{ boxShadow: 3, marginRight: 4, color: 'black' }}>
                              <ProgressClock />
                            </Avatar>
                            <Typography variant='body1' my='auto'>
                              Đang thực hiện: <strong>{appointmentMasterData.totalInprocess}</strong>
                            </Typography>
                          </CardActionArea>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box>
                          <CardActionArea
                            sx={{ display: 'flex', mb: 3, width: 'fit-content', padding: 3 }}
                            onClick={() => {
                              localStorage.setItem('AM_init_status_code', 'CLOSED')
                              localStorage.setItem('AM_init_actual_end_time_from', timestampToDatetimeLocal(getUnixTime(timeState[0].startDate) * 1000))
                              localStorage.setItem('AM_init_actual_end_time_to', timestampToDatetimeLocal(getUnixTime(timeState[0].endDate) * 1000))
                              localStorage.setItem('AM_init_actual_end_time_from_text', timestampToString(getUnixTime(timeState[0].startDate) * 1000))
                              localStorage.setItem('AM_init_actual_end_time_to_text', timestampToString(getUnixTime(timeState[0].endDate) * 1000))
                              router.push('/manage/appointment_master/')
                            }}
                          >
                            <Avatar sx={{ boxShadow: 3, marginRight: 4, color: 'black' }}>
                              <AttachMoneyIcon />
                            </Avatar>
                            <Typography variant='body1' my='auto'>
                              Hoàn tất thanh toán: <strong>{appointmentMasterData.totalClosed}</strong>
                            </Typography>
                          </CardActionArea>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box>
                          <CardActionArea
                            sx={{ display: 'flex', mb: 3, width: 'fit-content', padding: 3 }}
                            onClick={() => {
                              localStorage.setItem('AM_init_status_code', 'CANCELED')
                              localStorage.setItem('AM_init_cancel_time_from', timestampToDatetimeLocal(getUnixTime(timeState[0].startDate) * 1000))
                              localStorage.setItem('AM_init_cancel_time_to', timestampToDatetimeLocal(getUnixTime(timeState[0].endDate) * 1000))
                              localStorage.setItem('AM_init_cancel_time_from_text', timestampToString(getUnixTime(timeState[0].startDate) * 1000))
                              localStorage.setItem('AM_init_cancel_time_to_text', timestampToString(getUnixTime(timeState[0].endDate) * 1000))
                              router.push('/manage/appointment_master/')
                            }}
                          >
                            <Avatar sx={{ boxShadow: 3, marginRight: 4, color: 'black' }}>
                              <Close />
                            </Avatar>
                            <Typography variant='body1' my='auto'>
                              Đã hủy: <strong>{appointmentMasterData.totalCanceled}</strong>
                            </Typography>
                          </CardActionArea>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box>
                          <CardActionArea
                            sx={{ display: 'flex', mb: 3, width: 'fit-content', padding: 3 }}
                            onClick={() => {
                              localStorage.setItem('AM_init_overdue_status', 'OVERDUE')
                              localStorage.setItem('AM_init_created_date_from', timestampToDatetimeLocal(getUnixTime(timeState[0].startDate) * 1000))
                              localStorage.setItem('AM_init_created_date_to', timestampToDatetimeLocal(getUnixTime(timeState[0].endDate) * 1000))
                              localStorage.setItem('AM_init_created_date_from_text', timestampToString(getUnixTime(timeState[0].startDate) * 1000))
                              localStorage.setItem('AM_init_created_date_to_text', timestampToString(getUnixTime(timeState[0].endDate) * 1000))
                              router.push('/manage/appointment_master/')
                            }}
                          >
                            {/* <CardContent sx={{ display: 'flex', mb: 3, width: 'fit-content', padding: 3 }}> */}
                            <Avatar sx={{ boxShadow: 3, marginRight: 4, color: 'black' }}>
                              <ClockRemoveOutline />
                            </Avatar>
                            <Typography variant='body1' my='auto'>
                              Trễ hẹn: <strong>{appointmentMasterData.totalOverdue}</strong>
                            </Typography>
                            {/* </CardContent> */}
                          </CardActionArea>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </CardContent>
            </Box>
          </Card>
        </Grid>
        {isAccessible('SSDS_C_DASHBOARD_PRODUCTIVITY_IN_DAY') && (
          <Grid item xs={12}>
            <Card>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <CardHeader
                  title='Mật độ lịch hẹn trong ngày'
                  titleTypographyProps={{ sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' } }}
                />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardContent>
                  <Box>
                    <Box mx={8} mb={0} sx={{ height: 320 }}>
                      <ProductivityInDayChart data={productivityData} />
                    </Box>
                    {isAccessible('SSDS_C_DASHBOARD_DOWNLOAD_PRODUCTIVITY_IN_DAY') && (
                      <Box mr={5} mb={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant='contained' size='small' onClick={() => handleExportProductivity()}>
                          <Typography variant='body2' sx={{ color: 'white' }}>
                            Xuất dữ liệu
                          </Typography>
                        </Button>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Box>
            </Card>
          </Grid>
        )}
        {isAccessible('SSDS_C_DASHBOARD_APPOINTMENT_PERFORMANCE') && (
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title='Chỉ số quan trọng'
                titleTypographyProps={{ sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' } }}
              />
              <CardContent>
                <Box mx={2} mb={0}>
                  <AppointmentPerformance data={appointmentPerformanceData} period={period} timeState={timeState} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
        {isAccessible('SSDS_C_DASHBOARD_REVENUE_BY_SERVICE') && (
          <>
            <Grid item xs={12} lg={6}>
              <Card>
                <CardHeader
                  title='Doanh thu theo dịch vụ'
                  titleTypographyProps={{ sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' } }}
                />
                <CardContent
                  sx={{ height: 'inherit', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                  <RevenueByServiceList
                    startTime={setSeconds(setMinutes(setHours(timeState[0].startDate, 0), 0), 0)}
                    endTime={setSeconds(setMinutes(setHours(timeState[0].endDate, 23), 59), 59)}
                    branchId={currentBranchId}
                  />
                  <Box mb={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant='contained' size='small' onClick={() => handleExportRevenueByService()}>
                      <Typography variant='body2' sx={{ color: 'white' }}>
                        Xuất dữ liệu
                      </Typography>
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Card>
                <CardHeader
                  title='Thống kê dịch vụ'
                  titleTypographyProps={{ sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' } }}
                />
                <CardContent
                  sx={{ height: 'inherit', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                  <Box mb={0} sx={{ height: 505 }}>
                    <ServiceChart
                      startTime={setSeconds(setMinutes(setHours(timeState[0].startDate, 0), 0), 0)}
                      endTime={setSeconds(setMinutes(setHours(timeState[0].endDate, 23), 59), 59)}
                      branchId={currentBranchId}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
      <DialogAlert
        nameDialog={'Có lỗi xảy ra'}
        open={openError}
        allertContent={error}
        handleClose={handleCloseErrorDialog}
      />
    </>
  )
}

export default Dashboard
