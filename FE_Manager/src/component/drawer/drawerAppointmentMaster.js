import { useState, useEffect, Fragment } from 'react'

// ** MUI Imports
import {
  Box,
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  InputLabel,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import DeleteIcon from '@mui/icons-material/Delete'
import RemoveIcon from '@mui/icons-material/Remove'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { ThemeProvider } from '@mui/system'
import CloseIcon from '@mui/icons-material/Close'
import { GridList, GridListTile, makeStyles, Modal, Backdrop, Fade } from '@material-ui/core'

import { getAppMasterConfirmAction, getAppMasterReasonCancel, getPaymentMethod } from '../../api/common/commonApi'
import {
  verifyAppointmentMaster,
  cancelAppointmentMaster,
  getAppointmentMasterDetail,
  checkinAppointmentMaster,
  checkoutAppointmentMaster,
  cancelAppointmentService,
  getAvailableSpecialist,
  uploadImage
} from '../../api/appointment_master/appointmentMasterApi'

import { differenceInMinutes, format, fromUnixTime, getUnixTime, isDate, isValid } from 'date-fns'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { vi } from 'date-fns/locale'
import { TimePicker } from '@mui/x-date-pickers'
import {
  convertDurationToTextTime,
  datetimeLocalToTimestamp,
  datetimeToTimestamp,
  timestampToDatetimeLocal,
  timestampToString
} from 'src/utils/timeUtils'
import ModalCancelAS from '../modal/modalCancelAS'
import formLabelsTheme from 'public/redAsteriskMUITheme'
import { isAccessible } from 'src/api/auth/authApi'
import ModalInvoiceDetail from '../modal/modalInvoiceDetail'
import { getAllBranch } from 'src/api/branch/branchApi'

const widthViewPort = '90vw'

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      backgroundcolor: 'red'
    }
  },
  img: {
    outline: 'none'
  }
}))

//sticky style
const sticky = {
  position: 'sticky',
  left: 0,
  background: 'white'
}

//nhận data là 1 list các item
export const DrawerCancel = props => {
  const { openDrawer, setOpenDrawer, listItemChecked, setListItemChecked, onSuccess } = props

  //============================================================
  const [confirmActions, setConfirmActions] = useState([])

  const callGetAppMasterConfirmAction = async () => {
    const data = await getAppMasterConfirmAction()
    if (!data) return
    if (!data.data) return
    setConfirmActions(data.data)
  }

  const [listReasonCancel, setReasonCancel] = useState([])

  const callGetAppMasterReasonCancel = async () => {
    const data = await getAppMasterReasonCancel()
    if (!data) return
    if (!data.data) return
    setReasonCancel(data.data)
  }

  useEffect(() => {
    callGetAppMasterConfirmAction()
    callGetAppMasterReasonCancel()
  }, [])

  const handleCloseDrawer = () => {
    setOpenDrawer(false)
    setListItemChecked([])
  }

  //Thông tin table
  const listTableCellHead = [
    'Mã lịch hẹn',
    'Tên khách hàng',
    'Số điện thoại',
    'Trạng thái',
    'Thời gian bắt đầu dự kiến'
  ]

  const listTableCellName = ['id', 'customerFullName', 'customerPhoneNumber', 'statusName', 'expectedStartTime']

  const onChangeTextAndSelectField = (e, index) => {
    e.preventDefault()
    const temp = [...listItemChecked]
    temp[index] = { ...temp[index], [`${e.target.name}`]: e.target.value, [`${e.target.name}Error`]: null }

    setListItemChecked(temp)
  }

  const validateInput = () => {
    let result = true
    const temp = [...listItemChecked]
    listItemChecked.forEach((item, index) => {
      if (!item.canceledReason) {
        temp[index] = { ...temp[index], [`canceledReasonError`]: 'Vui lòng chọn một lý do hủy.' }
        result = false
      }
      if (item.canceledReason && item.canceledReason == 4 && !item.note) {
        //4 là ID của Cancel Reason 'Lý do khác' trong DB
        temp[index] = { ...temp[index], [`noteError`]: 'Vui lòng nhập ghi chú.' }
        result = false
      }
      if (item.note && item.note.length > 200) {
         temp[index] = { ...temp[index], [`noteError`]: 'Không nhập quá 200 kí tự.' }
         result = false
       }
    })
    setListItemChecked(temp)

    return result
  }

  const handleCancel = async () => {
    if (!validateInput()) return

    const data = await cancelAppointmentMaster(listItemChecked)
    if (!data) return
    if (data.meta.code != 200) {
      if (data.meta.code == '4001720') {
        props.setError(data.meta.message)
        props.setOpenError(true)

        return
      }
      props.setError(data.meta.message)
      props.setOpenError(true)

      return
    }
    props.onSuccess()
    handleCloseDrawer()
  }

  return (
    <Fragment>
      <Drawer
        anchor={'right'}
        open={openDrawer}
        hideBackdrop={true}
        onKeyDown={ev => {
          if (ev.key === 'Enter') {
            ev.preventDefault()
          }
          if (ev.key === 'Esc' || ev.key === 'Escape') {
            handleCloseDrawer()
          }
        }}
      >
        <Grid container spacing={6} style={{ width: `${widthViewPort}`, margin: 2 }}>
          {/* header */}
          <Grid item xs={12}>
            <Typography variant='h5' display={'inline'}>
              {`Hủy lịch hẹn`}
            </Typography>
            <Typography variant='h5' display={'inline'} style={{ color: 'blue' }}>
              {` (${listItemChecked.length})`}
            </Typography>
          </Grid>

          {/* body */}
          <Grid item xs={12}>
            <Card>
              <TableContainer component={Paper} sx={{ height: '60vh', minWidth: 650 }}>
                <Table sx={true ? {} : { width: 'max-content' }} stickyHeader aria-label='sticky table'>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ ...sticky, textTransform: 'none', zIndex: 99, borderRight: 1 }}>
                        {/* <p>Thao tác</p> */}
                        <Typography variant='subtitle1' gutterBottom>
                          Thao tác
                        </Typography>
                      </TableCell>

                      {listTableCellHead.map((item, index) => (
                        <TableCell key={index} sx={{ textTransform: 'none' }} align='left'>
                          <Typography variant='subtitle1' gutterBottom>
                            {item}
                          </Typography>
                        </TableCell>
                      ))}
                      <TableCell sx={{ textTransform: 'none' }} align='left'>
                        <Typography variant='subtitle1' gutterBottom>
                          Hành động
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textTransform: 'none' }} align='left'>
                        <Typography variant='subtitle1' gutterBottom sx={{ display: 'inline' }}>
                          Lý do hủy
                        </Typography>
                        <Typography variant='subtitle1' gutterBottom sx={{ display: 'inline', color: 'red' }}>
                          *
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textTransform: 'none' }} align='left'>
                        <Typography variant='subtitle1' gutterBottom>
                          Ghi chú
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listItemChecked && listItemChecked.length > 0 ? (
                      listItemChecked.map((item, index) => {
                        return (
                          <TableRow key={index}>
                            {/* 1st cell */}
                            <TableCell component='th' scope='row' sx={{ ...sticky, borderRight: 1 }}>
                              <IconButton>
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                            {/* the rest cells */}
                            {listTableCellName.map((itemField, indexCell) => {
                              return (
                                <TableCell key={indexCell} align='left'>
                                  <Typography variant='subtitle2' gutterBottom>
                                    {item[`${itemField}`]}
                                  </Typography>
                                </TableCell>
                              )
                            })}
                            <TableCell align='left'>
                              <Typography variant='subtitle2' gutterBottom>
                                Hủy
                              </Typography>
                            </TableCell>
                            <TableCell align='left'>
                              <FormControl sx={{ minWidth: 120 }}>
                                <Select
                                  labelId='status-select-label'
                                  id='demo-simple-select'
                                  name='canceledReason'
                                  value={item.canceledReason ? item.canceledReason : ''}
                                  onChange={e => onChangeTextAndSelectField(e, index)}
                                  sx={{ width: 150 }}
                                >
                                  {listReasonCancel &&
                                    listReasonCancel.length > 0 &&
                                    listReasonCancel.map((item, index) => {
                                      return (
                                        <MenuItem key={index} value={item?.id}>
                                          {item?.name}
                                        </MenuItem>
                                      )
                                    })}
                                </Select>
                                {item.canceledReasonError ? (
                                  <Typography variant='subtitle1' color={'red'}>
                                    {item.canceledReasonError}
                                  </Typography>
                                ) : (
                                  <></>
                                )}
                              </FormControl>
                            </TableCell>
                            <TableCell align='left'>
                              <TextField
                                id='outlined-search'
                                type='search'
                                size='small'
                                sx={{ width: 150 }}
                                name='note'
                                value={item.note ? item.note : ''}
                                onChange={e => onChangeTextAndSelectField(e, index)}
                              />
                              {item.noteError ? (
                                <Typography variant='subtitle1' color={'red'}>
                                  {item.noteError}
                                </Typography>
                              ) : (
                                <></>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow
                        sx={{
                          '&:last-of-type td, &:last-of-type th': {
                            border: 0
                          }
                        }}
                      >
                        <TableCell component='th' scope='row'>
                          {'Không có bản ghi nào'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>

          {/* end */}
          <Grid item xs={12} style={{ textAlign: 'right' }}>
            <Button onClick={handleCloseDrawer} variant='outlined' style={{ marginRight: 10 }}>
              Đóng
            </Button>
            <Button onClick={handleCancel} variant='contained' style={{ marginRight: 10 }}>
              Xác nhận
            </Button>
          </Grid>
        </Grid>
      </Drawer>
    </Fragment>
  )
}

//nhận data là 1 list các item
export const DrawerConfirm = props => {
  const { openDrawer, setOpenDrawer, listItemChecked, setListItemChecked, onSuccess } = props

  //============================================================
  const [confirmActions, setConfirmActions] = useState([])

  const callGetAppMasterConfirmAction = async () => {
    const data = await getAppMasterConfirmAction()
    if (!data) return
    if (!data.data) return
    setConfirmActions(data.data)
  }

  const [listReasonCancel, setReasonCancel] = useState([])

  const callGetAppMasterReasonCancel = async () => {
    const data = await getAppMasterReasonCancel()
    if (!data) return
    if (!data.data) return
    setReasonCancel(data.data)
  }

  useEffect(() => {
    callGetAppMasterConfirmAction()
    callGetAppMasterReasonCancel()
  }, [])

  const handleCloseDrawer = () => {
    setOpenDrawer(false)
    setListItemChecked([])
  }

  //Thông tin table
  const listTableCellHead = [
    'Mã lịch hẹn',
    'Tên khách hàng',
    'Số điện thoại',
    'Trạng thái',
    'Thời gian bắt đầu dự kiến'
  ]

  const listTableCellName = ['id', 'customerFullName', 'customerPhoneNumber', 'statusName', 'expectedStartTime']

  const onChangeTextAndSelectField = (e, index) => {
    e.preventDefault()
    const temp = [...listItemChecked]
    temp[index] = { ...temp[index], [`${e.target.name}`]: e.target.value, [`${e.target.name}Error`]: null }

    setListItemChecked(temp)
  }

  const handleConfirm = async () => {
    let temp = [...listItemChecked]
    listItemChecked.forEach((item, index) => {
      temp[index] = { ...temp[index], [`action`]: 'CONFIRM' }
    })
    const data = await verifyAppointmentMaster(temp)

    console.log(listItemChecked)
    if (!data) return
    if (data.meta.code != 200) {
      props.setError(data.meta.message)
      props.setOpenError(true)

      return
    }
    props.onSuccess()
    handleCloseDrawer()
  }

  const handleRemoveItem = index => {
    console.log(index)
    console.log(listItemChecked)

    let tempListItemChecked = [...listItemChecked]
    tempListItemChecked.splice(index, 1)

    setListItemChecked(tempListItemChecked)

    if (typeof tempListItemChecked === undefined || tempListItemChecked.length === 0) {
      handleCloseDrawer()
    }
  }

  return (
    <Fragment>
      <Drawer
        anchor={'right'}
        open={openDrawer}
        hideBackdrop={true}
        onKeyDown={ev => {
          if (ev.key === 'Enter') {
            ev.preventDefault()
          }
          if (ev.key === 'Esc' || ev.key === 'Escape') {
            handleCloseDrawer()
          }
        }}
      >
        <Grid container spacing={6} style={{ width: `${widthViewPort}`, margin: 2 }}>
          {/* header */}
          <Grid item xs={12}>
            <Typography variant='h5' display={'inline'}>
              {`Xác nhận lịch hẹn`}
            </Typography>
            <Typography variant='h5' display={'inline'} style={{ color: 'blue' }}>
              {` (${listItemChecked.length})`}
            </Typography>
          </Grid>

          {/* body */}
          <Grid item xs={12}>
            <Card>
              <TableContainer component={Paper} sx={{ height: '60vh', minWidth: 650 }}>
                <Table sx={true ? {} : { width: 'max-content' }} stickyHeader aria-label='sticky table'>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ ...sticky, textTransform: 'none', zIndex: 99, borderRight: 1 }}>
                        {/* <p>Thao tác</p> */}
                        <Typography variant='subtitle1' gutterBottom>
                          Thao tác
                        </Typography>
                      </TableCell>

                      {listTableCellHead.map((item, index) => (
                        <TableCell key={index} sx={{ textTransform: 'none' }} align='left'>
                          <Typography variant='subtitle1' gutterBottom>
                            {item}
                          </Typography>
                        </TableCell>
                      ))}
                      <TableCell sx={{ textTransform: 'none' }} align='left'>
                        <Typography variant='subtitle1' gutterBottom sx={{ display: 'inline' }}>
                          Hành động
                        </Typography>
                        <Typography variant='subtitle1' gutterBottom sx={{ display: 'inline', color: 'red' }}>
                          *
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listItemChecked && listItemChecked.length > 0 ? (
                      listItemChecked.map((item, index) => {
                        return (
                          <TableRow key={index}>
                            {/* 1st cell */}
                            <TableCell component='th' scope='row' sx={{ ...sticky, borderRight: 1 }}>
                              <IconButton
                                onClick={() => {
                                  handleRemoveItem(index)
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                            {/* the rest cells */}
                            {listTableCellName.map((itemField, indexCell) => {
                              return (
                                <TableCell key={indexCell} align='left'>
                                  <Typography variant='subtitle2' gutterBottom>
                                    {item[`${itemField}`]}
                                  </Typography>
                                </TableCell>
                              )
                            })}
                            <TableCell align='left'>
                              <Typography variant='subtitle2' gutterBottom>
                                Xác nhận
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow
                        sx={{
                          '&:last-of-type td, &:last-of-type th': {
                            border: 0
                          }
                        }}
                      >
                        <TableCell component='th' scope='row'>
                          {'Không có bản ghi nào'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>

          {/* end */}
          <Grid item xs={12} style={{ textAlign: 'right' }}>
            <Button onClick={handleCloseDrawer} variant='outlined' style={{ marginRight: 10 }}>
              Đóng
            </Button>
            <Button onClick={handleConfirm} variant='contained' style={{ marginRight: 10 }}>
              Xác nhận
            </Button>
          </Grid>
        </Grid>
      </Drawer>
    </Fragment>
  )
}

//nhận data là 1 item
export const DrawerEdit = props => {
  const { openDrawer, setOpenDrawer, selectedItem, setSelectedItem, setError, setOpenError, onSuccess } = props
  const [itemData, setItemData] = useState()
  const [branchList, setBranchList] = useState()

  useEffect(() => {
    callApiGetAMDetail()
    callApiGetAllBranch()
  }, [selectedItem]) // eslint-disable-line react-hooks/exhaustive-deps

  const callApiGetAMDetail = async () => {
    if (selectedItem) {
      const data = await getAppointmentMasterDetail(selectedItem.id)
      console.log(data)
      if (!data) return
      if (data.meta.code != 200) {
        props.setError(data.meta.message)
        props.setOpenError(true)

        return
      }
      const tempData = data.data
      setItemData(tempData)
    }
  }

  const callApiGetAllBranch = async () => {
    if (selectedItem) {
      const data = await getAllBranch()
      console.log(data)
      if (!data) return
      if (data.meta.code != 200) {
        props.setError(data.meta.message)
        props.setOpenError(true)

        return
      }

      let temp = []
      data.data?.map(item => {
        if (item.isActive === true) {
          temp.push(item)
        }
      })
      setBranchList(temp)
      console.log(temp)
    }
  }

  const handleClose = () => {
    setItemData()
    setSelectedItem()
    setBranchList()
    setOpenDrawer()
  }

  const handleEdit = () => {
    handleClose()
  }

  return (
    <Drawer
      anchor={'right'}
      open={openDrawer}
      hideBackdrop={true}
      onKeyDown={ev => {
        if (ev.key === 'Enter') {
          ev.preventDefault()
        }
        if (ev.key === 'Esc' || ev.key === 'Escape') {
          handleClose()
        }
      }}
    >
      <Grid container spacing={6} style={{ width: `${widthViewPort}`, margin: 2 }}>
        {itemData ? (
          <Grid item sx={12}>
            <Typography variant='h6'>Cập nhật lịch hẹn</Typography>
            <Box sx={{ marginLeft: '32px', marginY: 4 }}>
              {itemData.customer.fullName ? (
                <Typography variant='body1' my={3}>
                  Tên khách hàng: <strong>{itemData.customer.fullName}</strong>
                </Typography>
              ) : (
                <></>
              )}
              {itemData.customer.phoneNumber ? (
                <Typography variant='body1' my={3}>
                  Số điện thoại: <strong>{itemData.customer.phoneNumber}</strong>
                </Typography>
              ) : (
                <></>
              )}
              {itemData.customer.email ? (
                <Typography variant='body1' my={3}>
                  Email: <strong>{itemData.customer.email}</strong>
                </Typography>
              ) : (
                <></>
              )}
            </Box>
            <Typography variant='body1'>
              <strong>Thông tin lịch hẹn</strong>
            </Typography>
            <Box sx={{ marginLeft: '32px', marginY: 4 }}>
              {itemData.status.name ? (
                <Typography variant='body1' my={3}>
                  Trạng thái lịch hẹn: <strong>{itemData.status.name}</strong>
                </Typography>
              ) : (
                <></>
              )}
              {itemData.status.code === 'CANCELED' ? (
                <Typography variant='body1' my={3}>
                  Lý do hủy: <strong>{itemData.canceledReason.description}</strong>
                </Typography>
              ) : (
                <></>
              )}
              {/* {itemData.canceledReason ? (
                itemData.canceledReason.reasonMessageType ? (
                  <Typography variant='body1' my={3}>
                    {itemData.canceledReason.reasonMessageType.description}:{' '}
                    <strong>{itemData.canceledReason.reasonMessageType.name}</strong>
                  </Typography>
                ) : (
                  <></>
                )
              ) : (
                <></>
              )} */}
              {itemData.branchName ? (
                <Box sx={{ width: '100%', display: 'flex' }}>
                  <Typography my='auto'>Chi nhánh: </Typography>
                  <FormControl>
                    <Select
                      labelId='status-select-label'
                      id='demo-simple-select'
                      name='branch'
                      sx={{ width: 300, ml: 4 }}
                      size='small'
                      value={itemData?.branchId}
                      onChange={e => setItemData({ ...itemData, branchId: e.target.value })}
                    >
                      {branchList &&
                        branchList.length > 0 &&
                        branchList.map((item, index) => {
                          return (
                            <MenuItem key={index} value={item?.id}>
                              {item?.name}
                            </MenuItem>
                          )
                        })}
                    </Select>
                  </FormControl>
                </Box>
              ) : (
                <></>
              )}
              {/* {selectedItem.expectedStartTime ? (
                <Typography variant='body1' my={3}>
                  Thời gian bắt đầu (dự kiến): <strong>{selectedItem.expectedStartTime}</strong>
                </Typography>
              ) : (
                <></>
              )}
              {selectedItem.expectedEndTime ? (
                <Typography variant='body1' my={3}>
                  Thời gian kết thúc (dự kiến): <strong>{selectedItem.expectedEndTime}</strong>
                </Typography>
              ) : (
                <></>
              )}
              {selectedItem.actualStartTime ? (
                <Typography variant='body1' my={3}>
                  Thời gian bắt đầu (thực tế): <strong>{selectedItem.actualStartTime}</strong>
                </Typography>
              ) : (
                <></>
              )}
              {selectedItem.actualEndTime ? (
                <Typography variant='body1' my={3}>
                  Thời gian kết thúc (thực tế): <strong>{selectedItem.actualEndTime}</strong>
                </Typography>
              ) : (
                <></>
              )} */}
              {/* {itemData.note && itemData.note !== '' ? (
                <Typography variant='body1' my={3}>
                  Ghi chú: <strong>{itemData.note}</strong>
                </Typography>
              ) : (
                <></>
              )} */}
            </Box>
            <Typography variant='body1'>
              <strong>Dịch vụ đã chọn</strong>
            </Typography>
            <Box sx={{ marginLeft: '32px', marginY: 4 }}>
              {itemData.appointmentServices && itemData.appointmentServices.length !== 0 ? (
                itemData.appointmentServices.map((item, key) => {
                  return (
                    <Grid key={key}>
                      <Grid>
                        <Typography key={key} variant='body1' my={3}>
                          {key + 1}. {item.spaServiceName}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography key={key} variant='body1' my={3}>
                          <strong>Thời gian bắt đầu thực hiện dịch vụ (dự kiến):</strong>{' '}
                          {timestampToString(item.expectedStartTime)}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography key={key} variant='body1' my={3}>
                          <strong>Thời gian kết thúc thực hiện dịch vụ (dự kiến):</strong>{' '}
                          {timestampToString(item.expectedEndTime)}
                        </Typography>
                      </Grid>
                      {item.actualStartTime && (
                        <Grid>
                          <Typography key={key} variant='body1' my={3}>
                            <strong>Thời gian bắt đầu thực hiện dịch vụ (thực tế):</strong>{' '}
                            <LocalizationProvider locale={vi} dateAdapter={AdapterDateFns}>
                              <DateTimePicker
                                renderInput={props => <TextField size='small' {...props} />}
                                label='Chọn thời gian'
                                value={item.actualStartTime}
                                inputProps={{ readOnly: true }}
                                onChange={newValue => {
                                  setItemData({ ...itemData, actualStartTime: getUnixTime(newValue) })
                                }}
                              />
                            </LocalizationProvider>
                          </Typography>
                        </Grid>
                      )}
                      {item.actualEndTime && (
                        <Grid>
                          <Typography key={key} variant='body1' my={3}>
                            <strong>Thời gian kết thúc thực hiện dịch vụ (thực tế):</strong>{' '}
                            <LocalizationProvider locale={vi} dateAdapter={AdapterDateFns}>
                              <DateTimePicker
                                renderInput={props => <TextField size='small' {...props} />}
                                label='Chọn thời gian'
                                value={item.actualEndTime}
                                inputProps={{ readOnly: true }}
                                onChange={newValue => {
                                  setItemData({ ...itemData, actualEndTime: getUnixTime(newValue) })
                                }}
                              />
                            </LocalizationProvider>
                          </Typography>
                        </Grid>
                      )}
                      {/* {item.specialist && (
                        <Grid>
                          <Typography key={key} variant='body1' my={3}>
                            <strong>Dịch vụ được thực hiện bởi: </strong>
                            {item.specialist.fullName}
                          </Typography>
                        </Grid>
                      )} */}
                    </Grid>
                  )
                })
              ) : (
                <></>
              )}
              {/* {itemData.total ? (
                <Typography variant='body1' my={3} sx={{ color: 'red' }}>
                  Tổng chi phí: <strong>{currencyFormatter.format(itemData.total)}</strong>
                </Typography>
              ) : (
                <></>
              )} */}
              {/* {itemData.invoices && itemData.invoices.length > 0 ? (
                <Grid p={7}>
                  <Typography variant='body1' my={3}>
                    Hoá đơn
                  </Typography>
                  <ImageList sx={{ width: 500, height: 200 }} cols={3} rowHeight={164}>
                    {itemData.invoices.map((item, index) => (
                      <ImageListItem key={index}>
                        <img src={item.url} alt='' loading='lazy' onClick={e => handleImage(item.url)} />
                        <Modal
                          open={open}
                          onClose={handleClose}
                          className={classes.modal}
                          closeAfterTransition
                          BackdropComponent={Backdrop}
                          BackdropProps={{
                            timeout: 300
                          }}
                        >
                          <Fade in={open} timeout={300} className={classes.img}>
                            <img
                              src={image}
                              alt='asd'
                              style={{ maxHeight: '90%', maxWidth: '90%', textAlign: 'center', opacity: 0.9 }}
                            />
                          </Fade>
                        </Modal>
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Grid>
              ) : (
                <></>
              )} */}
            </Box>
          </Grid>
        ) : (
          <Typography>Không có dịch vụ</Typography>
        )}
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', mr: 4 }}>
          <Button
            mr={3}
            onClick={() => {
              handleClose()
            }}
          >
            Đóng
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              handleEdit()
            }}
          >
            Chỉnh sửa
          </Button>
        </Grid>
      </Grid>
    </Drawer>
  )
}

//nhận data là 1 item
export const DrawerView = props => {
  const { openDrawer, setOpenDrawer, selectedItem, setSelectedItem, onSuccess } = props
  const [itemData, setItemData] = useState()

  const [open, setOpen] = useState(false)
  const [image, setImage] = useState('false')
  const classes = useStyles()

  const handleImage = value => {
    setImage(value)
    setOpen(true)
    console.log(image)
  }

  const handleClose = () => {
    onSuccess()
    setOpenDrawer(false)
    setSelectedItem()
    setItemData()
  }

  const handleCloseImage = () => {
    setOpen(false)
  }

  useEffect(() => {
    callApiGetAMDetail()
  }, [selectedItem]) // eslint-disable-line react-hooks/exhaustive-deps

  const callApiGetAMDetail = async () => {
    if (selectedItem) {
      const data = await getAppointmentMasterDetail(selectedItem.id)
      console.log(data)
      if (!data) return
      if (data.meta.code != 200) {
        props.setError(data.meta.message)
        props.setOpenError(true)

        return
      }
      const tempData = data.data
      setItemData(tempData)
    }
  }

  const currencyFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  })

  return (
    <Drawer
      anchor={'right'}
      open={openDrawer}
      hideBackdrop={true}
      onKeyDown={ev => {
        if (ev.key === 'Enter') {
          ev.preventDefault()
        }
        if (ev.key === 'Esc' || ev.key === 'Escape') {
          handleClose()
        }
      }}
    >
      <Grid container spacing={6} style={{ width: `${widthViewPort}`, margin: 2 }}>
        {/* header */}
        <Grid item xs={12}>
          <Typography variant='h5' display={'inline'}>
            {`Chi tiết lịch hẹn`}
          </Typography>
        </Grid>
        {/* body */}
        {itemData ? (
          <Grid item sx={12}>
            <Typography variant='h6'>Thông tin khách hàng</Typography>
            <Box sx={{ marginLeft: '32px', marginY: 4 }}>
              {itemData.customer.fullName ? (
                <Typography variant='body1' my={3}>
                  Tên khách hàng: <strong>{itemData.customer.fullName}</strong>
                </Typography>
              ) : (
                <></>
              )}
              {itemData.customer.phoneNumber ? (
                <Typography variant='body1' my={3}>
                  Số điện thoại: <strong>{itemData.customer.phoneNumber}</strong>
                </Typography>
              ) : (
                <></>
              )}
              {itemData.customer.email ? (
                <Typography variant='body1' my={3}>
                  Email: <strong>{itemData.customer.email}</strong>
                </Typography>
              ) : (
                <></>
              )}
            </Box>
            <Typography variant='h6'>Thông tin lịch hẹn</Typography>
            <Box sx={{ marginLeft: '32px', marginY: 4 }}>
              {itemData.status.name ? (
                <Typography variant='body1' my={3}>
                  Trạng thái lịch hẹn: <strong>{itemData.status.name}</strong>
                </Typography>
              ) : (
                <></>
              )}
              {itemData.status.code === 'CANCELED' ? (
                <Typography variant='body1' my={3}>
                  Lý do hủy: <strong>{itemData.canceledReason.description}</strong>
                </Typography>
              ) : (
                <></>
              )}
              {itemData.canceledReason ? (
                itemData.canceledReason.reasonMessageType ? (
                  <Typography variant='body1' my={3}>
                    {itemData.canceledReason.reasonMessageType.description}:{' '}
                    <strong>{itemData.canceledReason.reasonMessageType.name}</strong>
                  </Typography>
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}
              {itemData.branchName ? (
                <Typography variant='body1' my={3}>
                  Chi nhánh: <strong>{itemData.branchName}</strong>
                </Typography>
              ) : (
                <></>
              )}
              {selectedItem.expectedStartTime ? (
                <Typography variant='body1' my={3}>
                  Thời gian bắt đầu (dự kiến): <strong>{selectedItem.expectedStartTime}</strong>
                </Typography>
              ) : (
                <></>
              )}
              {selectedItem.expectedEndTime ? (
                <Typography variant='body1' my={3}>
                  Thời gian kết thúc (dự kiến): <strong>{selectedItem.expectedEndTime}</strong>
                </Typography>
              ) : (
                <></>
              )}
              {selectedItem.actualStartTime ? (
                <Typography variant='body1' my={3}>
                  Thời gian bắt đầu (thực tế): <strong>{selectedItem.actualStartTime}</strong>
                </Typography>
              ) : (
                <></>
              )}
              {selectedItem.actualEndTime ? (
                <Typography variant='body1' my={3}>
                  Thời gian kết thúc (thực tế): <strong>{selectedItem.actualEndTime}</strong>
                </Typography>
              ) : (
                <></>
              )}
              {itemData.note && itemData.note !== '' ? (
                <Typography variant='body1' my={3}>
                  Ghi chú: <strong>{itemData.note}</strong>
                </Typography>
              ) : (
                <></>
              )}
            </Box>
            <Typography variant='h6'>Dịch vụ đã chọn</Typography>
            <Box sx={{ marginLeft: '32px', marginY: 4 }}>
              {itemData.appointmentServices && itemData.appointmentServices.length !== 0 ? (
                itemData.appointmentServices.map((item, key) => {
                  return (
                    <Grid key={key}>
                      <Grid>
                        <Typography key={key} variant='body1' my={3}>
                          {key + 1}. {item.spaServiceName}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography key={key} variant='body1' my={3}>
                          <strong>Thời gian bắt đầu thực hiện dịch vụ (dự kiến):</strong>{' '}
                          {timestampToString(item.expectedStartTime)}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography key={key} variant='body1' my={3}>
                          <strong>Thời gian kết thúc thực hiện dịch vụ (dự kiến):</strong>{' '}
                          {timestampToString(item.expectedEndTime)}
                        </Typography>
                      </Grid>
                      {item.actualStartTime && (
                        <Grid>
                          <Typography key={key} variant='body1' my={3}>
                            <strong>Thời gian bắt đầu thực hiện dịch vụ (thực tế):</strong>{' '}
                            {timestampToString(item.actualStartTime)}
                          </Typography>
                        </Grid>
                      )}
                      {item.actualEndTime && (
                        <Grid>
                          <Typography key={key} variant='body1' my={3}>
                            <strong>Thời gian kết thúc thực hiện dịch vụ (thực tế):</strong>{' '}
                            {timestampToString(item.actualEndTime)}
                          </Typography>
                        </Grid>
                      )}
                      {item.specialist && (
                        <Grid>
                          <Typography key={key} variant='body1' my={3}>
                            <strong>Dịch vụ được thực hiện bởi: </strong>
                            {item.specialist.fullName}
                          </Typography>
                        </Grid>
                      )}
                      {item.canceledReason && (
                        <Grid>
                          <Typography key={key} variant='body1' my={3}>
                            <strong>Lý do hủy: </strong>
                            {item.canceledReason.title}{' '}
                            {item.canceledReason.reasonMessageType && `(${item.canceledReason.reasonMessageType.name})`}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  )
                })
              ) : (
                <></>
              )}
              {itemData.total ? (
                <Typography variant='body1' my={3} sx={{ color: 'red' }}>
                  Tổng chi phí: <strong>{currencyFormatter.format(itemData.total)}</strong>
                </Typography>
              ) : (
                <></>
              )}
              {itemData.invoices && itemData.invoices.length > 0 ? (
                <Grid p={7}>
                  <Typography variant='body1' my={3}>
                    Hoá đơn
                  </Typography>
                  <ImageList sx={{ width: 500, height: 200 }} cols={3} rowHeight={164}>
                    {itemData.invoices.map((item, index) => (
                      <ImageListItem key={index}>
                        <img src={item.url} alt='' loading='lazy' onClick={e => handleImage(item.url)} />
                        <Modal
                          open={open}
                          onClose={handleCloseImage}
                          className={classes.modal}
                          closeAfterTransition
                          BackdropComponent={Backdrop}
                          BackdropProps={{
                            timeout: 300
                          }}
                        >
                          <Fade in={open} timeout={300} className={classes.img}>
                            <img
                              src={image}
                              alt='asd'
                              style={{ maxHeight: '90%', maxWidth: '90%', textAlign: 'center', opacity: 0.9 }}
                            />
                          </Fade>
                        </Modal>
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Grid>
              ) : (
                <></>
              )}
            </Box>
          </Grid>
        ) : (
          <Typography>Không có dịch vụ</Typography>
        )}

        {/* end */}
        <Grid item xs={12} style={{ textAlign: 'right', marginRight: '16px' }}>
          <Button
            onClick={() => {
              handleClose()
            }}
          >
            Đóng
          </Button>
        </Grid>
      </Grid>
    </Drawer>
  )
}

//nhận data là 1 item
export const DrawerCheckin = props => {
  const { openDrawer, setOpenDrawer, selectedItem, setSelectedItem, setError, setOpenError, onSuccess } = props
  const [itemData, setItemData] = useState()
  const [itemAppointmentServices, setItemAppointmentServices] = useState()
  const [itemActualStartTime, setItemActualStartTime] = useState()

  const [specialistData, setSpecialistData] = useState([])

  const [servicesExpectedTime, setServicesExpectedTime] = useState()

  const [specialistNoteError, setSpecialistNoteError] = useState()

  const handleChangeSpecialist = (e, key) => {
    let temp = itemAppointmentServices
    temp[key].specialist = { id: e.target.value }
    setItemAppointmentServices(temp)
    console.log('itemAppointmentServices sau khi chọn chuyên viên', temp)
  }

  useEffect(() => {
    callApiGetAMDetail()
  }, [selectedItem]) // eslint-disable-line react-hooks/exhaustive-deps

  const callApiGetAMDetail = async () => {
    if (selectedItem) {
      const data = await getAppointmentMasterDetail(selectedItem.id)
      if (!data) return
      if (data.meta.code != 200) {
        props.setError(data.meta.message)
        props.setOpenError(true)

        return
      }
      const tempData = data.data

      setItemData(tempData)
      const tempItemAS = []
      tempData.appointmentServices.map(item => {
        if (!item.canceledReason) {
          tempItemAS.push(item)
        }
      })
      setItemAppointmentServices(tempItemAS)

      setFirstAS(tempItemAS[0])

      setItemActualStartTime(new Date())

      if (data.data.note) setNote(data.data.note)
    }
  }

  const handleCloseDrawer = () => {
    setOpenDrawer(false)
    setSelectedItem()
    setItemData()
    setServicesExpectedTime('')
    setItemAppointmentServices()
    setItemActualStartTime()
    setNote('')
    setNoteError()
    setSpecialistNoteError()
    setFirstAS()
    setSelectedCancelAS()
    setCancelASInfo([])
    setSpecialistData([])
    onSuccess()
  }

  const callApiCheckinAM = async optionData => {
    const data = await checkinAppointmentMaster(optionData)
    if (!data) return
    if (data.meta.code != 200) {
      props.setError(data.meta.message)
      props.setOpenError(true)

      return
    }
    handleCloseDrawer()
  }

  const callApiCancel = async optionData => {
    const cancelInfo = [...cancelASInfo]
    const data = await cancelAppointmentService(cancelInfo)
    if (!data) return
    if (data.meta.code != 200) {
      props.setError(data.meta.message)
      props.setOpenError(true)

      return
    }
    callApiCheckinAM(optionData)
  }

  const handleCheckin = () => {
    const temp = [...itemAppointmentServices]
    temp[0].actualStartTime = itemActualStartTime

    console.log(temp)

    // console.log(differenceInMinutes(Date.parse(itemActualStartTime), itemData.expectedStartTime));
    // if(differenceInMinutes(Date.parse(itemActualStartTime), itemData.expectedStartTime) < -29 || differenceInMinutes(Date.parse(itemActualStartTime), itemData.expectedStartTime) > 30) {
    //   setError("Thời gian bắt đầu thực tế không được phép chênh lệch quá 30 phút so với thời gian dự kiến")
    //   setOpenError(true)

    //   return
    // }
    let errString = ''
    if (
      format(itemActualStartTime, 'ddMMyyyy', { locale: vi }) !==
      format(itemData.expectedStartTime, 'ddMMyyyy', { locale: vi })
    ) {
      console.log(format(itemActualStartTime, 'ddMMyyyy', { locale: vi }))
      console.log(format(itemData.expectedStartTime, 'ddMMyyyy', { locale: vi }))
      errString +=
        'Thời gian bắt đầu dự kiến và thời gian bắt đầu thực tế của lịch hẹn phải nằm trong cùng một ngày. Vui lòng kiểm tra lại.'
    }

    // if(note.trim()) {
    //   setNoteError("Trường này không được để trống")
    // }

    console.log('note', note)

    if (note.trim().length > 1000) {
      setNoteError('Trường này chỉ tối đa 1000 ký tự')
    }

    if (errString) {
      setError(errString)
      setOpenError(true)
    }

    let tempSpecialistNoteError = []

    itemAppointmentServices.map(item => {
      let temp = ''
      if (item.specialistInfoNote) {
        if (item.specialistInfoNote.trim().length > 1000) {
          temp = 'Trường này chỉ tối đa 1000 ký tự'
        }
      }
      tempSpecialistNoteError.push(temp)
    })

    setSpecialistNoteError(tempSpecialistNoteError)

    console.log(tempSpecialistNoteError)

    if (errString || noteError) {
      return
    }

    var validSpecialistNote = true

    tempSpecialistNoteError.map(item => {
      if (item !== '') {
        validSpecialistNote = false
      }
    })

    if (validSpecialistNote === false) return

    var data = {
      id: itemData.id,
      total: totalPrice,
      payAmount: itemData.payAmount,
      branchId: itemData.branchId,
      branchCode: itemData.branchCode,
      branchName: itemData.branchName,
      customer: itemData.customer,
      status: itemData.status,
      requireConfirm: itemData.requireConfirm,
      note: note,
      extraAppointmentServices: [],
      appointmentServices: temp
    }

    const tempCancelInfo = [...cancelASInfo]

    if (tempCancelInfo === undefined || tempCancelInfo.length === 0) {
      callApiCheckinAM(data)

      return
    } else {
      callApiCancel(data)

      return
    }
  }

  const handleChangeSpecialistInfoNote = (e, itemId) => {
    var temp = [...itemAppointmentServices]
    var tempItemId = temp.findIndex(x => x.id === itemId)
    temp[tempItemId].specialistInfoNote = e.target.value
    setItemAppointmentServices(temp)
    console.log(temp)
  }

  const handleChangeActualStartTime = value => {
    const newDate = value

    // const dateString = datetimeLocalToTimestamp(newDate)

    console.log(newDate)
    console.log(!isDate(Date.parse(newDate)))

    // if(!isDate(Date.parse(newDate))) {
    //   // setError("Thời gian bắt đầu thực tế không hợp lệ")
    //   // setOpenError(true)

    //   return
    // }

    setItemActualStartTime(newDate)
  }

  const [firstAS, setFirstAS] = useState()

  const handleChangeFirstAS = e => {
    const temp = [...itemAppointmentServices]
    setFirstAS(temp.find(x => x.id === e.target.value))
    console.log(firstAS)
  }

  useEffect(() => {
    if (itemAppointmentServices) {
      const temp = [...itemAppointmentServices]

      const tempFirstASIndex = temp.findIndex(x => x.id === firstAS?.id)
      const tempFirstAS = temp.splice(tempFirstASIndex, 1)
      temp.unshift(tempFirstAS[0])

      setItemAppointmentServices()

      setItemAppointmentServices(temp)
    }
  }, [firstAS]) // eslint-disable-line react-hooks/exhaustive-deps

  const [note, setNote] = useState('')
  const [noteError, setNoteError] = useState()

  const handleChangeNote = e => {
    const temp = e.target.value
    setNote(temp)
  }

  const currencyFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  })

  //=======================================================
  //Display cancel appointment service popup modal

  const [openCancelAS, setOpenCancelAS] = useState(false)

  const [selectedCancelAS, setSelectedCancelAS] = useState()

  const [cancelASInfo, setCancelASInfo] = useState([])

  const handleCancelAS = item => {
    if (itemAppointmentServices.length === 1) {
      setError('Mỗi lịch hẹn phải có ít nhất 1 dịch vụ. Bạn không thể hủy dịch vụ duy nhất của lịch hẹn')
      setOpenError(true)
    } else {
      setSelectedCancelAS(item)
      setOpenCancelAS(true)
    }
  }

  //Mỗi lần sau khi hủy thì cập nhật lại list AS

  useEffect(() => {
    setSpecialistNoteError()
    if (cancelASInfo && itemAppointmentServices) {
      const tempCancelInfo = [...cancelASInfo]
      var tempItemAppointmentService = [...itemAppointmentServices]
      tempCancelInfo.map(item => {
        tempItemAppointmentService = tempItemAppointmentService.filter(x => !(x.id === item.id))
      })

      setItemAppointmentServices(tempItemAppointmentService)
    }
  }, [cancelASInfo]) // eslint-disable-line react-hooks/exhaustive-deps

  //Tính tổng giá tiền
  const [totalPrice, setTotalPrice] = useState()

  useEffect(() => {
    if (itemAppointmentServices) {
      var tempTotal = 0
      const tempItemAppointmentService = [...itemAppointmentServices]
      tempItemAppointmentService.map(item => {
        if (!item.canceledReason) {
          tempTotal += item.spaServicePrice
        }
      })
      setTotalPrice(tempTotal)
    }
  }, [itemAppointmentServices])

  //Call api lấy danh sách nhân viên rảnh

  //loop qua itemAppointmentServices để push data vào list, rồi return list đó ra
  const loopToGetTempList = async () => {
    const result = []
    const tempItemAppointmentService = [...itemAppointmentServices]
    var tempTime = datetimeToTimestamp(itemActualStartTime)

    for (const item of tempItemAppointmentService) {
      const tempStartTime = tempTime
      tempTime += item.duration * 60000
      const tempEndTime = tempTime
      const response = await callApiGetASAvailableSpecialist(tempStartTime, tempEndTime, item.id, itemData.branchId)
      result.push(response)
    }

    return result
  }

  const getListAvailableSpecialist = async () => {
    const tempSpecialList = await loopToGetTempList()
    setSpecialistData(tempSpecialList)
  }

  const callApiGetASAvailableSpecialist = async (startTime, endTime, serviceId, branchId) => {
    if (!isValid(startTime) || !isValid(endTime)) {
      console.log('Invalid time')
      console.log('starttime', startTime)
      console.log('endtime', endTime)

      return
    }
    const data = await getAvailableSpecialist(startTime, endTime, serviceId, branchId)
    if (!data) return
    if (data.meta.code != 200) {
      // props.setError(data.meta.message)
      // props.setOpenError(true)

      return
    }
    if (!data.data) return

    return data.data
  }

  useEffect(() => {
    if (itemAppointmentServices && itemActualStartTime) {
      getListAvailableSpecialist()
    }
  }, [itemAppointmentServices, itemActualStartTime]) // eslint-disable-line react-hooks/exhaustive-deps

  const genFormSelect = index => {
    return (
      <Select
        labelId='assign-specialist'
        id='assign-specialist'
        label='Chọn chuyên viên'
        size='small'
        value={itemAppointmentServices.specialist?.id}
        onChange={e => handleChangeSpecialist(e, index)}
      >
        {specialistData[index]?.map(item => {
          return (
            <MenuItem key={item.id} value={item.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>{item.fullName}</Typography>
            </MenuItem>
          )
        })}
      </Select>
    )
  }

  return (
    <Drawer
      anchor={'right'}
      open={openDrawer}
      hideBackdrop={true}
      onKeyDown={ev => {
        if (ev.key === 'Enter') {
          ev.preventDefault()
        }
        if (ev.key === 'Esc' || ev.key === 'Escape') {
          handleCloseDrawer()
        }
      }}
    >
      <Grid container spacing={6} style={{ width: `100vw`, margin: 0 }}>
        {/* header */}
        <Grid item xs={12}>
          <Typography variant='h5' display={'inline'}>
            {`Check-in`}
          </Typography>
        </Grid>
        {/* body */}
        {itemData ? (
          <>
            <Grid item xs={6}>
              <Typography variant='h6'>Thông tin khách hàng</Typography>
              <Box sx={{ marginLeft: '32px', marginY: 4 }}>
                {itemData.customer.fullName ? (
                  <Typography variant='body1' my={3}>
                    Tên khách hàng: <strong>{itemData.customer.fullName}</strong>
                  </Typography>
                ) : (
                  <></>
                )}
                {itemData.customer.phoneNumber ? (
                  <Typography variant='body1' my={3}>
                    Số điện thoại: <strong>{itemData.customer.phoneNumber}</strong>
                  </Typography>
                ) : (
                  <></>
                )}
                {itemData.customer.email ? (
                  <Typography variant='body1' my={3}>
                    Email: <strong>{itemData.customer.email}</strong>
                  </Typography>
                ) : (
                  <></>
                )}
              </Box>
              <Typography variant='h6'>Thông tin lịch hẹn</Typography>
              <Box sx={{ marginLeft: '32px', marginY: 4 }}>
                {itemData.branchName ? (
                  <Typography variant='body1' my={3}>
                    Chi nhánh: <strong>{itemData.branchName}</strong>
                  </Typography>
                ) : (
                  <></>
                )}
                {selectedItem?.expectedStartTime ? (
                  <Typography variant='body1' my={3}>
                    Thời gian bắt đầu (dự kiến): <strong>{selectedItem.expectedStartTime}</strong>
                  </Typography>
                ) : (
                  <></>
                )}
                {selectedItem?.expectedEndTime ? (
                  <Typography variant='body1' my={3}>
                    Thời gian kết thúc (dự kiến): <strong>{selectedItem.expectedEndTime}</strong>
                  </Typography>
                ) : (
                  <></>
                )}
                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant='body1' my={3} sx={{ display: 'inline' }}>
                      Thời gian bắt đầu (thực tế):
                    </Typography>
                    <Typography variant='subtitle1' gutterBottom sx={{ display: 'inline', color: 'red' }}>
                      *
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <LocalizationProvider locale={vi} dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        renderInput={props => <TextField size='small' {...props} />}
                        label='Chọn thời gian'
                        value={itemActualStartTime}
                        inputProps={{ readOnly: true }}
                        onChange={newValue => {
                          handleChangeActualStartTime(newValue)
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6}>
                    {' '}
                    <Typography variant='body1' my={3}>
                      Dịch vụ thực hiện đầu tiên:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    {' '}
                    <FormControl>
                      <Select
                        size='small'
                        value={firstAS ? firstAS.id : 0}
                        defaultValue={firstAS ? firstAS.id : 0}
                        onChange={e => handleChangeFirstAS(e)}
                      >
                        {itemAppointmentServices?.map((item, key) => {
                          return (
                            <MenuItem key={key} value={item.id}>
                              {item.spaServiceName}
                            </MenuItem>
                          )
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    {' '}
                    <Typography variant='body1' my={3}>
                      Ghi chú:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    {' '}
                    <Box
                      component='form'
                      sx={{
                        '& > :not(style)': { m: 1, width: '90%' }
                      }}
                      autoComplete='off'
                    >
                      <TextField
                        id='note'
                        value={note}
                        label='Nhập ghi chú'
                        variant='standard'
                        onChange={e => handleChangeNote(e)}
                        onFocus={() => setNoteError()}
                        error={noteError ? true : false}
                        helperText={noteError}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={6}>
              {/* <Typography variant='h6'>Tải ảnh lên</Typography> */}
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h6'>Phân công chuyên viên</Typography>
              <Box sx={{ marginTop: 4 }}>
                <Grid container sx={{ marginBottom: 4, textAlign: 'center' }}>
                  <Grid item xs={1}>
                    Hành động
                  </Grid>
                  <Grid item xs={3}>
                    Tên dịch vụ
                  </Grid>
                  <Grid item xs={3}>
                    Chuyên viên
                  </Grid>
                  <Grid item xs={2}>
                    Giá
                  </Grid>
                  <Grid item xs={3}>
                    Ghi chú chuyên viên
                  </Grid>
                </Grid>
                {itemAppointmentServices && itemAppointmentServices.length !== 0 ? (
                  itemAppointmentServices.map((item, key) => {
                    return (
                      <Box key={item.id}>
                        <Grid container my={2} spacing={2}>
                          <Grid item xs={1} variant='body1' my={3}>
                            {isAccessible('SSDS_C_AS_CANCEL') && (
                              <Tooltip title='Hủy dịch vụ'>
                                <Button onClick={() => handleCancelAS(item)}>
                                  <RemoveIcon />
                                </Button>
                              </Tooltip>
                            )}
                          </Grid>
                          <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                            <Typography>{item.spaServiceName}</Typography>
                          </Grid>
                          <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                            {/*{specialistData[key] && (*/}
                            <FormControl sx={{ width: '90%' }}>
                              <InputLabel id='assign-specialist'>Chọn chuyên viên</InputLabel>
                              {genFormSelect(key)}
                            </FormControl>
                            {/*)}*/}
                          </Grid>
                          <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                            {item.spaServicePrice ? (
                              <Typography>{currencyFormatter.format(item.spaServicePrice)}</Typography>
                            ) : (
                              <>Giá</>
                            )}
                          </Grid>
                          <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                            <Typography>
                              <Box
                                component='form'
                                sx={{
                                  '& > :not(style)': { m: 1, width: '90%' }
                                }}
                                autoComplete='off'
                              >
                                <TextField
                                  id='note'
                                  variant='standard'
                                  value={itemAppointmentServices[key]?.specialistInfoNote || ''}
                                  onChange={e => {
                                    handleChangeSpecialistInfoNote(e, item.id)
                                  }}
                                  error={specialistNoteError && specialistNoteError[key] ? true : false}
                                  helperText={specialistNoteError && specialistNoteError[key]}
                                  onFocus={() => {
                                    setSpecialistNoteError()
                                  }}
                                />
                              </Box>
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    )
                  })
                ) : (
                  <></>
                )}
                <Grid container>
                  <Grid item xs={7} sx={{ textAlign: 'right' }}>
                    <Typography variant='body1' my={3} mr={3} sx={{ color: 'red' }}>
                      Tổng chi phí:
                    </Typography>
                  </Grid>
                  <Grid item xs={5}>
                    {totalPrice ? (
                      <Typography variant='body1' my={3} sx={{ color: 'red' }}>
                        <strong>{currencyFormatter.format(totalPrice)}</strong>
                      </Typography>
                    ) : (
                      <></>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </>
        ) : (
          <Typography>Không có dịch vụ</Typography>
        )}

        {/* end */}
        <Grid item xs={12} style={{ textAlign: 'right', marginRight: '16px' }}>
          <Button
            onClick={() => {
              handleCloseDrawer()
            }}
          >
            Đóng
          </Button>
          <Button variant='contained' onClick={() => handleCheckin()}>
            Check-in
          </Button>
        </Grid>
        <div>
          <ModalCancelAS
            open={openCancelAS}
            setOpen={setOpenCancelAS}
            selectedItem={selectedCancelAS}
            setSelectedItem={setSelectedCancelAS}
            cancelASInfo={cancelASInfo}
            setCancelASInfo={setCancelASInfo}
            setError={setError}
            setOpenError={setOpenError}
          ></ModalCancelAS>
        </div>
      </Grid>
    </Drawer>
  )
}

//nhận data là 1 item
export const DrawerCheckout = props => {
  const { openDrawer, setOpenDrawer, selectedItem, setSelectedItem, setError, setOpenError, onSuccess } = props
  const [itemData, setItemData] = useState()
  const [itemAppointmentServices, setItemAppointmentServices] = useState()
  const [actualStartTime, setActualStartTime] = useState()
  const [itemActualStartTime, setItemActualStartTime] = useState()
  const [specialistData, setSpecialistData] = useState([])
  const [file, setFile] = useState()
  const [fileArray, setFileArray] = useState([])
  const [fileArrayId, setFileArrayId] = useState([])
  const [listPaymentMethod, setPaymentMethod] = useState([])
  const [listSelectedPaymentMethod, setSelectePaymentMethod] = useState({})
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState('')
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState('false')
  const [enableButton, setEnableButton] = useState(true)

  const [specialistNoteError, setSpecialistNoteError] = useState()
  const classes = useStyles()

  const handleImage = value => {
    setImage(value)
    setOpen(true)
    console.log(image)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const callGetPaymentMethod = async () => {
    const data = await getPaymentMethod()
    console.log(data)
    if (!data) return
    if (!data.data) return
    setPaymentMethod(data.data)
  }

  const changeSelectedPaymentMethod = e => {
    setCurrentPaymentMethod(e.target.value)
    console.log(e.target)

    const newlistPaymentMethod = e.target.value
    setSelectePaymentMethod(newlistPaymentMethod)
    console.log(newlistPaymentMethod)
  }

  const handleChangeSpecialist = (e, key) => {
    let temp = itemAppointmentServices
    temp[key].specialist = { id: e.target.value }
    setItemAppointmentServices(temp)
    console.log('itemAppointmentServices sau khi chọn chuyên viên', temp)
  }

  // const callGetAppMasterDirection = async () => {
  //   const data = await getAppMasterReasonCancel();
  //   if (!data) return;
  //   if (!data.data) return;
  //   setReasonCancel(data.data);
  // };

  const selectFile = e => {
    const imageFile = e.target.files[0]
    console.log(e.target.name)
    if (!imageFile.name.match(/\.(jpg|jpeg|png|gif)$/)) {
      setError('Chỉ được chọn file ảnh')
      setOpenError(true)
      e.target.value = null
    } else {
      setFile(e.target.files[e.target.files.length - 1])
      console.log(e.target.files)
    }
  }

  const handleDisableImage = index => {
    console.log(index)
    setFileArray(fileArray.filter((file, i) => index != i))
    setFileArrayId(fileArrayId.filter((file, i) => index != i))
  }

  const uploadFile = async e => {
    console.log(file)
    if (e) {
      const res = await uploadImage(file)

      setFileArrayId([...fileArrayId, { id: res.data.id, url: res.data.url }])
      setFileArray([...fileArray, res.data.url])
      console.log(fileArrayId)
      console.log(res)
      setEnableButton(false)
      setTimeout(function () {
        setEnableButton(true)
      }, 5000)
    }
  }

  useEffect(() => {
    callGetPaymentMethod()
  }, [])

  useEffect(() => {
    callApiGetAMDetail()
  }, [selectedItem]) // eslint-disable-line react-hooks/exhaustive-deps

  const callApiGetAMDetail = async () => {
    if (selectedItem) {
      const data = await getAppointmentMasterDetail(selectedItem.id)
      if (!data) return
      if (data.meta.code != 200) {
        props.setError(data.meta.message)
        props.setOpenError(true)

        return
      }
      const tempData = data.data
      console.log('data.data', data.data)

      // calculateSetviceExpectedTime(tempData)
      setItemData(tempData)
      const tempItemAS = []
      tempData.appointmentServices.map(item => {
        if (!item.canceledReason) {
          tempItemAS.push(item)
        }
      })

      // Tìm dịch vụ được thực hiện đầu tiên và sắp xếp lên đầu
      tempItemAS.map((item, index) => {
        if (item.actualStartTime) {
          const tempFirstAS = tempItemAS.splice(index, 1)
          tempItemAS.unshift(tempFirstAS[0])
        }
      })

      // Tính toán sẵn thời gian dựa trên thời gian bắt đầu thực tế của dịch vụ đầu tiên

      let estimatedTimestamp = tempItemAS[0].actualStartTime

      tempItemAS.map((item, index) => {
        item.actualStartTime = estimatedTimestamp
        console.log(`start time ${index}: ${estimatedTimestamp}`)
        estimatedTimestamp += item.duration * 60000
        item.actualEndTime = estimatedTimestamp
        console.log(`end time ${index}: ${estimatedTimestamp}`)
      })

      console.log(tempItemAS)
      setItemAppointmentServices(tempItemAS)
      setActualStartTime(data.data.actualStartTime)
      setItemActualStartTime(data.data.actualStartTime)

      if (data.data.note) setNote(data.data.note)
    }
  }

  const handleCloseDrawer = () => {
    setOpenDrawer(false)
    setSelectedItem()
    setItemData()
    setItemAppointmentServices()
    setNote('')
    setSpecialistNoteError()
    setSpecialistData([])
    setCurrentPaymentMethod('')
    setFileArray([])
    setFileArrayId([])
    onSuccess()
  }

  const callApiCheckoutAM = async optionData => {
    const data = await checkoutAppointmentMaster(optionData)
    if (!data) return
    if (data.meta.code != 200) {
      props.setError(data.meta.message)
      props.setOpenError(true)

      return
    }

    setFileArray([])
    setFileArrayId([])
    setCurrentPaymentMethod('')
    onSuccess()
    setOpenDrawer(false)
    handleCloseDrawer()
  }

  const handleCheckout = () => {
    var tempItemAppointmentService = [...itemAppointmentServices]

    tempItemAppointmentService.forEach(item => {
      item.payAmount = item.spaServicePrice
    })

    // validate trước khi checkout

    let errorString = ''

    if (fileArrayId === undefined || fileArrayId.length === 0) {
      errorString += 'Bạn chưa upload ảnh nhằm xác nhận thanh toán<br>'
    }

    if (currentPaymentMethod === '') {
      errorString += 'Bạn chưa chọn phương thức thanh toán<br>'
    }

    // if (
    //   format(itemActualStartTime, 'ddMMyyyy', { locale: vi }) !==
    //   format(itemData.expectedStartTime, 'ddMMyyyy', { locale: vi })
    // ) {
    //   errorString +=
    //     'Thời gian bắt đầu dự kiến và thời gian bắt đầu thực tế của lịch hẹn phải nằm trong cùng một ngày.'

    //     errorString += '<br>'
    // }

    let blankStart = []
    let blankEnd = []
    let notSameDayAMStart = []
    let notSameDayAMEnd = []
    let beforeAMStart = []
    let beforeAMEnd = []
    let invalid = []
    let invalid2 = []

    tempItemAppointmentService.forEach((item, index) => {
      if (!item.actualStartTime) {
        blankStart.push(index + 1)

        // return
      } else {
        if (
          format(item.actualStartTime, 'ddMMyyyy', { locale: vi }) !==
          format(itemData.actualStartTime, 'ddMMyyyy', { locale: vi })
        ) {
          notSameDayAMStart.push(index + 1)
        }
        if (item.actualStartTime < itemData.actualStartTime) {
          beforeAMStart.push(index + 1)

          // return
        }
        if (item.actualEndTime) {
          if (item.actualEndTime < item.actualStartTime) {
            invalid.push(index + 1)
          }
          if (
            format(item.actualEndTime, 'ddMMyyyy', { locale: vi }) !==
            format(itemData.actualStartTime, 'ddMMyyyy', { locale: vi })
          ) {
            notSameDayAMEnd.push(index + 1)
          }
        }
        if (index >= 1) {
          if (item.actualStartTime && tempItemAppointmentService[index - 1]?.actualEndTime) {
            if (item.actualStartTime < tempItemAppointmentService[index - 1]?.actualEndTime) {
              invalid2.push(index + 1)
            }
          }
        }
      }
    })

    tempItemAppointmentService.forEach((item, index) => {
      if (!item.actualEndTime) {
        blankEnd.push(index + 1)

        // return
      } else {
        if (item.actualEndTime < itemData.actualStartTime) {
          beforeAMEnd.push(index + 1)
        }
      }
    })

    if (blankStart !== undefined && blankStart.length !== 0) {
      console.log(blankStart)
      errorString += 'Bạn chưa nhập thời gian bắt đầu của dịch vụ '
      blankStart.map((item, index) => {
        errorString += item
        if (index < blankStart.length - 1) errorString += ', '
      })
      errorString += '<br>'
    }

    if (blankEnd !== undefined && blankEnd.length !== 0) {
      console.log(blankEnd)
      errorString += 'Bạn chưa nhập thời gian kết thúc của dịch vụ '
      blankEnd.map((item, index) => {
        errorString += item
        if (index < blankEnd.length - 1) errorString += ', '
      })
      errorString += '<br>'
    }

    if (beforeAMStart !== undefined && beforeAMStart.length !== 0) {
      console.log(beforeAMStart)
      errorString += 'Thời gian bắt đầu của dịch vụ '
      beforeAMStart.map((item, index) => {
        errorString += item
        if (index < beforeAMStart.length - 1) errorString += ', '
      })
      errorString += ' không thể nhỏ hơn thời gian bắt đầu của lịch hẹn<br>'
    }

    if (beforeAMEnd !== undefined && beforeAMEnd.length !== 0) {
      console.log(beforeAMEnd)
      errorString += 'Thời gian kết thúc của dịch vụ '
      beforeAMEnd.map((item, index) => {
        errorString += item
        if (index < beforeAMEnd.length - 1) errorString += ', '
      })
      errorString += ' không thể nhỏ hơn thời gian bắt đầu của lịch hẹn<br>'
    }

    if (notSameDayAMStart !== undefined && notSameDayAMStart.length !== 0) {
      errorString += 'Thời gian bắt đầu của dịch vụ '
      notSameDayAMStart.map((item, index) => {
        errorString += item
        if (index < notSameDayAMStart.length - 1) errorString += ', '
      })
      errorString += ' phải cùng ngày với thời gian bắt đầu thực tế của lịch hẹn<br>'
    }

    if (notSameDayAMEnd !== undefined && notSameDayAMEnd.length !== 0) {
      errorString += 'Thời gian kết thúc của dịch vụ '
      notSameDayAMEnd.map((item, index) => {
        errorString += item
        if (index < notSameDayAMEnd.length - 1) errorString += ', '
      })
      errorString += ' phải cùng ngày với thời gian bắt đầu thực tế của lịch hẹn<br>'
    }

    if (invalid !== undefined && invalid.length !== 0) {
      console.log(invalid)
      errorString += 'Thời gian kết thúc của dịch vụ '
      invalid.map((item, index) => {
        errorString += item
        if (index < invalid.length - 1) errorString += ', '
      })
      errorString += ' không thể nhỏ hơn thời gian bắt đầu của chính dịch vụ đó<br>'
    }

    if (invalid2 !== undefined && invalid2.length !== 0) {
      errorString += 'Thời gian bắt đầu của dịch vụ '
      invalid2.map((item, index) => {
        errorString += item
        if (index < invalid.length - 1) errorString += ', '
      })
      errorString += ' không thể nhỏ hơn thời gian kết thúc của dịch vụ trước đó<br>'
    }

    if (note.trim().length > 1000) {
      setNoteError('Trường này chỉ tối đa 1000 ký tự')
    }

    // if(errorString) {
    //   setError(errString)
    //   setOpenError(true)

    // }

    let tempSpecialistNoteError = []

    itemAppointmentServices.map(item => {
      let temp = ''
      if (item.specialistInfoNote) {
        if (item.specialistInfoNote.trim().length > 1000) {
          temp = 'Trường này chỉ tối đa 1000 ký tự'
        }
      }
      tempSpecialistNoteError.push(temp)
    })

    setSpecialistNoteError(tempSpecialistNoteError)

    var validSpecialistNote = true

    tempSpecialistNoteError.map(item => {
      if (item !== '') {
        validSpecialistNote = false
      }
    })

    if (errorString) {
      setError(errorString)
      setOpenError(true)
    }

    if (errorString || noteError || !validSpecialistNote) {
      return
    }

    var data = {
      id: itemData.id,
      total: totalPrice,
      payAmount: itemData.payAmount,
      branchId: itemData.branchId,
      branchCode: itemData.branchCode,
      branchName: itemData.branchName,
      customer: itemData.customer,
      status: itemData.status,
      requireConfirm: itemData.requireConfirm,
      note: note,
      extraAppointmentServices: [],
      appointmentServices: tempItemAppointmentService,
      paymentMethod: listSelectedPaymentMethod,
      invoices: fileArrayId
    }
    callApiCheckoutAM(data)
  }

  const handleChangeSpecialistInfoNote = (e, itemId) => {
    var temp = [...itemAppointmentServices]
    var tempItemId = temp.findIndex(x => x.id === itemId)
    temp[tempItemId].specialistInfoNote = e.target.value
    setItemAppointmentServices(temp)
  }

  const [note, setNote] = useState('')
  const [noteError, setNoteError] = useState('')

  const handleChangeNote = e => {
    const temp = e.target.value
    setNote(temp)
  }

  const handleChangeActualStartTime = async (value, key) => {
    if (!isValid(value)) {
      return
    } else {
      const temp = [...itemAppointmentServices]
      temp[key].actualStartTime = getUnixTime(value) * 1000
      console.log(getUnixTime(value) * 1000)
      setItemAppointmentServices(temp)
      console.log('actual time thay doi', itemAppointmentServices)
      console.log('item data change:', itemData.appointmentServices)
      await getListAvailableSpecialist(key)
    }
  }

  const handleChangeActualEndTime = async (value, key) => {
    if (!isValid(value)) {
      return
    } else {
      const temp = [...itemAppointmentServices]
      temp[key].actualEndTime = getUnixTime(value) * 1000
      console.log(getUnixTime(value) * 1000)
      setItemAppointmentServices(temp)
      await getListAvailableSpecialist(key)
    }
  }

  const currencyFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  })

  //Tính tổng giá tiền
  const [totalPrice, setTotalPrice] = useState()

  useEffect(() => {
    if (itemAppointmentServices) {
      var tempTotal = 0
      const tempItemAppointmentService = [...itemAppointmentServices]
      tempItemAppointmentService.map(item => {
        if (!item.canceledReason) {
          tempTotal += item.spaServicePrice
        }
      })
      setTotalPrice(tempTotal)
    }
  }, [itemAppointmentServices])

  //Call api lấy danh sách nhân viên rảnh

  //loop qua itemAppointmentServices để push data vào list, rồi return list đó ra
  const loopToGetTempList = async key => {
    const tempItemAppointmentService = [...itemAppointmentServices]
    var tempSpecialistData = []

    // for (const item of tempItemAppointmentService) {
    const item = tempItemAppointmentService[key]
    console.log(item)
    if (item.actualStartTime && item.actualEndTime) {
      if (Number.isInteger(item.actualStartTime)) {
        if (item.actualEndTime > item.actualStartTime) {
          console.log('start time va end time valid, starttime la timestamp')

          const response = await callApiGetASAvailableSpecialist(
            item.actualStartTime,
            item.actualEndTime,
            item.id,
            itemData.branchId
          )
          tempSpecialistData = response
        }
      } else {
        if (item.actualEndTime > item.actualStartTime) {
          console.log('start time va end time valid, starttime la string')

          const response = await callApiGetASAvailableSpecialist(
            item.actualStartTime,
            item.actualEndTime,
            item.id,
            itemData.branchId
          )
          tempSpecialistData = response
        }
      }
    } else {
      console.log('start time va end time invalid')
      tempSpecialistData = []
    }

    // }

    return tempSpecialistData
  }

  const getListAvailableSpecialist = async key => {
    const tempSpecialList = await loopToGetTempList(key)
    var tempSpecialistDataList = [...specialistData]
    const tempItemAppointmentService = [...itemAppointmentServices]

    if (tempSpecialistDataList === undefined || tempSpecialistDataList === []) {
      var result = []
      tempItemAppointmentService.forEach((item, index) => {
        if (index === key) {
          result.push(tempSpecialList)
        } else {
          result.push([])
        }
      })
      console.log('specialistDataList', result)
      setSpecialistData(result)
    } else {
      tempSpecialistDataList[key] = tempSpecialList
      setSpecialistData(tempSpecialistDataList)
      console.log('specialistDataList', tempSpecialistDataList)
    }

    console.log('itemAppointmentServices: ', itemAppointmentServices)
  }

  const callApiGetASAvailableSpecialist = async (startTime, endTime, serviceId, branchId) => {
    const data = await getAvailableSpecialist(startTime, endTime, serviceId, branchId)
    if (!data) return
    if (data.meta.code != 200) {
      props.setError(data.meta.message)
      props.setOpenError(true)

      return
    }
    if (!data.data) return

    return data.data
  }

  useEffect(() => {
    if (itemAppointmentServices) {
      itemAppointmentServices.map((item, index) => {
        getListAvailableSpecialist(index)
      })
    }
  }, [itemAppointmentServices])

  // Xem hóa đơn
  const [openInvoiceDetail, setOpenInvoiceDetail] = useState(false)

  const handleOpenInvoice = () => {
    setOpenInvoiceDetail(true)
  }

  const genFormSelect = index => {
    return (
      <Select
        labelId='assign-specialist'
        id='assign-specialist'
        label='Chọn chuyên viên'
        size='small'
        value={itemAppointmentServices.specialist?.id}
        onChange={e => handleChangeSpecialist(e, index)}
      >
        {specialistData[index] !== undefined &&
          Array.isArray(specialistData[index]) === true &&
          specialistData[index]?.map(item => {
            return (
              <MenuItem key={item.id} value={item.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>{item.fullName}</Typography>
              </MenuItem>
            )
          })}
      </Select>
    )
  }

  return (
    <Drawer
      anchor={'right'}
      open={openDrawer}
      hideBackdrop={true}
      onKeyDown={ev => {
        if (ev.key === 'Enter') {
          ev.preventDefault()
        }
        if (ev.key === 'Esc' || ev.key === 'Escape') {
          handleCloseDrawer()
        }
      }}
    >
      <Grid container spacing={6} style={{ width: `100vw`, margin: 2 }}>
        {/* header */}
        <Grid item xs={12}>
          <Typography variant='h5' display={'inline'}>
            {`Check-out`}
          </Typography>
        </Grid>
        {/* body */}
        {itemData ? (
          <>
            <Grid item xs={6}>
              <Typography variant='h6'>Thông tin khách hàng</Typography>
              <Box sx={{ marginLeft: '32px', marginY: 4 }}>
                {itemData.customer.fullName ? (
                  <Typography variant='body1' my={3}>
                    Tên khách hàng: <strong>{itemData.customer.fullName}</strong>
                  </Typography>
                ) : (
                  <></>
                )}
                {itemData.customer.phoneNumber ? (
                  <Typography variant='body1' my={3}>
                    Số điện thoại: <strong>{itemData.customer.phoneNumber}</strong>
                  </Typography>
                ) : (
                  <></>
                )}
                {itemData.customer.email ? (
                  <Typography variant='body1' my={3}>
                    Email: <strong>{itemData.customer.email}</strong>
                  </Typography>
                ) : (
                  <></>
                )}
              </Box>
              <Typography variant='h6'>Thông tin lịch hẹn</Typography>
              <Box sx={{ marginLeft: '32px', marginY: 4 }}>
                {itemData.branchName ? (
                  <Typography variant='body1' my={3}>
                    Chi nhánh: <strong>{itemData.branchName}</strong>
                  </Typography>
                ) : (
                  <></>
                )}
                {itemData.expectedStartTime ? (
                  <Typography variant='body1' my={3}>
                    Thời gian bắt đầu (dự kiến): <strong>{timestampToString(itemData.expectedStartTime)}</strong>
                  </Typography>
                ) : (
                  <></>
                )}
                {itemData.expectedEndTime ? (
                  <Typography variant='body1' my={3}>
                    Thời gian kết thúc (dự kiến): <strong>{timestampToString(itemData.expectedEndTime)}</strong>
                  </Typography>
                ) : (
                  <></>
                )}
                {/* {selectedItem.actualEndTime ? ( */}
                <Typography variant='body1' my={3}>
                  {/* Thời gian bắt đầu (thực tế): <strong>{selectedItem.actualStartTime}</strong> */}
                  Thời gian bắt đầu (thực tế): <strong>{timestampToString(itemData.actualStartTime)}</strong>
                </Typography>
                {/* ) : (
                  <></>
                )} */}
                <Grid container>
                  {/* <Grid item xs={6}>
                    <Typography variant='body1' my={3}>
                      Thời gian kết thúc (thực tế):
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        renderInput={props => <TextField {...props} />}
                        label='Chọn thời gian'
                        value={new Date()}
                        size='small'
                        onChange={newValue => {
                          // setValue(newValue)
                        }}
                      />
                    </LocalizationProvider>
                  </Grid> */}
                  <Grid item xs={6}>
                    {' '}
                    <Typography variant='body1' my={3}>
                      Ghi chú:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    {' '}
                    <Box
                      component='form'
                      sx={{
                        '& > :not(style)': { m: 1, width: '90%' }
                      }}
                      autoComplete='off'
                    >
                      <TextField
                        id='note'
                        value={note}
                        label='Nhập ghi chú'
                        variant='standard'
                        onChange={e => handleChangeNote(e)}
                        onFocus={() => setNoteError()}
                        error={noteError ? true : false}
                        helperText={noteError}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='subtitle1' gutterBottom sx={{ display: 'inline' }}>
                      Phương thức thanh toán
                    </Typography>
                    <Typography variant='subtitle1' gutterBottom sx={{ display: 'inline', color: 'red' }}>
                      *
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl sx={{ minWidth: 120 }}>
                      <Select
                        labelId='status-select-label'
                        id='demo-simple-select'
                        name='canceledReason'
                        sx={{ width: 150 }}
                        value={currentPaymentMethod}
                        onChange={changeSelectedPaymentMethod}
                      >
                        {listPaymentMethod &&
                          listPaymentMethod.length > 0 &&
                          listPaymentMethod.map((item, index) => {
                            return (
                              <MenuItem key={index} value={item?.id}>
                                {item?.name}
                              </MenuItem>
                            )
                          })}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Typography variant='h6'>Xác nhận thanh toán</Typography>
              <input type={'file'} accept='image/png, image/jpeg' onChange={selectFile}></input>
              <br></br>
              <Grid p={2} direction='column' alignItems='center' justifyContent='center'>
                <Button variant='contained' onClick={e => uploadFile(e)}>
                  Thêm ảnh
                </Button>
              </Grid>
              <Grid p={5} direction='column' alignItems='center' justifyContent='center'>
                <ImageList sx={{ boxShadow: '0px 0px 20px 2px #dcdbff' }} cols={3} gap={2}>
                  {fileArray.map((item, index) => {
                    const cols = item.featured ? 2 : 1
                    const rows = item.featured ? 2 : 1

                    return (
                      <Grid item key={index} cols={cols} rows={rows}>
                        <Grid>
                          <ImageListItem key={index}>
                            <img src={item} alt='' loading='lazy' onClick={e => handleImage(item)} />
                            <ImageListItemBar
                              sx={{
                                background:
                                  'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                  'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
                              }}
                              position='top'
                              actionIcon={
                                <CloseIcon
                                  style={{ color: 'red', fontSize: '40px' }}
                                  onClick={() => handleDisableImage(index)}
                                />
                              }
                              actionPosition='right'
                            ></ImageListItemBar>
                            <Modal
                              open={open}
                              onClose={handleClose}
                              className={classes.modal}
                              closeAfterTransition
                              BackdropComponent={Backdrop}
                              BackdropProps={{
                                timeout: 500
                              }}
                            >
                              <Fade in={open} timeout={300} className={classes.img}>
                                <img
                                  src={image}
                                  alt='asd'
                                  style={{ maxHeight: '90%', maxWidth: '90%', textAlign: 'center', opacity: 0.95 }}
                                />
                              </Fade>
                            </Modal>
                          </ImageListItem>
                        </Grid>
                      </Grid>
                    )
                  })}
                </ImageList>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='h6'>Phân công chuyên viên</Typography>
                <Box mr={10}>
                  <Button variant='outlined' onClick={() => handleOpenInvoice()}>
                    Xem hóa đơn
                  </Button>
                </Box>
              </Box>
              <Box sx={{ marginTop: 4 }}>
                <Grid container sx={{ marginBottom: 4 }}>
                  <Grid item xs={2}>
                    Tên dịch vụ
                  </Grid>
                  <Grid item xs={1}>
                    Thời gian thực hiện (dự tính)
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant='subtitle1' gutterBottom sx={{ display: 'inline' }}>
                      Thời gian bắt đầu (thực tế)
                    </Typography>
                    <Typography variant='subtitle1' gutterBottom sx={{ display: 'inline', color: 'red' }}>
                      *
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant='subtitle1' gutterBottom sx={{ display: 'inline' }}>
                      Thời gian kết thúc (thực tế)
                    </Typography>
                    <Typography variant='subtitle1' gutterBottom sx={{ display: 'inline', color: 'red' }}>
                      *
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant='subtitle1' gutterBottom sx={{ display: 'inline' }}>
                      Chuyên viên
                    </Typography>
                    <Typography variant='subtitle1' gutterBottom sx={{ display: 'inline', color: 'red' }}>
                      *
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    Giá
                  </Grid>
                  <Grid item xs={2}>
                    Ghi chú chuyên viên
                  </Grid>
                </Grid>
                {itemAppointmentServices && itemAppointmentServices.length !== 0 ? (
                  itemAppointmentServices.map((item, key) => {
                    return (
                      <Grid key={key} container my={2} spacing={2}>
                        <Grid item xs={2} variant='body1' my={3}>
                          <Typography>{item.spaServiceName}</Typography>
                        </Grid>
                        <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                          {convertDurationToTextTime(item?.duration)}
                        </Grid>
                        {/* <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                          {servicesExpectedTime ? (
                            <Typography>
                              {format(servicesExpectedTime[key].startTime, 'HH:mm')} -{' '}
                              {format(servicesExpectedTime[key].endTime, 'HH:mm')}
                            </Typography>
                          ) : (
                            <></>
                          )}
                        </Grid> */}
                        <Grid item xs={2} my='auto'>
                          <LocalizationProvider locale={vi} dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                              renderInput={props => (
                                <TextField onKeyDown={e => e.preventDefault()} size='small' {...props} />
                              )}
                              label='Chọn thời gian'
                              disabled={itemAppointmentServices[key].actualStartTime === actualStartTime ? true : false}
                              value={
                                itemAppointmentServices &&
                                itemAppointmentServices[key] &&
                                itemAppointmentServices[key].actualStartTime &&
                                fromUnixTime(itemAppointmentServices[key].actualStartTime / 1000)
                              }
                              inputProps={{ readOnly: true }}
                              defaultValue={null}
                              onChange={newValue => {
                                handleChangeActualStartTime(newValue, key)
                              }}
                            />
                          </LocalizationProvider>
                        </Grid>
                        <Grid item xs={2} my='auto'>
                          <LocalizationProvider locale={vi} dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                              renderInput={props => <TextField disabled size='small' {...props} />}
                              label='Chọn thời gian'
                              inputProps={{ readOnly: true }}
                              value={
                                itemAppointmentServices &&
                                itemAppointmentServices[key] &&
                                itemAppointmentServices[key].actualEndTime &&
                                fromUnixTime(itemAppointmentServices[key].actualEndTime / 1000)
                              }
                              onChange={newValue => {
                                handleChangeActualEndTime(newValue, key)
                              }}
                            />
                          </LocalizationProvider>
                        </Grid>
                        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                          {item.specialist?.fullName ? (
                            item.specialist?.fullName
                          ) : (
                            <FormControl sx={{ width: '90%' }}>
                              <InputLabel id='assign-specialist'>Chọn chuyên viên</InputLabel>
                              {genFormSelect(key)}
                            </FormControl>
                          )}
                        </Grid>
                        <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                          {item.spaServicePrice ? (
                            <Typography>{currencyFormatter.format(item.spaServicePrice)}</Typography>
                          ) : (
                            <>Giá</>
                          )}
                        </Grid>
                        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                          <Typography>
                            <Box
                              component='form'
                              sx={{
                                '& > :not(style)': { m: 1, width: '90%' }
                              }}
                              autoComplete='off'
                            >
                              <TextField
                                id='note'
                                variant='standard'
                                value={itemAppointmentServices[key]?.specialistInfoNote || ''}
                                onChange={e => handleChangeSpecialistInfoNote(e, item.id)}
                                error={specialistNoteError && specialistNoteError[key] ? true : false}
                                helperText={specialistNoteError && specialistNoteError[key]}
                                onFocus={() => {
                                  setSpecialistNoteError()
                                }}
                              />
                            </Box>
                          </Typography>
                        </Grid>
                      </Grid>
                    )
                  })
                ) : (
                  <></>
                )}
                <Grid container>
                  <Grid item xs={9} sx={{ textAlign: 'right' }}>
                    <Typography variant='body1' my={3} mr={3} sx={{ color: 'red' }}>
                      Tổng chi phí:
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    {totalPrice ? (
                      <Typography variant='body1' my={3} sx={{ color: 'red' }}>
                        <strong>{currencyFormatter.format(totalPrice)}</strong>
                      </Typography>
                    ) : (
                      <></>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </>
        ) : (
          <Typography>Không có dịch vụ</Typography>
        )}

        {/* end */}
        <Grid item xs={12} style={{ textAlign: 'right', marginRight: '16px' }}>
          <Button
            onClick={() => {
              handleCloseDrawer()
            }}
          >
            Đóng
          </Button>
          <Button variant='contained' disabled = {!enableButton} onClick={() => handleCheckout()}>
            Check-out
          </Button>
        </Grid>
      </Grid>
      <ModalInvoiceDetail
        open={openInvoiceDetail}
        setOpen={setOpenInvoiceDetail}
        data={itemData}
        appointmentServices={itemAppointmentServices}
        totalPrice={totalPrice}
      />
    </Drawer>
  )
}
