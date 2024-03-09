// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import DotsVertical from 'mdi-material-ui/DotsVertical'
import { Button } from '@mui/material'
import { useRouter } from 'next/router'

const CardStatsVertical = props => {
  // ** Props
  const { title, color, icon, data, height, action } = props

  const router = useRouter()

  const handleAction = () => {
    router.push(action)
  }

  return (
    <Card sx={{ minHeight: height }}>
      <CardContent>
        <Box sx={{ display: 'flex', marginBottom: 5.5, alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex' }}>
            <Avatar sx={{ boxShadow: 3, marginRight: 4, color: 'common.white', backgroundColor: `${color}.main` }}>
              {icon}
            </Avatar>
            <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', my: 'auto' }}>{title}</Typography>
          </Box>
          {action ? (
            <Button size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }} onClick={() => {handleAction()}}>
              <Typography variant='caption'>Xem tất cả</Typography>
            </Button>
          ) : (
            <></>
          )}
        </Box>
        <Box
          sx={{
            marginTop: 1.5,
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            marginBottom: 1.5,
            alignItems: ''
          }}
        >
          {data.map((item, key) => {
            return (
              <Box key={key}>
                <Typography variant='body1'>
                  {item.key}: <strong>{item.value}</strong>
                </Typography>
              </Box>
            )
          })}
        </Box>
      </CardContent>
    </Card>
  )
}

export default CardStatsVertical