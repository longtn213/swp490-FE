import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import { Checkbox, FormControlLabel, FormGroup, Grid, Paper, TextField, Typography } from '@mui/material'
import { addCategory } from 'src/api/category/categoryApi'
import { Box } from '@mui/system'
import { Label } from 'mdi-material-ui'

import { getNotAssignCategorySetvice } from 'src/api/service/serviceApi'
import DialogAlert from '../dialogAlert'

function DialogCreateCategory(props) {
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
    var tempServices = [...selectedServices]
    var listServicesId = []
    tempServices.map(item => {
      listServicesId.push({ id: item.id })

      return null
    })

    const data = {
      name: name,
      description: description,
      spaServices: listServicesId
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
      callApiAddCategory(data)
    }
  }

  const validationName = e => {
    setName(e.target.value)
    if (e.target.value !== '' && e.target.value.length < 100 && name.trim() !== ' ') {
      seNameError(false)
      setErrorMessage([''])
    } else {
      seNameError(true)
      setErrorMessage(['Trường này không được để trống và chỉ được nhập tối đa 100 kí tự'])
    }
  }

  const validationDescripton = e => {
    setDescription(e.target.value)
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

  const callApiAddCategory = async data => {
    const res = await addCategory(data)
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

  //Xử lý checkbox
  const [services, setServices] = useState()
  const [selectedServices, setSelectedServices] = useState([])
  const [isOpenAgain, setIsOpenAgain] = useState(false)

  useEffect(() => {
    if (open) {
      callApitGetNotAssignCategorySetvice()
    }
  }, [open])

  const callApitGetNotAssignCategorySetvice = async () => {
    const data = await getNotAssignCategorySetvice()

    if (!data) return
    if (!data.data) return

    setServices(data.data)
  }

  const handleCheckbox = (e, id) => {
    var tempSelectedServices = [...selectedServices]
    var tempServices = [...services]

    // console.log(id);
    // console.log(e.target.checked);
    if (e.target.checked === false) {
      tempSelectedServices.splice(
        tempSelectedServices.findIndex(x => x.id === id),
        1
      )
      setSelectedServices(tempSelectedServices)
      console.log('tempServices', tempServices)
      console.log('tempSelectedServices', tempSelectedServices)
    }
    if (e.target.checked === true) {
      var index = tempServices.findIndex(x => x.id === id)
      tempSelectedServices.push(tempServices[index])
      setSelectedServices(tempSelectedServices)
      console.log('tempServices', tempServices)
      console.log('tempSelectedServices', tempSelectedServices)
    }
  }

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
        <DialogTitle>Thêm danh mục</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={6}>
              <Typography>Tên danh mục :</Typography>
            </Grid>
            <Grid item xs={4} mb={2}>
              <Typography sx={{ textAlign: 'left' }}>
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
                    label='Nhập tên danh mục'
                    variant='outlined'
                    size='small'
                    error={nameError}
                    helperText={ErrorMessage[0]}
                    onChange={e => validationName(e)}
                  />
                </Box>
              </Typography>
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
            <Grid item xs={12}>
              {services && (
                <Paper sx={{ maxHeight: 400, overflow: 'auto' }}>
                  <Typography>Danh sách dịch vụ không thuộc danh mục nào:</Typography>
                  <FormGroup>
                    {services?.map(item => {
                      return (
                        <FormControlLabel
                          key={item.id}
                          control={<Checkbox onChange={e => handleCheckbox(e, item.id)} />}
                          label={item.name}
                        />
                      )
                    })}
                  </FormGroup>
                </Paper>
              )}
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

export default DialogCreateCategory
