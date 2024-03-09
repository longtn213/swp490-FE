// ** React Imports
import { useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'

// ** Icons Imports
import Google from 'mdi-material-ui/Google'
import Github from 'mdi-material-ui/Github'
import Twitter from 'mdi-material-ui/Twitter'
import Facebook from 'mdi-material-ui/Facebook'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'

//api
import { login, getProfile } from '../../../api/auth/authApi'
import { useEffect } from 'react'
import { Alert } from '@mui/material'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const LoginPage = () => {
  // ** State
  const [values, setValues] = useState({
    password: '',
    showPassword: false
  })

  const [username, setUsername] = useState('')

  // ** Hook
  const theme = useTheme()
  const router = useRouter()

  console.log('login page', router.query)

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  const [error, setError] = useState('')
  const [displayError, setDisplayError] = useState(false)

  const handleLogin = async () => {
    console.log('username', username)
    console.log('password', values.password)
    const data = await login(username, values.password)

    if (data?.data?.token_type && data?.data?.access_token) {
      setDisplayError(false)
      localStorage.setItem('access_token', `${data?.data?.token_type} ${data?.data?.access_token}`)
      localStorage.setItem('expired_date', data?.data?.expires_in * 1000 + Date.now())
      localStorage.setItem('username', username)
      const res = await getProfile()
      if (res.meta.code === '200') {

        if(res.data.role.id !== 1 && res.data.role.id !== 3) { // Không phải manager hay receptionist
          localStorage.clear()
          setError('Tài khoản không có quyền truy cập')
          setDisplayError(true)
          
          return
        }

        localStorage.setItem('full_name', res.data.fullName)
        localStorage.setItem('role', res.data.role.code)
        localStorage.setItem('role_name', res.data.role.name)
        localStorage.setItem('id', res.data.id)
        localStorage.setItem('permission', JSON.stringify(res.data.role.permissions))
        if(res.data.branch?.id) {
          localStorage.setItem('branch_id', res.data.branch.id)
          localStorage.setItem('branch_code', res.data.branch.code)
          localStorage.setItem('branch_name', res.data.branch.name)
        }
      }
      if (router.query.returnUrl) {
        router.push(`${router.query.returnUrl}`)
      } else {
        router.push(`/`)
      }
    } else {
      setError('Tên tài khoản hoặc Mật khẩu của bạn không đúng, vui lòng thử lại')
      setDisplayError(true)
    }
  }

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      localStorage.clear()
    }
  }, [])

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image className='Logo' src='/images/logos/logo.png' alt='Logo' width={200} height={200} />
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant='h6'>Đăng nhập</Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
            {displayError && (
              <Alert severity='error' sx={{ marginBottom: 4 }}>
                {error}
              </Alert>
            )}
            <TextField
              mt={3}
              autoFocus
              fullWidth
              id='email'
              label='Tài khoản'
              sx={{ marginBottom: 4 }}
              value={username}
              onChange={e => {
                e.preventDefault
                setUsername(e.target.value)
              }}
            />
            <FormControl fullWidth>
              <InputLabel htmlFor='auth-login-password'>Mật khẩu</InputLabel>
              <OutlinedInput
                label='Password'
                value={values.password}
                id='auth-login-password'
                onChange={handleChange('password')}
                type={values.showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='toggle password visibility'
                    >
                      {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Box
              sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
            >
              <br></br>
              <Link passHref href='/pages/forgot-password'>
                <LinkStyled>Quên mật khẩu?</LinkStyled>
              </Link>
            </Box>
            <Button fullWidth size='large' variant='contained' sx={{ marginBottom: 7 }} onClick={handleLogin}>
              Đăng nhập
            </Button>
            {/* <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                Chưa có tài khoản?
              </Typography>
              <Typography variant='body2'>
                <Link passHref href='/pages/register'>
                  <LinkStyled>Đăng ký ngay</LinkStyled>
                </Link>
              </Typography>
            </Box>
            <Divider sx={{ my: 5 }}>hoặc</Divider>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Link href='/' passHref>
                <IconButton component='a' onClick={e => e.preventDefault()}>
                  <Facebook sx={{ color: '#497ce2' }} />
                </IconButton>
              </Link>
              <Link href='/' passHref>
                <IconButton component='a' onClick={e => e.preventDefault()}>
                  <Twitter sx={{ color: '#1da1f2' }} />
                </IconButton>
              </Link>
              <Link href='/' passHref>
                <IconButton component='a' onClick={e => e.preventDefault()}>
                  <Github
                    sx={{ color: theme => (theme.palette.mode === 'light' ? '#272727' : theme.palette.grey[300]) }}
                  />
                </IconButton>
              </Link>
              <Link href='/' passHref>
                <IconButton component='a' onClick={e => e.preventDefault()}>
                  <Google sx={{ color: '#db4437' }} />
                </IconButton>
              </Link>
            </Box> */}
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default LoginPage
