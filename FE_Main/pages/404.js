// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import {styled} from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Head from 'next/head'

// ** Styled Components
const BoxWrapper = styled(Box)(({theme}) => ({
    [theme.breakpoints.down('md')]: {
        width: '90vw'
    }
}))

const Img = styled('img')(({theme}) => ({
    marginBottom: theme.spacing(10),
    [theme.breakpoints.down('lg')]: {
        height: 450,
        marginTop: theme.spacing(10)
    },
    [theme.breakpoints.down('md')]: {
        height: 400
    },
    [theme.breakpoints.up('lg')]: {
        marginTop: theme.spacing(13)
    }
}))

const Error404 = () => {
    return (
        <Box className='content-center'>
            <Head>
                <title>Không tìm thấy trang</title>
            </Head>
            <Box sx={{p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
                <BoxWrapper>
                    <Typography variant='h1'>404</Typography>
                    <Typography variant='h5' sx={{mb: 1, fontSize: '1.5rem !important'}}>
                        Không tìm thấy trang ⚠️
                    </Typography>
                    <Typography variant='body2'>Trang bạn đang tìm có vẻ như không tồn tại</Typography>
                </BoxWrapper>
                <Link passHref href='/'>
                    <Button variant='contained' sx={{px: 5.5, mt: 4}}>
                        Về trang chủ
                    </Button>
                </Link>
            </Box>
        </Box>
    )
}
Error404.getLayout = page => <>{page}</>

export default Error404
