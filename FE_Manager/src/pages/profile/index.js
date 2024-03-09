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
import { FormControlLabel, FormLabel, Paper, Radio, RadioGroup } from '@mui/material'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

// ** Third Party Imports
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker, { registerLocale } from 'react-datepicker'
import vi from 'date-fns/locale/vi'
import { useEffect } from 'react'

registerLocale('vi', vi)

//api
import { getProfile } from '../../../src/api/auth/authApi'
import DialogAlert from 'src/component/dialog/dialogAlert'
import { format, fromUnixTime } from 'date-fns'
import { TabPanel } from '@mui/lab'

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
  // const [openAlert, setOpenAlert] = useState(true)
  const [openAlert, setOpenAlert] = useState(false)
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')
  const [date, setDate] = useState(null)

  // Dialog khi có lỗi
  const [error, setError] = useState('')
  const [openError, setOpenError] = useState(false)

  //Account data
  const [accountData, setAccountData] = useState()

  const router = useRouter()

  useEffect(() => {
    callApiGetProfile()
  }, [])

  const callApiGetProfile = async () => {
    const data = await getProfile()
    if (!data) return
    if (data.meta.code != 200) {
      setError(data.meta.message)
      setOpenError(true)

      return
    }
    if (!data.data) return

    console.log(data.data)

    setAccountData(data.data)

    if(data.data.avatar?.url){
      setImgSrc(data.data.avatar?.url)
    }
  }

  return (
    <Box pb={5} sx={{ marginX: 1, marginTop: 6, boxShadow: 1, backgroundColor: '#FFFFFF', borderRadius: '5px' }}>
      <Grid container spacing={7} sx={{marginX: '0px'}}>
        <Grid item xs={12}>
        <Typography variant='h6'>Thông tin tài khoản</Typography>
        </Grid>
        <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <ImgStyled src={imgSrc} alt='Profile Pic' sx={{ margin: '0 auto' }} />
          </Box>
          <Typography variant='caption'>Ảnh đại diện</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant='body2'>Tên đăng nhập:</Typography>
          <Typography>{accountData?.username ? accountData?.username : 'Không có'}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant='body2'>Họ tên:</Typography>
          <Typography>{accountData?.fullName ? accountData?.fullName : 'Không có'}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant='body2'>Email:</Typography>
          <Typography>{accountData?.email ? accountData?.email : 'Không có'}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant='body2'>Ngày sinh:</Typography>
          <Typography>
            {accountData?.dob ? format(fromUnixTime(accountData?.dob / 1000), 'dd/MM/yyyy') : 'Không có'}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant='body2'>Số điện thoại:</Typography>
          <Typography>{accountData?.phoneNumber ? accountData?.phoneNumber : 'Không có'}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant='body2'>Giới tính:</Typography>
          <Typography>
            {(accountData?.gender === true && 'Nam') || (accountData?.gender === false && 'Nữ') || 'Không có'}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button variant='contained' sx={{ marginRight: 3.5 }} onClick={() => router.push(`/profile/edit`)}>
            Cập nhật thông tin
          </Button>
          <Button type='reset' variant='outlined' color='secondary' onClick={() => router.back()}>
            Quay lại
          </Button>
        </Grid>
      </Grid>
      <DialogAlert
        nameDialog={'Có lỗi xảy ra'}
        open={openError}
        allertContent={error}
        handleClose={() => setOpenError(false)}
      />
    </Box>
  )
}

export default TabAccount
