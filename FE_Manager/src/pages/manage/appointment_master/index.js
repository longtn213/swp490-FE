import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { Button, TextField, Box, IconButton, Tooltip, Drawer, ListItemIcon, ListItemText } from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import CalendarImportOutline from 'mdi-material-ui/CalendarImport'
import CalendarExportOutline from 'mdi-material-ui/CalendarExport'

//Component import
import DataTable from '../../../component/table/dataTable'
import DialogFormSearch from '../../../component/dialog/dialogForSelectDate'
import DialogAlert from '../../../component/dialog/dialogAlert'
import * as DrawerAppointmentMaster from '../../../component/drawer/drawerAppointmentMaster'

//API import
import { filterAppointmentMaster } from '../../../api/appointment_master/appointmentMasterApi'
import { getAppMasterStatus, getAppMasterReasonCancel, getAppMasterConfirmAction } from '../../../api/common/commonApi'
import { callApiGetProfile, isAccessible } from 'src/api/auth/authApi'

//utils import
import { timestampToString, reformatDateForView, reformatDateForQuery } from '../../../utils/timeUtils'
import { convertNumberToVND } from 'src/utils/currencyUtils'
import {
  Check,
  ClockOutline,
  Close,
  CurrencyUsd,
  DotsHorizontal,
  FormatListBulleted,
  ProgressClock
} from 'mdi-material-ui'
import { makeStyles } from '@material-ui/core'
import { useRouter } from 'next/router'
import DialogBooking from 'src/component/dialog/appointment_master/dialogBooking'
import { Cancel, CheckCircle } from '@mui/icons-material'

const ManageAppointmentAdmin = () => {
  const router = useRouter()

  // Page Authorization

  useEffect(() => {
    callApiGetProfile()
    if (!isAccessible('SSDS_P_AM')) {
      router.push('/')
    }
  }, [router.asPath])

  //=================================================

  //====================================================================================
  //PAGINATION HANDLING
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [count, setCount] = useState(0)

  const callFilterFromProps = (pageProp, sizeProp) => {
    callFilter(pageProp, sizeProp)
  }

  //====================================================================================
  //Chuẩn bị data để truyền vào bảng
  //Table header
  const listTableCellHead = [
    {
      name: 'Mã lịch hẹn'
    },
    {
      name: 'Tên khách hàng',
      genFormSearch: () => {
        return (
          <TextField
            id='outlined-search'
            type='search'
            size='small'
            sx={{ width: 150 }}
            name='customerFullName'
            onChange={onChangeTextAndSelectField}
            value={customerFullName.value}
          />
        )
      }
    },
    {
      name: 'Số điện thoại',
      genFormSearch: () => {
        return (
          <TextField
            id='outlined-search'
            type='search'
            size='small'
            sx={{ width: 150 }}
            name='customerPhoneNumber'
            onChange={onChangeNumberField}
            value={customerPhoneNumber.value}
          />
        )
      }
    },
    {
      name: 'Trạng thái',
      genFormSearch: () => {
        return (
          <FormControl>
            <Select
              labelId='status-select-label'
              id='demo-simple-select'
              name='statusName'
              size='small'
              value={statusName.value}
              onChange={onChangeTextAndSelectField}
              sx={{ width: 250 }}
              classes={{ select: classes.root }}
            >
              {listStatus &&
                listStatus.length > 0 &&
                listStatus.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item?.code}>
                      <ListItemIcon>{setStatusIcon(item?.code)}</ListItemIcon>
                      <ListItemText primary={item?.name} />
                      {/* <Typography>{item?.name}</Typography> */}
                    </MenuItem>
                  )
                })}
            </Select>
          </FormControl>
        )
      }
    },
    {
      name: 'Trạng thái lịch hẹn',
      genFormSearch: () => {
        return (
          <FormControl>
            <Select
              labelId='status-select-label'
              id='demo-simple-select'
              name='overdueStatus'
              size='small'
              value={overdueStatus.value}
              onChange={onChangeTextAndSelectField}
              sx={{ width: 250 }}
              classes={{ select: classes.root }}
            >
              <MenuItem value=''>
                <ListItemIcon></ListItemIcon>
                <ListItemText primary='Tất cả' />
                {/* <Typography>{item?.name}</Typography> */}
              </MenuItem>
              <MenuItem value='ONTIME'>
                <ListItemIcon>{setStatusIcon('ONTIME')}</ListItemIcon>
                <ListItemText primary='Đúng hẹn' />
                {/* <Typography>{item?.name}</Typography> */}
              </MenuItem>
              <MenuItem value='OVERDUE'>
                <ListItemIcon>{setStatusIcon('OVERDUE')}</ListItemIcon>
                <ListItemText primary='Trễ hẹn' />
                {/* <Typography>{item?.name}</Typography> */}
              </MenuItem>
            </Select>
          </FormControl>
        )
      }
    },
    {
      name: 'Tạm tính',
      genFormSearch: () => {
        return (
          <TextField
            id='outlined-search'
            type='search'
            size='small'
            sx={{ width: 150 }}
            name='total'
            onChange={onChangeNumberField}
            value={total.value}
          />
        )
      }
    },
    {
      name: 'Thành tiền',
      genFormSearch: () => {
        return (
          <TextField
            id='outlined-search'
            type='search'
            size='small'
            sx={{ width: 150 }}
            name='payAmount'
            onChange={onChangeNumberField}
            value={payAmount.value}
          />
        )
      }
    },
    {
      name: 'Thời gian bắt đầu dự kiến',
      genFormSearch: () => {
        return (
          <Button variant='outlined' onClick={handleClickOpenExpectedStartTime}>
            {(expectedStartTime.value.fromText ? expectedStartTime.value.fromText : 'Chưa chọn') +
              ' - ' +
              (expectedStartTime.value.toText ? expectedStartTime.value.toText : 'Chưa chọn')}
          </Button>
        )
      }
    },
    {
      name: 'Thời gian kết thúc dự kiến',
      genFormSearch: () => {
        return (
          <Button variant='outlined' onClick={handleClickOpenExpectedEndTime}>
            {(expectedEndTime.value.fromText ? expectedEndTime.value.fromText : 'Chưa chọn') +
              ' - ' +
              (expectedEndTime.value.toText ? expectedEndTime.value.toText : 'Chưa chọn')}
          </Button>
        )
      }
    },
    {
      name: 'Thời gian bắt đầu thực tế',
      genFormSearch: () => {
        return (
          <Button variant='outlined' onClick={handleClickOpenActualStartTime}>
            {(actualStartTime.value.fromText ? actualStartTime.value.fromText : 'Chưa chọn') +
              ' - ' +
              (actualStartTime.value.toText ? actualStartTime.value.toText : 'Chưa chọn')}
          </Button>
        )
      }
    },
    {
      name: 'Thời gian kết thúc thực tế',
      genFormSearch: () => {
        return (
          <Button variant='outlined' onClick={handleClickOpenActualEndTime}>
            {(actualEndTime.value.fromText ? actualEndTime.value.fromText : 'Chưa chọn') +
              ' - ' +
              (actualEndTime.value.toText ? actualEndTime.value.toText : 'Chưa chọn')}
          </Button>
        )
      }
    },
    {
      name: 'Thời gian hủy',
      genFormSearch: () => {
        return (
          <Button variant='outlined' onClick={handleClickOpenCancelTime}>
            {(cancelTime.value.fromText ? cancelTime.value.fromText : 'Chưa chọn') +
              ' - ' +
              (cancelTime.value.toText ? cancelTime.value.toText : 'Chưa chọn')}
          </Button>
        )
      }
    },
    {
      name: 'Lý do hủy',
      genFormSearch: () => {
        return (
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id='status-select-label'>Lý do hủy</InputLabel>
            <Select
              labelId='status-select-label'
              id='demo-simple-select'
              label='Lý do hủy'
              size='small'
              name='canceledReason'
              value={canceledReason.value}
              onChange={onChangeTextAndSelectField}
              sx={{ width: 150 }}
            >
              {listReasonCancel &&
                listReasonCancel.length > 0 &&
                listReasonCancel.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item?.code}>
                      {item?.name}
                    </MenuItem>
                  )
                })}
            </Select>
          </FormControl>
        )
      }
    },
    {
      name: 'Ghi chú',
      genFormSearch: () => {
        return (
          <TextField
            id='outlined-search'
            type='search'
            size='small'
            sx={{ width: 150 }}
            name='note'
            onChange={onChangeTextAndSelectField}
            value={note.value}
          />
        )
      }
    },
    {
      name: 'Ngày tạo',
      genFormSearch: () => {
        return (
          <Button variant='outlined' onClick={handleClickOpenCreatedDate}>
            {(createdDate.value.fromText ? createdDate.value.fromText : 'Chưa chọn') +
              ' - ' +
              (createdDate.value.toText ? createdDate.value.toText : 'Chưa chọn')}
          </Button>
        )
      }
    },
    {
      name: 'Người tạo',
      genFormSearch: () => {
        return (
          <TextField
            id='outlined-search'
            type='search'
            size='small'
            sx={{ width: 150 }}
            name='createdBy'
            onChange={onChangeTextAndSelectField}
            value={createdBy.value}
          />
        )
      }
    },
    {
      name: 'Ngày cập nhật',
      genFormSearch: () => {
        return (
          <Button variant='outlined' onClick={handleClickOpenLastModifiedDate}>
            {(lastModifiedDate.value.fromText ? lastModifiedDate.value.fromText : 'Chưa chọn') +
              ' - ' +
              (lastModifiedDate.value.toText ? lastModifiedDate.value.toText : 'Chưa chọn')}
          </Button>
        )
      }
    },
    {
      name: 'Người cập nhật',
      genFormSearch: () => {
        return (
          <TextField
            id='outlined-search'
            type='search'
            size='small'
            sx={{ width: 150 }}
            name='lastModifiedBy'
            onChange={onChangeTextAndSelectField}
            value={lastModifiedBy.value}
          />
        )
      }
    }
  ]

  const useStyles = makeStyles({
    root: {
      display: 'flex',
      alignItems: 'center'
    }
  })

  const classes = useStyles()

  const setStatusIcon = code => {
    switch (code) {
      case 'WAITING_FOR_CONFIRMATION':
        return <FormatListBulleted fontSize='18px' sx={{ color: '#FD8B08' }} />
      case 'READY':
        return <ClockOutline fontSize='18px' sx={{ color: '#FD8B08' }} />
      case 'IN_PROGRESS':
        return <ProgressClock fontSize='18px' sx={{ color: '#2561FB' }} />
      case 'COMPLETED':
        return <Check fontSize='18px' sx={{ color: '#51B14F' }} />
      case 'CANCELED':
        return <Close fontSize='18px' sx={{ color: '#D1CABB' }} />
      case 'PENDING':
        return <DotsHorizontal fontSize='18px' sx={{ color: '#FD8B08' }} />
      case 'CLOSED':
        return <CurrencyUsd fontSize='18px' sx={{ color: '#51B14F' }} />
      case 'ONTIME':
        return <CheckCircle fontSize='18px' sx={{ color: '#51B14F' }} />
      case 'OVERDUE':
        return <Cancel fontSize='18px' sx={{ color: 'red' }} />

      default:
        return <></>
    }
  }

  const [listTableCellSort, setListTableCellSort] = useState([
    {
      name: 'Mã lịch hẹn'
    },
    {
      name: 'Tên khách hàng',
      havingSortIcon: true,
      sortBy: 'customerFullName',
      sortDirection: ''
    },
    {
      name: 'Số điện thoại',
      havingSortIcon: true,
      sortBy: 'customerPhoneNumber',
      sortDirection: ''
    },
    {
      name: 'Trạng thái',
      havingSortIcon: false,
      sortBy: 'statusName',
      sortDirection: ''
    },
    {
      name: 'Trạng thái đặt lịch',
      havingSortIcon: false,
      sortBy: 'overdueStatus',
      sortDirection: ''
    },
    {
      name: 'Tạm tính',
      havingSortIcon: true,
      sortBy: 'total',
      sortDirection: ''
    },
    {
      name: 'Thành tiền',
      havingSortIcon: true,
      sortBy: 'payAmount',
      sortDirection: ''
    },
    {
      name: 'Thời gian bắt đầu dự kiến',
      havingSortIcon: true,
      sortBy: 'expectedStartTime',
      sortDirection: ''
    },
    {
      name: 'Thời gian kết thúc dự kiến',
      havingSortIcon: true,
      sortBy: 'expectedEndTime',
      sortDirection: ''
    },
    {
      name: 'Thời gian bắt đầu thực tế',
      havingSortIcon: true,
      sortBy: 'actualStartTime',
      sortDirection: ''
    },
    {
      name: 'Thời gian kết thúc thực tế',
      havingSortIcon: true,
      sortBy: 'actualEndTime',
      sortDirection: ''
    },
    {
      name: 'Thời gian hủy',
      havingSortIcon: true,
      sortBy: 'cancelTime',
      sortDirection: ''
    },
    {
      name: 'Lý do hủy',
      havingSortIcon: true,
      sortBy: 'canceledReason',
      sortDirection: ''
    },
    {
      name: 'Ghi chú'
    },
    {
      name: 'Ngày tạo',
      havingSortIcon: true,
      sortBy: 'createdDate',
      sortDirection: ''
    },
    {
      name: 'Người tạo',
      havingSortIcon: true,
      sortBy: 'createdBy',
      sortDirection: ''
    },
    {
      name: 'Ngày cập nhật',
      havingSortIcon: true,
      sortBy: 'lastModifiedDate',
      sortDirection: ''
    },
    {
      name: 'Người cập nhật',
      havingSortIcon: true,
      sortBy: 'lastModifiedBy',
      sortDirection: ''
    }
  ])

  //Table row
  //List table cell name
  const listTableCellName = [
    'id',
    'customerFullName',
    'customerPhoneNumber',
    'statusName',
    'overdueStatusName',
    'total',
    'payAmount',
    'expectedStartTime',
    'expectedEndTime',
    'actualStartTime',
    'actualEndTime',
    'cancelTime',
    'canceledReason',
    'note',
    'createdDate',
    'createdBy',
    'lastModifiedDate',
    'lastModifiedBy'
  ]

  //====================================================================================
  //click to sort
  const [sortInfo, setSortInfo] = useState({
    sortBy: 'expectedStartTime',
    sortDirection: 'desc',
    index: 6
  })

  const onChangeSort = (sortBy, sortDirection, index) => {
    let tempSortDirect = ''
    if (!sortDirection) {
      tempSortDirect = 'desc'
    }
    if (sortDirection == 'desc') {
      tempSortDirect = 'asc'
    }
    if (sortDirection == 'asc') {
      tempSortDirect = ''
    }

    setSortInfo({
      sortBy: sortBy,
      sortDirection: tempSortDirect,
      index: index
    })
  }

  useEffect(() => {
    const tempLst = []
    listTableCellSort.forEach(item => {
      let tempItem = { ...item, ['sortDirection']: '' }
      tempLst.push(tempItem)
    })
    tempLst[sortInfo.index] = { ...listTableCellSort[sortInfo.index], ['sortDirection']: sortInfo.sortDirection }
    setListTableCellSort(tempLst)
  }, [sortInfo])

  //====================================================================================
  //Định nghĩa query param, khi gọi api filter thì dùng đến nó
  const defaultQueryParam = {
    customerFullName: {
      value: '',
      operator: 'contains'
    },
    customerPhoneNumber: {
      value: '',
      operator: 'contains'
    },
    statusName: {
      value: localStorage.getItem('AM_init_status_code') || '',
      operator: 'in'
    },
    overdueStatus: {
      value: localStorage.getItem('AM_init_overdue_status') || '',
      operator: 'in'
    },
    total: {
      value: '',
      operator: 'equals'
    },
    payAmount: {
      value: '',
      operator: 'equals'
    },
    expectedStartTime: {
      value: {
        from: '',
        to: '',
        fromText: '',
        toText: ''
      },
      operator: ['greaterOrEqual', 'lessOrEqual']
    },
    expectedEndTime: {
      value: {
        from: '',
        to: '',
        fromText: '',
        toText: ''
      },
      operator: ['greaterOrEqual', 'lessOrEqual']
    },
    actualStartTime: {
      value: {
        from: localStorage.getItem("AM_init_actual_start_time_from") || '',
        to: localStorage.getItem("AM_init_actual_start_time_to") || '',
        fromText: localStorage.getItem("AM_init_actual_start_time_from_text") || '',
        toText: localStorage.getItem("AM_init_actual_start_time_to_text") || ''
      },
      operator: ['greaterOrEqual', 'lessOrEqual']
    },
    actualEndTime: {
      value: {
        from: localStorage.getItem("AM_init_actual_end_time_from") || '',
        to: localStorage.getItem("AM_init_actual_end_time_to") || '',
        fromText: localStorage.getItem("AM_init_actual_end_time_from_text") || '',
        toText: localStorage.getItem("AM_init_actual_end_time_to_text") || ''
      },
      operator: ['greaterOrEqual', 'lessOrEqual']
    },
    cancelTime: {
      value: {
        from: localStorage.getItem("AM_init_cancel_time_from") || '',
        to: localStorage.getItem("AM_init_cancel_time_to") || '',
        fromText: localStorage.getItem("AM_init_cancel_time_from_text") || '',
        toText: localStorage.getItem("AM_init_cancel_time_to_text") || ''
      },
      operator: ['greaterOrEqual', 'lessOrEqual']
    },
    canceledReason: {
      value: '',
      operator: 'in'
    },
    cancelNote: {
      value: '',
      operator: 'contains'
    },
    note: {
      value: '',
      operator: 'contains'
    },
    createdDate: {
      value: {
        from: localStorage.getItem("AM_init_created_date_from") || '',
        to: localStorage.getItem("AM_init_created_date_to") || '',
        fromText: localStorage.getItem("AM_init_created_date_from_text") || '',
        toText: localStorage.getItem("AM_init_created_date_to_text") || ''
      },
      operator: ['greaterOrEqual', 'lessOrEqual']
    },
    createdBy: {
      value: '',
      operator: 'contains'
    },
    lastModifiedDate: {
      value: {
        from: '',
        to: '',
        fromText: '',
        toText: ''
      },
      operator: ['greaterOrEqual', 'lessOrEqual']
    },
    lastModifiedBy: {
      value: '',
      operator: 'contains'
    }
  }

  const [queryParam, setQueryParam] = useState(defaultQueryParam)

  const {
    customerFullName,
    customerPhoneNumber,
    statusName,
    overdueStatus,
    total,
    payAmount,
    expectedStartTime,
    expectedEndTime,
    actualStartTime,
    actualEndTime,
    cancelTime,
    canceledReason,
    cancelNote,
    note,
    createdDate,
    createdBy,
    lastModifiedDate,
    lastModifiedBy
  } = queryParam

  //====================================================================================
  //ONCHANGE CHO TỪNG LOẠI FIELD

  //cho các trường chỉ search theo free-text và select giá trị
  const onChangeTextAndSelectField = e => {
    e.preventDefault()

    setQueryParam({
      ...queryParam,
      [`${e.target.name}`]: { ...queryParam[`${e.target.name}`], ['value']: e.target.value }
    })
  }

  //cho các trường chỉ được điền số
  const onChangeNumberField = e => {
    e.preventDefault()

    const regex = /^[0-9\b]+$/

    setQueryParam({
      ...queryParam,
      [`${e.target.name}`]:
        regex.test(e.target.value) || e.target.value == ''
          ? { ...queryParam[`${e.target.name}`], ['value']: e.target.value }
          : { ...queryParam[`${e.target.name}`], ['value']: queryParam[`${e.target.name}`]['value'] }
    })
  }

  //cho các trường chỉ date-time (giá trị FROM)
  const onChangeDateFromField = e => {
    e.preventDefault()

    setQueryParam({
      ...queryParam,
      [`${e.target.name}`]: {
        ...queryParam[`${e.target.name}`],
        ['value']: {
          ...queryParam[`${e.target.name}`]['value'],
          ['from']: e.target.value,
          ['fromText']: reformatDateForView(e.target.value)
        }
      }
    })
  }

  //cho các trường chỉ date-time (giá trị TO)
  const onChangeDateToField = e => {
    e.preventDefault()

    setQueryParam({
      ...queryParam,
      [`${e.target.name}`]: {
        ...queryParam[`${e.target.name}`],
        ['value']: {
          ...queryParam[`${e.target.name}`]['value'],
          ['to']: e.target.value,
          ['toText']: reformatDateForView(e.target.value)
        }
      }
    })
  }

  //====================================================================================
  //MẤY CÁI LIÊN QUAN ĐẾN API
  //get dropdown list for select search status
  const [listStatus, setListStatus] = useState([])

  const callGetAppMasterStatus = async () => {
    const data = await getAppMasterStatus()
    if (!data) return
    if (!data.data) return
    const tempLst = []
    tempLst.push({ id: 0, name: 'Tất cả', code: '' })
    data.data.forEach(element => {
      tempLst.push(element)
    })
    setListStatus(tempLst)
  }

  //get dropdown list for select cancel reason
  const [listReasonCancel, setReasonCancel] = useState([])

  const callGetAppMasterReasonCancels = async () => {
    const data = await getAppMasterReasonCancel()
    if (!data) return
    if (!data.data) return
    const tempLst = []
    tempLst.push({ id: 0, name: 'Tất cả', code: '' })
    data.data.forEach(element => {
      tempLst.push(element)
    })
    setReasonCancel(tempLst)
  }

  //get filter data to fill to table
  const [list, setList] = useState(0)

  //Tạo data trong bảng với tên attribute custom
  const createData = (
    customerFullName,
    customerPhoneNumber,
    statusName,
    statusCode,
    overdueStatusName,
    overdueStatus,
    total,
    payAmount,
    expectedStartTime,
    expectedEndTime,
    actualStartTime,
    actualEndTime,
    cancelTime,
    canceledReason,
    note,
    createdDate,
    createdBy,
    lastModifiedDate,
    lastModifiedBy,
    id
  ) => {
    expectedStartTime = timestampToString(expectedStartTime)
    expectedEndTime = timestampToString(expectedEndTime)
    actualStartTime = timestampToString(actualStartTime)
    actualEndTime = timestampToString(actualEndTime)
    cancelTime = timestampToString(cancelTime)
    createdDate = timestampToString(createdDate)
    lastModifiedDate = timestampToString(lastModifiedDate)

    return {
      customerFullName,
      customerPhoneNumber,
      statusName,
      statusCode,
      overdueStatusName,
      overdueStatus,
      total,
      payAmount,
      expectedStartTime,
      expectedEndTime,
      actualStartTime,
      actualEndTime,
      cancelTime,
      canceledReason,
      note,
      createdDate,
      createdBy,
      lastModifiedDate,
      lastModifiedBy,
      id
    }
  }

  const check = (item)=>{
    if(item == 'ONTIME') {
      return 'Đúng hẹn'
    }
    else if(item == 'OVERDUE') {
      return 'Trễ hẹn'
    }else{
      return ''
    }
  }

  const callFilter = async (pageProp, sizeProp) => {
    const data = await filterAppointmentMaster(
      queryParam ? queryParam : defaultQueryParam,
      pageProp,
      sizeProp,
      sortInfo
    )
    if (!data) return
    if (data.meta.code != 200) {
      setError(data.meta.message)
      setOpenError(true)

      return
    }
    if (!data.data) return

    console.log('queryParam khi callFilter: ', queryParam)

    setCount(data.meta.total)
    const tempList = []
    data.data.forEach(item => {
      const convertedTotal = convertNumberToVND(item.total)
      const convertedPayAmount = convertNumberToVND(item.payAmount)

      const formatedStatusName = (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {setStatusIcon(item.status.code)}
          <Typography ml={2} variant='subtitle2'>
            {item.status.name}
          </Typography>
        </Box>
      )

      const formatedOverdueStatusName = (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {setStatusIcon(item.overdueStatus)}
          <Typography ml={2} variant='subtitle2'>
            {/* {item.overdueStatus == 'ONTIME' ? 'Đúng hẹn' : ('OVERDUE' ? 'Trễ hẹn' : "")} */}
            {
              check(item.overdueStatus)
            }
          </Typography>
        </Box>
      )
      tempList.push(
        createData(
          item.customer.fullName,
          item.customer.phoneNumber,
          formatedStatusName,
          item.status.code,
          formatedOverdueStatusName,
          item.overdueStatus,
          convertedTotal,
          convertedPayAmount,
          item.expectedStartTime,
          item.expectedEndTime,
          item.actualStartTime,
          item.actualEndTime,
          item.cancelTime,
          item.canceledReason?.title,
          item.note,
          item.createdDate,
          item.createdBy,
          item.lastModifiedDate,
          item.lastModifiedBy,
          item.id
        )
      )
    })
    setList(tempList)
  }

  //First call when go into this page
  useEffect(() => {
    callGetAppMasterStatus()
    callGetAppMasterReasonCancels()
    callFilter(page, size)
  }, [])

  // Nếu trong localStorage có init status code thì set nó vào queryParam

  // useEffect(() => {
  //   if (queryParam === defaultQueryParam) {
  //     if (localStorage.getItem('AM_init_status_code')) {
  //       setQueryParam({
  //         ...queryParam,
  //         [`statusName`]: { ...queryParam[`statusName`], ['value']: localStorage.getItem('AM_init_status_code') }
  //       })
  //     }
  //   }
  // }, [])

  useEffect(() => {
    const temp = queryParam
    if (temp.statusName.value === localStorage.getItem('AM_init_status_code')) {
      callFilter()
      localStorage.removeItem('AM_init_status_code')
    }
  }, [list])
  useEffect(() => {
    const temp = queryParam
    if (temp.overdueStatus.value === localStorage.getItem('AM_init_overdue_status')) {
      callFilter()
      localStorage.removeItem('AM_init_overdue_status')
    }
  }, [list])
  useEffect(() => {
    const temp = queryParam
    if (temp.createdDate.value.from === localStorage.getItem('AM_init_created_date_from')) {
      callFilter()
      localStorage.removeItem('AM_init_created_date_from')
    }
  }, [list])
  useEffect(() => {
    const temp = queryParam
    if (temp.createdDate.value.to === localStorage.getItem('AM_init_created_date_to')) {
      callFilter()
      localStorage.removeItem('AM_init_created_date_to')
    }
  }, [list])
  useEffect(() => {
    const temp = queryParam
    if (temp.createdDate.value.fromText === localStorage.getItem('AM_init_created_date_from_text')) {
      callFilter()
      localStorage.removeItem('AM_init_created_date_from_text')
    }
  }, [list])
  useEffect(() => {
    const temp = queryParam
    if (temp.createdDate.value.toText === localStorage.getItem('AM_init_created_date_to_text')) {
      callFilter()
      localStorage.removeItem('AM_init_created_date_to_text')
    }
  }, [list])
  useEffect(() => {
    const temp = queryParam
    if (temp.actualStartTime.value.from === localStorage.getItem('AM_init_actual_start_time_from')) {
      callFilter()
      localStorage.removeItem('AM_init_actual_start_time_from')
    }
  }, [list])
  useEffect(() => {
    const temp = queryParam
    if (temp.actualStartTime.value.to === localStorage.getItem('AM_init_actual_start_time_to')) {
      callFilter()
      localStorage.removeItem('AM_init_actual_start_time_to')
    }
  }, [list])
  useEffect(() => {
    const temp = queryParam
    if (temp.actualStartTime.value.fromText === localStorage.getItem('AM_init_actual_start_time_from_text')) {
      callFilter()
      localStorage.removeItem('AM_init_actual_start_time_from_text')
    }
  }, [list])
  useEffect(() => {
    const temp = queryParam
    if (temp.actualStartTime.value.toText === localStorage.getItem('AM_init_actual_start_time_to_text')) {
      callFilter()
      localStorage.removeItem('AM_init_actual_start_time_to_text')
    }
  }, [list])
  useEffect(() => {
    const temp = queryParam
    if (temp.actualEndTime.value.from === localStorage.getItem('AM_init_actual_end_time_from')) {
      callFilter()
      localStorage.removeItem('AM_init_actual_end_time_from')
    }
  }, [list])
  useEffect(() => {
    const temp = queryParam
    if (temp.actualEndTime.value.to === localStorage.getItem('AM_init_actual_end_time_to')) {
      callFilter()
      localStorage.removeItem('AM_init_actual_end_time_to')
    }
  }, [list])
  useEffect(() => {
    const temp = queryParam
    if (temp.actualEndTime.value.fromText === localStorage.getItem('AM_init_actual_end_time_from_text')) {
      callFilter()
      localStorage.removeItem('AM_init_actual_end_time_from_text')
    }
  }, [list])
  useEffect(() => {
    const temp = queryParam
    if (temp.actualEndTime.value.toText === localStorage.getItem('AM_init_actual_end_time_to_text')) {
      callFilter()
      localStorage.removeItem('AM_init_actual_end_time_to_text')
    }
  }, [list])
  useEffect(() => {
    const temp = queryParam
    if (temp.cancelTime.value.from === localStorage.getItem('AM_init_cancel_time_from')) {
      callFilter()
      localStorage.removeItem('AM_init_cancel_time_from')
    }
  }, [list])
  useEffect(() => {
    const temp = queryParam
    if (temp.cancelTime.value.to === localStorage.getItem('AM_init_cancel_time_to')) {
      callFilter()
      localStorage.removeItem('AM_init_cancel_time_to')
    }
  }, [list])
  useEffect(() => {
    const temp = queryParam
    if (temp.cancelTime.value.fromText === localStorage.getItem('AM_init_cancel_time_from_text')) {
      callFilter()
      localStorage.removeItem('AM_init_cancel_time_from_text')
    }
  }, [list])
  useEffect(() => {
    const temp = queryParam
    if (temp.cancelTime.value.toText === localStorage.getItem('AM_init_cancel_time_to_text')) {
      callFilter()
      localStorage.removeItem('AM_init_cancel_time_to_text')
    }
  }, [list])

  //====================================================================================
  //MỞ DIALOG CHO TỪNG LOẠI THỜI GIAN
  //   'expectedStartTime',
  const [openExpectedStartTime, setOpenExpectedStartTime] = useState(false)

  const handleClickOpenExpectedStartTime = () => {
    setOpenExpectedStartTime(true)
  }

  //   'expectedEndTime',
  const [openExpectedEndTime, setOpenExpectedEndTime] = useState(false)

  const handleClickOpenExpectedEndTime = () => {
    setOpenExpectedEndTime(true)
  }

  //   'actualStartTime',
  const [openActualStartTime, setOpenActualStartTime] = useState(false)

  const handleClickOpenActualStartTime = () => {
    setOpenActualStartTime(true)
  }

  //   'actualEndTime',
  const [openActualEndTime, setOpenActualEndTime] = useState(false)

  const handleClickOpenActualEndTime = () => {
    setOpenActualEndTime(true)
  }

  //   'actualEndTime',
  const [openCancelTime, setOpenCancelTime] = useState(false)

  const handleClickOpenCancelTime = () => {
    setOpenCancelTime(true)
  }

  //   'createdDate',
  const [openCreatedDate, setOpenCreatedDate] = useState(false)

  const handleClickOpenCreatedDate = () => {
    setOpenCreatedDate(true)
  }

  //   'lastModifiedDate',
  const [openLastModifiedDate, setOpenLastModifiedDate] = useState(false)

  const handleClickOpenLastModifiedDate = () => {
    setOpenLastModifiedDate(true)
  }

  // Dialog khi có lỗi
  const [error, setError] = useState('')
  const [openError, setOpenError] = useState(false)

  // Dialog đặt lịch
  const [openDialogBooking, setOpenDialogBooking] = useState(false)

  //đóng dialog
  const handleClose = () => {
    setOpenExpectedStartTime(false)
    setOpenExpectedEndTime(false)
    setOpenActualStartTime(false)
    setOpenActualEndTime(false)
    setOpenCancelTime(false)
    setOpenCreatedDate(false)
    setOpenLastModifiedDate(false)
    setOpenError(false)
    setOpenDialogBooking(false)
  }

  //====================================================================================
  //Khi search theo các trường select, thì chỉ cần chọn là gọi filter lại
  useEffect(() => {
    callFilter(page, size)
  }, [statusName, overdueStatus, canceledReason, sortInfo])

  //====================================================================================

  //List data trong drawwer (confirm, cancel)
  const [listItemConfirm, setListItemConfirm] = useState([])
  const [listItemCancel, setListItemCancel] = useState([])

  //Item data trong drawwer (view, edit, checkout)
  const [itemView, setItemView] = useState()
  const [itemEdit, setItemEdit] = useState()
  const [itemCheckin, setItemCheckin] = useState()
  const [itemCheckout, setItemCheckout] = useState()

  //Tạo action vertical dot
  const renderActionItem = (item, popupState, handleCloseSnackbar) => {
    return (
      <Box sx={{ py: 1 }}>
        {isAccessible('SSDS_C_AM_DETAIL') && (
          <MenuItem
            sx={{ py: 1 }}
            onClick={() => {
              popupState.close()
              setOpenDrawerView(true)
              setItemView(item)
              handleCloseSnackbar()
            }}
          >
            <VisibilityIcon sx={{ mr: 1 }} />
            Xem chi tiết
          </MenuItem>
        )}

        {isAccessible('SSDS_C_AM_CONFIRM') && item.statusCode == 'WAITING_FOR_CONFIRMATION' && (
          <MenuItem
            sx={{ py: 1 }}
            onClick={() => {
              popupState.close()
              setOpenDrawerConfirm(true)
              setListItemConfirm([item])
              handleCloseSnackbar()
            }}
          >
            <CheckIcon sx={{ mr: 1 }} />
            Xác nhận
          </MenuItem>
        )}

        {isAccessible('SSDS_C_AM_CHECKIN') &&
          (item.statusCode == 'READY' || item.statusCode == 'WAITING_FOR_CONFIRMATION') && (
            <MenuItem
              sx={{ py: 1 }}
              onClick={() => {
                popupState.close()
                setOpenDrawerCheckin(true)
                setItemCheckin(item)
                handleCloseSnackbar()
              }}
            >
              <CalendarImportOutline sx={{ mr: 1 }} />
              Check-in
            </MenuItem>
          )}

        {isAccessible('SSDS_C_AM_CHECKOUT') && item.statusCode == 'IN_PROGRESS' && (
          <MenuItem
            sx={{ py: 1 }}
            onClick={() => {
              popupState.close()
              setOpenDrawerCheckout(true)
              setItemCheckout(item)
              handleCloseSnackbar()
            }}
          >
            <CalendarExportOutline sx={{ mr: 1 }} />
            Check-out
          </MenuItem>
        )}

        {isAccessible('SSDS_C_AM_CANCEL') &&
          (item.statusCode == 'WAITING_FOR_CONFIRMATION' || item.statusCode == 'READY') && (
            <MenuItem
              sx={{ py: 1 }}
              onClick={() => {
                popupState.close()
                setOpenDrawerCancel(true)
                setListItemCancel([item])
                handleCloseSnackbar()
              }}
            >
              <CancelIcon sx={{ mr: 1 }} />
              Hủy
            </MenuItem>
          )}

        {/* {isAccessible('SSDS_C_AM_UPDATE') &&
          (item.statusCode == 'WAITING_FOR_CONFIRMATION' ||
            item.statusCode == 'READY' ||
            item.statusCode == 'IN_PROGRESS') && (
            <MenuItem
              sx={{ py: 1 }}
              onClick={() => {
                popupState.close()
                setItemEdit(item)
                setOpenDrawerEdit(true)
                handleCloseSnackbar()
              }}
            >
              <EditIcon sx={{ mr: 1 }} />
              Cập nhật
            </MenuItem>
          )} */}
      </Box>
    )
  }

  //Tạo action snack bar

  const renderActionSnackbar = (handleCloseSnackbar, listItemChecked) => {
    if(isAccessible("SSDS_C_AM_CONFIRM") || isAccessible("SSDS_C_AM_CANCEL")) {
      return (
        <span style={{ marginLeft: 15 }}>
          {isAccessible('SSDS_C_AM_CANCEL') && (
          <Tooltip
            title='Xác nhận'
            onClick={() => {
              handleCloseSnackbar()
              handleValidateConfirmItems(listItemChecked)
            }}
          >
            <IconButton>
              <CheckIcon />
            </IconButton>
          </Tooltip>
          )}
          {isAccessible('SSDS_C_AM_CANCEL') && (
            <Tooltip
              title='Hủy'
              onClick={() => {
                handleCloseSnackbar()
                handleValidateCancelItems(listItemChecked)
              }}
            >
              <IconButton>
                <CancelIcon />
              </IconButton>
            </Tooltip>
          )}
        </span>
      )
    }
    
  }

  // Validate statusCode của lịch hẹn khi chọn từ snackbar

  const handleValidateConfirmItems = listItemChecked => {
    let validItems = []
    listItemChecked.forEach(item => {
      if (item.statusCode == 'WAITING_FOR_CONFIRMATION') {
        validItems.push(item)
      }
    })
    if (validItems === undefined || validItems.length == 0) {
      setError('Không có lịch hẹn nào được chọn có trạng thái "Chờ xác nhận", không thể thực hiện việc xác nhận')
      setOpenError(true)

      return
    }
    setListItemConfirm(validItems)
    setOpenDrawerConfirm(true)
  }

  const handleValidateCancelItems = listItemChecked => {
    let validItems = []
    listItemChecked.forEach(item => {
      if (item.statusCode == 'WAITING_FOR_CONFIRMATION' || item.statusCode == 'READY') {
        validItems.push(item)
      }
    })
    if (validItems === undefined || validItems.length == 0) {
      setError(
        'Không có lịch hẹn nào được chọn có trạng thái "Chờ xác nhận" hoặc "Chờ thực hiện", không thể thực hiện việc hủy'
      )
      setOpenError(true)

      return
    }
    setListItemCancel(validItems)
    setOpenDrawerCancel(true)
  }

  //Open drawer
  const [openDrawerCancel, setOpenDrawerCancel] = useState(false)
  const [openDrawerConfirm, setOpenDrawerConfirm] = useState(false)
  const [openDrawerEdit, setOpenDrawerEdit] = useState(false)
  const [openDrawerView, setOpenDrawerView] = useState(false)
  const [openDrawerCheckin, setOpenDrawerCheckin] = useState(false)
  const [openDrawerCheckout, setOpenDrawerCheckout] = useState(false)

  return (
    <div
      onKeyDown={e => {
        e.persist()
        if (e.key === 'Enter') {
          callFilter(page, size)
        }
      }}
    >
      <Grid container spacing={6}>
        {/* dòng này là wrapper của main content */}

        {/* START Render main content của cái page này */}
        <Grid item xs={12}>
          <Typography variant='h5' style={{ marginBottom: 10 }}>
            Quản lý lịch hẹn
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Button
                variant='outlined'
                onClick={() => {
                  setQueryParam(defaultQueryParam)
                  setPage(0)
                  setSize(10)
                }}
                style={{ marginRight: 10 }}
              >
                Xóa bộ lọc
              </Button>
              {/* Ấn nút search cũng gọi filter */}
              <Button variant='contained' onClick={() => callFilter(page, size)}>
                Search
              </Button>
            </Box>
            <Box>
              {isAccessible('SSDS_C_AM_BOOKING') && (
                <Button variant='contained' onClick={() => setOpenDialogBooking(true)}>
                  Đặt lịch
                </Button>
              )}
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Card>
            {isAccessible('SSDS_C_AM_LISTING') && (
              <DataTable
                listData={list}
                listTableCellHead={listTableCellHead}
                listTableCellName={listTableCellName}
                renderIconActions={() => {
                  return <DotsVertical />
                }}
                listTableCellSort={listTableCellSort}
                onChangeSort={onChangeSort}

                // Có gen Pagination ko
                callFilterFromProps={callFilterFromProps}
                isGenPagination
                count={count}

                //có gen nút vertical dot để ấn vào ra các action con ko
                renderActionItem={renderActionItem}

                //Có gen check box ko
                isHavingCheckboxes={isAccessible("SSDS_C_AM_CONFIRM") || isAccessible("SSDS_C_AM_CANCEL")}
                messageSnackbar={'Lịch hẹn được chọn'}
                renderActionSnackbar={renderActionSnackbar}
              />
            )}
          </Card>
        </Grid>
        {/* END Render main content của cái page này */}

        {/* START Định nghĩa các thể loại dialog có thể mở của cái page này */}
        <DialogFormSearch
          nameDialog={'Thời gian bắt đầu dự kiến'}
          name='expectedStartTime'
          open={openExpectedStartTime}
          handleClose={handleClose}
          onChangeFrom={onChangeDateFromField}
          onChangeTo={onChangeDateToField}
          valueFrom={expectedStartTime.value.from}
          valueTo={expectedStartTime.value.to}
        />

        <DialogFormSearch
          nameDialog={'Thời gian kết thúc dự kiến'}
          name='expectedEndTime'
          open={openExpectedEndTime}
          handleClose={handleClose}
          onChangeFrom={onChangeDateFromField}
          onChangeTo={onChangeDateToField}
          valueFrom={expectedEndTime.value.from}
          valueTo={expectedEndTime.value.to}
        />

        <DialogFormSearch
          nameDialog={'Thời gian bắt đầu thực tế'}
          name='actualStartTime'
          open={openActualStartTime}
          handleClose={handleClose}
          onChangeFrom={onChangeDateFromField}
          onChangeTo={onChangeDateToField}
          valueFrom={actualStartTime.value.from}
          valueTo={actualStartTime.value.to}
        />

        <DialogFormSearch
          nameDialog={'Thời gian kết thúc thực tế'}
          name='actualEndTime'
          open={openActualEndTime}
          handleClose={handleClose}
          onChangeFrom={onChangeDateFromField}
          onChangeTo={onChangeDateToField}
          valueFrom={actualEndTime.value.from}
          valueTo={actualEndTime.value.to}
        />

        <DialogFormSearch
          nameDialog={'Thời gian hủy'}
          name='cancelTime'
          open={openCancelTime}
          handleClose={handleClose}
          onChangeFrom={onChangeDateFromField}
          onChangeTo={onChangeDateToField}
          valueFrom={cancelTime.value.from}
          valueTo={cancelTime.value.to}
        />

        <DialogFormSearch
          nameDialog={'Ngày tạo'}
          name='createdDate'
          open={openCreatedDate}
          handleClose={handleClose}
          onChangeFrom={onChangeDateFromField}
          onChangeTo={onChangeDateToField}
          valueFrom={createdDate.value.from}
          valueTo={createdDate.value.to}
        />

        <DialogFormSearch
          nameDialog={'Ngày cập nhật'}
          name='lastModifiedDate'
          open={openLastModifiedDate}
          handleClose={handleClose}
          onChangeFrom={onChangeDateFromField}
          onChangeTo={onChangeDateToField}
          valueFrom={lastModifiedDate.value.from}
          valueTo={lastModifiedDate.value.to}
        />

        <DialogAlert nameDialog={'Có lỗi xảy ra'} open={openError} allertContent={error} handleClose={handleClose} />

        <DialogBooking
          open={openDialogBooking}
          setOpen={setOpenDialogBooking}
          setOpenError={setOpenError}
          setError={setError}
          onSuccess={() => {
            callFilter(page, size)
          }}
        />
        {/* END Định nghĩa các thể loại dialog có thể mở của cái page này */}

        {/* START Định nghĩa Drawer của page này */}
        <DrawerAppointmentMaster.DrawerCancel
          openDrawer={openDrawerCancel}
          setOpenDrawer={setOpenDrawerCancel}
          listItemChecked={listItemCancel}
          setListItemChecked={setListItemCancel}
          setOpenError={setOpenError}
          setError={setError}
          onSuccess={() => {
            callFilter(page, size)
          }}
        />
        <DrawerAppointmentMaster.DrawerConfirm
          openDrawer={openDrawerConfirm}
          setOpenDrawer={setOpenDrawerConfirm}
          listItemChecked={listItemConfirm}
          setListItemChecked={setListItemConfirm}
          setOpenError={setOpenError}
          setError={setError}
          onSuccess={() => {
            callFilter(page, size)
          }}
        />
        <DrawerAppointmentMaster.DrawerEdit
          openDrawer={openDrawerEdit}
          setOpenDrawer={setOpenDrawerEdit}
          selectedItem={itemEdit}
          setSelectedItem={setItemEdit}
          setOpenError={setOpenError}
          setError={setError}
          onSuccess={() => {
            callFilter(page, size)
          }}
        />
        <DrawerAppointmentMaster.DrawerView
          openDrawer={openDrawerView}
          setOpenDrawer={setOpenDrawerView}
          selectedItem={itemView}
          setSelectedItem={setItemView}
          setOpenError={setOpenError}
          setError={setError}
          onSuccess={() => {
            callFilter(page, size)
          }}
        />
        <DrawerAppointmentMaster.DrawerCheckin
          openDrawer={openDrawerCheckin}
          setOpenDrawer={setOpenDrawerCheckin}
          selectedItem={itemCheckin}
          setSelectedItem={setItemCheckin}
          setOpenError={setOpenError}
          setError={setError}
          onSuccess={() => {
            callFilter(page, size)
          }}
        />
        <DrawerAppointmentMaster.DrawerCheckout
          openDrawer={openDrawerCheckout}
          setOpenDrawer={setOpenDrawerCheckout}
          selectedItem={itemCheckout}
          setSelectedItem={setItemCheckout}
          setOpenError={setOpenError}
          setError={setError}
          onSuccess={() => {
            callFilter(page, size)
          }}
        />
        {/* END Định nghĩa Drawer của page này */}
      </Grid>
    </div>
  )
}

export default ManageAppointmentAdmin
