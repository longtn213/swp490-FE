import * as React from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { useState } from 'react'
import { useEffect } from 'react'
import {
  Button,
  Dialog,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import Image from 'next/image'
import { getAllBranch } from 'src/api/branch/branchApi'
import { convertDurationToTextTime } from 'src/utils/timeUtils'
import { convertNumberToVND, convertNumberToVNDLetters } from 'src/utils/currencyUtils'
import { getDate, getMonth, getYear } from 'date-fns'
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import PrintIcon from '@mui/icons-material/Print';

export default function ModalInvoiceDetail(props) {
  const { open, setOpen, data, totalPrice } = props

  const [branchData, setBranchData] = useState()

  useEffect(() => {
    if (data && open == true) {
      callApiGetAllBranch(data.branchId)
      console.log(data)
    }
  }, [open])

  const callApiGetAllBranch = async id => {
    const res = await getAllBranch()
    if (!res) return
    if (!res.data) return
    setBranchData(res.data.find(x => x.id === id))
    console.log(res.data.find(x => x.id === id))
  }

  const handleClose = () => {
    setOpen(false)
    setBranchData()
  }

  // In hóa đơn
  const [printSuccess, setPrintSuccess] = useState(false)
  const componentRef = useRef()

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Hoa-don_${data?.id}_${branchData?.code}`,
    onAfterPrint: () => setPrintSuccess(true)
  })

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      width='40vw'
      onKeyPress={ev => {
        if (ev.key === 'Enter') {
          ev.preventDefault()
        }
      }}
      fullWidth
      maxWidth='md'
    >
      <Box sx={{ margin: 5 }}>
        <Typography variant='h6'>Chi tiết hóa đơn</Typography>
        {data && branchData && (
          <Box ref={componentRef}>
            <Box mx={6} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Image className='Logo' src='/images/logos/logo.png' alt='Logo' width={200} height={200} />
              <Box mt={6} sx={{ textAlign: 'center' }}>
                <Typography variant='h6'>{branchData.name}</Typography>
                <Typography maxWidth={500}>
                  Địa chỉ:{' '}
                  {`${branchData.detailAddress} - ${branchData.district.divisionName} - ${branchData.city.divisionName} - ${branchData.state.divisionName}`}
                </Typography>
                <Typography>Điện thoại: {branchData.hotline}</Typography>
              </Box>
            </Box>
            <Box mt={3} sx={{ textAlign: 'center' }}>
              <Typography variant='h4'>Hóa đơn dịch vụ</Typography>
            </Box>

            <Box mt={6} mx={8}>
              <Grid container>
                {data.customer.fullName && (
                  <Grid item xs={8}>
                    <Typography>
                      <strong>Tên khách hàng: </strong>
                      {data.customer.fullName}
                    </Typography>
                  </Grid>
                )}
                {data.customer.phoneNumber && (
                  <Grid item xs={4}>
                    <strong>Điện thoại: </strong>
                    {data.customer.phoneNumber}
                  </Grid>
                )}
                {data.customer.email && (
                  <Grid item xs={4}>
                    <strong>Email: </strong>
                    {data.customer.email}
                  </Grid>
                )}
              </Grid>
            </Box>

            {data.appointmentServices && data.appointmentServices.length !== 0 && (
              <Box mx={6} mt={4}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align='center'>STT</TableCell>
                      <TableCell align='center'>Tên dịch vụ</TableCell>
                      <TableCell align='center'>Thời gian</TableCell>
                      <TableCell align='center'>Đơn giá</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.appointmentServices.map((item, index) => {
                      if(!item.canceledReason) {
                        return (
                          <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component='th' scope='row' align='center'>
                              {index + 1}
                            </TableCell>
                            <TableCell align='center'>{item.spaServiceName}</TableCell>
                            <TableCell align='center'>{convertDurationToTextTime(item.duration)}</TableCell>
                            <TableCell align='center'>{convertNumberToVND(item.spaServicePrice)}</TableCell>
                          </TableRow>
                        )
                      }
                    })}
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell align='right'>
                        <Typography variant='body1'>
                          <strong>Tổng cộng:</strong>
                        </Typography>
                      </TableCell>
                      <TableCell align='center'>
                        <Typography color='red'>{convertNumberToVND(totalPrice)}</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Typography my={4}>
                  <strong>Tổng thanh toán (bằng chữ):</strong> {convertNumberToVNDLetters(totalPrice)}
                </Typography>
              </Box>
            )}
            <Typography variant='body1' mx={6} my={4}>
              <strong>Xác nhận thanh toán</strong>
            </Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant='body2' mr={25} my={2} sx={{fontStyle: 
              'italic'}}>
                {branchData.state.divisionName}, ngày {getDate(new Date())} tháng {getMonth(new Date()) + 1} năm{' '}
                {getYear(new Date())}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
              <Box sx={{ textAlign: 'center', height: '150px' }}>
                <Typography>Khách hàng</Typography>
                <Typography variant='caption'>(ký và ghi rõ họ tên)</Typography>
              </Box>
              <Box sx={{ textAlign: 'center', height: '150px' }}>
                <Typography>Lễ tân</Typography>
                <Typography variant='caption'>(ký và ghi rõ họ tên)</Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      <Box sx={{ display: 'flex', margin: 3, justifyContent: 'flex-end' }}>
        <Button variant='text' onClick={() => handleClose()}>
          Đóng
        </Button>
        <Button variant='contained'  startIcon={<PrintIcon/>} onClick={() => handlePrint()}>
          In hóa đơn
        </Button>
      </Box>
    </Dialog>
  )
}
