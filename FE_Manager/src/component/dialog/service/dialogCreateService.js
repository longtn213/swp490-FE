import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import { addService, uploadImage } from 'src/api/service/serviceApi'
import {
  Grid,
  ImageList,
  ImageListItem,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
  ImageListItemBar
} from '@mui/material'
import { GridList, GridListTile, makeStyles, Modal, Backdrop, Fade } from '@material-ui/core'
import { Box } from '@mui/system'
import CloseIcon from '@mui/icons-material/Close'
import DialogAlert from '../dialogAlert'

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

function DialogCreateService(props) {
  const { open, handleClose, onSuccess } = props
  const [nameState, setnameState] = useState('')
  const [descriptionState, setdescriptionState] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [equimentId, setEquimentId] = useState('')
  const [equimentName, setEquimentName] = useState('')
  const [nameError, seNameError] = useState('')
  const [durationError, setDurationError] = useState('')
  const [priceError, setPriceError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')
  const [ErrorMessage, setErrorMessage] = useState([])
  const [ErrorMessage1, setErrorMessage1] = useState([])
  const [ErrorMessage2, setErrorMessage2] = useState([])
  const [ErrorMessage3, setErrorMessage3] = useState([])
  const [durationState, setdurationState] = useState('')
  const [file, setFile] = useState()
  const [fileArray, setFileArray] = useState([])
  const [fileArrayId, setFileArrayId] = useState([])
  const [isActive, setisActive] = useState(true)
  const [priceState, setpriceState] = useState('')
  const regex = /^[0-9\b]+$/
  const [openImage, setOpenImage] = useState(false)
  const [image, setImage] = useState('false')
  const [enableButton, setEnableButton] = useState(true)
  const classes = useStyles()

  const handleImage = value => {
    setImage(value)
    setOpenImage(true)
    console.log(image)
  }

  const handleCloseImage = () => {
    setOpenImage(false)
  }

  const handleCloseDialog = () => {
    setIsOpenError(false)
    setIsOpenAgain(false)
  }

  useEffect(() => {}, [])

  const handleAdd = () => {
    const data = {
      name: nameState,
      description: descriptionState,
      duration: durationState,
      isActive: isActive,
      categoryId: categoryId,
      categoryName: categoryName,
      equipmentTypeId: equimentId,
      equipmentName: equimentName,
      currentPrice: priceState,
      files: fileArrayId
    }
    if (nameState === '') {
      seNameError(true)
      setErrorMessage1(['Trường này không được để trống'])
      console.log('1')
    } else if (nameState.length > 100) {
      seNameError(true)
      setErrorMessage1(['Trường này chỉ tối đa 100 kí tự'])
      console.log('2')
    } else if (durationState === '') {
      setDurationError(true)
      setErrorMessage(['Trường này không được để trống'])
      console.log('3')
    } else if (!regex.test(durationState)) {
      setDurationError(true)
      setErrorMessage(['Trường này chỉ được nhập số'])
      console.log('4')
    } else if (durationState.length > 3) {
      setDurationError(true)
      setErrorMessage(['Trường này chỉ tối đa 3 kí tự'])
      console.log('5')
    } else if (priceState === '') {
      setPriceError(true)
      setErrorMessage2(['Trường này không được để trống'])
      console.log('6')
    } else if (!regex.test(priceState)) {
      setPriceError(true)
      setErrorMessage2(['Trường này chỉ được nhập số'])
      console.log('7')
    } else if (priceState.length > 22) {
      setPriceError(true)
      setErrorMessage2(['Trường này chỉ tối đa 22 kí tự'])
      console.log('8')
    } else if (descriptionState.length > 1500) {
      setDescriptionError(true)
      setErrorMessage3(['Trường này chỉ tối đa 1500 kí tự'])
      console.log('9')
    } else {
      callApiAddService(data)
    }
  }

  const validationName = e => {
    setnameState(e.target.value.trim())
    if (e.target.value !== '' && e.target.value.length < 100 && nameState.trim() !== ' ') {
      seNameError(false)
      setErrorMessage1([''])
    } else {
      seNameError(true)
      setErrorMessage1(['Trường này không được để trống và chỉ được nhập tối đa 100 kí tự'])
    }
  }

  const validationDuration = e => {
    console.log(e.target.value)
    setdurationState(e.target.value.trim())
    if (e.target.value !== '' && regex.test(e.target.value) && e.target.value.length <= 3) {
      setDurationError(false)
      setErrorMessage([''])
    } else {
      setDurationError(true)
      setErrorMessage(['Trường này không được để trống và chỉ được nhập số với tối đa 3 kí tự'])
    }
  }

  const validationPrice = e => {
    console.log(e.target.value)
    setpriceState(e.target.value.trim())
    if (e.target.value !== '' && regex.test(e.target.value) && e.target.value.length <= 22) {
      setPriceError(false)
      setErrorMessage2([''])
    } else {
      setPriceError(true)
      setErrorMessage2(['Trường này không được để trống và chỉ được nhập số với tối đa 22 kí tự'])
    }
  }

  const validationDescripton = e => {
    console.log(e.target.value)
    setdescriptionState(e.target.value.trim())
    if (e.target.value.length < 1500 && descriptionState.trim() !== ' ') {
      setDescriptionError(false)
      setErrorMessage3([''])
    } else {
      setDescriptionError(true)
      setErrorMessage3(['Trường này chỉ được nhập tối đa 1500 kí tự'])
    }
  }

  const [error, setError] = useState('')
  const [isOpenError, setIsOpenError] = useState(false)

  const selectFile = e => {
    const imageFile = e.target.files[0];
    console.log(e.target.name)    
    if(!imageFile.name.match(/\.(jpg|jpeg|png|gif)$/)){
      setError('Chỉ được chọn file ảnh')
      setIsOpenError(true)
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
      const res = await uploadImage(file)
      setFileArrayId([...fileArrayId, { id: res.data.id, url: res.data.url }])
      setFileArray([...fileArray, res.data.url])
      console.log(fileArrayId)
      console.log(fileArray)
      setEnableButton(false)
      setTimeout(function () {
        setEnableButton(true)
      }, 5000)
  }

  const changeCategory = e => {
    setCategoryName(e.target.value)
    setCategoryId(props.listCategoryCodes.filter(el => el.name === e.target.value)[0].id)
  }

  const changeEquiqment = e => {
    setEquimentName(e.target.value)
    setEquimentId(props.listEquipmentCodes.filter(el => el.name === e.target.value)[0].id)
  }

  const callApiAddService = async data => {
    const res = await addService(data)
    if (!res) return
    console.log(res)
    if (res.meta.code != 200) {
      setError(res.meta.message)
      setIsOpenError(true)
      setIsOpenAgain(true)

      return
    }
    setnameState('')
    setdescriptionState('')
    setdurationState('')
    setCategoryId('')
    setCategoryName('')
    setEquimentId('')
    setEquimentName('')
    setpriceState('')
    setFileArray([])
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
        <DialogTitle>Thêm dịch vụ</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={6}>
              <Typography>Tên dịch vụ :</Typography>
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
                  label='Nhập tên dịch vụ'
                  variant='outlined'
                  size='small'
                  error={nameError}
                  helperText={ErrorMessage1[0]}
                  onChange={e => validationName(e)}
                />
              </Box>
            </Grid>
            <Grid item xs={2} mb={2} pl={2}>
              {' '}
              <Box sx={{ display: 'inline', color: 'red' }}>*</Box>
            </Grid>
            <Grid item xs={6}>
              <Typography>Miêu tả :</Typography>
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
                  label='Nhập miêu tả'
                  variant='outlined'
                  size='small'
                  error={descriptionError}
                  helperText={ErrorMessage3[0]}
                  onChange={e => validationDescripton(e)}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography>Thời gian thực hiện :</Typography>
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
                  label='Nhập thời gian thực hiện'
                  variant='outlined'
                  size='small'
                  error={durationError}
                  helperText={ErrorMessage[0]}
                  onChange={e => validationDuration(e)}
                />
              </Box>
            </Grid>
            <Grid item xs={2} mb={2} pl={2}>
              {' '}
              <Box sx={{ display: 'inline', color: 'red' }}>*</Box>
            </Grid>
            <br></br>
            <br></br>
            <Grid item xs={6}>
              <Typography>Chọn danh mục:</Typography>
            </Grid>
            <Grid item xs={4} sm={4} md={4}>
              <Select id='categoryState' fullWidth variant='standard' onChange={changeCategory} value={categoryName}>
                {props.listCategoryCodes &&
                  props.listCategoryCodes.map(item => {
                    return (
                      <MenuItem value={item.name} key={item.id}>
                        {item.name}
                      </MenuItem>
                    )
                  })}
              </Select>
            </Grid>
            <br></br>
            <br></br>
            <Grid item xs={6}>
              <Typography>Chọn thiết bị :</Typography>
            </Grid>
            <Grid item xs={4} sm={4} md={4}>
              <Select id='equimentState' fullWidth variant='standard' onChange={changeEquiqment} value={equimentName}>
                {props.listEquipmentCodes &&
                  props.listEquipmentCodes.map(item => {
                    return (
                      <MenuItem value={item.name} key={item.id}>
                        {item.name}
                      </MenuItem>
                    )
                  })}
              </Select>
            </Grid>
            <br></br>
            <br></br>
            <Grid item xs={6}>
              <Typography>Giá dịch vụ :</Typography>
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
                  label='Nhập giá dịch vụ'
                  variant='outlined'
                  size='small'
                  error={priceError}
                  helperText={ErrorMessage2[0]}
                  onChange={e => validationPrice(e)}
                />
              </Box>
            </Grid>
            <Grid item xs={2} mb={2} pl={2}>
              {' '}
              <Box sx={{ display: 'inline', color: 'red' }}>*</Box>
            </Grid>
            <Grid item xs={6}>
              <Typography>Thêm ảnh :</Typography>
            </Grid>
            <Grid item xs={4}>
              <input type={'file'} accept='image/png, image/jpeg' onChange={selectFile}></input>
              <br></br> 
              <Grid container mb={0} direction='column' alignItems='center' justifyContent='center'>
                <Grid p={2} direction='column' alignItems='center' justifyContent='center'>
                  <Button variant='contained' onClick={e => uploadFile(e)}>
                    Thêm ảnh
                  </Button>
                </Grid>
                <Grid p={5} direction='column' alignItems='center' justifyContent='center'>
                  <ImageList sx={{ boxShadow: '0px 0px 20px 2px #dcdbff', width: 250, height: 100 }} cols={3} gap={2}>
                    {fileArray.map((item, index) => {
                      const cols = item.featured ? 2 : 1
                      const rows = item.featured ? 2 : 1

                      return (
                        <Grid item key={index} cols={cols} rows={rows}>
                          <Grid>
                            <ImageListItem key={index}>
                              <img src={item} alt='' loading='lazy'  onClick={e => handleImage(item)}/>
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
                              open={openImage}
                              onClose={handleCloseImage}
                              className={classes.modal}
                              closeAfterTransition
                              BackdropComponent={Backdrop}
                              BackdropProps={{
                                timeout: 300
                              }}
                            >
                              <Fade in={openImage} timeout={300} className={classes.img}>
                                <img
                                  src={image}
                                  alt='asd'
                                  style={{ maxHeight: '90%', maxWidth: '90%', textAlign: 'center', opacity: 0.9 }}
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
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setnameState('')
              setdescriptionState('')
              setdurationState('')
              setCategoryId('')
              setCategoryName('')
              setEquimentId('')
              setEquimentName('')
              setpriceState('')
              setFileArray([])
              handleClose()
              onSuccess()
              seNameError(false)
              setDurationError(false)
              setDescriptionError(false)
              setPriceError(false)
              setErrorMessage([''])
              setErrorMessage1([''])
              setErrorMessage2([''])
              setErrorMessage3([''])
            }}
            variant='outlined'
          >
            Đóng
          </Button>
          <Button variant='contained' disabled = {!enableButton} onClick={handleAdd}>
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
      <DialogAlert
        nameDialog={'Có lỗi xảy ra'}
        open={isOpenError}
        allertContent={error}
        handleClose={handleCloseDialog}
      />
    </Grid>
  )
}

export default DialogCreateService
