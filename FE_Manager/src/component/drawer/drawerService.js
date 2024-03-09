import {
  Button,
  Drawer,
  Grid,
  ImageList,
  ImageListItem,
  TextField,
  Typography,
  Select,
  MenuItem,
  IconButton,
  ImageListItemBar
} from '@mui/material'
import { Box } from '@mui/system'
import { useState, useEffect } from 'react'
import { editService, uploadImage } from 'src/api/service/serviceApi'
import CloseIcon from '@mui/icons-material/Close'
import { GridList, GridListTile, makeStyles, Modal, Backdrop, Fade } from '@material-ui/core'
import { convertNumberToVND } from 'src/utils/currencyUtils'
import { convertDurationToTextTime } from 'src/utils/timeUtils'

const widthViewPort = '40vw'
const widthViewPort1 = '50vw'

//sticky style
const sticky = {
  position: 'sticky',
  left: 0,
  background: 'white'
}

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

export const DrawerViewService = props => {
  const { openDrawer, setOpenDrawer, selectedItem, setSelectedItem, setOpenError, setError, onSuccess } = props

  const [open, setOpen] = useState(false)
  const [image, setImage] = useState('false')
  const classes = useStyles()

  const handleImage = value => {
    setImage(value)
    setOpen(true)
    console.log(image)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleKeyPress = e => {
    if (e.key === 'Escape') {
      setOpenDrawer(false)
    }
  }

  return (
    <Drawer anchor={'right'} open={openDrawer} onKeyDown={handleKeyPress} hideBackdrop={true}>
      <Grid container spacing={6} style={{ width: `${widthViewPort1}`, margin: 2 }}>
        {/* header */}
        <Grid item xs={12}>
          <Typography variant='h5' display={'inline'}>
            {`Chi tiết dịch vụ`}
          </Typography>
        </Grid>
        {/* body */}
        {selectedItem ? (
          <Grid item xs={12}>
            <Typography component='div'>
              <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>
                <Typography>
                  <strong>Tên loại dịch vụ: </strong>
                  {selectedItem?.serviceName}
                </Typography>
              </Box>
              <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>
                <Typography>
                  <strong>Tên loại dịch vụ: </strong>
                  {selectedItem?.serviceCode}
                </Typography>
              </Box>
              <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>
                <Typography>
                  <strong>Mô tả : </strong>
                  {selectedItem?.serviceDesc}
                </Typography>
              </Box>
              <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>
                <Typography>
                  <strong>Thời gian thực hiện dịch vụ: </strong>
                  {convertDurationToTextTime(selectedItem?.serviceDuration)}
                </Typography>
              </Box>
              <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>
                <Typography>
                  <strong>Trạng thái dịch vụ: </strong>
                  {selectedItem?.serviceStatus}
                </Typography>
              </Box>
              <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>
                <Typography>
                  <strong>Danh mục dịch vụ: </strong>
                  {selectedItem?.serviceCategory}
                </Typography>
              </Box>
              <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>
                <Typography>
                  {' '}
                  <strong> Thiết bị dùng cho dịch vụ: </strong>
                  {selectedItem?.serviceEquipment}
                </Typography>
              </Box>
              <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>
                <Typography>
                  <strong>Giá dịch vụ: </strong>
                  {convertNumberToVND(selectedItem?.servicePrice)}
                </Typography>
              </Box>
            </Typography>
            {selectedItem?.servicefile && selectedItem?.servicefile.length > 0 && (
              <Grid p={10}>
                <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
                  {selectedItem?.servicefile.map((item, index) => (
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
            )}
            {selectedItem?.servicefile === 0 && (
              <Grid p={10}>
                <Typography variant='h5' style={{ marginBottom: 10 }}>
                  Không có ảnh
                </Typography>
              </Grid>
            )}
          </Grid>
        ) : (
          <Typography>Không có dịch vụ</Typography>
        )}

        {/* end */}
        <Grid item xs={12} style={{ textAlign: 'right', marginRight: '16px' }}>
          <Button
            onClick={() => {
              setOpenDrawer(false)
              setSelectedItem()
              onSuccess()
            }}
          >
            Đóng
          </Button>
        </Grid>
      </Grid>
    </Drawer>
  )
}

export const DrawerEditService = props => {
  const {
    openDrawer,
    setOpenDrawer,
    selectedItem,
    setSelectedItem,
    setOpenError,
    setError,
    onSuccess,
    listCategoryCodes,
    listEquipmentCodes
  } = props
  const [itemData, setItemData] = useState({})
  const [nameError, seNameError] = useState('')
  const [durationError, setDurationError] = useState('')
  const [priceError, setPriceError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')
  const [ErrorMessage, setErrorMessage] = useState([])
  const [ErrorMessage1, setErrorMessage1] = useState([])
  const [ErrorMessage2, setErrorMessage2] = useState([])
  const [ErrorMessage3, setErrorMessage3] = useState([])
  const [file, setFile] = useState()
  const [newfileArray, setNewfileArray] = useState([])
  const [fileArray, setFileArray] = useState([])
  const [fileArrayId, setFileArrayId] = useState([])
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState('false')
  const [enableButton, setEnableButton] = useState(true)
  const classes = useStyles()
  const regex = /^[0-9\b]+$/

  const handleImage = value => {
    setImage(value)
    setOpen(true)
    console.log(image)
  }

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    const temp = selectedItem
    console.log(selectedItem)
    setItemData(temp)
    if (selectedItem != undefined) {
      setNewfileArray(selectedItem.servicefile)
    }
  }, [selectedItem])

  const handleDisableImage = index => {
    console.log(index)
    setFileArray(fileArray.filter((file, i) => index != i))
    setFileArrayId(fileArrayId.filter((file, i) => index != i))
  }

  const handleDisableListImage = id => {
    setNewfileArray(newfileArray.filter((file, i) => id != file.id))
  }

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

  const handleChangeCode = e => {
    var temp = itemData
    temp.serviceCode = e.target.value
    setItemData(temp)
  }

  const handleChangeDescription = e => {
    var temp = itemData
    temp.serviceDesc = e.target.value.trim()
    setItemData(temp)
    if (temp.serviceDesc.length < 1500) {
      setDescriptionError(false)
      setErrorMessage3([''])
    } else {
      setDescriptionError(true)
      setErrorMessage3(['Trường này chỉ được nhập tối đa 1500 kí tự'])
    }
  }

  const handleChangeCategory = e => {
    const cateId = listCategoryCodes.filter(el => el.name === e.target.value)[0].id
    var temp = itemData
    temp.serviceCategory = e.target.value
    temp.categoryId = cateId
    setItemData(temp)
    console.log(temp)
  }

  const handleChangeEquipment = e => {
    const equipId = listEquipmentCodes.filter(el => el.name === e.target.value)[0].id
    var temp = itemData
    temp.serviceEquipment = e.target.value
    temp.equipmentTypeId = equipId
    setItemData(temp)
    console.log(temp)
  }

  const handleChangeName = e => {
    var temp = itemData
    temp.serviceName = e.target.value.trim()
    setItemData(temp)
    if (temp.serviceName !== '' && temp.serviceName.length < 100) {
      seNameError(false)
      setErrorMessage([''])
    } else {
      seNameError(true)
      setErrorMessage(['Trường này không được để trống và chỉ được nhập tối đa 100 kí tự'])
    }
  }

  const handleChangeDuration = e => {
    var temp = itemData
    temp.serviceDuration = e.target.value.trim()
    setItemData(temp)
    if (temp.serviceDuration !== '' && regex.test(e.target.value) && e.target.value.length <= 3) {
      setDurationError(false)
      setErrorMessage1([''])
    } else {
      setDurationError(true)
      setErrorMessage1(['Trường này không được để trống và chỉ được nhập số với tối đa 3 kí tự'])
    }
  }

  const handleChangePrice = e => {
    var temp = itemData
    temp.servicePrice = e.target.value.trim()
    setItemData(temp)
    if (temp.servicePrice !== '' && regex.test(e.target.value) && e.target.value.length <= 22) {
      setPriceError(false)
      setErrorMessage2([''])
    } else {
      setPriceError(true)
      setErrorMessage2(['Trường này không được để trống và chỉ được nhập số với tối đa 22 kí tự'])
    }
  }

  const handleEdit = () => {
    var data = {
      id: itemData.id,
      name: itemData.serviceName,
      code: itemData.serviceCode,
      duration: itemData.serviceDuration,
      isActive: itemData.isActive,
      categoryName: itemData.serviceCategory,
      categoryId: itemData.categoryId,
      equipmentTypeId: itemData.equipmentTypeId,
      equipmentName: itemData.serviceEquipment,
      description: itemData.serviceDesc,
      currentPrice: itemData.servicePrice,
      files: newfileArray ? [...newfileArray, ...fileArrayId] : [...fileArrayId]
    }
    console.log(data)

    if (itemData.serviceName === '') {
      seNameError(true)
      setErrorMessage1(['Trường này không được để trống'])
      console.log('1')
    } else if (itemData.serviceName.length > 100) {
      seNameError(true)
      setErrorMessage1(['Trường này chỉ tối đa 100 kí tự'])
      console.log('2')
    } else if (itemData.duration === '') {
      setDurationError(true)
      setErrorMessage(['Trường này không được để trống'])
      console.log('3')
    } else if (!regex.test(itemData.duration)) {
      setDurationError(true)
      setErrorMessage(['Trường này chỉ được nhập số'])
      console.log('4')
    } else if (itemData.duration.length > 3) {
      setDurationError(true)
      setErrorMessage(['Trường này chỉ tối đa 3 kí tự'])
      console.log('5')
    } else if (itemData.servicePrice === '') {
      setPriceError(true)
      setErrorMessage2(['Trường này không được để trống'])
      console.log('6')
    } else if (!regex.test(itemData.servicePrice)) {
      setPriceError(true)
      setErrorMessage2(['Trường này chỉ được nhập số'])
      console.log('7')
    } else if (itemData.servicePrice.length > 22) {
      setPriceError(true)
      setErrorMessage2(['Trường này chỉ tối đa 22 kí tự'])
      console.log('8')
    } else if (itemData.serviceDesc.length > 1500) {
      setDescriptionError(true)
      setErrorMessage3(['Trường này chỉ tối đa 1500 kí tự'])
      console.log('9')
    } else {
      callApiEditService(data)
      console.log(data)
      setFileArray([])
      setFileArrayId([])
      setFile()
      console.log(itemData)
    }
  }

  const callApiEditService = async item => {
    console.log(item)
    if (selectedItem) {
      const data = await editService(item)
      console.log(data)
      if (!data) return
      if (data.meta.code != 200) {
        setError(data.meta.message)
        setOpenError(true)

        return
      }
      setOpenDrawer(false)
      setSelectedItem()
      setItemData()
      onSuccess()
    }
  }

  const handleKeyPress = e => {
    if (e.key === 'Escape') {
      setOpenDrawer(false)
      seNameError(false)
      setDurationError(false)
      setPriceError(false)
      setErrorMessage([''])
    }
  }

  return (
    <Drawer
      anchor={'right'}
      open={openDrawer}
      onKeyDown={handleKeyPress}
      hideBackdrop={true}
      onKeyPress={ev => {
        if (ev.key === 'Enter') {
          ev.preventDefault()
        }
      }}
    >
      <Grid container spacing={6} style={{ width: `${widthViewPort}`, margin: 2 }}>
        {/* header */}
        <Grid item xs={12}>
          <Typography variant='h5' display={'inline'}>
            {`Chỉnh sửa dịch vụ`}
          </Typography>
        </Grid>
        {/* body */}
        {itemData ? (
          <Grid item sx={12}>
            <Typography>Tên loại dịch vụ</Typography>
            <Box
              component='form'
              sx={{
                '& > :not(style)': { m: 1, width: '25ch' }
              }}
              noValidate
              autoComplete='off'
            >
              <TextField
                id='name'
                defaultValue={itemData.serviceName}
                variant='outlined'
                error={nameError}
                helperText={ErrorMessage[0]}
                onChange={e => handleChangeName(e)}
              />
            </Box>
            <Typography>Mã loại dịch vụ</Typography>
            <Box
              component='form'
              sx={{
                '& > :not(style)': { m: 1, width: '25ch' }
              }}
              autoComplete='off'
            >
              <TextField
                id='code'
                label='Mã'
                disabled
                defaultValue={itemData.serviceCode}
                variant='outlined'
                onChange={e => handleChangeCode(e)}
              />
            </Box>
            <Typography>Mô tả dịch vụ</Typography>
            <Box
              component='form'
              sx={{
                '& > :not(style)': { m: 1, width: '25ch' }
              }}
              autoComplete='off'
            >
              <TextField
                id='description'
                defaultValue={itemData.serviceDesc}
                variant='outlined'
                error={descriptionError}
                helperText={ErrorMessage3[0]}
                onChange={e => handleChangeDescription(e)}
              />
            </Box>
            <Box
              component='form'
              sx={{
                '& > :not(style)': { m: 1, width: '25ch' }
              }}
              autoComplete='off'
            >
              <Typography>Các loại dịch vụ :</Typography>
            </Box>
            <Box
              component='form'
              sx={{
                '& > :not(style)': { m: 1, width: '25ch' }
              }}
              autoComplete='off'
            >
              <Select
                id='categoryState'
                fullWidth
                variant='standard'
                onChange={e => handleChangeCategory(e)}
                value={itemData.serviceCategory}
              >
                {listCategoryCodes &&
                  listCategoryCodes.map(item => {
                    return (
                      <MenuItem value={item.name} key={item.id}>
                        {item.name}
                      </MenuItem>
                    )
                  })}
              </Select>
            </Box>
            <Box
              component='form'
              sx={{
                '& > :not(style)': { m: 1, width: '25ch' }
              }}
              autoComplete='off'
            >
              <Typography>Các loại thiết bị :</Typography>
            </Box>
            <Box
              component='form'
              sx={{
                '& > :not(style)': { m: 1, width: '25ch' }
              }}
              autoComplete='off'
            >
              <Select
                id='equipmentState'
                fullWidth
                variant='standard'
                onChange={e => handleChangeEquipment(e)}
                value={itemData.serviceEquipment}
              >
                {listEquipmentCodes &&
                  listEquipmentCodes.map(item => {
                    return (
                      <MenuItem value={item.name} key={item.id}>
                        {item.name}
                      </MenuItem>
                    )
                  })}
              </Select>
            </Box>
            <Box
              component='form'
              sx={{
                '& > :not(style)': { m: 1, width: '25ch' }
              }}
              autoComplete='off'
            >
              <Typography>Giá dịch vụ</Typography>
            </Box>
            <Box
              component='form'
              sx={{
                '& > :not(style)': { m: 1, width: '25ch' }
              }}
              autoComplete='off'
            >
              <TextField
                id='price'
                defaultValue={itemData.servicePrice}
                variant='outlined'
                error={priceError}
                helperText={ErrorMessage2[0]}
                onChange={e => handleChangePrice(e)}
              />
            </Box>
            <Box
              component='form'
              sx={{
                '& > :not(style)': { m: 1, width: '25ch' }
              }}
              autoComplete='off'
            >
              <Typography>Thời gian dịch vụ</Typography>
            </Box>
            <Box
              component='form'
              sx={{
                '& > :not(style)': { m: 1, width: '25ch' }
              }}
              autoComplete='off'
            >
              <TextField
                id='description'
                defaultValue={itemData.serviceDuration}
                variant='outlined'
                error={durationError}
                helperText={ErrorMessage1[0]}
                onChange={e => handleChangeDuration(e)}
              />
            </Box>
            {newfileArray && newfileArray.length > 0 && (
              <Grid p={10}>
                <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
                  {newfileArray.map((item, index) => (
                    <ImageListItem key={index}>
                      <img src={item.url} alt='' loading='lazy' onClick={e => handleImage(item.url)} />
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
                            onClick={() => handleDisableListImage(item.id)}
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
                  ))}
                </ImageList>
              </Grid>
            )}
            {newfileArray === 0 && (
              <Grid p={10}>
                <Typography variant='h5' style={{ marginBottom: 10 }}>
                  Không có ảnh
                </Typography>
              </Grid>
            )}
            <Grid item xs={6}>
              <Typography>Thêm ảnh :</Typography>
            </Grid>
            <Grid item xs={4}>
              <input type={'file'} accept='image/png, image/jpeg' onChange={selectFile}></input>
              <br></br>
              <Grid p={2} direction='column' alignItems='center' justifyContent='center'>
                <Button variant='contained' onClick={e => uploadFile(e)}>
                  Thêm ảnh
                </Button>
              </Grid>
              <Grid p={5} direction='column' alignItems='center' justifyContent='center'>
                <ImageList sx={{ boxShadow: '0px 0px 500px 2px #dcdbff', width: 500, height: 150 }} cols={3} gap={2}>
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
                        </Grid>
                      </Grid>
                    )
                  })}
                </ImageList>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Typography>Không có dịch vụ</Typography>
        )}

        {/* end */}
        <Grid item xs={12} style={{ textAlign: 'right', marginRight: '16px' }}>
          <Button
            onClick={() => {
              setOpenDrawer(false)
              setSelectedItem()
              setItemData()
              seNameError(false)
              setDurationError(false)
              setPriceError(false)
              setErrorMessage([''])
              onSuccess()
            }}
          >
            Đóng
          </Button>
          <Button
            variant='contained'
            disabled = {!enableButton}
            onClick={() => {
              handleEdit()
            }}
          >
            Cập nhật
          </Button>
        </Grid>
      </Grid>
    </Drawer>
  )
}
