import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { Button, TextField, Box, IconButton } from '@mui/material'
import { Popover } from '@mui/material'
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

//Component import
import DataTable from '../../../component/table/dataTable'
import DialogAlert from '../../../component/dialog/dialogAlert'
import * as DrawerConfig from '../../../component/drawer/drawerConfig'

//API import
import { filterConfig } from '../../../api/config/configApi'
import { getAppMasterStatus, getAppMasterReasonCancel } from '../../../api/common/commonApi'
import { callApiGetProfile, isAccessible } from 'src/api/auth/authApi'

//utils import
import { DotsVertical } from 'mdi-material-ui'
import { useRouter } from 'next/router'
import DialogEditConfig from 'src/component/dialog/config/dialogEditConfig'


const ManageconfigAdmin = () => {
  const router = useRouter()

  // Page Authorization
  useEffect(() => {
    callApiGetProfile()

    if (!isAccessible('SSDS_P_CONFIG')) {
      router.push('/')
    }
  }, [router.asPath])

  //=================================================
  //PAGINATION HANDLING
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [count, setCount] = useState(0)

  const sticky = {
    position: 'sticky',
    left: 0,
    background: 'white'
  }

  //====================================================================================
  //Chuẩn bị data để truyền vào bảng
  //Table header
  const listTableCellHead = [
    {
      name: 'Id'
    },
    {
      name: 'Tên cấu hình',
      genFormSearch: () => {
        return (
          <TextField
            id='outlined-search'
            type='search'
            size='small'
            sx={{ width: 150 }}
            name='configKey'
            onChange={onChangeTextAndSelectField}
            value={configKey.value}
          />
        )
      }
    },
    {
      name: 'Giá trị cấu hình',
      genFormSearch: () => {
        return (
          <TextField
            id='outlined-search'
            type='search'
            size='small'
            sx={{ width: 150 }}
            name='configValue'
            onChange={onChangeTextAndSelectField}
            value={configValue.value}
          />
        )
      }
    },
    {
      name: 'Miêu tả cấu hình',
    },
      {
        name: 'Tên cơ sở',
      },
  ]


  const [listTableCellSort, setListTableCellSort] = useState([
    {
      name: 'Id',
      havingSortIcon: false
    },
    {
      name: 'Tên cấu hình',
      havingSortIcon: false,
      sortBy: 'configKey',
      sortDirection: ''
    },
    {
      name: 'Giá trị cấu hình',
      havingSortIcon: false,
      sortBy: 'configValue',
      sortDirection: ''
    },
    {
      name: 'Miêu tả cấu hình',
      havingSortIcon: false,
      sortBy: 'configDesc',
      sortDirection: ''
    },
    {
      name: 'Tên cơ sở',
      havingSortIcon: false,
      sortBy: 'branchName',
      sortDirection: ''
    }
  ])

  //Table row
  //List table cell name
  const listTableCellName = [
    'id',
    'configKey',
    'configValue',
    'configDesc',
    'branchName'
  ]

  //====================================================================================
  //click to sort
  const [sortInfo, setSortInfo] = useState({
    sortBy: 'id',
    sortDirection: 'desc',
    index: 1
  })

  const onChangeSort = (sortBy, sortDirection, index) => {
    let tempSortDirect = ''
    if (!sortDirection) {
      tempSortDirect = 'desc'
    }
    if (sortDirection == 'desc') {
      tempSortDirect = 'asc'
    }
    if (sortDirection == 'asc') {
      tempSortDirect = ''
    }

    setSortInfo({
      sortBy: sortBy,
      sortDirection: tempSortDirect,
      index: index
    })
  }

  useEffect(() => {
    const tempLst = []
    listTableCellSort.forEach(item => {
      let tempItem = { ...item, ['sortDirection']: '' }
      tempLst.push(tempItem)
    })
    tempLst[sortInfo.index] = { ...listTableCellSort[sortInfo.index], ['sortDirection']: sortInfo.sortDirection }
    setListTableCellSort(tempLst)
  }, [sortInfo])

  //====================================================================================
  //Định nghĩa query param, khi gọi api filter thì dùng đến nó
  const defaultQueryParam = {
    id: {
      value: '',
      operator: 'equals'
    },
    configKey: {
      value: '',
      operator: 'contains'
    },
    configValue: {
      value: '',
      operator: 'contains'
    },
    configDesc: {
      value: '',
      operator: 'contains'
    },
    branchName: {
      value: '',
      operator: 'equals'
    }
  }

  const [queryParam, setQueryParam] = useState(defaultQueryParam)

  const {
    id,
    configKey,
    configValue,
    configDesc,
    branchName
  } = queryParam
  
  

  //====================================================================================
  //ONCHANGE CHO TỪNG LOẠI FIELD

  //cho các trường chỉ search theo free-text và select giá trị
  const onChangeTextAndSelectField = e => {
    console.log('aaa')
    
    e.preventDefault()

    setQueryParam({
      ...queryParam,
      [`${e.target.name}`]: { ...queryParam[`${e.target.name}`], ['value']: e.target.value }
    })
  }

  //cho các trường chỉ được điền số
  const onChangeNumberField = e => {
    e.preventDefault()

    const regex = /^[0-9\b]+$/

    setQueryParam({
      ...queryParam,
      [`${e.target.name}`]:
        regex.test(e.target.value) || e.target.value == ''
          ? { ...queryParam[`${e.target.name}`], ['value']: e.target.value }
          : { ...queryParam[`${e.target.name}`], ['value']: queryParam[`${e.target.name}`]['value'] }
    })
  }

 

  //get filter data to fill to table
  const [list, setList] = useState(0)

  //Tạo data trong bảng với tên attribute custom
  const createData = (
    id,
    configKey,
    configValue,
    configDesc,
    branchName,
    
    //branchId
  ) => {
    return {
    id,
    configKey,
    configValue,
    configDesc,
    branchName,

    //branchId
    }
  }

  const callFilter = async (pageProp,sizeProp) => {
    const data = await filterConfig(queryParam ? queryParam : defaultQueryParam, pageProp, sizeProp)
    console.log(data)
    if (!data) return
    if (data.meta.code != 200) {
      setError(data.meta.message)
      setOpenError(true)

      return
    }
    if (!data.data) return
    setCount(data.meta.total)
    const tempList = []
    data.data.forEach(item => {
      tempList.push(
        createData(
          item.id,
          item.configKey,
          item.configValue,
          item.configDesc,
          item.branchName,

          //item.branchId
        )
      )
    })
    setList(tempList)
  }

  //First call when go into this page
  useEffect(() => {
    // callGetAppMasterStatus()
    // callGetAppMasterReasonCancels()
    callFilter(page,size)
  }, [])

  //====================================================================================
  //MỞ DIALOG CHO TỪNG LOẠI THỜI GIAN
  //   'expectedStartTime',


  // Dialog khi có lỗi
  const [error, setError] = useState('')
  const [openError, setOpenError] = useState(false)

  //đóng dialog
  const handleClose = () => {
    setOpenError(false)
  }

  //Open drawer
//Item data trong drawwer (view, edit)
const [itemView, setItemView] = useState()
const [itemEdit, setItemEdit] = useState()


//Tạo action vertical dot
const renderActionItem = (item, popupState, handleCloseSnackbar) => {
  return (
    <Box sx={{ py: 1 }}>
      {isAccessible('SSDS_C_CONFIG_DETAIL') && (
        <MenuItem
        sx={{ py: 1 }}
        onClick={() => {
          popupState.close()
          setOpenDrawerView(true)
          setItemView(item)
        }}
        >
          <VisibilityIcon sx={{ mr: 1 }} />
          Xem chi tiết
        </MenuItem>
      )}
      {isAccessible('SSDS_C_CONFIG_UPDATE') && (
        <MenuItem
        sx={{ py: 1 }}
        onClick={() => {
          popupState.close()
          setItemEdit(item)
          setOpenDialogEdit(true)
        }}
        >
          <EditIcon sx={{ mr: 1 }} />
          Chỉnh sửa
        </MenuItem>
      )}
    </Box>
  )
}


  const [openDrawerView, setOpenDrawerView] = useState(false)
  const [openDialogEdit, setOpenDialogEdit] = useState(false)
 


  //====================================================================================
  //Khi search theo các trường select, thì chỉ cần chọn là gọi filter lại
//   useEffect(()=>{
//     callFilter(page,size);
//   },[])

  return (

    //Ấn enter để gọi filter
    <div
      onKeyPress={e => {
        e.persist()
        if (e.key === 'Enter') {
          callFilter(page,size)
        }
      }}
    >
      <Grid container spacing={6}>
        {/* dòng này là wrapper của main content */}

        {/* START Render main content của cái page này */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Button
                variant='outlined'
                onClick={() => {
                  setQueryParam(defaultQueryParam)
                  setPage(0)
                  setSize(10)
                }}
                style={{ marginRight: 10 }}
              >
                Xóa bộ lọc
              </Button>
              {/* Ấn nút search cũng gọi filter */}
              <Button variant='contained' onClick={callFilter}>
                Search
              </Button>
            </Box>
          </Grid>
        

        <Grid item xs={12}>
          <Card>
            {isAccessible('SSDS_C_CONFIG_LISTING') && (
              <DataTable
              listData={list}
              listTableCellHead={listTableCellHead}
              listTableCellName={listTableCellName}
              renderIconActions={() => {
                return <DotsVertical />
              }}
              listTableCellSort={listTableCellSort}
              onChangeSort={onChangeSort}
              isGenPagination={false}
              isFewCol

              renderActionItem={renderActionItem}

              // renderAction={renderAction}
              />
            )}
          </Card>
        </Grid>
        {/* END Render main content của cái page này */}

        {/* START Định nghĩa các thể loại dialog có thể mở của cái page này */}
        <DrawerConfig.DrawerViewConfig
          openDrawer={openDrawerView}
          setOpenDrawer={setOpenDrawerView}
          selectedItem={itemView}
          setSelectedItem={setItemView}
          setOpenError={setOpenError}
          setError={setError}
          onSuccess={() => {
            callFilter(page, size)
          }}
        />
        <DialogEditConfig 
          open={openDialogEdit}
          setOpen={setOpenDialogEdit}
          selectedItem={itemEdit}
          setSelectedItem={setItemEdit}
          setError={setError}
          setOpenError={setOpenError}
          onSuccess={() => {
            callFilter(page, size)
          }}
        />
        <DialogAlert
          nameDialog={'Có lỗi xảy ra'}
          open={openError}
          allertContent={error}
          handleClose={handleClose}
        />
        {/* END Định nghĩa các thể loại dialog có thể mở của cái page này */}
      </Grid>
    </div>
  )
}

export default ManageconfigAdmin
