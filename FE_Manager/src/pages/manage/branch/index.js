import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { Button, TextField, Box, IconButton } from '@mui/material'
import { Popover } from '@mui/material'
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import CommonAlert from 'src/component/common/Alert'

//Component import
import DataTable from '../../../component/table/dataTable'
import DialogAlert from '../../../component/dialog/dialogAlert'
import * as DrawerBranch from '../../../component/drawer/drawerBranch'
import { styled } from '@mui/material/styles'
import Switch from '@mui/material/Switch'
import { useRouter } from 'next/router'

//API import
import { filterBranch, getAllBranch, editBranch } from '../../../api/branch/branchApi'
import { getAppMasterStatus, getAppMasterReasonCancel } from '../../../api/common/commonApi'

//utils import
import { DotsVertical } from 'mdi-material-ui'
import DialogCreateBranch from 'src/component/dialog/branch/dialogCreateBranch'
import CustomDialogConfirm from 'src/component/dialog/customDialogConfirm'
import { callApiGetProfile, isAccessible } from 'src/api/auth/authApi'

const ManageBranchAdmin = () => {
  const router = useRouter()

  // Page Authorization

  useEffect(() => {
    callApiGetProfile()
    if (!isAccessible('SSDS_P_BRANCH')) {
      router.push('/')
    }
  }, [router.asPath])

  //====================================================================================
  //PAGINATION HANDLING

  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [count, setCount] = useState(0)
  const [openAlert, setOpenAlert] = useState(false)
  const [alertProps, setAlertProps] = useState(['', ''])

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
      name: 'Tên chi nhánh'
    },
    {
      name: 'Địa chỉ'
    },
    {
      name: 'Xã/phường'
    },
    {
      name: 'Quận/huyện'
    },
    {
      name: 'Tỉnh/thành phố'
    },
    {
      name: 'Số điện thoại'
    }
  ]

  const [listTableCellSort, setListTableCellSort] = useState([
    {
      name: 'Id',
      havingSortIcon: false,
      sortBy: 'id',
      sortDirection: ''
    },
    {
      name: 'Tên chi nhánh',
      havingSortIcon: false,
      sortBy: 'name',
      sortDirection: ''
    },
    {
      name: 'Địa chỉ',
      havingSortIcon: false,
      sortBy: 'detailAddress',
      sortDirection: ''
    },
    {
      name: 'Xã/phường',
      havingSortIcon: false
    },
    {
      name: 'Quận/huyện',
      havingSortIcon: false
    },
    {
      name: 'Tỉnh/thành phố',
      havingSortIcon: false
    },
    {
      name: 'Số điện thoại',
      havingSortIcon: false,
      sortBy: 'hotline',
      sortDirection: ''
    }
  ])

  //Table row
  //List table cell name
  const listTableCellName = ['id', 'name', 'detailAddress', 'district', 'city', 'state', 'hotline']

  //====================================================================================
  //click to sort
  const [sortInfo, setSortInfo] = useState({
    sortBy: 'equipmentName',
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
    name: {
      value: '',
      operator: 'contains'
    },
    detailAddress: {
      value: '',
      operator: 'contains'
    },
    hotline: {
      value: '',
      operator: 'contains'
    }
  }

  const [queryParam, setQueryParam] = useState(defaultQueryParam)

  const { name, detailAddress, hotline } = queryParam

  //====================================================================================
  //ONCHANGE CHO TỪNG LOẠI FIELD

  //cho các trường chỉ search theo free-text và select giá trị
  const onChangeTextAndSelectField = e => {
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

  //cho các trường chỉ date-time (giá trị FROM)
  const onChangeDateFromField = e => {
    e.preventDefault()

    setQueryParam({
      ...queryParam,
      [`${e.target.name}`]: {
        ...queryParam[`${e.target.name}`],
        ['value']: {
          ...queryParam[`${e.target.name}`]['value'],
          ['from']: e.target.value,
          ['fromText']: reformatDateForView(e.target.value)
        }
      }
    })
  }

  //cho các trường chỉ date-time (giá trị TO)
  const onChangeDateToField = e => {
    e.preventDefault()

    setQueryParam({
      ...queryParam,
      [`${e.target.name}`]: {
        ...queryParam[`${e.target.name}`],
        ['value']: {
          ...queryParam[`${e.target.name}`]['value'],
          ['to']: e.target.value,
          ['toText']: reformatDateForView(e.target.value)
        }
      }
    })
  }

  //get filter data to fill to table
  const [list, setList] = useState(0)
  const [fullList, setFullList] = useState([])
  const [arraydeactive, setArraydeactive] = useState([])
  const [isOpenConfirmDeactive, setIsOpenConfirmDeactive] = useState(false)

  //Tạo data trong bảng với tên attribute custom
  const createData = (id, name, detailAddress, district, city, state, hotline,latitude, longitude, isActive, stateId, cityId, districtId,code ) => {
    return {
      id,
      name,
      detailAddress,
      district,
      city,
      state,
      hotline, 
      latitude, 
      longitude, 
      isActive, 
      stateId, 
      cityId, 
      districtId,
      code

    }
  }

  const getFullList = async () => {
    const res = await getAllBranch()
    if (!res) return
    if (res.meta.code != 200) {
      setError(res.meta.message)
      setOpenError(true)

      return
    }

    setFullList([...res.data])
  }

  const callFilter = async (pageProp, sizeProp) => {
    const data = await filterBranch(queryParam ? queryParam : defaultQueryParam, pageProp, sizeProp)
    if (!data) return
    if (data.meta.code != 200) {
      setError(data.meta.message)
      setOpenError(true)

      return
    }
    if (!data.data) return
    setCount(data.meta.total)
    const tempList = []
    const tempListdeactive = []
    console.log(data.data)
    data.data.forEach((item, index) => {
      tempList.push(
        createData(
          item.id,
          item.name,
          item.detailAddress,
          item.district?.divisionName,
          item.city?.divisionName,
          item.state?.divisionName,
          item.hotline,
          item.latitude, 
          item.longitude, 
          item.isActive,
          item.state?.id, 
          item.city?.id, 
          item.district?.id,
          item.code
        )
      )
      if (!item.isActive) {
        tempListdeactive.push(index)
      }
    })
    setList(tempList)
    setArraydeactive(tempListdeactive)
  }

  const isShortLine = {
    width: '250px',
    display: 'block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }

  //First call when go into this page
  useEffect(() => {
    // callGetAppMasterStatus()
    // callGetAppMasterReasonCancels()
    callFilter(page, size)
    getFullList()
  }, [])

  //====================================================================================
  //MỞ DIALOG CHO TỪNG LOẠI THỜI GIAN
  //   'expectedStartTime',

  // Dialog khi có lỗi
  const [error, setError] = useState('')
  const [openError, setOpenError] = useState(false)
  const [currentItem, setCurrentItem] = useState({isActive : false })

  const onConfirmDelete = confirm => {
    if (confirm == true && currentItem != null) {
      handleChageActive(currentItem);
    }

   // setCurrentItem(null)

    setIsOpenConfirmDeactive(false)
  }

  // Dialog create branch
  const [openCreateBranch, setOpenCreateBranch] = useState(false)

  const handleChageActive = item => {
    console.log(item)

    const newItem = Object.assign(item, {
      ...item
    })

    var data = {
      // item.id,
      // item.name,
      // item.detailAddress,
      // item.district?.divisionName,
      // item.city?.divisionName,
      // item.state?.divisionName,
      // item.hotline

      id: newItem.id,
      name: newItem.name,
      code: newItem.code,
      detailAddress: newItem.detailAddress,
      latitude: newItem.latitude,
      longitude: newItem.longitude,
      hotline: newItem.hotline,
      state: {
        id: newItem.stateId
      },
      city: {
        id: newItem.cityId
      },
      district: {
        id: newItem.districtId
      },
      isActive: !newItem.isActive
    }
    console.log(data)
    callApieditBranch(data)
  }

  const callApieditBranch = async item => {
    const data = await editBranch(item)

    if (!data || data.meta.code != 200) {
      setError(data.meta.message)
      setOpenError(true)
    } else {
      if (item.isActive == true) {
        setAlertProps(['Bạn đã mở chi nhánh thành công', ''])
      } else {
        setAlertProps(['Bạn đã đóng chi nhánh thành công', ''])
      }
    }
    setOpenAlert(true)
    callFilter(page, size)
    getFullList()
  }

  //đóng dialog
  const handleClose = () => {
    setOpenError(false)
  }

  //====================================================================================
  //Item data trong drawwer (view, edit)
  const [itemView, setItemView] = useState()
  const [itemEdit, setItemEdit] = useState()

  const Android12Switch = styled(Switch)(({ theme }) => ({
    padding: 8,
    '& .MuiSwitch-track': {
      borderRadius: 22 / 2,
      '&:before, &:after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 16,
        height: 16
      },
      '&:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main)
        )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
        left: 12
      },
      '&:after': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main)
        )}" d="M19,13H5V11H19V13Z" /></svg>')`,
        right: 12
      }
    },
    '& .MuiSwitch-thumb': {
      boxShadow: 'none',
      width: 16,
      height: 16,
      margin: 2
    }
  }))

  const alertCallback = () => {
    setOpenAlert(false)
    router.push('/manage/branch')
  }

  //Tạo action vertical dot
  const renderActionItem = (item, popupState) => {
    return (
      
      <Box sx={{ py: 1 }}>
        {isAccessible('SSDS_C_BRANCH_DETAIL') && (
        <MenuItem
          sx={{ py: 1 }}
          onClick={() => {
            popupState.close()
            setOpenDrawerView(true)
            setItemView(item)
            console.log(item)
          }}
        >
          <VisibilityIcon sx={{ mr: 1 }} />
          Xem chi tiết
        </MenuItem>
      )}
      {isAccessible('SSDS_C_BRANCH_UPDATE') && (
        <MenuItem
          sx={{ py: 1 }}
          onClick={() => {
            popupState.close()
            setOpenDrawerEdit(true)
            setItemEdit(item)
          }}
        >
          <EditIcon sx={{ mr: 1 }} />
          Chỉnh sửa
        </MenuItem>
        )}
        {isAccessible('SSDS_C_BRANCH_DEACTIVE_ACTIVE') && (
        <MenuItem>
          <Android12Switch
            checked={
              fullList.length > 0 && item.id !== undefined
                && fullList.filter(el => el.id === item.id)[0]?.isActive
            }
             onChange={() => {
              setIsOpenConfirmDeactive(true)
            }}
            onClick={() =>{
              setCurrentItem(item)
            }}
          />
        </MenuItem>
        )}
      </Box>
    )
  }

  //Open drawer

  const [openDrawerView, setOpenDrawerView] = useState(false)
  const [openDrawerEdit, setOpenDrawerEdit] = useState(false)

  //====================================================================================
  //Khi search theo các trường select, thì chỉ cần chọn là gọi filter lại
  //   useEffect(()=>{
  //     callFilter(page,size);
  //   },[])

  return (
    <div
      onKeyPress={e => {
        e.persist()
        if (e.key === 'Enter') {
          callFilter(page, size)
        }
      }}
    >
      <Grid container spacing={6}>
        {/* dòng này là wrapper của main content */}

        {/* START Render main content của cái page này */}
        <Grid item xs={12}>
          <Typography variant='h5' style={{ marginBottom: 10 }}>
            Quản lý chi nhánh
          </Typography>
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
            {isAccessible('SSDS_C_BRANCH_CREATE') && (
            <Button variant='contained' onClick={() => setOpenCreateBranch(true)}>
              Thêm chi nhánh
            </Button>
            )}
          </Grid>
          <CommonAlert
            open={openAlert}
            param={''}
            okLabel={'Ok'}
            okCallback={alertCallback}
            message={alertProps[1]}
            title={alertProps[0]}
            variant={'oneButton'}
          />
        </Grid>

        <Grid item xs={12}>
          <Card>
            {isAccessible('SSDS_C_BRANCH_LISTING') && (
            <DataTable
              listData={list}
              listTableCellHead={listTableCellHead}
              listTableCellName={listTableCellName}
              highlightIndice={arraydeactive}
              renderIconActions={() => {
                return <DotsVertical />
              }}
              listTableCellSort={listTableCellSort}
              onChangeSort={onChangeSort}
              isGenPagination={false}
              isShortLine={isShortLine}
              isFewCol
              renderActionItem={renderActionItem}
            />
            )}
          </Card>
        </Grid>
        {/* END Render main content của cái page này */}

        {/* START Định nghĩa các thể loại dialog có thể mở của cái page này */}

        <DialogAlert nameDialog={'Có lỗi xảy ra'} open={openError} allertContent={error} handleClose={handleClose} />
        <DialogCreateBranch
          open={openCreateBranch}
          setOpen={setOpenCreateBranch}
          handleClose={handleClose}
          onSuccess={() => {
            callFilter(page, size)
          }}
          error={error}
          setError={setError}
          openError={openError}
          setOpenError={setOpenError}
        />
        {/* END Định nghĩa các thể loại dialog có thể mở của cái page này */}
        {/* START Định nghĩa Drawer của page này */}
        <DrawerBranch.DrawerViewBranch
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
        <DrawerBranch.DrawerEditBranch
          openDrawer={openDrawerEdit}
          setOpenDrawer={setOpenDrawerEdit}
          selectedItem={itemEdit}
          setSelectedItem={setItemEdit}
          setOpenError={setOpenError}
          setError={setError}
          onSuccess={() => {
            callFilter(page, size)
          }}
        />
        {/* END Định nghĩa Drawer của page này */}
      </Grid>
      <CustomDialogConfirm nameDialog={'Xác nhận'} open={isOpenConfirmDeactive} handleConfirm={onConfirmDelete}>
          {!currentItem.isActive ? 'Bạn có chắc chắc muốn thay đổi trạng thái chi nhánh ?' : 'Bạn có chắc chắc muốn thay đổi trạng thái chi nhánh?'}
        </CustomDialogConfirm>
    </div>
  )
}

export default ManageBranchAdmin
