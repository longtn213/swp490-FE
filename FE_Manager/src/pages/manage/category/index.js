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
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

//Component import
import DataTable from '../../../component/table/dataTable'
import DialogFormSearch from '../../../component/dialog/dialogForSelectDate'
import DialogAlert from '../../../component/dialog/dialogAlert'
import * as DrawerCategory from '../../../component/drawer/drawerCategory'

//API import
import { deleteCategory, filterCategory } from '../../../api/category/categoryApi'
import { callApiGetProfile, isAccessible } from 'src/api/auth/authApi'

//utils import
import { DotsVertical } from 'mdi-material-ui'
import DialogCreateCategory from 'src/component/dialog/category/dialogCreateCategory'
import { useRouter } from 'next/router'
import CommonAlert from 'src/component/common/Alert'
import CustomDialogConfirm from 'src/component/dialog/customDialogConfirm'

const ManageCategoryAdmin = () => {
  const router = useRouter()

  // Page Authorization
  useEffect(() => {
    callApiGetProfile()

    if (!isAccessible('SSDS_P_CATEGORY')) {
      router.push('/')
    }
  }, [router.asPath])

  //=================================================
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
      name: 'Tên danh mục'

      // genFormSearch: () => {
      //   return (
      //     <TextField
      //       id='outlined-search'
      //       type='search'
      //       size='small'
      //       sx={{ width: 150 }}
      //       name='name'
      //       onChange={onChangeTextAndSelectField}
      //       value={name.value}
      //     />
      //   )
      // }
    },

    // {
    //   name: 'Mã danh mục',
    //   genFormSearch: () => {
    //     return (
    //       <TextField
    //         id='outlined-search'
    //         type='search'
    //         size='small'
    //         sx={{ width: 150 }}
    //         name='code'
    //         value={code.value}
    //       />
    //     )
    //   }
    // },
    {
      name: 'Miêu tả'

      // genFormSearch: () => {
      //   return (
      //     <TextField
      //       id='outlined-search'
      //       type='search'
      //       size='small'
      //       sx={{ width: 150 }}
      //       name='description'
      //       onChange={onChangeTextAndSelectField}
      //       value={description.value}
      //     />
      //   )
      // }
    }
  ]

  const [listTableCellSort, setListTableCellSort] = useState([
    {
      name: 'Id',
      havingSortIcon: false,
      sortBy: 'id',
      sortDirection: ''
    },

    // {
    //   name: 'Tên danh mục',
    //   havingSortIcon: false,
    //   sortBy: 'name',
    //   sortDirection: ''
    // },
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
  const listTableCellName = [
    'id',
    'name',

    // 'code',

    'description'
  ]

  //====================================================================================
  //click to sort
  const [sortInfo, setSortInfo] = useState({
    sortBy: 'name',
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
    code: {
      value: '',
      operator: 'contains'
    },
    description: {
      value: '',
      operator: 'contains'
    }
  }

  const [queryParam, setQueryParam] = useState(defaultQueryParam)

  const {
    name,

    // code,

    description
  } = queryParam

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

  //get filter data to fill to table
  const [list, setList] = useState(0)

  //Tạo data trong bảng với tên attribute custom
  const createData = (
    id,
    name,

    // code,
    description
  ) => {
    return {
      id,
      name,

      // code,
      description
    }
  }

  const callFilter = async (pageProp, sizeProp) => {
    const data = await filterCategory(queryParam ? queryParam : defaultQueryParam, pageProp, sizeProp)
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
          item.name,

          // item.code,
          item.description
        )
      )
    })
    setList(tempList)
  }

  //First call when go into this page
  useEffect(() => {
    callFilter(page, size)
  }, [])

  //====================================================================================
  //MỞ DIALOG CHO TỪNG LOẠI THỜI GIAN
  //   'expectedStartTime',

  // Dialog khi có lỗi
  const [error, setError] = useState('')
  const [openError, setOpenError] = useState(false)

  const [currentId, setCurrentId] = useState()
  const [listCurrentId, setlistCurrentId] = useState([])

  // Dialog add category
  const [openCreateCategory, setOpenCreateCategory] = useState(false)

  //đóng dialog
  const handleClose = () => {
    setOpenError(false)
    setOpenCreateCategory(false)
  }

  //====================================================================================
  //Khi search theo các trường select, thì chỉ cần chọn là gọi filter lại
  //   useEffect(()=>{
  //     callFilter(page,size);
  //   },[])

  //Item data trong drawwer (view, edit, checkout)
  const [itemView, setItemView] = useState()
  const [itemEdit, setItemEdit] = useState()

  //Tạo action vertical dot
  const renderActionItem = (item, popupState, handleCloseSnackbar) => {
    return (
      <Box sx={{ py: 1 }}>
        {isAccessible('SSDS_C_CATEGORY_DETAIL') && (
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

        {isAccessible('SSDS_C_CATEGORY_UPDATE') && (
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
        {isAccessible('SSDS_C_CATEGORY_DELETE') && (
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
        {isAccessible('SSDS_C_CATEGORY_DELETE') && (
          <Tooltip
            title='Xóa tất cả'
            onClick={() => {
              handleCloseSnackbar()
              setIsOpenConfirmDelete(true)
              setCurrentId(-1)
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
  //Xóa category

  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false)

  const onConfirmDelete = confirm => {
    if (confirm == true && currentId != -1) {
      handleSingleDeleteCategory(currentId)
    } else if (confirm == true && currentId == -1) {
      console.log(listCurrentId)
      handleMultiDeleteCategory(listCurrentId)
      setlistCurrentId([])
    }
    setIsOpenConfirmDelete(false)
  }

  const handleSingleDeleteCategory = id => {
    const listId = [id]
    callApiDeleteCategory(listId)
  }

  const handleMultiDeleteCategory = listItem => {
    var listId = []
    listItem.map(item => {
      listId.push(item.id)
    })
    callApiDeleteCategory(listId)
  }

  const alertCallback = () => {
    setOpenAlert(false)
    router.push('/manage/category')
  }

  const callApiDeleteCategory = async listId => {
    const data = await deleteCategory(listId)
    if (!data || data.meta.code != 200) {
      setError(data.meta.message)
      setOpenError(true)
    } else {
      setAlertProps(['Bạn đã xoá danh mục thành công', ''])
    }
    setOpenAlert(true)
    callFilter(page, size)
  }

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
            Quản lý danh mục
          </Typography>
          <CommonAlert
            open={openAlert}
            param={''}
            okLabel={'Ok'}
            okCallback={alertCallback}
            message={alertProps[1]}
            title={alertProps[0]}
            variant={'oneButton'}
          />
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
            {isAccessible('SSDS_C_CATEGORY_CREATE') && (
            <Button variant='contained' onClick={() => setOpenCreateCategory(true)}>
              Thêm danh mục
            </Button>
            )}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Card>
            {isAccessible('SSDS_C_CATEGORY_LISTING') && (
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
                messageSnackbar={'Loại danh mục được chọn'}
                renderActionSnackbar={renderActionSnackbar}
              />
            )}
          </Card>
        </Grid>

        <DialogAlert nameDialog={'Có lỗi xảy ra'} open={openError} allertContent={error} handleClose={handleClose} />
        <DialogCreateCategory
          open={openCreateCategory}
          handleClose={handleClose}
          onSuccess={() => {
            callFilter(page, size)
          }}
        />
        {/* END Định nghĩa các thể loại dialog có thể mở của cái page này */}
        {/* START Định nghĩa Drawer của page này */}
        <DrawerCategory.DrawerViewCategory
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
        <DrawerCategory.DrawerEditCategory
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
        {/* END Định nghĩa các thể loại dialog có thể mở của cái page này */}
      </Grid>
      <CustomDialogConfirm nameDialog={'Xác nhận'} open={isOpenConfirmDelete} handleConfirm={onConfirmDelete}>
        Bạn có chắc chắc muốn xóa danh mục này
      </CustomDialogConfirm>
    </div>
  )
}

export default ManageCategoryAdmin
