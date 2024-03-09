import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import { Grid, TextField, Typography } from '@mui/material'
import { addEquipment } from 'src/api/equipment/equipmentApi'
import DialogAlert from '../dialogAlert'
import { Box } from '@mui/system'

function DialogCreateEquipment(props) {
  const { open, handleClose, onSuccess } = props
  const [name, setName] = useState('')
  const [nameError, seNameError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')
  const [ErrorMessage, setErrorMessage] = useState([])
  const [ErrorMessage3, setErrorMessage3] = useState([])
  const [description, setDescription] = useState('')

   const handleCloseDialog = () => {
    setIsOpenError(false)
    setIsOpenAgain(false)
  }

  const handleAdd = () => {
    const data = {
      name: name,
      description: description
    }
    if (name === '') {
      seNameError(true)
      setErrorMessage(['Trường này không được để trống'])
      console.log('1')
    } else if (name.length > 100) {
      seNameError(true)
      setErrorMessage(['Trường này chỉ được nhập tối đa 100 kí tự'])
      console.log('2')
    } else if (name.trim() === ' ') {
      seNameError(true)
      setErrorMessage(['Sai format'])
      console.log('3')
    } else if (description.length > 255) {
      setDescriptionError(true)
      setDescriptionError(['Trường này chỉ được nhập tối đa 255 kí tự'])
      console.log('4')
    } else if (description.trim() === ' ') {
      setDescriptionError(true)
      setDescriptionError(['Sai format'])
      console.log('5')
    } else {
      callApiAddEquipment(data)
    }
  }

  const validationName = e => {
    setName(e.target.value.trim())
    if (e.target.value !== '' && e.target.value.length < 100) {
      seNameError(false)
      setErrorMessage([''])
    } else {
      seNameError(true)
      setErrorMessage(['Trường này không được để trống và chỉ được nhập tối đa 100 kí tự'])
    }
  }

  const validationDescripton = e => {
    console.log(e.target.value)
    setDescription(e.target.value.trim())
    if (e.target.value.length < 255 && e.target.value.trim() !== ' ') {
      setDescriptionError(false)
      setErrorMessage3([''])
    } else {
      setDescriptionError(true)
      setErrorMessage3(['Trường này chỉ được nhập tối đa 255 kí tự'])
    }
  }

  const [error, setError] = useState('')
  const [isOpenError, setIsOpenError] = useState(false)

  const callApiAddEquipment = async data => {
    const res = await addEquipment(data)
    if (!res) return
    console.log(res)
    if (res.meta.code != 200) {
      setError(res.meta.message)
      setIsOpenError(true)
      setIsOpenAgain(true)

      return
    }
    setName('')
    setDescription('')
    handleClose()
    onSuccess()
  }

   const [isOpenAgain, setIsOpenAgain] = useState(false)

  return (
    <Grid>
    <Dialog
      open={open}
      onClose={handleClose}
      onKeyPress={ev => {
        if (ev.key === 'Enter') {
          ev.preventDefault()
        }
      }}
    >
      <DialogTitle>Thêm thiết bị</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs={6}>
            <Typography>Tên thiết bị :</Typography>
          </Grid>
          <Grid item xs={4} mb={2}>
            <Box
              component='form'
              sx={{
                '& > :not(style)': { m: 1, width: '100%' }
              }}
              noValidate
              autoComplete='off'
            >
              <TextField
                id='name'
                label='Nhập tên thiết bị'
                variant='outlined'
                size='small'
                error={nameError}
                helperText={ErrorMessage[0]}
                onChange={e => validationName(e)}
              />
            </Box>
          </Grid>
          <Grid item xs={2} mb={2} pl={2}>
            {' '}
            <Box sx={{ display: 'inline', color: 'red' }}>*</Box>
          </Grid>
          <Grid item xs={6}>
            <Typography>Mô tả:</Typography>
          </Grid>
          <Grid item xs={4}>
            <Box
              component='form'
              sx={{
                '& > :not(style)': { m: 1, width: '100%' }
              }}
              noValidate
              autoComplete='off'
            >
              <TextField
                id='name'
                label='Nhập mô tả'
                variant='outlined'
                size='small'
                error={descriptionError}
                helperText={ErrorMessage3[0]}
                onChange={e => validationDescripton(e)}
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleClose()
            onSuccess()
            seNameError(false)
            setErrorMessage([''])
            setDescriptionError(false)
            setErrorMessage3([''])
          }}
          variant='outlined'
        >
          Đóng
        </Button>
        <Button variant='contained' onClick={handleAdd}>
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
     <DialogAlert nameDialog={'Có lỗi xảy ra'} open={isOpenError} allertContent={error} handleClose={handleCloseDialog} />
    </Grid>
  )
}

export default DialogCreateEquipment
