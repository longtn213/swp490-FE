import * as React from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { useState } from 'react'
import { useEffect } from 'react'
import { Button, Dialog, FormControl, Grid, MenuItem, Select, TextField, Typography } from '@mui/material'
import { getAppMasterReasonCancel } from 'src/api/common/commonApi'

export default function ModalCancelAS(props) {
  const { open, setOpen, selectedItem, setSelectedItem, cancelASInfo, setCancelASInfo, setError, setOpenError } = props

  const [listReasonCancel, setListReasonCancel] = useState()

  const [selectedReasonId, setSelectedReasonId] = useState(1)

  const [displayOther, setDisplayOther] = useState(false)

  const [other, setOther] = useState('')

  const [otherError, setOtherError] = useState()

  const callApiGetReasonCancelList = async () => {
    const data = await getAppMasterReasonCancel()
    if (!data) return
    if (!data.data) return
    setListReasonCancel(data.data)
  }

  useState(() => {
    callApiGetReasonCancelList()
  }, [])

  const handleClose = () => {
    setOpen(false)
    setSelectedItem()
    setSelectedReasonId(1)
    setDisplayOther(false)
    setOther('')
    setOtherError()
  }

  const handleChangeReason = e => {
    const tempId = e.target.value
    setSelectedReasonId(tempId)
    if (tempId === 4) {
      setDisplayOther(true)
      setOther('')
      setOtherError()
    } else {
      setDisplayOther(false)
      setOther('')
      setOtherError()
    }
  }

  const handleChangeOther = e => {
    setOther(e.target.value)
  }

  const handleCancelAS = () => {
    const tempId = selectedReasonId
    const tempOther = other
    const tempItem = selectedItem
    if(!tempId) {
        setError('Bạn cần chọn lý do trước khi hủy')
        setOpenError(true)

        return
    }

    if(tempId === 4 && tempOther && tempOther.trim().length > 255) {

      setOtherError("Trường này chỉ được nhập tối đa 255 ký tự")

    }

    if(tempId === 4 && tempOther.trim() === '') {
        setError('Bạn cần ghi rõ lý do trước khi hủy')
        setOpenError(true)

        return
    }

    if(setOtherError) {
      return
    }

    var tempCancelASInfo = []

    if(cancelASInfo) {
        tempCancelASInfo = [...cancelASInfo]
    }

    var tempInfo

    if(tempOther.trim() === '') {
        tempInfo = {
            id: tempItem.id,
            canceledReason: {
                id: tempId
            }
        }
    }

    if(tempOther.trim() !== '') {
        tempInfo = {
            id: tempItem.id,
            canceledReason: {
                id: tempId
            },
            note: tempOther.trim()
        }
    }

    tempCancelASInfo.push(tempInfo)

    setCancelASInfo(tempCancelASInfo)

    handleClose()

  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      width="40vw"
      onKeyPress={(ev) => {
        if (ev.key === 'Enter') {
          ev.preventDefault();
        }
      }}
    >
      <Box sx={{ margin: 5 }}>
        <Typography variant='h6'>Hủy dịch vụ</Typography>

        {selectedItem && (
          <Grid container spacing={3}>
            <Grid item xs={6} my={2}>
              Tên dịch vụ:
            </Grid>
            <Grid item xs={6} my={2}>
              {selectedItem.spaServiceName}
            </Grid>
            <Grid item xs={6} my={2}>
              Lý do hủy:
            </Grid>
            <Grid item xs={6} my={2}>
              {listReasonCancel && (
                <FormControl>
                  <Select
                    size='small'
                    value={selectedReasonId ? selectedReasonId : 1}
                    defaultValue={selectedReasonId ? selectedReasonId : 1}
                    onChange={e => handleChangeReason(e)}
                  >
                    {listReasonCancel.map((item, key) => {
                      return (
                        <MenuItem key={key} value={item.id}>
                          {item.name}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              )}
            </Grid>
            {displayOther && (
              <Grid container spacing={3}>
                <Grid item xs={6} my={2}>
                  Lý do khác:
                </Grid>
                <Grid item xs={6} my={2}>
                  <Box
                    component='form'
                    sx={{
                      '& > :not(style)': { m: 1, width: '25ch' }
                    }}
                    noValidate
                    autoComplete='off'
                  >
                    <TextField id='outlined-basic' size="small" width="100%" label='Lý do' value={other} onChange={(e) => handleChangeOther(e)} variant='outlined' error={otherError ? true : false} helperText={otherError} onFocus={() => setOtherError()} />
                  </Box>
                </Grid>
              </Grid>
            )}
          </Grid>
        )}
      </Box>
      <Box sx={{display: "flex", margin: 3, justifyContent: "flex-end"}}>
        <Button variant='text' onClick={() => handleClose()}>
            Đóng
        </Button>
        <Button variant='contained' onClick={() => handleCancelAS()}>
            Hủy dịch vụ
        </Button>
      </Box>
    </Dialog>
  )
}
