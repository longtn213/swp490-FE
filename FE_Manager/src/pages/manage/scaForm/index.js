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
import VisibilityIcon from '@mui/icons-material/Visibility'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { styled } from '@mui/material/styles'
import Switch from '@mui/material/Switch'

//Component import
import DataTable from '../../../component/table/dataTable'
import DialogFormSearch from '../../../component/dialog/dialogForSelectDate'
import DialogAlert from '../../../component/dialog/dialogAlert'
import * as DrawerSca from '../../../component/drawer/drawerSca'

//API import
import { getListSca, addSca } from '../../../api/scaForm/scaApi'
import { getAppMasterStatus, getAppMasterReasonCancel } from '../../../api/common/commonApi'
import { editSca } from 'src/api/scaForm/scaApi'
import CommonAlert from 'src/component/common/Alert'

//utils import
import { DotsVertical } from 'mdi-material-ui'
import DialogCreateSCA from 'src/component/dialog/sca/dialogCreateSCA'
import { ExcelRenderer } from 'react-excel-renderer'

import { useRouter } from 'next/router'
import CustomDialogConfirm from 'src/component/dialog/customDialogConfirm'
import { callApiGetProfile, isAccessible } from 'src/api/auth/authApi'

const ManageScaAdmin = () => {
  const router = useRouter()

    // Page Authorization

    useEffect(() => {
      callApiGetProfile()
      if (!isAccessible('SSDS_P_SCA_FORM')) {
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
  const [file, setFile] = useState()

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
      name: 'Tên khảo sát'
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
      name: 'Tên danh mục',
      havingSortIcon: false,
      sortBy: 'scaName',
      sortDirection: ''
    },
    {
      name: 'Mã',
      havingSortIcon: false,
      sortBy: 'scaCode',
      sortDirection: ''
    },
    {
      name: 'Mô tả',
      havingSortIcon: false,
      sortBy: 'scaDesc',
      sortDirection: ''
    }
  ])

  //Table row
  //List table cell name
  const listTableCellName = ['id', 'scaName', 'scaCode', 'scaDesc']

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
    scaName: {
      value: '',
      operator: 'contains'
    },
    scaCode: {
      value: '',
      operator: 'contains'
    },
    scaDesc: {
      value: '',
      operator: 'contains'
    }
  }

  const [queryParam, setQueryParam] = useState(defaultQueryParam)

  const { scaName, scaCode, scaDesc } = queryParam

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
  const [list, setList] = useState([])
  const [fullList, setFullList] = useState([])

  //Tạo data trong bảng với tên attribute custom
  const createData = (id, scaName, scaCode, scaDesc) => {
    return {
      id,
      scaName,
      scaCode,
      scaDesc
    }
  }

  const getFullList = async () => {
    const res = await getListSca()
    if (!res) return
    if (res.meta.code != 200) {
      setError(res.meta.message)
      setOpenError(true)

      return
    }

    setFullList([...res.data])
  }

  const callFilter = async () => {
    const data = await getListSca()
    if (!data) return
    if (data.meta.code != 200) {
      setError(data.meta.message)
      setOpenError(true)

      return
    }

    if (!data.data) return
    console.log(data.data)
    setCount(data.meta.total)
    const tempList = []
    const tempListdeactive = []
    data.data.forEach((item, index) => {
      tempList.push
      (createData(
        item.id, 
        item.name,
        item.code, 
        item.description
      )
      )
      if (!item.active) {
        tempListdeactive.push(index)
      }
    })
    setArraydeactive(tempListdeactive)
    setList(tempList)
  }

  //First call when go into this page
  useEffect(() => {
    callFilter(page, size)
    getFullList()
  }, [])

  //====================================================================================
  //MỞ DIALOG CHO TỪNG LOẠI THỜI GIAN
  //   'expectedStartTime',

  // Dialog khi có lỗi
  const [error, setError] = useState('')
  const [openError, setOpenError] = useState(false)

  // Dialog add category
  const [openCreateSca, setOpenCreateSca] = useState(false)

  //đóng dialog
  const handleClose = () => {
    setOpenError(false)
    setOpenCreateSca(false)
  }

  const [isOpenConfirmDeactive, setIsOpenConfirmDeactive] = useState(false)

  const onConfirmDelete = confirm => {
    if (confirm == true && currentItem != null) {
      handleChageActive(currentItem);
    }

   // setCurrentItem(null)

    setIsOpenConfirmDeactive(false)
  }

  

  const handleChageActive = item => {
    const newItem = Object.assign(item, {
      ...item,
      questions: fullList.filter(el => el.id === item.id)[0].questions
        ? [...fullList.filter(el => el.id === item.id)[0].questions]
        : [],
      isActive: fullList.length > 0 ? fullList.filter(el => el.id === item.id)[0].active : false
    })

    var data = {
      id: newItem.id,
      name: newItem.scaName,
      code: newItem.scaCode,
      description: newItem.scaDesc,
      questions: newItem.questions,
      active: !newItem.isActive
    }
    callApieditSca(data)
  }

  const callApieditSca = async item => {
    const data = await editSca(item)

    if (!data || data.meta.code != 200) {
      setError(data.meta.message)
      setOpenError(true)
    } else {
      if (item.active == true) {
        setAlertProps(['Bạn đã mở form thành công', ''])
      } else {
        setAlertProps(['Bạn đã đóng form thành công', ''])
      }
    }
    setOpenAlert(true)
    callFilter(page, size)
    getFullList()
  }

  // const selectFile = e => {
  //   const excelFile = e.target.files[0]
  //   if (!excelFile.name.match(/\.(xls|xlsx)$/)) {
  //     setError('Chỉ được chọn file excel')
  //     setOpenError(true)
  //     e.target.value = null
  //   } else {
  //     setFile(e.target.files[0])
  //     console.log(e.target.files)
  //   }
  // }

  // const importExcel = e => {
  //   let excelSheet = file
  //   ExcelRenderer(excelSheet, (err, res) => {
  //     if (err) {
  //       console.log(err)
  //     } else if (
  //       res.rows[0][0] != 'name' &&
  //       res.rows[0][1] != 'code' &&
  //       res.rows[0][2] != 'description' &&
  //       res.rows[0][3] != 'questions'
  //     ) {
  //       setError('File excel không hợp lệ')
  //       setOpenError(true)
  //     } else {
  //       res.rows
  //         .filter((el, index1) => index1 !== 0)
  //         .forEach((row, index2) => {
  //           let newData = Object.assign(
  //             {},
  //             {
  //               name: row[0],
  //               code: row[1],
  //               description: row[2],
  //               questions: JSON.parse(row[3])
  //             }
  //           )

  //           //console.log(newData)

  //           setTimeout(function () {
  //             callCreateSca(newData)
  //           }, index2 * 1000)
  //         })

  //       console.log(res)
  //       if (res) {
  //         setTimeout(function () {
  //           setAlertProps(['Bạn đã import form thành công', ''])
  //           setOpenAlert(true)
  //         }, res.rows.length * 1000)
  //       } else {
  //         setAlertProps(['import không thành công', ''])
  //       }
  //     }
  //   })
  // }

  const callCreateSca = async newSca => {
    const data = await addSca(newSca)
    if (!data) return
    if (data.meta.code != 200) {
      setError(data.meta.message)
      setOpenError(true)

      return
    }
  }

  //Item data trong drawwer (view, edit, checkout)
  const [itemView, setItemView] = useState({ questions: [] })
  const [openDrawerEdit, setOpenDrawerEdit] = useState(false)
  const [arraydeactive, setArraydeactive] = useState([])
  const [currentItem, setCurrentItem] = useState({active : false })

  const isShortLine = {
    width: '250px',
    display: 'block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }

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

  //Tạo action vertical dot
  const renderActionItem = (item, popupState, handleCloseSnackbar) => {
    return (
      <Box
        sx={{ py: 1 }}
        onClick={() => {
          const newItem = Object.assign(item, {
            ...item,
            questions: fullList.filter(el => el.id === item.id)[0].questions
              ? [...fullList.filter(el => el.id === item.id)[0].questions]
              : [],
            isActive: fullList.length > 0 ? fullList.filter(el => el.id === item.id)[0].active : false
          })

          setItemView(newItem)
        }}
      >
        {isAccessible('SSDS_C_SCA_FORM_DETAIL') && (
        <MenuItem
          sx={{ py: 1 }}
          onClick={() => {
            popupState.close()
            setOpenDrawerView(true)
          }}
        >
          <VisibilityIcon sx={{ mr: 1 }} />
          Xem chi tiết
        </MenuItem>
        )}
        {isAccessible('SSDS_C_SCA_FORM_UPDATE') && (
        <MenuItem
          sx={{ py: 1 }}
          onClick={() => {
            popupState.close()
            setOpenDrawerEdit(true)
          }}
        >
          <EditIcon sx={{ mr: 1 }} />
          Chỉnh sửa
        </MenuItem>
        )}
        {isAccessible('SSDS_C_SCA_FORM_DEACTIVE_ACTIVE') && (
        <MenuItem>
          <Android12Switch
            checked={
              fullList.length > 0 && item.id !== undefined ? fullList.filter(el => el.id === item.id)[0].active : false
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

  const [openDrawerView, setOpenDrawerView] = useState(false)

  const alertCallback = () => {
    setOpenAlert(false)
    router.push('/manage/scaForm')
  }

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
            Quản lý form tư vấn
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
            {isAccessible('SSDS_C_SCA_FORM_CREATE') && (
            <Button variant='contained' onClick={() => router.push('/manage/scaForm/add')}>
              Thêm khảo sát mới
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
          {isAccessible('SSDS_C_SCA_FORM_LISTING') && (
            <DataTable
              listData={list}
              listTableCellHead={listTableCellHead}
              listTableCellName={listTableCellName}
              highlightIndice={arraydeactive}
              renderIconActions={() => {
                return <DotsVertical />
              }}
              isShortLine={isShortLine}
              listTableCellSort={listTableCellSort}
              onChangeSort={onChangeSort}
              isGenPagination={false}
              isFewCol
              renderActionItem={renderActionItem}
            />
            )}
          </Card>
        </Grid>
        <DrawerSca.DrawerViewSca
          openDrawer={openDrawerView}
          setOpenDrawer={setOpenDrawerView}
          selectedItem={itemView}
          setSelectedItem={setItemView}
          setOpenError={setOpenError}
          setError={setError}
          onSuccess={() => {
            callFilter(page, size)
            getFullList()
          }}
        />
        <DrawerSca.DrawerEditSca
          openDrawer={openDrawerEdit}
          setOpenDrawer={setOpenDrawerEdit}
          selectedItem={itemView || { questions: [], id: 0, scaName: '', scaCode: '' }}
          setSelectedItem={setItemView}
          setOpenError={setOpenError}
          setError={setError}
          onSuccess={param => {
            callFilter(page, size)
            getFullList()
            if (open !== undefined) {
              setOpenDrawerEdit(param)
            }
          }}
        />
        <DialogAlert
          nameDialog={'Thông tin search không hợp lệ'}
          open={openError}
          allertContent={error}
          handleClose={handleClose}
        />
        <DialogCreateSCA
          open={openCreateSca}
          handleClose={handleClose}
          onSuccess={() => {
            callFilter(page, size)
            getFullList()
          }}
        />
        {/* END Định nghĩa các thể loại dialog có thể mở của cái page này */}
      </Grid>
        <CustomDialogConfirm nameDialog={'Xác nhận'} open={isOpenConfirmDeactive} handleConfirm={onConfirmDelete}>
          {!currentItem.active ? 'Bạn có chắc chắc muốn thay đổi trạng thái form ?' : 'Bạn có chắc chắc muốn thay đổi trạng thái form ?'}
        </CustomDialogConfirm>
    </div>
  ) 
}

export default ManageScaAdmin
