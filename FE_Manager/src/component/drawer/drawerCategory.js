import {
  Button,
  Checkbox,
  Drawer,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'
import { useEffect } from 'react'
import { editCategory, getCategory } from 'src/api/category/categoryApi'
import { getNotAssignCategorySetvice } from 'src/api/service/serviceApi'

const widthViewPort = '40vw'

//sticky style
const sticky = {
  position: 'sticky',
  left: 0,
  background: 'white'
}

export const DrawerViewCategory = props => {
  const { openDrawer, setOpenDrawer, selectedItem, setSelectedItem, setOpenError, setError, onSuccess } = props

  const handleKeyPress = e => {
    if (e.key === 'Escape') {
      setOpenDrawer(false)
    }
  }

  return (
    <Drawer anchor={'right'} open={openDrawer} onKeyDown={handleKeyPress} hideBackdrop={true}>
      <Grid container spacing={6} style={{ width: `${widthViewPort}`, margin: 2 }}>
        {/* header */}
        <Grid item xs={12}>
          <Typography variant='h5' display={'inline'}>
            {`Chi tiết danh mục`}
          </Typography>
        </Grid>
        {/* body */}
        {selectedItem ? (
          <Grid item sx={12}>
            <Typography>
              <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>
                Tên danh mục: <Typography>{selectedItem?.name}</Typography>
              </Box>
              <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>
                Mã danh mục: <Typography>{selectedItem?.code}</Typography>
              </Box>
              <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>
                Mô tả danh mục: <Typography>{selectedItem?.description}</Typography>
              </Box>
            </Typography>
          </Grid>
        ) : (
          <Typography>Không có danh mục</Typography>
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

export const DrawerEditCategory = props => {
  const { openDrawer, setOpenDrawer, selectedItem, setSelectedItem, setOpenError, setError, onSuccess } = props
  const [itemData, setItemData] = useState()
  const [nameError, seNameError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')
  const [ErrorMessage3, setErrorMessage3] = useState([])
  const [ErrorMessage, setErrorMessage] = useState([])

  const handleKeyPress = e => {
    if (e.key === 'Escape') {
      setOpenDrawer(false)
      setItemData()
      seNameError(false)
      setErrorMessage([''])
    }
  }

  useEffect(() => {
    setServices()
    setSelectedServices()
    if (selectedItem) {
      callApiGetDetailCategory()
      callApitGetNotAssignCategoryService()
    }
  }, [selectedItem])

  const callApiGetDetailCategory = async () => {
    const data = await getCategory(selectedItem.id)
    if (!data) return
    if (data.meta.code != 200) {
      setError(data.meta.message)
      setOpenError(true)

      return
    }
    if (!data.data) return

    setItemData(data.data)

    if (data.data?.spaServices) {
      console.log(data.data?.spaServices)
      if (services !== null && services !== [] && services !== undefined) {
        setServices(services => [...services, ...data.data?.spaServices])
        console.log(data.data?.spaServices)
        setSelectedServices(data.data?.spaServices)
      } else {
        setServices(data.data?.spaServices)
        setSelectedServices(data.data?.spaServices)
      }
    }
  }

  const handleChangeName = e => {
    var temp = itemData
    temp.name = e.target.value.trim()
    setItemData(temp)
    if (temp.name !== '' && temp.name.length < 100) {
      seNameError(false)
      setErrorMessage([''])
    } else {
      seNameError(true)
      setErrorMessage(['Trường này không được để trống và chỉ được nhập tối đa 100 kí tự'])
    }
  }

  const handleChangeCode = e => {
    var temp = itemData
    temp.code = e.target.value
    setItemData(temp)
  }

  const handleChangeDescription = e => {
    var temp = itemData
    temp.description = e.target.value.trim()
    setItemData(temp)
    if (temp.description.length < 200) {
      setDescriptionError(false)
      setErrorMessage3([''])
    } else {
      setDescriptionError(true)
      setErrorMessage3(['Trường này chỉ được nhập tối đa 200 kí tự'])
    }
  }

  const handleEdit = () => {
    var tempServices = [...selectedServices]
    var listServicesId = []
    tempServices.map(item => {
      listServicesId.push({ id: item.id })

      return null
    })

    var data = {
      id: itemData.id,
      name: itemData.name,
      code: itemData.code,
      description: itemData.description,
      spaServices: listServicesId
    }
    if (itemData.name === '') {
      seNameError(true)
      setErrorMessage(['Trường này không được để trống'])
      console.log('1')
    } else if (itemData.name.length > 100) {
      seNameError(true)
      setErrorMessage(['Trường này chỉ được nhập tối đa 100 kí tự'])
      console.log('2')
    } else if (itemData.name.trim() === ' ') {
      seNameError(true)
      setErrorMessage(['Sai format'])
      console.log('3')
    } else if (itemData.description.length > 255) {
      setDescriptionError(true)
      setDescriptionError(['Trường này chỉ được nhập tối đa 255 kí tự'])
      console.log('4')
    } else if (itemData.description.trim() === ' ') {
      setDescriptionError(true)
      setDescriptionError(['Sai format'])
      console.log('5')
    } else {
      callApiEditCategory(data)
    }
  }

  const callApiEditCategory = async item => {
    if (selectedItem) {
      const data = await editCategory(item)
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

  //Xử lý checkbox
  const [services, setServices] = useState()
  const [selectedServices, setSelectedServices] = useState()

  // useEffect(() => {
  //   if (openDrawer === true) {
  //     callApitGetNotAssignCategoryService()
  //   }
  // }, [openDrawer])

  const callApitGetNotAssignCategoryService = async () => {
    const data = await getNotAssignCategorySetvice()

    if (!data) return
    if (!data.data) return

    setServices(services => [...services, ...data.data])
    console.log('services', services)
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

  const handleClose = () => {
    setOpenDrawer(false)
    setSelectedItem()
    setSelectedItem()
    setServices()
    setSelectedServices()
    setItemData()
    onSuccess()
    seNameError(false)
    setErrorMessage([''])
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
      onClose={handleClose}
    >
      <Grid container spacing={6} style={{ width: `${widthViewPort}`, margin: 2 }}>
        {/* header */}
        <Grid item xs={12}>
          <Typography variant='h5' display={'inline'}>
            {`Chỉnh sửa danh mục`}
          </Typography>
        </Grid>
        {/* body */}
        {itemData ? (
          <Grid item sx={12}>
            <Typography>Tên danh mục</Typography>
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
                defaultValue={itemData.name}
                variant='outlined'
                error={nameError}
                helperText={ErrorMessage[0]}
                onChange={e => handleChangeName(e)}
              />
            </Box>
            {/* <Typography>Mã danh mục</Typography>
            <Box
              component='form'
              sx={{
                '& > :not(style)': { m: 1, width: '25ch' }
              }}
              autoComplete='off'
            >
              <TextField
                id='code'
                disabled
                defaultValue={itemData.code}
                variant='outlined'
                onChange={e => handleChangeCode(e)}
              />
            </Box> */}
            <Typography>Mô tả danh mục</Typography>
            <Box
              component='form'
              sx={{
                '& > :not(style)': { m: 1, width: '25ch' }
              }}
              autoComplete='off'
            >
              <TextField
                id='description'
                defaultValue={itemData.description}
                variant='outlined'
                error={descriptionError}
                helperText={ErrorMessage3[0]}
                onChange={e => handleChangeDescription(e)}
              />
            </Box>
            {services && (
              <>
                <Typography>Các dịch vụ thuộc danh mục:</Typography>
                <Paper sx={{ maxHeight: 400, overflow: 'auto' }}>
                  <FormGroup>
                    {services?.map(item => {
                      return (
                        <FormControlLabel
                          key={item.id}
                          control={
                            <Checkbox
                              checked={selectedServices?.filter(e => e.id === item.id).length > 0}
                              onChange={e => handleCheckbox(e, item.id)}
                            />
                          }
                          label={item.name}
                        />
                      )
                    })}
                  </FormGroup>
                </Paper>
              </>
            )}
          </Grid>
        ) : (
          <Typography>Không có danh mục</Typography>
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
          <Button
            variant='contained'
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
