import {Divider, FormControl, MenuItem, Select, Typography} from '@mui/material'
import {Box} from '@mui/system'
import {useEffect, useState} from 'react'
import {getRevenueReport} from 'src/api/dashboard/dashboardApi'

const RevenueByServiceList = props => {
  const {startTime, endTime, branchId} = props

  const [listData, setListData] = useState([
    {
      serviceName: '',
      totalCompletedApptService: 0,
      total: 0,
      totalPayAmount: 0
    }
  ])

  const [payAmountSum, setPayAmountSum] = useState(0)

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

  const calculatePayAmountSum = () => {
    var sum = 0
    if (listData) {
      listData.map((item, key) => {
        sum += item.totalPayAmount
      })
    }

    return sum
  }

  useEffect(() => {
    callApiGetRevenueReport()
    setPayAmountSum(calculatePayAmountSum())
  }, [])

  useEffect(() => {
    callApiGetRevenueReport()
    setPayAmountSum(calculatePayAmountSum())
  }, [startTime, endTime, branchId, currentSortOption])

  const callApiGetRevenueReport = async () => {
    const data = await getRevenueReport(startTime, endTime, branchId)
    if (!data) return
    if (!data.data) return
    let tempList = [];
    tempList = data.data
    tempList.sort(compare)
    console.log("Doanh thu theo dich vu: ", tempList);
    setListData(tempList)
  }

  const currencyFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  })

  return (
    <Box mb={3} sx={{height: 450}}>
      {listData.length !== 0 ? (
        <>
          <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
            <Typography mr={3} my='auto'>
              Sắp xếp theo
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
          {listData.map((item, key) => {
            if (key <= 4) {
              return (
                <Box
                  key={key}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    ...(key !== listData.length - 1 ? {mb: 5.875} : {})
                  }}
                >
                  <Box mr={3} sx={{width: 20, textAlign: 'center'}}>
                    <Typography variant='h5'>{key + 1}</Typography>
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Box sx={{marginRight: 2, display: 'flex', flexDirection: 'column'}}>
                      <Typography variant='body2' sx={{lineHeight: 1.5}}>
                        {item.serviceName}
                      </Typography>
                      <Box sx={{display: 'flex'}}>
                        <Typography sx={{mr: 0.5, fontWeight: 600, letterSpacing: '0.25px', color: 'red'}}>
                          {currencyFormatter.format(Math.floor(item.totalPayAmount))}
                        </Typography>
                        <Box sx={{display: 'flex', alignItems: 'center'}}></Box>
                      </Box>
                    </Box>

                    <Box sx={{display: 'flex', textAlign: 'end', flexDirection: 'column'}}>
                      <Typography
                        sx={{fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.72, letterSpacing: '0.22px'}}
                      >
                        {item.totalCompletedApptService}
                      </Typography>
                      <Typography variant='caption' sx={{lineHeight: 1.5}}>
                        Lượt phục vụ
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )
            } else {
              return <></>
            }
          })}
          <Box>
            <Typography variant='h5'>Tổng doanh thu: {currencyFormatter.format(Math.floor(payAmountSum))}</Typography>
          </Box>
        </>
      ) : (
        <Typography>Không có dữ liệu</Typography>
      )}
    </Box>
  )
}

export default RevenueByServiceList
