import { Button, Drawer, Grid, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'
import { useEffect } from 'react'
import { editEquipment } from 'src/api/equipment/equipmentApi'

const widthViewPort = '40vw'

//sticky style
const sticky = {
  position: 'sticky',
  left: 0,
  background: 'white'
}

export const DrawerViewEquipment = props => {
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
            {`Chi tiết loại thiết bị`}
          </Typography>
        </Grid>
        {/* body */}
        {selectedItem ? (
          <Grid item xs={12}>
            <Typography>
              <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>
                Tên loại thiết bị: <Typography>{selectedItem?.equipmentName}</Typography>
              </Box>
              <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>
                Mã loại thiết bị: <Typography>{selectedItem?.equipmentCode}</Typography>
              </Box>
              <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>
                Mô tả loại thiết bị: <Typography>{selectedItem?.equipmentDesc}</Typography>
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

export const DrawerEditEquipment = props => {
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
    const temp = selectedItem
    setItemData(temp)
  }, [selectedItem])

  const handleChangeName = e => {
    var temp = itemData
    temp.equipmentName = e.target.value.trim()
    setItemData(temp)
    if (temp.equipmentName !== '' && temp.equipmentName.length < 100 && temp.equipmentName.trim()){
      seNameError(false)
      setErrorMessage([''])
    } else {
      seNameError(true)
      setErrorMessage(['Trường này không được để trống và chỉ được nhập tối đa 100 kí tự'])
    }
  }

  const handleChangeCode = e => {
    var temp = itemData
    temp.equipmentCode = e.target.value
    setItemData(temp)
  }

  const handleChangeDescription = e => {
    var temp = itemData
    temp.equipmentDesc = e.target.value.trim()
    setItemData(temp)
    if ( temp.equipmentDesc.length < 255 && temp.equipmentDesc.trim()){
      setDescriptionError(false)
      setErrorMessage3([''])
    } else {
      setDescriptionError(true)
      setErrorMessage3(['Trường này chỉ được nhập tối đa 255 kí tự'])
    }
  }

  const handleEdit = () => {
    var data = {
      id: itemData.id,
      name: itemData.equipmentName,
      code: itemData.equipmentCode,
      description: itemData.equipmentDesc
    }
    if (itemData.equipmentName === '') {
      seNameError(true)
      setErrorMessage(['Trường này không được để trống'])
      console.log('1')
    } else if (itemData.equipmentName.length > 100) {
      seNameError(true)
      setErrorMessage(['Trường này chỉ được nhập tối đa 100 kí tự'])
      console.log('2')
    } else if (itemData.equipmentName.trim() === ' ') {
      seNameError(true)
      setErrorMessage(['Sai format'])
      console.log('3')
    } else if (itemData.equipmentDesc.length > 255) {
      setDescriptionError(true)
      setDescriptionError(['Trường này chỉ được nhập tối đa 255 kí tự'])
      console.log('4')
    } else if (itemData.equipmentDesc.trim() === ' ') {
      setDescriptionError(true)
      setDescriptionError(['Sai format'])
      console.log('5')
    } else {
      callApiEditEquipment(data)
    }
  }

  const callApiEditEquipment = async item => {
    if (selectedItem) {
      const data = await editEquipment(item)
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
            {`Chỉnh sửa loại thiết bị`}
          </Typography>
        </Grid>
        {/* body */}
        {itemData ? (
          <Grid item sx={12}>
            <Typography>Tên loại thiết bị</Typography>
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
                defaultValue={itemData.equipmentName}
                variant='outlined'
                error={nameError}
                helperText={ErrorMessage[0]}
                onChange={e => handleChangeName(e)}
              />
            </Box>
            <Typography>Mã loại thiết bị</Typography>
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
                defaultValue={itemData.equipmentCode}
                variant='outlined'
                onChange={e => handleChangeCode(e)}
              />
            </Box>
            <Typography>Mô tả loại thiết bị</Typography>
            <Box
              component='form'
              sx={{
                '& > :not(style)': { m: 1, width: '25ch' }
              }}
              autoComplete='off'
            >
              <TextField
                id='description'
                defaultValue={itemData.equipmentDesc}
                variant='outlined'
                error={descriptionError}
                helperText={ErrorMessage3[0]}
                onChange={e => handleChangeDescription(e)}
              />
            </Box>
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
              setItemData()
              onSuccess()
              seNameError(false)
              setErrorMessage([''])
              setDescriptionError(false)
              setErrorMessage3([''])
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
