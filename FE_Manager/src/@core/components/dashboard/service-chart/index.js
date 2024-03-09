import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { useState } from 'react'
import { useEffect } from 'react'
import { getRevenueReport } from 'src/api/dashboard/dashboardApi'
import { Box, FormControl, MenuItem, Select, Typography } from '@mui/material'
import { CHART_COLORS } from 'public/chartColors'
import { convertNumberToVND } from '../../../../utils/currencyUtils'

ChartJS.register(CategoryScale, LinearScale, ArcElement, Tooltip, Legend)

export function ServiceChart(props) {
  const { startTime, endTime, branchId } = props

  const [listData, setListData] = useState([
    {
      serviceName: '',
      totalCompletedApptService: 0,
      total: 0,
      totalPayAmount: 0
    }
  ])
  const [listLabel, setListLabel] = useState()

  const sortOptionsList = [
    {
      id: 'totalPayAmount',
      name: 'Doanh thu'
    },
    {
      id: 'totalCompletedApptService',
      name: 'Lượt phục vụ'
    }
  ]

  const [currentSortOption, setCurrentSortOption] = useState('totalPayAmount')

  function compare(a, b) {
    if (a[currentSortOption] < b[currentSortOption]) {
      return 1
    }
    if (a[currentSortOption] > b[currentSortOption]) {
      return -1
    }

    return 0
  }

  const handleChange = e => {
    setCurrentSortOption(e.target.value)
  }

  const callApiGetRevenueReport = async () => {
    const data = await getRevenueReport(startTime, endTime, branchId)
    if (!data) return
    if (!data.data) return
    let temp = []
    temp = data.data

    // setListData(tempList)

    // let temp = [...listData]
    temp.sort(compare)
    setListData(temp)

    let tempPayAmountData = []
    let tempCompletedServiceData = []
    temp.forEach(item => {
      // tempPayAmountData.push(convertNumberToVND(item.totalPayAmount))
      tempPayAmountData.push(item.totalPayAmount)
      tempCompletedServiceData.push(item.totalCompletedApptService)
    })
    setTotalPayAmountData(tempPayAmountData)
    setTotalCompletedApptServiceData(tempCompletedServiceData)
  }

  const currencyFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  })

  // Handle chart data

  const [totalPayAmountData, setTotalPayAmountData] = useState([])
  const [totalCompletedApptServiceData, setTotalCompletedApptServiceData] = useState([])

  useEffect(() => {
    callApiGetRevenueReport()
  }, [])

  useEffect(() => {
    callApiGetRevenueReport()

  }, [startTime, endTime, branchId, currentSortOption])

  useEffect(() => {
    if (listData) {
      let tempListLabel = listData.map(item => {
        return item.serviceName
      })
      setListLabel(tempListLabel)
    }
  }, [listData])

  const totalPayData = {
    responsive: true,
    maintainAspectRatio: false,
    labels: listLabel,
    datasets: [
      {
        label: 'Doanh thu',
        data: totalPayAmountData,
        backgroundColor: CHART_COLORS,
        borderWidth: 1
      }
    ]
  }

  const totalCompletedData = {
    responsive: true,
    maintainAspectRatio: false,
    labels: listLabel,
    datasets: [
      {
        label: 'Lượt phục vụ',
        data: totalCompletedApptServiceData,
        backgroundColor: CHART_COLORS,
        borderWidth: 1
      }
    ]
  }

  const options = {
    plugins: {
      legend: {
        align: 'right',
        position: 'bottom',
        verticalAlign: 'top',
        layout: 'horizontal',
        floating: true,
        useHTML: true,
        symbolWidth: 0,
        width: 400,
        y: 80,
        itemMarginTop: 5,
        itemMarginBottom: 5,
        itemStyle: {
          width: 200,
          font: 'Helvetica Neue'
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || ''

            if(context.parsed) {
              label += `: ${convertNumberToVND(context.parsed)}`
            }

            let sum = 0
            context.dataset.data.map((item) => {
              sum += item
            })

            label += ` (${(context.parsed / sum * 100).toFixed(2)} %)`

            return label
          }
        }
      }
    },
    responsive: true,
    maintainAspectRatio: true
  }

  return (
    <Box>
      {listData.length !== 0 ? (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Typography mr={3} my='auto'>
              Hiển thị theo:
            </Typography>
            <FormControl>
              <Select
                size='small'
                value={currentSortOption}
                defaultValue={currentSortOption}
                onChange={e => handleChange(e)}
              >
                {sortOptionsList?.map((item, key) => {
                  return (
                    <MenuItem key={key} value={item.id}>
                      {item.name}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ height: 440, display: 'flex', justifyContent: 'center' }}>
            {currentSortOption === 'totalPayAmount' ? (
              <Doughnut data={totalPayData} options={options} />
            ) : (
              <Doughnut data={totalCompletedData} options={options} />
            )}
          </Box>
        </Box>
      ) : (
        <Typography>Không có dữ liệu</Typography>
      )}
    </Box>
  )
}
