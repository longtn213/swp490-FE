import { useState, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { Button, TextField, Box, IconButton, Tooltip, Drawer, FormControl, InputLabel, Select } from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import DotsVertical from 'mdi-material-ui/DotsVertical'

//Component import
import DataTable from '../../../component/table/dataTable'
import DialogSCAAnswer from '../../../component/dialog/dialogViewAnswers'

//API import
import { getAllSCAs } from '../../../api/feedback/feedbackApi'
import { filterfeedback } from 'src/api/feedback/feedbackApi'
import { callApiGetProfile, isAccessible } from 'src/api/auth/authApi'

const ManageFeedbackAdmin = () => {
  const router = useRouter()

  // Page Authorization
  useEffect(() => {
    callApiGetProfile()

    if (!isAccessible('SSDS_P_SCA_ANSWER')) {
      router.push('/')
    }
  }, [router.asPath])
  
  //====================================================================================
  //PAGINATION HANDLING
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(500)
  const [count, setCount] = useState(0)
  const [scaList, setScaList] = useState([])
  const [fullList, setFullList] = useState([])

  const [openAnswer, setOpenAnswer] = useState(false)
  const [answerSet, setAnswerSet] = useState({})
  const [scaId, setScaId] = useState(-1)

  const listTableCellHead = [
    {
      name: 'Mã tư vấn'
    },
    {
      name: 'Khách hàng',
      genFormSearch: () => {
        return (
          <TextField
            id='outlined-search'
            type='search'
            size='small'
            sx={{ width: 150 }}
            name='customername'
            onChange={onChangeTextAndSelectField}

            //value={name.value}
          />
        )
      }
    },
    {
      name: 'Tư vấn viên',
      genFormSearch: () => {
        return (
          <TextField
            id='outlined-search'
            type='search'
            size='small'
            sx={{ width: 150 }}
            name='repliedBy'
            onChange={onChangeTextAndSelectField}

            //value={name.value}
          />
        )
      }
    },
    {
      name: 'Trạng thái tư vấn',
      genFormSearch: () => {
        return (
          <FormControl>
            <InputLabel id='status-select-label'>Trạng thái</InputLabel>
            <Select
              labelId='status-select-label'
              id='demo-simple-select'
              label='Trạng thái'
              name='status'
              size='small'
              value={status.value}
              onChange={onChangeTextAndSelectField}
              sx={{ width: 250 }}
            >
              {listStatusCodes &&
                listStatusCodes.length > 0 &&
                listStatusCodes.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item?.code}>
                      {item?.name}
                    </MenuItem>
                  )
                })}
            </Select>
          </FormControl>
        )
      }
    },
    {
      name: 'Nội dung tư vấn'
    }
  ]

  const listTableCellName = ['id', 'customer', 'repliedBy', 'status', 'comment']

  const [listTableCellSort, setListTableCellSort] = useState([
    {
      name: 'Mã tư vấn',
      havingSortIcon: false,
      sortBy: 'id',
      sortDirection: ''
    },
    {
      name: 'Khách hàng',
      havingSortIcon: false,
      sortBy: 'customer',
      sortDirection: ''
    },
    {
      name: 'Tư vấn viên',
      havingSortIcon: false,
      sortBy: 'repliedBy',
      sortDirection: ''
    },
    {
      name: 'Trạng thái tư vấn',
      havingSortIcon: false,
      sortBy: 'status',
      sortDirection: ''
    },
    {
      name: 'Nội dung tư vấn',
      havingSortIcon: false,
      sortBy: 'comment',
      sortDirection: ''
    }
  ])

  //cho các trường chỉ search theo free-text và select giá trị
  const onChangeTextAndSelectField = e => {
    e.preventDefault()
    console.log(listStatusCodes)
    setQueryParam({
      ...queryParam,
      [`${e.target.name}`]: { ...queryParam[`${e.target.name}`], ['value']: e.target.value }
    })

    if (e.target.name == 'status') {
      setSortInfo({ ...sortInfo, statusCode: e.target.value })
      console.log(e.target.value)
      callFilter()
    }

    if (e.target.name == 'customername') {
      scaList.forEach(el =>
        console.log(
          el.customer.toLowerCase() +
            ' ' +
            e.target.value.toLowerCase() +
            ' ' +
            el.customer.toLowerCase().indexOf(e.target.value.toLowerCase())
        )
      )

      setScaList(fullList.filter(el => el.customer.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1))
    }

    if (e.target.name == 'repliedBy') {
      scaList.forEach(el =>
        console.log(
          el.repliedBy.toLowerCase() +
            ' ' +
            e.target.value.toLowerCase() +
            ' ' +
            el.repliedBy.toLowerCase().indexOf(e.target.value.toLowerCase())
        )
      )

      setScaList(fullList.filter(el => el.repliedBy.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1))
    }
  }

  const [sortInfo, setSortInfo] = useState({
    sortBy: 'createdDate',
    sortDirection: 'asc',
    index: 0,
    statusCode: 'WAITING_FOR_RESULT'
  })

  const onChangeSort = (sortBy, sortDirection, index, statusCode) => {
    let tempSortDirect = ''
    if (!sortDirection) {
      tempSortDirect = 'asc'
    }
    if (sortDirection == 'asc') {
      tempSortDirect = 'desc'
    }
    if (sortDirection == 'desc') {
      tempSortDirect = ''
    }

    setSortInfo({
      sortBy: sortBy,
      sortDirection: tempSortDirect,
      index: index,
      statusCode: statusCode
    })
  }

  useEffect(() => {
    callFilter()
    const tempLst = []
    listTableCellSort.forEach(item => {
      let tempItem = { ...item, ['sortDirection']: '' }
      tempLst.push(tempItem)
    })
    tempLst[sortInfo.index] = { ...listTableCellSort[sortInfo.index], ['sortDirection']: sortInfo.sortDirection }
    setListTableCellSort(tempLst)
  }, [sortInfo])

  const callFilterFromProps = (pageProp, sizeProp) => {
    callFilter(pageProp, sizeProp)
  }

  const toggleDialog = props => {
    setOpenAnswer(props)
  }

  const proceedToCommentPage = scaId => {
    console.log(scaId)
    router.push({
      pathname: 'feedback/comment',
      query: { id: scaId }
    })
  }

  const getStatusFeedback = () => {
    const tempLst = []

    tempLst.push({
      code: 'WAITING_FOR_RESULT',
      name: 'Chưa trả lời'
    })
    tempLst.push({
      code: 'DONE_ANSWER',
      name: 'Đã trả lời'
    })
    setListStatusCodes(tempLst)
  }

  const [listStatusCodes, setListStatusCodes] = useState([])

  const callGetListStatusCodes = async () => {
    const data = await getAllSCAs()
    if (!data) return
    if (!data.data) return
    const tempLst = []
    data.data.forEach(element => {
      tempLst.push({
        code: element.status.code,
        name: element.status.name
      })
      console.log(element.status.code)
    })
    setListStatusCodes(tempLst)
  }

  const getAll = async () => {
    const data = await getAllSCAs()
    console.log(data)
    if (!data) return
    if (!data.data) return
    if (data.data && data.data.length > 0) {
      const newData = data.data.map(el =>
        el.repliedBy && el.repliedBy.fullName
          ? Object.assign({}, el, {
              ...el,
              status: el.status.name,
              customer: el.customer.fullName,
              repliedBy: el.repliedBy.fullName
            })
          : Object.assign({}, el, {
              ...el,
              status: el.status.name,
              customer: el.customer.fullName,
              repliedBy: el.repliedBy !== null ? el.repliedBy.fullName : ''
            })
      )
      setScaList(newData)
    }
  }

  const defaultQueryParam = {
    customer: {
      value: '',
      operator: 'contains'
    },
    repliedBy: {
      value: '',
      operator: 'contains'
    },
    status: {
      value: '',
      operator: 'in'
    },
    comment: {
      value: '',
      operator: 'contains'
    }
  }

  const [queryParam, setQueryParam] = useState(defaultQueryParam)

  const { customer, repliedBy, status, comment } = queryParam

  const callFilter = async () => {
    const data = await filterfeedback(queryParam ? queryParam : defaultQueryParam, page, size, sortInfo)
    console.log(data)
    if (!data) return
    if (data.meta.code != 200) {
      setError(data.meta.message)
      setOpenError(true)

      return
    }
    if (!data.data) return
    setCount(data.meta.total)

    const tempList = data.data.map(el =>
      el.repliedBy && el.repliedBy.fullName
        ? Object.assign({}, el, {
            ...el,
            status: el.status.name,
            customer: el.customer.fullName,
            repliedBy: el.repliedBy.fullName
          })
        : Object.assign({}, el, {
            ...el,
            status: el.status.name,
            customer: el.customer.fullName,
            repliedBy: el.repliedBy !== null ? el.repliedBy.fullName : ''
          })
    )
    setScaList(tempList)
    setFullList(tempList)
  }

  useEffect(() => {
    getStatusFeedback()
  }, [])

  const renderActionItem = (item, popupState, handleCloseSnackbar) => {
    return (
      <Box sx={{ py: 1 }}>
        {isAccessible('SSDS_C_SCA_ANSWER_CONSULT') && (
          <MenuItem
            sx={{ py: 1 }}
            onClick={() => {
              setAnswerSet(item.answerSet[0])
              setScaId(item.id)
              popupState.close()
              router.push({
                pathname: 'feedback/comment',
                query: { id: item.id }
              })
            }}
          >
            <EditIcon sx={{ mr: 1 }} />
            Tư vấn
          </MenuItem>
        )}
      </Box>
    )
  }

  return (
    <Grid container spacing={6}>
      {/* dòng này là wrapper của main content */}

      {/* START Render main content của cái page này */}
      <Grid item xs={12}>
        <Typography variant='h5' style={{ marginBottom: 10 }}>
          Quản lý tư vấn khách hàng
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          {isAccessible('SSDS_C_SCA_ANSWER_LISTING') && (
            <DataTable
              listData={scaList}
              listTableCellHead={listTableCellHead}
              listTableCellName={listTableCellName}
              renderIconActions={() => {
                return <DotsVertical />
              }}
              isFewCol
              listTableCellSort={listTableCellSort}
              onChangeSort={onChangeSort}
              callFilterFromProps={callFilterFromProps}
              isGenPagination
              count={count}
              renderActionItem={renderActionItem}
            />
          )}
        </Card>
      </Grid>
    </Grid>
  )
}

export default ManageFeedbackAdmin
