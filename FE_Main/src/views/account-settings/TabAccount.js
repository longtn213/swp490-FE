// ** React Imports
import { useState } from 'react'
import { forwardRef } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import { FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'

// ** Third Party Imports
// import DatePicker, { registerLocale } from 'react-datepicker'
// import vi from 'date-fns/locale/vi'
import { useEffect } from 'react'
import DialogAlert from '../../components/dialog/dialogAlert'
import { getProfile } from '../../api/auth/authApi'
import { updateProfile, uploadImage } from '../../api/profile/profileApi'

// registerLocale('vi', vi)

const CustomInput = forwardRef((props, ref) => {
  return <TextField inputRef={ref} label='Ngày sinh' fullWidth {...props} />
})

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const TabAccount = () => {
  // ** State
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')
  const [date, setDate] = useState(null)
  const [name, setName] = useState('')
  const [defaultName, setDefaultName] = useState('')
  const [email, setEmail] = useState('')
  const [allowEditEmail, setAllowEditEmail] = useState(true)
  const [phone, setPhone] = useState('')
  const [defaultPhone, setDefaultPhone] = useState('')
  const [gender, setGender] = useState()
  const [defaultGender, setDefaultGender] = useState()
  const [id, setId] = useState()
  const [avatarId, setAvatarId] = useState(-1)
  const [changeSuccess, setChangeSuccess] = useState(false)
  const [nameError, setNameError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [phoneError, setPhoneError] = useState(false)
  const [isOpenError, setIsOpenError] = useState(false)
  const [error, setError] = useState('')

  const handleCloseDialog = () => {
    setIsOpenError(false)
  }

  const router = useRouter()

  const onChange = file => {
    const imageFile = file.target.files[0]
    const reader = new FileReader()
    const { files } = file.target
    if (files && files.length !== 0 && imageFile.name.match(/\.(jpg|jpeg|png|gif)$/)) {
      reader.onload = () => setImgSrc(reader.result)
      reader.readAsDataURL(files[0])
      uploadFile(imageFile)
      console.log(id)
    } else {
      setError('Chỉ được chọn file ảnh')
      setIsOpenError(true)
      file.target.value = null
    }
  }

  const uploadFile = async newFile => {
    const res = await uploadImage(newFile)
    console.log(res)
    if (res && res.meta.code == 200) {
      setAvatarId(res.data.id)
    } else {
      setAvatarId(-1)
    }
  }  

  // Xứ lý update thông tin

  const nameRegex =
    /^[a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđA-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ0-9]*(?:[ a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđA-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ0-9]*)*$/

  const phoneRegex = /(03|05|07|08|09|01[2|6|8|9]|\+843|\+845|\+847|\+848|\+849|\+841[2|6|8|9])+([0-9]{8})\b/

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

  useEffect(() => {
    callApiGetProfile()
  }, [])

  const handleUpdateInfo = () => {
    setNameError(false)
    setPhoneError(false)
    setEmailError(false)
    setChangeSuccess(false)
    if (name.trim() !== '') {
      if (nameRegex.test(name.trim())) {
        setName(name.trim())
      } else {
        setNameError(true)
      }
      if (name.trim().length > 255) {
        setNameError(true)
      }
    } else {
      setNameError(true)
    }

    if (phone.trim() !== '') {
      if (phoneRegex.test(phone.trim())) {
        setPhone(phone.trim())
      } else {
        setPhoneError(true)
      }
    } else {
      setPhoneError(true)
    }

    if (allowEditEmail) {
      if (email.trim() !== '') {
        if (emailRegex.test(email.trim())) {
          setEmail(email.trim())
        } else {
          setEmailError(true)
        }
        if (email.trim().length > 100) {
          setEmailError(true)
        }
      } else {
        setEmailError(true)
      }
    }

    if (
      name.trim() === '' ||
      !nameRegex.test(name.trim()) ||
      name.trim().length > 255 ||
      phone.trim() === '' ||
      !phoneRegex.test(phone.trim())
    ) {
      return
    }

    if (allowEditEmail && (email.trim() === '' || !emailRegex.test(email.trim()) || email.trim().length > 100)) {
      return
    }

    // if(avatarId == -1){
    //   console.log(2);

    //   return
    // }

    callApiUpdateProfile()
  }

  // Lấy thông tin từ profile

  const callApiGetProfile = async () => {
    const res = await getProfile()
    if (!res) return
    if (res.meta.code != 200) {
      console.log(res.meta.message)

      return
    }
    if (!res.data) return
    console.log(res)

    setId(res.data.id)

    if (res.data.fullName) {
      setName(res.data.fullName)
    }

    if (res.data.email) {
      setEmail(res.data.email)
      setAllowEditEmail(false)
    }

    if (res.data.phoneNumber) {
      setPhone(res.data.phoneNumber)
      setDefaultPhone(res.data.phoneNumber)
    }

    if(res.data.avatar?.url){
      setImgSrc(res.data.avatar?.url)
    }

    if (res.data.gender) {
      if (res.data.gender === true) {
        setGender('male')
      }
      if (res.data.gender === false) {
        setGender('female')
      }
    }
  }

  const callApiUpdateProfile = async () => {
    let data = {
      id: id,
      fullName: name,
      
    }
    console.log(data)
    if(phone && phone !== defaultPhone) {
      data.phoneNumber = phone
    }
    if(avatarId && avatarId !== -1) {
      data.avatar = { id: avatarId }
    }
    if (allowEditEmail) {
      data.email = email
    }
    if (gender) {
      if (gender === 'male') {
        data.gender = true
      }
      if (gender === 'female') {
        data.gender = false
      }
    }

    const res = await updateProfile(data)
    if (!res) return
    if (res.meta.code == 200) {
      setChangeSuccess(true)
      localStorage.setItem('full_name', name)
    }
    if (res.meta.code != 200) {
      setError(res.meta.message)
      setIsOpenError(true)
    }


    console.log(res)
    callApiGetProfile()
  }

  return (
    <CardContent>
      {changeSuccess && <Alert severity='success'>Cập nhật thông tin thành công.</Alert>}
      <form>
        <Grid container spacing={7}>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ImgStyled src={imgSrc} alt='Profile Pic' />
              <Box>
                <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                  Chọn ảnh từ thiết bị
                  <input
                    hidden
                    type='file'
                    onChange={onChange}
                    accept='image/png, image/jpeg'
                    id='account-settings-upload-image'
                  />
                </ButtonStyled>
                <ResetButtonStyled color='error' variant='outlined' onClick={() => setImgSrc('/images/avatars/1.png')}>
                  Hủy
                </ResetButtonStyled>
                <Typography variant='body2' sx={{ marginTop: 5 }}>
                  Các định dạng file hợp lệ: .png, .jpeg, .jpg,...
                </Typography>
                <Typography variant='body2'>Dung lượng tối đa 800KB.</Typography>
              </Box>
            </Box>
          </Grid>

          {/* <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Tên đăng nhập' defaultValue='' />
          </Grid> */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Họ tên'
              value={name || ''}
              onChange={e => setName(e.target.value)}
              error={nameError}
              helperText={nameError && 'Họ tên không hợp lệ'}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='email'
              label='Email'
              placeholder='abc@example.com'
              value={email || ''}
              onChange={e => setEmail(e.target.value)}
              disabled={!allowEditEmail}
              error={emailError}
              helperText={emailError && 'Email không hợp lệ'}
            />
          </Grid>
          {/* <Grid item xs={12} sm={6}>
            <DatePickerWrapper>
              <DatePicker
                locale="vi"
                dateFormat="dd/LL/yyyy"
                selected={date}
                showYearDropdown
                showMonthDropdown
                id='account-settings-date'
                placeholderText='dd/mm/yyyy'
                customInput={<CustomInput />}
                onChange={date => setDate(date)}
              />
            </DatePickerWrapper>
          </Grid> */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='number'
              label='Số điện thoại'
              value={phone || ''}
              onChange={e => setPhone(e.target.value)}
              error={phoneError}
              helperText={phoneError && 'Số điện thoại không hợp lệ'}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl>
              <FormLabel sx={{ fontSize: '0.875rem' }}>Giới tính</FormLabel>
              <RadioGroup
                row
                defaultValue={gender ? gender : ''}
                aria-label='gender'
                name='account-settings-info-radio'
                value={gender}
                onChange={e => setGender(e.target.value)}
              >
                <FormControlLabel value='male' label='Nam' control={<Radio />} checked={gender === 'male'} />
                <FormControlLabel value='female' label='Nữ' control={<Radio />} checked={gender === 'female'} />
                {/* <FormControlLabel value='other' label='Other' control={<Radio />} /> */}
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button variant='contained' sx={{ marginRight: 3.5 }} onClick={() => handleUpdateInfo()}>
              Lưu thay đổi
            </Button>
            <Button type='reset' variant='outlined' color='secondary' onClick={() => router.back()}>
              Hủy
            </Button>
          </Grid>
        </Grid>
      </form>
      <DialogAlert
        nameDialog={'Có lỗi xảy ra'}
        open={isOpenError}
        allertContent={error}
        handleClose={handleCloseDialog}
      />
    </CardContent>
  )
}

export default TabAccount
