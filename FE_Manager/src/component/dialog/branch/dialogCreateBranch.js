import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import {
  Autocomplete,
  Fade,
  FormControl,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Popover,
  Popper,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import { addBranch, getAutocompletePlaces, getListDivision, getPlaceLatLong } from 'src/api/branch/branchApi'
import ModalMap from 'src/component/modal/modalMap'
import { Longitude } from 'mdi-material-ui'

function DialogCreateBranch(props) {
  const { open, setOpen, handleClose, onSuccess, error, setError, openError, setOpenError } = props
  const [name, setName] = useState('')
  const [detailAddress, setDetailAddress] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [hotline, setHotline] = useState('')
  const [divisionId, setDivisionId] = useState(0)
  const [stateList, setStateList] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [cityList, setCityList] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [districtList, setDistrictList] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [isValidDivision, setIsValidDivision] = useState(false)
  const [isDisplayPredictions, setIsDisplayPredictions] = useState(false)
  const [predictionsList, setPredictionsList] = useState([])

  // Các state hiển thị lỗi
  const [nameError, setNameError] = useState()
  const [districtError, setDistrictError] = useState()
  const [cityError, setCityError] = useState()
  const [stateError, setStateError] = useState()
  const [detailAddressError, setDetailAddressError] = useState()
  const [hotlineError, setHotlineError] = useState()

  const [anchorEl, setAnchorEl] = useState(null)

  const handleCloseDialog = () => {
    setOpen(false)
    handleClose()
    setName()
    setDetailAddress()
    setLatitude()
    setLongitude()
    setHotline()
    setDivisionId(0)
    setStateList()
    setSelectedState()
    setCityList()
    setSelectedCity()
    setDistrictList()
    setSelectedDistrict()
    setIsValidDivision(false)
    setIsDisplayPredictions(false)
    setNameError()
    setHotlineError()
    setPredictionsList([])
    setDistrictError()
    setCityError()
    setStateError()
    setDetailAddressError()
    onSuccess()
  }

  const nameRegex =
    /^[a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđA-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ0-9]*(?:[ a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđA-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ0-9]*)*$/

  const phoneRegex = /(03|05|07|08|09|01[2|6|8|9]|\+843|\+845|\+847|\+848|\+849|\+841[2|6|8|9])+([0-9]{8})\b/

  const handleAdd = () => {
    setNameError()
    setDistrictError()
    setCityError()
    setStateError()
    setDetailAddressError()
    setHotlineError()

    if (!name || (name && name.trim() === '')) {
      setNameError('Tên chi nhánh không được để trống')
    }
    if (name && name.trim().length > 255) {
      setNameError('Tên chi nhánh không được lớn hơn 255 ký tự')
    }
    if (name && !nameRegex.test(name.trim())) {
      setNameError('Tên chi nhánh không hợp lệ')
    }
    if (!selectedState) {
      setStateError('Bạn chưa chọn tỉnh/thành phố')
    }
    if (!selectedCity) {
      setCityError('Bạn chưa chọn quận/huyện')
    }
    if (!selectedDistrict) {
      setDistrictError('Bạn chưa chọn phường/xã')
    }
    if (!detailAddress || (detailAddress && detailAddress.trim() === '')) {
      setDetailAddressError('Địa chỉ cụ thể không được để trống')
    }
    if (detailAddress && detailAddress.trim().length > 255) {
      setDetailAddressError('Địa chỉ cụ thể không được lớn hơn 255 ký tự')
    }
    if (detailAddress && !nameRegex.test(detailAddress.trim())) {
      setDetailAddressError('Địa chỉ cụ thể không hợp lệ')
    }
    if (!hotline || (hotline && hotline.trim() === '')) {
      setHotlineError('Số điện thoại không được để trống')
    }
    if (hotline && !phoneRegex.test(hotline.trim())) {
      setHotlineError('Số điện thoại không hợp lệ')
    }

    if (!latitude || !longitude) {
      setError('Bạn cần chọn vị trí trên bản đồ nhằm xác định tọa độ của chi nhánh này')
      setOpenError(true)
    }

    if (
      !name || (name && name.trim() === '') ||
      name && name.trim().length > 255 ||
      name && !nameRegex.test(name.trim()) ||
      !selectedState ||
      !selectedCity ||
      !selectedDistrict ||
      !detailAddress || (detailAddress && detailAddress.trim() === '') ||
      detailAddress && detailAddress.trim().length > 255 ||
      detailAddress && !nameRegex.test(detailAddress.trim()) ||
      !hotline || (hotline && hotline.trim() === '') ||
      hotline && !phoneRegex.test(hotline.trim()) ||
      !latitude ||
      !longitude
    ) {
      return
    }

    const data = {
      name: name.trim(),
      detailAddress: detailAddress.trim(),
      latitude: latitude,
      longitude: longitude,
      hotline: hotline.trim(),
      state: {
        id: selectedState.id
      },
      city: {
        id: selectedCity.id
      },
      district: {
        id: selectedDistrict.id
      }
    }

    callApiAddBranch(data)
  }

  const validationName = e => {
    setName(e.target.value)
  }

  const validationHotline = e => {
    setHotline(e.target.value)
  }

  useEffect(() => {
    const temp = divisionId
    console.log(divisionId);
    if(open) {
      if(divisionId) {
        callApiGetDivisionList(temp)
      } else {
        setDivisionId(0)
        callApiGetDivisionList(0)
      }
    }
  }, [open])

  useEffect(() => {
    const temp = divisionId
    console.log(divisionId);
    if(divisionId) {
      callApiGetDivisionList(temp)
    }
  }, [divisionId])

  const callApiGetDivisionList = async divisionId => {
    const data = await getListDivision(divisionId)
    if (!data) return
    if (data.meta.code != 200) {
      setError(data.meta.message)
      setOpenError(true)

      return
    }
    if (!data.data) return
    const temp = data.data
    if (temp !== [] && temp.length > 0) {
      console.log(temp[0]);
      if (temp[0]?.divisionLevel === 'STATE') {
        setStateList(temp)
        setCityList()
        setSelectedCity()
        setDistrictList()
        setSelectedDistrict()

        return
      }
      if (temp[0]?.divisionLevel === 'CITY') {
        setCityList(temp)
        setDistrictList()
        setSelectedDistrict()

        return
      }
      if (temp[0]?.divisionLevel === 'DISTRICT') {
        setDistrictList(temp)

        return
      }
    }
  }

  const handleChangeState = e => {
    const tempId = e.target.value
    setSelectedState(stateList.find(element => element.id == tempId))
    setSelectedCity('')
    setSelectedDistrict('')
    setDivisionId(tempId)
    setIsValidDivision(false)
    setDetailAddress('')
    setLatitude()
    setLongitude()

    return
  }

  const handleChangeCity = e => {
    const tempId = e.target.value
    setSelectedCity(cityList.find(element => element.id == tempId))
    setSelectedDistrict('')
    setDivisionId(tempId)
    setIsValidDivision(false)
    setDetailAddress('')
    setLatitude()
    setLongitude()

    return
  }

  const handleChangeDistrict = e => {
    const tempId = e.target.value
    setSelectedDistrict(districtList.find(element => element.id == tempId))
    setIsValidDivision(true)
    setDetailAddress('')
    setLatitude()
    setLongitude()

    return
  }

  useEffect(() => {
    if (detailAddress && selectedDistrict && selectedCity && selectedState) {
      callApiGetAutocompletePlaces(
        `${detailAddress}, ${selectedDistrict?.divisionName}, ${selectedCity?.divisionName}, ${selectedState?.divisionName}`
      )
    }
  }, [detailAddress])

  const callApiGetAutocompletePlaces = async input => {
    const data = await getAutocompletePlaces(input)
    if (!data) return
    if (!data.predictions) return
    let temp = [...data.predictions]
    setPredictionsList(temp)
  }

  const callApiGetPlaceLatLong = async item => {
    const data = await getPlaceLatLong(item.place_id)
    if (!data) return
    if (!data.result) return
    if (!data.result.geometry) return
    if (!data.result.geometry.location) return
    let temp = data.result.geometry.location
    setLatitude(temp.lat)
    setLongitude(temp.lng)
    setDetailAddress(item.structured_formatting.main_text)
  }

  const handleSelectPlace = item => {
    callApiGetPlaceLatLong(item)
  }

  const callApiAddBranch = async data => {
    const res = await addBranch(data)
    if (!res) return
    if (res.meta.code != 200) {
      return
    }
    handleCloseDialog()
  }

  // Trạng trái đóng mở của map
  const [openMap, setOpenMap] = useState(false)

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
      onKeyPress={ev => {
        if (ev.key === 'Enter') {
          ev.preventDefault()
        }
      }}
      PaperProps={{
        sx: {
          minWidth: 700,
          minHeight: 450
        }
      }}
    >
      <DialogTitle>Thêm chi nhánh</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs={6}>
            <Typography>Tên chi nhánh :</Typography>
          </Grid>
          <Grid item xs={6}>
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
                label='Nhập tên chi nhánh'
                variant='outlined'
                size='small'
                error={nameError ? true : false}
                helperText={nameError}
                onFocus={() => setNameError()}
                onChange={e => validationName(e)}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', marginBottom: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                {
                  <>
                    <Typography>Chọn tỉnh/thành phố:</Typography>
                    <FormControl>
                      <Select
                        size='small'
                        value={selectedState && selectedState?.id}
                        onChange={e => handleChangeState(e)}
                        sx={{ width: 'fit-content' }}
                        error={stateError ? true : false}
                        onFocus={() => setStateError()}
                      >
                        {stateList &&
                          stateList.length > 0 &&
                          stateList.map((item, key) => {
                            return (
                              <MenuItem key={key} value={item.id}>
                                {item.divisionName}
                              </MenuItem>
                            )
                          })}
                      </Select>
                      <Typography variant='caption' color='red'>
                        {stateError}
                      </Typography>
                    </FormControl>
                  </>
                }
              </Grid>
              <Grid item xs={4}>
                {
                  <>
                    <Typography>Chọn quận/huyện:</Typography>
                    <FormControl>
                      <Select
                        size='small'
                        value={selectedCity && selectedCity?.id}
                        onChange={e => handleChangeCity(e)}
                        sx={{ width: 'fit-content' }}
                        error={cityError ? true : false}
                        onFocus={() => setCityError()}
                      >
                        {cityList &&
                          cityList.length > 0 &&
                          cityList.map((item, key) => {
                            return (
                              <MenuItem key={key} value={item.id}>
                                {item.divisionName}
                              </MenuItem>
                            )
                          })}
                      </Select>
                      <Typography variant='caption' color='red'>
                        {cityError}
                      </Typography>
                    </FormControl>
                  </>
                }
              </Grid>
              <Grid item xs={4}>
                {
                  <>
                    <Typography>Chọn phường/xã:</Typography>
                    <FormControl>
                      <Select
                        size='small'
                        value={selectedDistrict && selectedDistrict?.id}
                        onChange={e => handleChangeDistrict(e)}
                        sx={{ width: 'fit-content' }}
                        error={districtError ? true : false}
                        onFocus={() => setDistrictError()}
                      >
                        {districtList &&
                          districtList.length > 0 &&
                          districtList.map((item, key) => {
                            return (
                              <MenuItem key={key} value={item.id}>
                                {item.divisionName}
                              </MenuItem>
                            )
                          })}
                      </Select>
                      <Typography variant='caption' color='red'>
                        {districtError}
                      </Typography>
                    </FormControl>
                  </>
                }
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Typography>Địa chỉ cụ thể:</Typography>
          </Grid>
          <Grid item xs={6}>
            {isValidDivision ? (
              <>
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
                    label='Nhập địa chỉ'
                    variant='outlined'
                    size='small'
                    value={detailAddress}
                    onChange={e => setDetailAddress(e.target.value)}
                    onFocus={e => {
                      e.preventDefault()
                      setIsDisplayPredictions(true)
                      callApiGetAutocompletePlaces(
                        `${detailAddress}, ${selectedDistrict.divisionName}, ${selectedCity.divisionName}, ${selectedState.divisionName}`
                      )
                      setAnchorEl(e.currentTarget)
                      setDetailAddressError()
                    }}
                    onBlur={e => {
                      e.preventDefault()

                      // setIsDisplayPredictions(false)

                      if (isDisplayPredictions) {
                        setTimeout(() => {
                          setIsDisplayPredictions(false)
                        }, 100)
                      }
                    }}
                    error={detailAddressError ? true : false}
                    helperText={detailAddressError}
                  />
                </Box>
                {predictionsList !== [] && isDisplayPredictions && (
                  <Popper open={isDisplayPredictions} anchorEl={anchorEl} sx={{ maxWidth: 400, zIndex: 1300 }}>
                    <Paper>
                      <List className='list' sx={{ maxHeight: 300, overflow: 'auto' }}>
                        {predictionsList.map((item, key) => {
                          return (
                            <ListItem key={key} className='list-item'>
                              <ListItemButton
                                className='list-item-button'
                                sx={{ display: 'block' }}
                                onClick={() => {
                                  handleSelectPlace(item)
                                  setIsDisplayPredictions(false)
                                }}
                              >
                                <Typography variant='body1'>{item.structured_formatting.main_text}</Typography>
                                <Typography variant='body2'>{item.structured_formatting.secondary_text}</Typography>
                              </ListItemButton>
                            </ListItem>
                          )
                        })}
                      </List>
                    </Paper>
                  </Popper>
                )}
              </>
            ) : (
              <Typography>Bạn cần hoàn thành các trường trước đó</Typography>
            )}
          </Grid>
          {/* <Grid item xs={6}>
            <Typography>Kinh độ:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{longitude}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Vĩ độ:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{latitude}</Typography>
          </Grid> */}
          <Grid item xs={12} my={3}>
            {detailAddress !== '' && isValidDivision && (
              <Button variant='contained' onClick={() => setOpenMap(true)}>
                Chọn từ bản đồ
              </Button>
            )}
          </Grid>
          <Grid item xs={6}>
            <Typography>Số điện thoại:</Typography>
          </Grid>
          <Grid item xs={6}>
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
                label='Nhập số điện thoại'
                variant='outlined'
                size='small'
                error={hotlineError ? true : false}
                helperText={hotlineError}
                onFocus={() => setHotlineError()}
                onChange={e => validationHotline(e)}
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleCloseDialog()
          }}
          variant='outlined'
        >
          Đóng
        </Button>
        <Button variant='contained' onClick={handleAdd}>
          Thêm
        </Button>
      </DialogActions>
      <ModalMap
        open={openMap}
        setOpen={setOpenMap}
        latitude={latitude}
        setLatitude={setLatitude}
        longitude={longitude}
        setLongitude={setLongitude}
      />
    </Dialog>
  )
}

export default DialogCreateBranch
