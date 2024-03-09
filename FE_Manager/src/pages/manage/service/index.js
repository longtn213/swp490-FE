import { useEffect, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { Box, Button, TextField } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import { styled } from '@mui/material/styles'
import Switch from '@mui/material/Switch'

//Component import
import DataTable from '../../../component/table/dataTable'
import DialogAlert from '../../../component/dialog/dialogAlert'
import { editService } from 'src/api/service/serviceApi'
import { useRouter } from 'next/router'

//API import
import * as drawerService from '../../../component/drawer/drawerService'

//utils import
import { convertDurationToTextTime, reformatDateForView } from '../../../utils/timeUtils'
import { getListCategory } from 'src/api/category/categoryApi'
import { getListEquipment } from 'src/api/equipment/equipmentApi'
import { filterService, getAllServices } from 'src/api/service/serviceApi'
import { DotsVertical } from 'mdi-material-ui'
import DialogCreateService from 'src/component/dialog/service/dialogCreateService'
import { convertNumberToVND } from 'src/utils/currencyUtils'
import CommonAlert from 'src/component/common/Alert'
import CustomDialogConfirm from 'src/component/dialog/customDialogConfirm'
import { callApiGetProfile, isAccessible } from 'src/api/auth/authApi'

const ManageServiceAdmin = () => {
  const router = useRouter()

  // Page Authorization

  useEffect(() => {
    callApiGetProfile()
    if (!isAccessible('SSDS_P_SERVICE')) {
      router.push('/')
    }
  }, [router.asPath])

  //=================================================
  //====================================================================================
  //PAGINATION HANDLING
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [count, setCount] = useState(0)

  const alertCallback = () => {
    setOpenAlert(false)
    router.push('/manage/service')
  }

  const callFilterFromProps = (pageProp, sizeProp) => {
    callFilter(pageProp, sizeProp)
  }

  //====================================================================================
  //Chuẩn bị data để truyền vào bảng
  //Table header

  const listTableCellHead = [
    {
      name: 'Tên dịch vụ',
      genFormSearch: () => {
        return (
          <TextField
            id='outlined-search'
            type='search'
            size='small'
            sx={{ width: 150 }}
            name='serviceName'
            onChange={onChangeTextAndSelectField}
            value={serviceName.value}
          />
        )
      }
    },
    {
      name: 'Mô tả',
      genFormSearch: () => {
        return (
          <TextField
            id='outlined-search'
            type='search'
            size='small'
            sx={{ width: 250 }}
            name='serviceDesc'
            onChange={onChangeTextAndSelectField}
            value={serviceDesc.value}
          />
        )
      }
    },
    {
      name: 'Thời gian thực hiện'
    },
    {
      name: 'Trạng thái hoạt động'
    },
    {
      name: 'Danh mục',
      genFormSearch: () => {
        return (
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id='status-select-label'>Danh mục</InputLabel>
            <Select
              labelId='status-select-label'
              id='demo-simple-select'
              label='Danh mục'
              name='serviceCategory'
              value={serviceCategory.value}
              onChange={onChangeTextAndSelectField}
              sx={{ width: 150 }}
            >
              {listCategoryCodes &&
                listCategoryCodes.length > 0 &&
                listCategoryCodes.map((item, index) => {
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
      name: 'Thiết bị',
      genFormSearch: () => {
        return (
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id='status-select-label'>Thiết bị</InputLabel>
            <Select
              labelId='status-select-label'
              id='demo-simple-select'
              label='Danh mục'
              name='serviceEquipment'
              value={serviceEquipment.value}
              onChange={onChangeTextAndSelectField}
              sx={{ width: 150 }}
            >
              {listEquipmentCodes &&
                listEquipmentCodes.length > 0 &&
                listEquipmentCodes.map((item, index) => {
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
      name: 'Giá hiện tại',
      genFormSearch: () => {
        return <div />
      }
    }
  ]

  const [listTableCellSort, setListTableCellSort] = useState([
    {
      name: 'Tên dịch vụ',
      havingSortIcon: true,
      sortBy: 'name',
      sortDirection: ''
    },
    {
      name: 'Mô tả',
      havingSortIcon: true,
      sortBy: 'description',
      sortDirection: ''
    },
    {
      name: 'Thời gian thực hiện',
      havingSortIcon: true,
      sortBy: 'duration',
      sortDirection: ''
    },
    {
      name: 'Trạng thái',
      havingSortIcon: true,
      sortBy: 'isActive',
      sortDirection: ''
    },
    {
      name: 'Danh mục dịch vụ',
      havingSortIcon: true,
      sortBy: 'categoryCode',
      sortDirection: ''
    },
    {
      name: 'Thiết bị dịch vụ',
      havingSortIcon: false,
      sortBy: 'serviceEquipment',
      sortDirection: ''
    },
    {
      name: 'Giá thành',
      havingSortIcon: true,
      sortBy: 'currentPrice',
      sortDirection: ''
    }
  ])

  //Table row
  //List table cell name
  const listTableCellName = [
    'serviceName',
    'serviceDesc',
    'serviceDuration',
    'serviceStatus',
    'serviceCategory',
    'serviceEquipment',
    'servicePrice'
  ]

  //====================================================================================
  //click to sort
  const [sortInfo, setSortInfo] = useState({
    sortBy: 'name',
    sortDirection: 'asc',
    index: 0
  })

  const onChangeSort = (sortBy, sortDirection, index) => {
    let tempSortDirect = ''
    if (!sortDirection) {
      tempSortDirect = 'desc'
    }
    if (sortDirection === 'desc') {
      tempSortDirect = 'asc'
    }
    if (sortDirection === 'asc') {
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
    serviceName: {
      value: '',
      operator: 'contains'
    },
    serviceDesc: {
      value: '',
      operator: 'contains'
    },
    serviceDuration: {
      value: '',
      operator: 'equals'
    },
    serviceStatus: {
      value: '',
      operator: 'equals'
    },
    serviceCategory: {
      value: '',
      operator: 'in'
    },
    serviceEquipment: {
      value: '',
      operator: 'in'
    },
    servicePrice: {
      value: '',
      operator: 'equals'
    }
  }

  const [queryParam, setQueryParam] = useState(defaultQueryParam)

  const { serviceName, serviceDesc, serviceDuration, serviceStatus, serviceCategory, serviceEquipment, servicePrice } =
    queryParam

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
  const [listCategoryCodes, setListCategoryCodes] = useState([])
  const [listEquipmentCodes, setListEquipmentCodes] = useState([])

  const callGetServiceCategoryCodes = async () => {
    const data = await getListCategory()
    if (!data) return
    if (!data.data) return
    const tempLst = []
    data.data.forEach(element => {
      tempLst.push({ id: element.id, name: element.name, code: element.code })
    })
    setListCategoryCodes(tempLst)
  }

  const callGetServiceEquipmentCodes = async () => {
    const data = await getListEquipment()
    if (!data) return
    if (!data.data) return
    const tempLst = []
    data.data.forEach(element => {
      tempLst.push({ id: element.id, name: element.name, code: element.code })
    })
    setListEquipmentCodes(tempLst)
  }

  //get filter data to fill to table
  const [list, setList] = useState([])
  const [fullList, setFullList] = useState([])
  const [arraydeactive, setArraydeactive] = useState([])

  //Tạo data trong bảng với tên attribute custom
  const createData = (
    serviceName,
    serviceDesc,
    serviceDuration,
    serviceStatus,
    serviceCategory,
    serviceEquipment,
    servicePrice,
    serviceCode,
    servicefile,
    id,
    categoryId,
    equipmentTypeId,
    isActive,
    duration,
    files
  ) => {
    return {
      id,
      serviceName,
      serviceDesc,
      serviceDuration,
      serviceStatus,
      serviceCategory,
      serviceEquipment,
      servicePrice,
      serviceCode,
      servicefile,
      id,
      categoryId,
      equipmentTypeId,
      isActive,
      duration,
      files
    }
  }

  const getFullList = async () => {
    const res = await getAllServices()
    console.log(res)
    if (!res) return
    if (res.meta.code != 200) {
      setError(res.meta.message)
      setOpenError(true)

      return
    }
    setFullList([...res.data])
  }

  const callFilter = async (pageProp, sizeProp) => {
    const data = await filterService(queryParam ? queryParam : defaultQueryParam, pageProp, sizeProp, sortInfo)
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
    const tempListdeactive = []
    data.data.forEach((item, index) => {
      var activeStatus
      item.isActive === true ? (activeStatus = 'Đang hoạt động') : (activeStatus = 'Đã vô hiệu hóa')
      var convertedDuration = convertDurationToTextTime(item.duration)
      var convertedCurrentPrice = convertNumberToVND(item.currentPrice)
      tempList.push(
        createData(
          item.name,
          item.description,
          convertedDuration,
          activeStatus,
          item.categoryName,
          item.equipmentName,
          convertedCurrentPrice,
          item.code,
          item.files,
          item.id,
          item.categoryId,
          item.equipmentTypeId,
          item.isActive,
          item.duration,
          item.files
        )
      )
      if (!item.isActive) {
        tempListdeactive.push(index)
      }
    })
    setArraydeactive(tempListdeactive)
    setList(tempList)
  }

  //First call when go into this page
  useEffect(() => {
    // callGetAppMasterStatus()
    callGetServiceCategoryCodes()
    callGetServiceEquipmentCodes()
    callFilter(page, size)
    getFullList()
  }, [])

  //====================================================================================

  // Dialog khi có lỗi
  const [error, setError] = useState('')
  const [openError, setOpenError] = useState(false)

  // Dialog add service
  const [openCreateService, setOpenCreateService] = useState(false)
  const [isOpenConfirmDeactive, setIsOpenConfirmDeactive] = useState(false)
  const [currentItem, setCurrentItem] = useState({ isActive: false })

  const onConfirmDelete = confirm => {
    if (confirm == true && currentItem != null) {
      handleChageActive(currentItem)
    }

    // setCurrentItem(null)

    setIsOpenConfirmDeactive(false)
  }

  //đóng dialog
  const handleClose = () => {
    setOpenError(false)
    setOpenCreateService(false)
  }

  const handleChageActive = item => {
    const newItem = Object.assign(item, {
      ...item
    })
    console.log(newItem)
    console.log(item)

    var data = {
      id: newItem.id,
      name: newItem.serviceName,
      code: newItem.serviceCode,
      duration: newItem.duration,
      isActive: !newItem.isActive,
      categoryName: newItem.serviceCategory,
      categoryId: newItem.categoryId,
      equipmentTypeId: newItem.equipmentTypeId,
      equipmentName: newItem.serviceEquipment,
      description: newItem.serviceDesc,
      currentPrice: newItem.servicePrice,
      files: newItem.servicefile
    }
    callApieditService(data)
  }

  const callApieditService = async item => {
    const data = await editService(item)
    console.log(item)

    if (!data || data.meta.code != 200) {
      setError(data.meta.message)
      setOpenError(true)
    } else {
      if (item.isActive == true) {
        setAlertProps(['Bạn đã mở dịch vụ thành công', ''])
      } else {
        setAlertProps(['Bạn đã đóng dịch vụ thành công', ''])
      }
    }
    setOpenAlert(true)
    callFilter(page, size)
    getFullList()
  }

  const [openAlert, setOpenAlert] = useState(false)
  const [alertProps, setAlertProps] = useState(['', ''])

  //====================================================================================
  //Khi search theo các trường select, thì chỉ cần chọn là gọi filter lại
  useEffect(() => {
    callFilter(page, size)
  }, [serviceDesc, serviceCategory, sortInfo])

  //Item data trong drawwer (view, edit, checkout)
  const [itemView, setItemView] = useState()

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

  const renderActionItem = (item, popupState) => {
    return (
      <Box sx={{ py: 1 }}>
        {isAccessible('SSDS_C_SERVICE_DETAIL') && (
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
        {isAccessible('SSDS_C_SERVICE_UPDATE') && (
        <MenuItem
          sx={{ py: 1 }}
          onClick={() => {
            popupState.close()
            setOpenDrawerEdit(true)
            setItemView({
              ...item
            })
          }}
        >
          <EditIcon sx={{ mr: 1 }} />
          Chỉnh sửa
        </MenuItem>
        )}
        {isAccessible('SSDS_C_SERVICE_DEACTIVE_ACTIVE') && (
        <MenuItem>
          <Android12Switch
            checked={
              fullList.length > 0 && item.id !== undefined
                ? fullList.filter(el => el.id === item.id)[0].isActive
                : false
            }
            onChange={() => {
              setIsOpenConfirmDeactive(true)
            }}
            onClick={() => {
              setCurrentItem(item)
            }}
          />
        </MenuItem>
        )}
      </Box>
    )
  }

  const isShortLine = {
    width: '250px',
    display: 'block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }

  //Open drawer

  const [openDrawerView, setOpenDrawerView] = useState(false)
  const [openDrawerEdit, setOpenDrawerEdit] = useState(false)

  return (

    //Ấn enter để gọi filter

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
            Quản lý dịch vụ
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
            {isAccessible('SSDS_C_SERVICE_CREATE') && (
            <Button variant='contained' onClick={() => setOpenCreateService(true)}>
              Thêm dịch vụ
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
          {isAccessible('SSDS_C_SERVICE_LISTING') && (
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
              callFilterFromProps={callFilterFromProps}
              isGenPagination
              count={count}

              // renderAction={renderAction}

              // isFewCol
              isShortLine={isShortLine}
              renderActionItem={renderActionItem}
            />
            )}
          </Card>
        </Grid>
        {/* END Render main content của cái page này */}

        {/* START Định nghĩa các thể loại dialog có thể mở của cái page này */}

        <DialogAlert
          nameDialog={'Có lỗi xảy ra'}
          open={openError}
          allertContent={error}
          handleClose={handleClose}
          onSuccess={() => {
            callFilter(page, size)
          }}
        />
        <DialogCreateService
          open={openCreateService}
          handleClose={handleClose}
          listCategoryCodes={listCategoryCodes}
          listEquipmentCodes={listEquipmentCodes}
          onSuccess={() => {
            callFilter(page, size)
          }}
        />
        {/* END Định nghĩa các thể loại dialog có thể mở của cái page này */}
        <drawerService.DrawerViewService
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
        <drawerService.DrawerEditService
          openDrawer={openDrawerEdit}
          setOpenDrawer={setOpenDrawerEdit}
          selectedItem={itemView}
          setSelectedItem={setItemView}
          setOpenError={setOpenError}
          setError={setError}
          listCategoryCodes={listCategoryCodes}
          listEquipmentCodes={listEquipmentCodes}
          onSuccess={() => {
            callFilter(page, size)
          }}
        />
      </Grid>
      <CustomDialogConfirm nameDialog={'Xác nhận'} open={isOpenConfirmDeactive} handleConfirm={onConfirmDelete}>
        {!currentItem.isActive
          ? 'Bạn có chắc chắc muốn thay đổi trạng thái dịch vụ ?'
          : 'Bạn có chắc chắc muốn thay đổi trạng thái dịch vụ ?'}
      </CustomDialogConfirm>
    </div>
  )
}

export default ManageServiceAdmin
