import { useState, useEffect } from 'react'

import { getConfigDetail } from '../../api/config/configApi'

import { Box, Button, Grid, Drawer, Typography } from '@mui/material'
import { fontWeight } from '@mui/system'

const widthViewPort = '40vw'

//sticky style
const sticky = {
  position: 'sticky',
  left: 0,
  background: 'white'
}

export const DrawerViewConfig = props => {
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
            {`Chi tiết loại cấu hình`}
          </Typography>
        </Grid>
        {/* body */}
        {selectedItem ? (
          <Grid item xs={12}>
            <Typography component='div'>
              <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>
                Mã cấu hình: <Typography>{selectedItem?.configKey}</Typography>
              </Box>
              <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>
                Giá trị cấu hình: <Typography>{selectedItem?.configValue}</Typography>
              </Box>
              <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>
                Miêu tả cấu hình: <Typography>{selectedItem?.configDesc}</Typography>
              </Box>
              <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>
                Tên cơ sở: <Typography>{selectedItem?.branchName}</Typography>
              </Box>
            </Typography>
          </Grid>
        ) : (
          <Typography>Không có cấu hình</Typography>
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
