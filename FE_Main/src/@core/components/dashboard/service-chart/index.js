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
    let tempList = []
    tempList = data.data
    setListData(tempList)
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
    let temp = [...listData]
    temp.sort(compare)
    setListData(temp)
    let tempPayAmountData = []
    let tempCompletedServiceData = []
    temp.forEach(item => {
      tempPayAmountData.push(item.totalPayAmount)
      tempCompletedServiceData.push(item.totalCompletedApptService)
    })
    setTotalPayAmountData(tempPayAmountData)
    setTotalCompletedApptServiceData(tempCompletedServiceData)
  }, [])

  useEffect(() => {
    callApiGetRevenueReport()
    let temp = [...listData]
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
    console.log(tempPayAmountData)
    console.log(tempCompletedServiceData)
  }, [startTime, endTime, branchId, currentSortOption])

  const totalPayData = {
    responsive: true,
    maintainAspectRatio: false,
    labels: listData?.map(item => item.serviceName),
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
    labels: listData?.map(item => item.serviceName),
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
        position: 'right'
      }
    },
    responsive: true,
    maintainAspectRatio: true,
    datalabels: {
      formatter: value => {
        let sum = 0
        let dataArr = []
        if (currentSortOption === 'totalPayAmount') {
          dataArr = [...totalPayData]
        } else {
          dataArr = [...totalCompletedData]
        }
        dataArr.map(data => {
          sum += data
        })
        let percentage = ((value * 100) / sum).toFixed(2) + '%'

        return percentage
      },
      color: '#FFFFFF'
    }
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
