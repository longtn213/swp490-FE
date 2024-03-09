import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography
} from '@material-ui/core'
import { Box, TextField } from '@mui/material'
import { LocalizationProvider, StaticTimePicker, TimePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { useState } from 'react'
import { useEffect } from 'react'
import { editConfig, getConfigDetail } from 'src/api/config/configApi'

const DialogEditConfig = props => {
  const { open, setOpen, selectedItem, setSelectedItem, setError, setOpenError, onSuccess } = props

  const [itemData, setItemData] = useState()
  const [itemTime, setItemTime] = useState()
  const [itemNumber, setItemNumber] = useState()
  const [errorTime, setErrorTime] = useState(false)
  const [errorNumber, setErrorNumber] = useState(false)
  const [isEditable, setIsEditable] = useState(true)
  const [openWarning, setOpenWarning] = useState(false)
  const [bypassWarning, setBypassWarning] = useState()
  const [checked, setChecked] = useState(false)

  const handleClose = () => {
    setOpen(false)
    setSelectedItem()
    setError()
    setOpenError()
    setItemData()
    setItemTime()
    setItemNumber()
    setErrorTime(false)
    setErrorNumber(false)
    setErrorNumber(false)
    setIsEditable(true)
    setOpenWarning(false)
    setChecked(false)
    onSuccess()
  }

  useEffect(() => {
    if (selectedItem) {
      callApiGetDetailConfig(selectedItem.id)
    }
  }, [selectedItem])

  const callApiGetDetailConfig = async id => {
    const data = await getConfigDetail(id)
    if (!data) return
    if (data.meta.code != 200) {
      setError(data.meta.message)
      setOpenError(true)

      return
    }
    if (!data.data) return

    setItemData(data.data)
    setBypassWarning(data.data.autoByPassWarning)
    console.log(data.data)
    if (data.data.type === 'time') {
      setItemTime(new Date('2022-01-01T' + data.data.configValue + '+0700'))
    }
    if (data.data.type === 'number') {
      setItemNumber(data.data.configValue)
    }
  }

  useEffect(() => {
    if (itemData) {
      const tempItemData = itemData
      if (tempItemData.type === 'time') {
        errorTime === true ? setIsEditable(false) : setIsEditable(true)
      }
      if (tempItemData.type === 'number') {
        errorNumber === true ? setIsEditable(false) : setIsEditable(true)
      }
    }
  }, [errorTime, errorNumber])

  const handleEdit = () => {
    const tempItemData = itemData
    let tempConfigValue

    if(tempItemData.type === 'time') tempConfigValue = (itemTime.getHours() < 10 ? '0' + itemTime.getHours() : itemTime.getHours()) +
    ':' +
    (itemTime.getMinutes() < 10 ? '0' + itemTime.getMinutes() : itemTime.getMinutes()) +
    ':' +
    (itemTime.getSeconds() < 10 ? '0' + itemTime.getSeconds() : itemTime.getSeconds())

    if(tempItemData.type === 'number') tempConfigValue = itemNumber

    let tempData = {
      id : itemData.id,
      configValue : tempConfigValue,
      autoByPassWarning: checked
    }


    callApiEditConfig(tempData)
  }

  const callApiEditConfig = async (data) => {
    

    const res = await editConfig(data)

    if(!res) return
    if (res.meta.code != 200) {
      setError(res.meta.message)
      setOpenError(true)

      return
    }
    handleClose()
  }

  const handleCloseWarning = () => {
    setOpenWarning(false)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      onKeyPress={ev => {
        if (ev.key === 'Enter') {
          ev.preventDefault()
        }
      }}
    >
      <DialogTitle>Chỉnh sửa cấu hình</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>
              <strong>Tên cấu hình</strong>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{itemData?.configKey}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <strong>Mô tả cấu hình</strong>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{itemData?.configDesc}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <strong>Chi nhánh</strong>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{itemData?.branchName}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <strong>Giá trị cấu hình</strong>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            {itemData?.type === 'number' && (
              <Box
                component='form'
                sx={{
                  '& .MuiTextField-root': { m: 1, width: '25ch', marginY: 'auto' }
                }}
                noValidate
                autoComplete='off'
              >
                <TextField
                  error={errorNumber}
                  type='number'
                  InputProps={{
                    inputProps: {
                      min: 1
                    }
                  }}
                  label=''
                  required
                  value={itemNumber}
                  onChange={e => {
                    if (isNaN(e.target.value) || e.target.value.toString().includes('.')) {
                      setErrorNumber(true)
                    } else {
                      setErrorNumber(false)
                      setItemNumber(e.target.value)
                    }
                    e.target.value < 1 ? (e.target.value = 1) : e.target.value
                  }}
                  onBlur={e => {
                    if (isNaN(e.target.value) || e.target.value.toString().includes('.')) {
                      setErrorNumber(true)
                    } else {
                      setErrorNumber(false)
                      setItemNumber(e.target.value)
                    }
                  }}
                />
              </Box>
            )}
            {itemData?.type === 'time' && (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  error={errorTime}
                  variant='inline'
                  label='Chọn thời gian'
                  ampm={false}
                  value={itemTime}
                  inputProps={{readOnly: true}}
                  onChange={newValue => {
                    if (newValue == 'Invalid Date' || newValue == null) {
                      setErrorTime(true)
                    } else {
                      setErrorTime(false)
                    }
                    setItemTime(newValue)
                    console.log(newValue)
                  }}
                  renderInput={params => <TextField disabled {...params} />}
                />
              </LocalizationProvider>
            )}
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
        <Button variant='contained' disabled={!isEditable} onClick={() => {bypassWarning === true ? handleEdit() : setOpenWarning(true)}}>
          Chỉnh sửa
        </Button>
      </DialogActions>
      <Dialog open={openWarning} onClose={handleCloseWarning}>
        <DialogTitle>Cảnh báo</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn chỉnh sửa cấu hình này không?
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  value={checked}
                  onChange={e => {
                    setChecked(e.target.checked)
                    console.log(e.target.checked)
                  }}
                />
              }
              label='Không hỏi lại với cấu hình này'
            />
          </FormGroup>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setOpenWarning(false)
              setChecked(false)
            }}
            variant='outlined'
          >
            Hủy
          </Button>
          <Button variant='contained' disabled={!isEditable} onClick={() => handleEdit()}>
            Chỉnh sửa
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  )
}

export default DialogEditConfig
