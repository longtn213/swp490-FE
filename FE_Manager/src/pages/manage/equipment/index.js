import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { Button, TextField, Box, IconButton, Tooltip } from '@mui/material'
import { Popover } from '@mui/material'
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteIcon from '@mui/icons-material/Delete'
import { DotsVertical } from 'mdi-material-ui'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DialogCreateEquipment from 'src/component/dialog/equipment/dialogCreateEquipment'
import CancelIcon from '@mui/icons-material/Cancel'
import EditIcon from '@mui/icons-material/Edit'
import { useRouter } from 'next/router'

//Component import
import DataTable from '../../../component/table/dataTable'
import DialogAlert from '../../../component/dialog/dialogAlert'
import * as DrawerEquipment from '../../../component/drawer/drawerEquipment'

//API import
import { deleteEquipment, filterEquipment } from '../../../api/equipment/equipmentApi'
import { getAppMasterStatus, getAppMasterReasonCancel } from '../../../api/common/commonApi'

//utils import
import { timestampToString, reformatDateForView, reformatDateForQuery } from '../../../utils/timeUtils'
import CommonAlert from 'src/component/common/Alert'
import Dialog from 'src/component/common/Dialog'
import CustomDialogConfirm from 'src/component/dialog/customDialogConfirm'
import { callApiGetProfile, isAccessible } from 'src/api/auth/authApi'

const ManageEquipmentAdmin = () => {

  const router = useRouter()
  
  useEffect(() => {
    callApiGetProfile()
    if (!isAccessible('SSDS_P_EQUIPMENT')) {
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
  const [alertProps1, setAlertProps1] = useState(['', ''])
  

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
      name: 'Tên thiết bị'
    },
    {
      name: 'Mã'
    },
    {
      name: 'Mô tả'
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
      name: 'Tên thiết bị',
      havingSortIcon: false,
      sortBy: 'name',
      sortDirection: ''
    },
    {
      name: 'Mã',
      havingSortIcon: false,
      sortBy: 'code',
      sortDirection: ''
    },
    {
      name: 'Mô tả',
      havingSortIcon: false,
      sortBy: 'description',
      sortDirection: ''
    }
  ])

  //Table row
  //List table cell name
  const listTableCellName = ['id', 'equipmentName', 'equipmentCode', 'equipmentDesc']

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
    equipmentName: {
      value: '',
      operator: 'contains'
    },
    equipmentCode: {
      value: '',
      operator: 'contains'
    },
    equipmentDesc: {
      value: '',
      operator: 'contains'
    }
  }

  const [queryParam, setQueryParam] = useState(defaultQueryParam)

  const { equipmentName, equipmentCode, equipmentDesc } = queryParam

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

  //====================================================================================
  //MẤY CÁI LIÊN QUAN ĐẾN API
  //get dropdown list for select search status
  const [listStatus, setListStatus] = useState([])

  const [list, setList] = useState(0)

  //Tạo data trong bảng với tên attribute custom
  const createData = (id, equipmentName, equipmentCode, equipmentDesc) => {
    return {
      id,
      equipmentName,
      equipmentCode,
      equipmentDesc
    }
  }

  const callFilter = async (pageProp, sizeProp) => {
    const data = await filterEquipment(queryParam ? queryParam : defaultQueryParam, pageProp, sizeProp, sortInfo)
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
      tempList.push(createData(item.id, item.name, item.code, item.description))
    })
    console.log('template', tempList)
    setList(tempList)
  }

  //First call when go into this page
  useEffect(() => {
    callFilter(page, size)
  }, [])

  // Dialog khi có lỗi
  const [error, setError] = useState('')
  const [openError, setOpenError] = useState(false)

  // Dialog add equipment
  const [openCreateEquipment, setOpenCreateEquipment] = useState(false)
  

  //đóng dialog
  const handleClose = () => {
    setOpenError(false)
    setOpenCreateEquipment(false)
  }

  //====================================================================================

  const [currentId, setCurrentId] = useState()
  const [listCurrentId, setlistCurrentId] = useState([])

  //Item data trong drawwer (view, edit, checkout)
  const [itemView, setItemView] = useState()
  const [itemEdit, setItemEdit] = useState()

  //Tạo action vertical dot
  const renderActionItem = (item, popupState, handleCloseSnackbar) => {
    return (
      <Box sx={{ py: 1 }}>
         {isAccessible('SSDS_C_EQUIPMENT_DETAIL') && (
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
        {isAccessible('SSDS_C_EQUIPMENT_UPDATE') && (
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
        {isAccessible('SSDS_C_EQUIPMENT_DELETE') && (
        <MenuItem
          sx={{ py: 1 }}
          onClick={() => {
            popupState.close()
            setIsOpenConfirmDelete(true)
            setCurrentId(item.id)
          }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Xóa
        </MenuItem>
        )}
      </Box>
    )
  }

  //Tạo action snack bar

  const renderActionSnackbar = (handleCloseSnackbar, listItemChecked) => {
    return (
      <span style={{ marginLeft: 15 }}>
        {isAccessible('SSDS_C_EQUIPMENT_DELETE') && (
        <Tooltip
          title='Xóa tất cả'
          onClick={() => {
            handleCloseSnackbar()
            setIsOpenConfirmDelete(true)
            setCurrentId(-1)

             //handleMultiDeleteEquipment(listItemChecked)
             setlistCurrentId(listItemChecked)
            
          }}
        >
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        )}
      </span>
    )
  }

  //Open drawer

  const [openDrawerView, setOpenDrawerView] = useState(false)
  const [openDrawerEdit, setOpenDrawerEdit] = useState(false)


  //============================================================
  //Xóa equipment

  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false)

  const onConfirmDelete = confirm => {
    console.log(confirm)
    if (confirm == true && currentId != -1) {
      handleSingleDeleteEquipment(currentId);
      setCurrentId(-1)
    }else if(confirm == true && currentId == -1){
      console.log(listCurrentId)
      handleMultiDeleteEquipment(listCurrentId)
      setlistCurrentId([])
    }
    setIsOpenConfirmDelete(false)
  }

  const handleSingleDeleteEquipment = id => {
    const listId = [id]
    callApiDeleteEquipment(listId)
  }

  const handleMultiDeleteEquipment = listItem => {
    var listId = []
    listItem.map(item => {
      listId.push(item.id)
    })
    callApiDeleteEquipment(listId)
  }

  const alertCallback = () => {
    setOpenAlert(false)
    router.push('/manage/equipment')
  }

  const callApiDeleteEquipment = async listId => {
    const data = await deleteEquipment(listId)
    if (!data || data.meta.code != 200) {
      setError(data.meta.message)
      setOpenError(true)
    } else {
      setAlertProps(['Bạn đã xoá thiết bị thành công', ''])
    }
    setOpenAlert(true)
    callFilter(page, size)
  }

  return (

    //Ấn enter để gọi filter
    <div
      onKeyDown={e => {
        e.persist()
        if (e.key === 'Enter') {
          callFilter()
        }
      }}
    >
      <Grid container spacing={6}>
        {/* dòng này là wrapper của main content */}

        {/* START Render main content của cái page này */}
        <Grid item xs={12}>
          <Typography variant='h5' style={{ marginBottom: 10 }}>
            Quản lý thiết bị
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
            {isAccessible('SSDS_C_EQUIPMENT_CREATE') && (
            <Button variant='contained' onClick={() => setOpenCreateEquipment(true)}>
              Thêm thiết bị
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
            {isAccessible('SSDS_C_EQUIPMENT_LISTING') && (
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

              //Có gen check box ko
              isHavingCheckboxes
              messageSnackbar={'Loại thiết bị được chọn'}
              renderActionSnackbar={renderActionSnackbar}
            />
            )}
          </Card>
        </Grid>

        <DialogAlert nameDialog={'Có lỗi xảy ra'} open={openError} allertContent={error} handleClose={handleClose} />
        <DialogCreateEquipment
          open={openCreateEquipment}
          handleClose={handleClose}
          onSuccess={() => {
            callFilter(page, size)
          }}
        />
        {/* END Định nghĩa các thể loại dialog có thể mở của cái page này */}
        {/* START Định nghĩa Drawer của page này */}
        <DrawerEquipment.DrawerViewEquipment
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
        <DrawerEquipment.DrawerEditEquipment
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
      <CustomDialogConfirm nameDialog={'Xác nhận'} open={isOpenConfirmDelete} handleConfirm={onConfirmDelete}>
        Bạn có chắc chắc muốn xóa thiết bị này
      </CustomDialogConfirm>
    </div>
  )
}

export default ManageEquipmentAdmin
