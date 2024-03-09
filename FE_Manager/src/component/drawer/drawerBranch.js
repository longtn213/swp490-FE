import {
  Button,
  Drawer,
  FormControl,
  Grid,
  List,
  ListItem,
  ListItemButton,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'
import { useEffect } from 'react'
import {
  editBranch,
  getAllBranch,
  getAutocompletePlaces,
  getListDivision,
  getPlaceLatLong
} from 'src/api/branch/branchApi'
import { editEquipment } from 'src/api/equipment/equipmentApi'
import ModalMap from '../modal/modalMap'

const widthViewPort = '60vw'

export const DrawerViewBranch = props => {
  const { openDrawer, setOpenDrawer, selectedItem, setSelectedItem, setOpenError, setError, onSuccess } = props
  const [itemData, setItemData] = useState()

  useEffect(() => {
    callApiGetAllBranch()
  }, [selectedItem])

  const callApiGetAllBranch = async () => {
    const data = await getAllBranch()
    if (!data) return
    if (data.meta.code != 200) {
      setError(data.meta.message)
      setOpenError(true)

      return
    }
    if (!data.data) return
    const temp = [...data.data]
    if (selectedItem) {
      setItemData(temp.find(x => x.id === selectedItem.id))
      console.log(temp.find(x => x.id === selectedItem.id))
    }
  }

  const handleKeyPress = e => {
    if (e.key === 'Escape') {
      setOpenDrawer(false)
      setSelectedItem()
      onSuccess()
    }
  }

  return (
    <Drawer anchor={'right'} open={openDrawer} onKeyDown={handleKeyPress} hideBackdrop={true}>
      <Grid container spacing={6} style={{ width: `${widthViewPort}`, margin: 2 }}>
        {/* header */}
        <Grid item xs={12}>
          <Typography variant='h5' display={'inline'}>
            {`Chi tiết chi nhánh`}
          </Typography>
        </Grid>
        {/* body */}
        {itemData ? (
          <Grid item xs={12}>
            <Typography>
              <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>
                Tên chi nhánh: <Typography>{itemData?.name}</Typography>
              </Box>
              <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>
                Mã chi nhánh: <Typography>{itemData?.code}</Typography>
              </Box>
              <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>Địa chỉ</Box>
            </Typography>
            <Grid container>
              <Grid item xs={4}>
                <Typography>
                  <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>
                    Tỉnh/thành phố: <Typography>{itemData?.state?.divisionName}</Typography>
                  </Box>
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography>
                  <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>
                    Quận/huyện: <Typography>{itemData?.city?.divisionName}</Typography>
                  </Box>
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography>
                  <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>
                    Phường/xã: <Typography>{itemData?.district?.divisionName}</Typography>
                  </Box>
                </Typography>
              </Grid>
            </Grid>
            <Typography>
              <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>
                Địa chỉ cụ thể: <Typography>{itemData?.detailAddress} </Typography>
              </Box>
            </Typography>
            <Typography>
              <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>
                Điện thoại: <Typography>{itemData?.hotline} </Typography>
              </Box>
            </Typography>
          </Grid>
        ) : (
          <Typography>Không có thiết bị</Typography>
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

export const DrawerEditBranch = props => {
  const { openDrawer, setOpenDrawer, selectedItem, setSelectedItem, setOpenError, setError, onSuccess } = props
  const [itemData, setItemData] = useState()

  const [name, setName] = useState('')
  const [detailAddress, setDetailAddress] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [hotline, setHotline] = useState('')
  const [divisionId, setDivisionId] = useState()
  const [stateList, setStateList] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [cityList, setCityList] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [districtList, setDistrictList] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [isValidDivision, setIsValidDivision] = useState(true)
  const [isDisplayPredictions, setIsDisplayPredictions] = useState(false)
  const [predictionsList, setPredictionsList] = useState([])

  // Các state hiển thị lỗi
  const [nameError, setNameError] = useState()
  const [districtError, setDistrictError] = useState()
  const [cityError, setCityError] = useState()
  const [stateError, setStateError] = useState()
  const [detailAddressError, setDetailAddressError] = useState()
  const [hotlineError, setHotlineError] = useState()

  const callApiGetAllBranch = async () => {
    const data = await getAllBranch()
    if (!data) return
    if (data.meta.code != 200) {
      setError(data.meta.message)
      setOpenError(true)

      return
    }
    if (!data.data) return
    const temp = [...data.data]
    if (selectedItem) {
      const tempSelectedItem = temp.find(x => x.id === selectedItem.id)
      setItemData(tempSelectedItem)
      console.log(tempSelectedItem)
      setName(tempSelectedItem.name)
      setDetailAddress(tempSelectedItem.detailAddress)
      setLatitude(tempSelectedItem.latitude)
      setLongitude(tempSelectedItem.longitude)
      setHotline(tempSelectedItem.hotline)

      setDivisionId(0)
      setSelectedState(tempSelectedItem.state)

      setTimeout(() => {
        setDivisionId(tempSelectedItem.state.id)
        setSelectedCity(tempSelectedItem.city)
      }, 100)

      setTimeout(() => {
        setDivisionId(tempSelectedItem.city.id)
        setSelectedDistrict(tempSelectedItem.district)
      }, 200)

      setIsValidDivision(true)
    }
  }

  const handleCloseDrawer = () => {
    setOpenDrawer(false)
    setName('')
    setDetailAddress('')
    setLatitude('')
    setLongitude('')
    setHotline('')
    setDivisionId()
    setStateList('')
    setSelectedState('')
    setCityList('')
    setSelectedCity('')
    setDistrictList('')
    setSelectedDistrict('')
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

  const handleEdit = () => {
    setNameError()
    setDistrictError()
    setCityError()
    setStateError()
    setDetailAddressError()
    setHotlineError()

    if (name.trim() === '') {
      setNameError('Tên chi nhánh không được để trống')
    }
    if (name.trim().length > 255) {
      setNameError('Tên chi nhánh không được lớn hơn 255 ký tự')
    }
    if (!nameRegex.test(name.trim())) {
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
    if (detailAddress.trim() === '') {
      setDetailAddressError('Địa chỉ cụ thể không được để trống')
    }
    if (detailAddress.trim().length > 255) {
      setDetailAddressError('Địa chỉ cụ thể không được lớn hơn 255 ký tự')
    }
    if (!nameRegex.test(detailAddress.trim())) {
      setDetailAddressError('Địa chỉ cụ thể không hợp lệ')
    }
    if (hotline.trim() === '') {
      setHotlineError('Số điện thoại không được để trống')
    }
    if (!phoneRegex.test(hotline.trim())) {
      setHotlineError('Số điện thoại không hợp lệ')
    }
    if(!latitude || !longitude) {
      setError("Bạn cần chọn vị trí trên bản đồ nhằm xác định tọa độ của chi nhánh này")
      setOpenError(true)
    }

    if (
      name.trim() === '' ||
      name.trim().length > 255 ||
      !nameRegex.test(name.trim()) ||
      !selectedState ||
      !selectedCity ||
      !selectedDistrict ||
      detailAddress.trim() === '' ||
      detailAddress.trim().length > 255 ||
      !nameRegex.test(detailAddress.trim()) ||
      hotline.trim() === '' ||
      !phoneRegex.test(hotline.trim()) ||
      !latitude ||
      !longitude
    ) {

      return
    }

      const data = {
        id: itemData.id,
        name: name,
        code: itemData.code,
        detailAddress: detailAddress,
        latitude: latitude,
        longitude: longitude,
        hotline: hotline,
        state: {
          id: selectedState.id
        },
        city: {
          id: selectedCity.id
        },
        district: {
          id: selectedDistrict.id
        },
        isActive: itemData.isActive
      }
      callApiEditBranch(data)
  }

  useEffect(() => {
    callApiGetAllBranch()
  }, [selectedItem])

  // useEffect(() => {
  //   callApiGetDivisionList(0)
  // }, [openDrawer])

  useEffect(() => {
    const temp = divisionId
    callApiGetDivisionList(temp)
  }, [divisionId])

  const callApiGetDivisionList = async divisionId => {
    if (divisionId === undefined) return
    const data = await getListDivision(divisionId)
    if (!data) return
    if (data.meta.code != 200) {
      setError(data.meta.message)
      setOpenError(true)

      return
    }
    if (!data.data) return
    const temp = data.data
    if (temp !== []) {
      if (temp[0]?.divisionLevel === 'STATE') {
        setStateList(temp)
        setCityList('')
        setDistrictList('')

        return
      }
      if (temp[0]?.divisionLevel === 'CITY') {
        setCityList(temp)
        setDistrictList('')

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
    callApiGetAutocompletePlaces(
      `${detailAddress}, ${selectedDistrict.divisionName}, ${selectedCity.divisionName}, ${selectedState.divisionName}`
    )
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

  const handleKeyPress = e => {
    if (e.key === 'Escape') {
      handleCloseDrawer()
    }
  }

  const callApiEditBranch = async data => {
    const res = await editBranch(data)
    console.log(data)
    if (!res) return
    if (res.meta.code != 200) {
      return
    }
    handleCloseDrawer()
  }

  // Trạng trái đóng mở của map
  const [openMap, setOpenMap] = useState(false)

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
            {`Chỉnh sửa chi nhánh`}
          </Typography>
        </Grid>
        {/* body */}
        {itemData ? (
          <Grid container spacing={6} m={2}>
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
                  value={name}
                  error={nameError ? true : false}
                  helperText={nameError}
                  onFocus={() => setNameError()}
                  onChange={e => setName(e.target.value)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', marginBottom: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  {stateList && (
                    <>
                      <Typography>Chọn tỉnh/thành phố:</Typography>
                      <FormControl>
                        <Select
                          size='small'
                          value={selectedState?.id}
                          onChange={e => handleChangeState(e)}
                          sx={{ width: '90%' }}
                          error={stateError ? true : false}
                          onFocus={() => setStateError()}
                        >
                          {stateList.map((item, key) => {
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
                  )}
                </Grid>
                <Grid item xs={4}>
                  {cityList && (
                    <>
                      <Typography>Chọn quận/huyện:</Typography>
                      <FormControl>
                        <Select
                          size='small'
                          value={selectedCity?.id}
                          onChange={e => handleChangeCity(e)}
                          sx={{ width: '90%' }}
                          error={cityError ? true : false}
                          onFocus={() => setCityError()}
                        >
                          {cityList.map((item, key) => {
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
                  )}
                </Grid>
                <Grid item xs={4}>
                  {districtList && (
                    <>
                      <Typography>Chọn phường/xã:</Typography>
                      <FormControl>
                        <Select
                          size='small'
                          value={selectedDistrict?.id}
                          onChange={e => handleChangeDistrict(e)}
                          sx={{ width: '90%' }}
                          error={districtError ? true : false}
                          onFocus={() => setDistrictError()}
                        >
                          {districtList.map((item, key) => {
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
                  )}
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
                        setDetailAddressError()
                      }}
                      onBlur={e => {
                        e.preventDefault()

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
                    <Paper sx={{ maxWidth: 400 }}>
                      <List className='list'>
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
                  value={hotline}
                  error={hotlineError ? true : false}
                  helperText={hotlineError}
                  onBlur={() => setHotlineError()}
                  onChange={e => setHotline(e.target.value)}
                />
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Typography>Không có thông tin chi nhánh</Typography>
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
      <ModalMap
        open={openMap}
        setOpen={setOpenMap}
        latitude={latitude}
        setLatitude={setLatitude}
        longitude={longitude}
        setLongitude={setLongitude}
      />
    </Drawer>
  )
}
