import {
  Box,
  Card,
  CardContent,
  IconButton,
  Paper,
  Typography,
  Tooltip as MUITooltip,
  CardActionArea
} from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import ChevronUp from 'mdi-material-ui/ChevronUp'
import ChevronDown from 'mdi-material-ui/ChevronDown'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { convertNumberToVND } from 'src/utils/currencyUtils'
import { useEffect, useState } from 'react'
import { format, fromUnixTime } from 'date-fns'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend)

export const options = {
  interaction: {
    mode: 'index',
    intersect: false
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      title: {
        display: true,
        text: 'Thời gian'
      }
    },
    y: {
      display: true,
      title: {
        display: false,
        text: 'Số tiền'
      },
      beginAtZero: true,
      ticks: {
        stepSize: 100000,
        callback: function(value) {if (value % 1 === 0) {return convertNumberToVND(value);}}
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      intersect: true,
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || ''

          console.log(context)

          if (label) {
            label += ': '
          }

          if (context.parsed.y !== null) {
            switch (label) {
              case 'Doanh thu: ':
                label += convertNumberToVND(context.parsed.y)

                break
              case 'Số lịch hẹn: ':
                label += context.parsed.y

                break
              case 'Doanh thu mỗi lịch hẹn: ':
                label += convertNumberToVND(context.parsed.y)

                break
              case 'Tổng giá trị bị hủy: ':
                label += convertNumberToVND(context.parsed.y)

                break
              case 'Lịch hẹn bị hủy: ':
                label += context.parsed.y

                break
              case 'Doanh thu lịch hẹn hoàn thành: ':
                label += convertNumberToVND(context.parsed.y)

                break
              case 'Số lịch hẹn hoàn thành: ':
                label += context.parsed.y

                break

              default:
                break
            }
          }

          return label
        }
      }
    }
  }
}

export const options2 = {
  interaction: {
    mode: 'index',
    intersect: false
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      title: {
        display: true,
        text: 'Thời gian'
      }
    },
    y: {
      display: true,
      title: {
        display: false,
        text: 'Số lượng'
      },
      beginAtZero: true,
      ticks: {
        callback: function(value) {if (value % 1 === 0) {return value;}}
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      intersect: true,
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || ''

          console.log(context)

          if (label) {
            label += ': '
          }

          if (context.parsed.y !== null) {
            switch (label) {
              case 'Doanh thu: ':
                label += convertNumberToVND(context.parsed.y)

                break
              case 'Số lịch hẹn: ':
                label += context.parsed.y

                break
              case 'Doanh thu mỗi lịch hẹn: ':
                label += convertNumberToVND(context.parsed.y)

                break
              case 'Tổng giá trị bị hủy: ':
                label += convertNumberToVND(context.parsed.y)

                break
              case 'Lịch hẹn bị hủy: ':
                label += context.parsed.y

                break
              case 'Doanh thu lịch hẹn hoàn thành: ':
                label += convertNumberToVND(context.parsed.y)

                break
              case 'Số lịch hẹn hoàn thành: ':
                label += context.parsed.y

                break

              default:
                break
            }
          }

          return label
        }
      }
    }
  }
}

const AppointmentPerformance = props => {
  const { data, period, timeState } = props

  //States của các chỉ số

  const [placeGmv, setPlaceGmv] = useState(false)
  const [placeAppointment, setPlaceAppointment] = useState(false)
  const [placeSalesPerAppointment, setPlaceSalesPerAppointment] = useState(false)
  const [cancelledSales, setCancelledSales] = useState(false)
  const [cancelledAppointment, setCancelledAppointment] = useState(false)
  const [doneGmv, setDoneGmv] = useState(true)
  const [doneAppointment, setDoneAppointment] = useState(true)

  const handleClickCard = label => {
    switch (label) {
      case 'placeGmv':
        if (chartData.datasets.length == 1 && placeGmv === true) break
        if (placeGmv === true) {
          setPlaceGmv(false)
          break
        } else {
          setPlaceGmv(true)

          break
        }
      case 'placeAppointment':
        if (chartData2.datasets.length == 1 && placeAppointment === true) break
        if (placeAppointment === true) {
          setPlaceAppointment(false)

          break
        } else {
          setPlaceAppointment(true)

          break
        }
      case 'placeSalesPerAppointment':
        if (chartData.datasets.length == 1 && placeSalesPerAppointment === true) break
        if (placeSalesPerAppointment === true) {
          setPlaceSalesPerAppointment(false)

          break
        } else {
          setPlaceSalesPerAppointment(true)

          break
        }
      case 'cancelledSales':
        if (chartData.datasets.length == 1 && cancelledSales === true) break
        if (cancelledSales === true) {
          setCancelledSales(false)

          break
        } else {
          setCancelledSales(true)

          break
        }
      case 'cancelledAppointment':
        if (chartData2.datasets.length == 1 && cancelledAppointment === true) break
        if (cancelledAppointment === true) {
          setCancelledAppointment(false)

          break
        } else {
          setCancelledAppointment(true)

          break
        }
      case 'doneGmv':
        if (chartData.datasets.length == 1 && doneGmv === true) break
        if (doneGmv === true) {
          setDoneGmv(false)

          break
        } else {
          setDoneGmv(true)

          break
        }
      case 'doneAppointment':
        if (chartData2.datasets.length == 1 && doneAppointment === true) break
        if (doneAppointment === true) {
          setDoneAppointment(false)

          break
        } else {
          setDoneAppointment(true)

          break
        }

      default:
        break
    }
  }

  const [chartData, setChartData] = useState({
    labels: data?.placeGmv?.points?.map(item => format(fromUnixTime(item.timestamp / 1000), 'dd-MM-yyyy')),
    datasets: [
      {
        label: 'Doanh thu',
        data: data?.placeGmv?.points?.map(item => item.value),
        backgroundColor: '#4FB06D'
      }
    ]
  })

  const [chartData2, setChartData2] = useState({
    labels: data?.doneAppointment?.points?.map(item => format(fromUnixTime(item.timestamp / 1000), 'dd-MM-yyyy')),
    datasets: [
      {
        label: 'Số lịch hẹn hoàn thành',
        data: data?.doneAppointment?.points?.map(item => item.value),
        backgroundColor: '#BF2C34'
      }
    ]
  })

  useEffect(() => {
    console.log("data: ", data);
    if (data) {
      if (data.placeGmv) {
        let tempChartData = {
          // labels: data?.placeGmv?.points?.map(item => format(fromUnixTime(item.timestamp / 1000), 'dd-MM-yyyy')),
          datasets: []
        }

        let tempChartData2 = {
          // labels: data?.placeGmv?.points?.map(item => format(fromUnixTime(item.timestamp / 1000), 'dd-MM-yyyy')),
          datasets: []
        }

        if(period.value === "day") {
          tempChartData.labels = data?.placeGmv?.points?.map(item => format(fromUnixTime(item.timestamp / 1000), 'HH:mm'))
          tempChartData2.labels = data?.placeGmv?.points?.map(item => format(fromUnixTime(item.timestamp / 1000), 'HH:mm'))
        } else {
          tempChartData.labels = data?.placeGmv?.points?.map(item => format(fromUnixTime(item.timestamp / 1000), 'dd-MM-yyyy'))
          tempChartData2.labels = data?.placeGmv?.points?.map(item => format(fromUnixTime(item.timestamp / 1000), 'dd-MM-yyyy'))
        }

        if (placeGmv)
          tempChartData.datasets.push({
            label: 'Doanh thu',
            data: data?.placeGmv?.points?.map(item => item.value),
            backgroundColor: '#4FB06D'
          })

        if (placeAppointment)
          tempChartData2.datasets.push({
            label: 'Số lịch hẹn',
            data: data?.placeAppointment?.points?.map(item => item.value),
            backgroundColor: '#F07857'
          })

        if (placeSalesPerAppointment)
          tempChartData.datasets.push({
            label: 'Doanh thu mỗi lịch hẹn',
            data: data?.placeSalesPerAppointment?.points?.map(item => item.value),
            backgroundColor: '#F5C26B'
          })

        if (cancelledSales)
          tempChartData.datasets.push({
            label: 'Tổng giá trị bị hủy',
            data: data?.cancelledSales?.points?.map(item => item.value),
            backgroundColor: '#BE398D'
          })

        if (cancelledAppointment)
          tempChartData2.datasets.push({
            label: 'Lịch hẹn bị hủy',
            data: data?.cancelledAppointment?.points?.map(item => item.value),
            backgroundColor: '#407857'
          })

        if (doneGmv)
          tempChartData.datasets.push({
            label: 'Doanh thu lịch hẹn hoàn thành',
            data: data?.doneGmv?.points?.map(item => item.value),
            backgroundColor: '#5C62D6'
          })

        if (doneAppointment)
          tempChartData2.datasets.push({
            label: 'Số lịch hẹn hoàn thành',
            data: data?.doneAppointment?.points?.map(item => item.value),
            backgroundColor: '#BF2C34'
          })

        setChartData(tempChartData)
        setChartData2(tempChartData2)
      }
    }else {
      // setChartData()
      // setChartData2()
    }
  }, [
    data,
    timeState,
    period,
    placeGmv,
    placeAppointment,
    placeSalesPerAppointment,
    cancelledSales,
    cancelledAppointment,
    doneGmv,
    doneAppointment
  ])

  return (
    <>
      {data ? (
        <Box>
          <Box>
            <Paper style={{ overflowX: 'auto' }} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              {/* Doanh thu lịch hẹn hoàn thành */}
              <Card
                sx={
                  doneGmv
                    ? { borderTop: '5px solid #5C62D6', minWidth: '250px', flexShrink: 0, marginX: 4, marginY: 6 }
                    : { minWidth: '250px', flexShrink: 0, marginX: 4, marginY: 6 }
                }
              >
                <CardActionArea onClick={() => handleClickCard('doneGmv')}>
                  <CardContent>
                    <Box mb={4} sx={{ display: 'flex' }}>
                      <Typography variant='body1' my='auto'>
                        Doanh thu lịch hẹn hoàn thành
                      </Typography>
                      <MUITooltip placement='top' title='Tổng doanh thu của tất cả các lịch hẹn đã được hoàn thành'>
                        <IconButton my='auto'>
                          <HelpOutlineIcon sx={{ fontSize: '16px' }} />
                        </IconButton>
                      </MUITooltip>
                    </Box>
                    <Typography variant='h6'>{convertNumberToVND(data?.doneGmv?.value)}</Typography>
                    <Box mb={2} sx={{ display: 'flex' }}>
                      {data?.doneGmv?.increment < 0 && (
                        <ChevronDown my='auto' sx={{ color: 'error.main', fontWeight: 600 }} />
                      )}
                      {data?.doneGmv?.increment > 0 && (
                        <ChevronUp my='auto' sx={{ color: 'success.main', fontWeight: 600 }} />
                      )}
                      <Typography
                        my='auto'
                        variant='caption'
                        color={
                          (data?.doneGmv?.increment < 0 && 'error.main') ||
                          (data?.doneGmv?.increment > 0 && 'success.main') ||
                          'black'
                        }
                      >
                        {convertNumberToVND(Math.abs(data?.doneGmv?.increment))}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant='caption'>
                        {(period.value == 'day' && 'so với hôm qua') ||
                          (period.value == 'week' && 'so với tuần trước') ||
                          (period.value == 'month' && 'so với tháng trước')}
                      </Typography>
                      <Box sx={{ display: 'flex' }}>
                        {data?.doneGmv?.increment < 0 && (
                          <ChevronDown my='auto' sx={{ color: 'error.main', fontWeight: 600 }} />
                        )}
                        {data?.doneGmv?.increment > 0 && (
                          <ChevronUp my='auto' sx={{ color: 'success.main', fontWeight: 600 }} />
                        )}
                        <Typography
                          my='auto'
                          variant='caption'
                          color={
                            (data?.doneGmv?.increment < 0 && 'error.main') ||
                            (data?.doneGmv?.increment > 0 && 'success.main') ||
                            'black'
                          }
                        >
                          {Math.abs(data?.doneGmv?.chainRatio * 100).toFixed(2) + '%'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
              {/* ====================================================== */}
              {/* Doanh thu */}
              <Card
                sx={
                  placeGmv
                    ? { borderTop: '5px solid #4FB06D', minWidth: '250px', flexShrink: 0, marginX: 4, marginY: 6 }
                    : { minWidth: '250px', flexShrink: 0, marginX: 4, marginY: 6 }
                }
              >
                <CardActionArea onClick={() => handleClickCard('placeGmv')}>
                  <CardContent>
                    <Box mb={4} sx={{ display: 'flex' }}>
                      <Typography variant='body1' my='auto'>
                        Doanh thu
                      </Typography>
                      <MUITooltip
                        placement='top'
                        title='Doanh thu các lịch hẹn đã đặt (bao gồm cả những lịch hẹn bị hủy, chưa thực hiện,....)'
                      >
                        <IconButton my='auto'>
                          <HelpOutlineIcon sx={{ fontSize: '16px' }} />
                        </IconButton>
                      </MUITooltip>
                    </Box>
                    <Typography variant='h6'>{convertNumberToVND(data?.placeGmv?.value)}</Typography>
                    <Box mb={2} sx={{ display: 'flex' }}>
                      {data?.placeGmv?.increment < 0 && (
                        <ChevronDown my='auto' sx={{ color: 'error.main', fontWeight: 600 }} />
                      )}
                      {data?.placeGmv?.increment > 0 && (
                        <ChevronUp my='auto' sx={{ color: 'success.main', fontWeight: 600 }} />
                      )}
                      <Typography
                        my='auto'
                        variant='caption'
                        color={
                          (data?.placeGmv?.increment < 0 && 'error.main') ||
                          (data?.placeGmv?.increment > 0 && 'success.main') ||
                          'black'
                        }
                      >
                        {convertNumberToVND(Math.abs(data?.placeGmv?.increment))}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant='caption'>
                        {(period.value == 'day' && 'so với hôm qua') ||
                          (period.value == 'week' && 'so với tuần trước') ||
                          (period.value == 'month' && 'so với tháng trước')}
                      </Typography>
                      <Box sx={{ display: 'flex' }}>
                        {data?.placeGmv?.increment < 0 && (
                          <ChevronDown my='auto' sx={{ color: 'error.main', fontWeight: 600 }} />
                        )}
                        {data?.placeGmv?.increment > 0 && (
                          <ChevronUp my='auto' sx={{ color: 'success.main', fontWeight: 600 }} />
                        )}
                        <Typography
                          my='auto'
                          variant='caption'
                          color={
                            (data?.placeGmv?.increment < 0 && 'error.main') ||
                            (data?.placeGmv?.increment > 0 && 'success.main') ||
                            'black'
                          }
                        >
                          {Math.abs(data?.placeGmv?.chainRatio * 100).toFixed(2) + '%'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
              {/* ====================================================== */}
              {/* Doanh thu trên mỗi lịch hẹn */}
              <Card
                sx={
                  placeSalesPerAppointment
                    ? { borderTop: '5px solid #F5C26B', minWidth: '250px', flexShrink: 0, marginX: 4, marginY: 6 }
                    : { minWidth: '250px', flexShrink: 0, marginX: 4, marginY: 6 }
                }
              >
                <CardActionArea onClick={() => handleClickCard('placeSalesPerAppointment')}>
                  <CardContent>
                    <Box mb={4} sx={{ display: 'flex' }}>
                      <Typography variant='body1' my='auto'>
                        Doanh thu mỗi lịch hẹn
                      </Typography>
                      <MUITooltip
                        placement='top'
                        title='Doanh thu trung bình của mỗi lịch hẹn (được tính bằng cách lấy tổng doanh thu chia đều cho tổng số lịch hẹn)'
                      >
                        <IconButton my='auto'>
                          <HelpOutlineIcon sx={{ fontSize: '16px' }} />
                        </IconButton>
                      </MUITooltip>
                    </Box>
                    <Typography variant='h6'>{convertNumberToVND(data?.placeSalesPerAppointment?.value)}</Typography>
                    <Box mb={2} sx={{ display: 'flex' }}>
                      {data?.placeSalesPerAppointment?.increment < 0 && (
                        <ChevronDown my='auto' sx={{ color: 'error.main', fontWeight: 600 }} />
                      )}
                      {data?.placeSalesPerAppointment?.increment > 0 && (
                        <ChevronUp my='auto' sx={{ color: 'success.main', fontWeight: 600 }} />
                      )}
                      <Typography
                        my='auto'
                        variant='caption'
                        color={
                          (data?.placeSalesPerAppointment?.increment < 0 && 'error.main') ||
                          (data?.placeSalesPerAppointment?.increment > 0 && 'success.main') ||
                          'black'
                        }
                      >
                        {convertNumberToVND(Math.abs(data?.placeSalesPerAppointment?.increment))}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant='caption'>
                        {(period.value == 'day' && 'so với hôm qua') ||
                          (period.value == 'week' && 'so với tuần trước') ||
                          (period.value == 'month' && 'so với tháng trước')}
                      </Typography>
                      <Box sx={{ display: 'flex' }}>
                        {data?.placeSalesPerAppointment?.increment < 0 && (
                          <ChevronDown my='auto' sx={{ color: 'error.main', fontWeight: 600 }} />
                        )}
                        {data?.placeSalesPerAppointment?.increment > 0 && (
                          <ChevronUp my='auto' sx={{ color: 'success.main', fontWeight: 600 }} />
                        )}
                        <Typography
                          my='auto'
                          variant='caption'
                          color={
                            (data?.placeSalesPerAppointment?.increment < 0 && 'error.main') ||
                            (data?.placeSalesPerAppointment?.increment > 0 && 'success.main') ||
                            'black'
                          }
                        >
                          {Math.abs(data?.placeSalesPerAppointment?.chainRatio * 100).toFixed(2) + '%'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
              {/* ====================================================== */}
              {/* Tổng giá trị lịch hẹn đã hủy */}
              <Card
                sx={
                  cancelledSales
                    ? { borderTop: '5px solid #BE398D', minWidth: '250px', flexShrink: 0, marginX: 4, marginY: 6 }
                    : { minWidth: '250px', flexShrink: 0, marginX: 4, marginY: 6 }
                }
              >
                <CardActionArea onClick={() => handleClickCard('cancelledSales')}>
                  <CardContent>
                    <Box mb={4} sx={{ display: 'flex' }}>
                      <Typography variant='body1' my='auto'>
                        Tổng giá trị bị hủy
                      </Typography>
                      <MUITooltip
                        placement='top'
                        title='Tổng giá trị của tất cả các dịch vụ thuộc những lịch hẹn đã bị hủy'
                      >
                        <IconButton my='auto'>
                          <HelpOutlineIcon sx={{ fontSize: '16px' }} />
                        </IconButton>
                      </MUITooltip>
                    </Box>
                    <Typography variant='h6'>{convertNumberToVND(data?.cancelledSales?.value)}</Typography>
                    <Box mb={2} sx={{ display: 'flex' }}>
                      {data?.cancelledSales?.increment < 0 && (
                        <ChevronDown my='auto' sx={{ color: 'error.main', fontWeight: 600 }} />
                      )}
                      {data?.cancelledSales?.increment > 0 && (
                        <ChevronUp my='auto' sx={{ color: 'success.main', fontWeight: 600 }} />
                      )}
                      <Typography
                        my='auto'
                        variant='caption'
                        color={
                          (data?.cancelledSales?.increment < 0 && 'error.main') ||
                          (data?.cancelledSales?.increment > 0 && 'success.main') ||
                          'black'
                        }
                      >
                        {convertNumberToVND(Math.abs(data?.cancelledSales?.increment))}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant='caption'>
                        {(period.value == 'day' && 'so với hôm qua') ||
                          (period.value == 'week' && 'so với tuần trước') ||
                          (period.value == 'month' && 'so với tháng trước')}
                      </Typography>
                      <Box sx={{ display: 'flex' }}>
                        {data?.cancelledSales?.increment < 0 && (
                          <ChevronDown my='auto' sx={{ color: 'error.main', fontWeight: 600 }} />
                        )}
                        {data?.cancelledSales?.increment > 0 && (
                          <ChevronUp my='auto' sx={{ color: 'success.main', fontWeight: 600 }} />
                        )}
                        <Typography
                          my='auto'
                          variant='caption'
                          color={
                            (data?.cancelledSales?.increment < 0 && 'error.main') ||
                            (data?.cancelledSales?.increment > 0 && 'success.main') ||
                            'black'
                          }
                        >
                          {Math.abs(data?.cancelledSales?.chainRatio * 100).toFixed(2) + '%'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
              {/* ====================================================== */}
              
            </Paper>
          </Box>
          <Box mt={6}>
            <div style={{ height: '300px', width: '100%' }}>
              <Line options={options} data={chartData} />
            </div>
          </Box>
          <Box>
            <Paper style={{ overflowX: 'auto' }} sx={{ display: 'flex' }}>
              {/* Số lịch hẹn hoàn thành */}
              <Card
                sx={
                  doneAppointment
                    ? { borderTop: '5px solid #BF2C34', minWidth: '250px', flexShrink: 0, marginX: 4, marginY: 6, ml: 'auto' }
                    : { minWidth: '250px', flexShrink: 0, marginX: 4, marginY: 6, ml: 'auto' }
                }
              >
                <CardActionArea onClick={() => handleClickCard('doneAppointment')}>
                  <CardContent>
                    <Box mb={4} sx={{ display: 'flex' }}>
                      <Typography variant='body1' my='auto'>
                        Số lịch hẹn hoàn thành
                      </Typography>
                      <MUITooltip placement='top' title='Tổng số tất cả các lịch hẹn đã được hoàn thành'>
                        <IconButton my='auto'>
                          <HelpOutlineIcon sx={{ fontSize: '16px' }} />
                        </IconButton>
                      </MUITooltip>
                    </Box>
                    <Typography variant='h6'>{data?.doneAppointment?.value}</Typography>
                    <Box mb={2} sx={{ display: 'flex' }}>
                      {data?.doneAppointment?.increment < 0 && (
                        <ChevronDown my='auto' sx={{ color: 'error.main', fontWeight: 600 }} />
                      )}
                      {data?.doneAppointment?.increment > 0 && (
                        <ChevronUp my='auto' sx={{ color: 'success.main', fontWeight: 600 }} />
                      )}
                      <Typography
                        my='auto'
                        variant='caption'
                        color={
                          (data?.doneAppointment?.increment < 0 && 'error.main') ||
                          (data?.doneAppointment?.increment > 0 && 'success.main') ||
                          'black'
                        }
                      >
                        {Math.abs(data?.doneAppointment?.increment)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant='caption'>
                        {(period.value == 'day' && 'so với hôm qua') ||
                          (period.value == 'week' && 'so với tuần trước') ||
                          (period.value == 'month' && 'so với tháng trước')}
                      </Typography>
                      <Box sx={{ display: 'flex' }}>
                        {data?.doneAppointment?.increment < 0 && (
                          <ChevronDown my='auto' sx={{ color: 'error.main', fontWeight: 600 }} />
                        )}
                        {data?.doneAppointment?.increment > 0 && (
                          <ChevronUp my='auto' sx={{ color: 'success.main', fontWeight: 600 }} />
                        )}
                        <Typography
                          my='auto'
                          variant='caption'
                          color={
                            (data?.doneAppointment?.increment < 0 && 'error.main') ||
                            (data?.doneAppointment?.increment > 0 && 'success.main') ||
                            'black'
                          }
                        >
                          {Math.abs(data?.doneAppointment?.chainRatio * 100).toFixed(2) + '%'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
              {/* ====================================================== */}
              {/* Tổng lịch hẹn */}
              <Card
                sx={
                  placeAppointment
                    ? { borderTop: '5px solid #F07857', minWidth: '250px', flexShrink: 0, marginX: 4, marginY: 6 }
                    : { minWidth: '250px', flexShrink: 0, marginX: 4, marginY: 6 }
                }
              >
                <CardActionArea onClick={() => handleClickCard('placeAppointment')}>
                  <CardContent>
                    <Box mb={4} sx={{ display: 'flex' }}>
                      <Typography variant='body1' my='auto'>
                        Số lịch hẹn
                      </Typography>
                      <MUITooltip placement='top' title='Tổng tất cả các lịch hẹn (bao gồm cả các lịch hẹn đã bị hủy)'>
                        <IconButton my='auto'>
                          <HelpOutlineIcon sx={{ fontSize: '16px' }} />
                        </IconButton>
                      </MUITooltip>
                    </Box>
                    <Typography variant='h6'>{data?.placeAppointment?.value}</Typography>
                    <Box mb={2} sx={{ display: 'flex' }}>
                      {data?.placeAppointment?.increment < 0 && (
                        <ChevronDown my='auto' sx={{ color: 'error.main', fontWeight: 600 }} />
                      )}
                      {data?.placeAppointment?.increment > 0 && (
                        <ChevronUp my='auto' sx={{ color: 'success.main', fontWeight: 600 }} />
                      )}
                      <Typography
                        my='auto'
                        variant='caption'
                        color={
                          (data?.placeAppointment?.increment < 0 && 'error.main') ||
                          (data?.placeAppointment?.increment > 0 && 'success.main') ||
                          'black'
                        }
                      >
                        {Math.abs(data?.placeAppointment?.increment)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant='caption'>
                        {(period.value == 'day' && 'so với hôm qua') ||
                          (period.value == 'week' && 'so với tuần trước') ||
                          (period.value == 'month' && 'so với tháng trước')}
                      </Typography>
                      <Box sx={{ display: 'flex' }}>
                        {data?.placeAppointment?.increment < 0 && (
                          <ChevronDown my='auto' sx={{ color: 'error.main', fontWeight: 600 }} />
                        )}
                        {data?.placeAppointment?.increment > 0 && (
                          <ChevronUp my='auto' sx={{ color: 'success.main', fontWeight: 600 }} />
                        )}
                        <Typography
                          my='auto'
                          variant='caption'
                          color={
                            (data?.placeAppointment?.increment < 0 && 'error.main') ||
                            (data?.placeAppointment?.increment > 0 && 'success.main') ||
                            'black'
                          }
                        >
                          {Math.abs(data?.placeAppointment?.chainRatio * 100).toFixed(2) + '%'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
              {/* ====================================================== */}
              {/* Lịch hẹn bị hủy */}
              <Card
                sx={
                  cancelledAppointment
                    ? { borderTop: '5px solid #407857', minWidth: '250px', flexShrink: 0, marginX: 4, marginY: 6, mr: 'auto' }
                    : { minWidth: '250px', flexShrink: 0, marginX: 4, marginY: 6, mr: 'auto' }
                }
              >
                <CardActionArea onClick={() => handleClickCard('cancelledAppointment')}>
                  <CardContent>
                    <Box mb={4} sx={{ display: 'flex' }}>
                      <Typography variant='body1' my='auto'>
                        Lịch hẹn bị hủy
                      </Typography>
                      <MUITooltip
                        placement='top'
                        title='Tổng tất các lịch hẹn đã phải hủy vì nhiều lý do khác nhau (khách đến muộn, đổi ý,...)'
                      >
                        <IconButton my='auto'>
                          <HelpOutlineIcon sx={{ fontSize: '16px' }} />
                        </IconButton>
                      </MUITooltip>
                    </Box>
                    <Typography variant='h6'>{data?.cancelledAppointment?.value}</Typography>
                    <Box mb={2} sx={{ display: 'flex' }}>
                      {data?.cancelledAppointment?.increment < 0 && (
                        <ChevronDown my='auto' sx={{ color: 'error.main', fontWeight: 600 }} />
                      )}
                      {data?.cancelledAppointment?.increment > 0 && (
                        <ChevronUp my='auto' sx={{ color: 'success.main', fontWeight: 600 }} />
                      )}
                      <Typography
                        my='auto'
                        variant='caption'
                        color={
                          (data?.cancelledAppointment?.increment < 0 && 'error.main') ||
                          (data?.cancelledAppointment?.increment > 0 && 'success.main') ||
                          'black'
                        }
                      >
                        {Math.abs(data?.cancelledAppointment?.increment)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant='caption'>
                        {(period.value == 'day' && 'so với hôm qua') ||
                          (period.value == 'week' && 'so với tuần trước') ||
                          (period.value == 'month' && 'so với tháng trước')}
                      </Typography>
                      <Box sx={{ display: 'flex' }}>
                        {data?.cancelledAppointment?.increment < 0 && (
                          <ChevronDown my='auto' sx={{ color: 'error.main', fontWeight: 600 }} />
                        )}
                        {data?.cancelledAppointment?.increment > 0 && (
                          <ChevronUp my='auto' sx={{ color: 'success.main', fontWeight: 600 }} />
                        )}
                        <Typography
                          my='auto'
                          variant='caption'
                          color={
                            (data?.cancelledAppointment?.increment < 0 && 'error.main') ||
                            (data?.cancelledAppointment?.increment > 0 && 'success.main') ||
                            'black'
                          }
                        >
                          {Math.abs(data?.cancelledAppointment?.chainRatio * 100).toFixed(2) + '%'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
              {/* ====================================================== */}
              
            </Paper>
          </Box>
          <Box mt={6}>
            <div style={{ height: '300px', width: '100%' }}>
              <Line options={options2} data={chartData2} />
            </div>
          </Box>
        </Box>
      ) : (
        <Typography>Không có dữ liệu</Typography>
      )}
    </>
  )
}

export default AppointmentPerformance
