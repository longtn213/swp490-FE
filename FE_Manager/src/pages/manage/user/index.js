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

//API import
import { filterUser, getListUser } from '../../../api/user/userApi'

import { DotsVertical } from 'mdi-material-ui'
import DialogCreateUser from 'src/component/dialog/user/dialogCreateUser'
import DialogImportRolePermission from 'src/component/dialog/role/dialogImportRolePermission'
import DialogChangeDefaultPassword from 'src/component/dialog/user/DialogChangeDefaultPassword' 
import { callApiGetProfile, isAccessible } from 'src/api/auth/authApi'
import { useRouter } from 'next/router'

const ManageUserAdmin = () => {
  const router = useRouter()

  // Page Authorization

  useEffect(() => {
    callApiGetProfile()
    if (!isAccessible('SSDS_P_ACCOUNT')) {
      router.push('/')
    }
  }, [router.asPath])

  //====================================================================================
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [count, setCount] = useState(0)

  const callFilterFromProps = (pageProp, sizeProp) => {
    callFilter(pageProp, sizeProp)
  }

  const sticky = {
    position: 'sticky',
    left: 0,
    background: 'white'
  }

  const listTableCellHead = [
    {
      name: 'Id'
    },
    {
      name: 'Tên',
      genFormSearch: () => {
        return (
          <TextField
            id='outlined-search'
            type='search'
            size='small'
            sx={{ width: 150 }}
            name='fullName'
            onChange={onChangeTextAndSelectField}
            value={fullName.value}
          />
        )
      }
    },
    {
      name: 'Số điện thoại',
      genFormSearch: () => {
        return (
          <TextField
            id='outlined-search'
            type='search'
            size='small'
            sx={{ width: 150 }}
            name='phoneNumber'
            onChange={onChangeNumberField}
            value={phoneNumber.value}
          />
        )
      }
    },
    {
      name: 'Tên đăng nhập',
      genFormSearch: () => {
        return (
          <TextField
            id='outlined-search'
            type='search'
            size='small'
            sx={{ width: 150 }}
            name='username'
            onChange={onChangeTextAndSelectField}
            value={username.value}
          />
        )
      }
    },
    {
      name: 'Giới tính'
    },
    {
      name: 'Trạng thái hoạt động'
    },
    {
      name: 'Email',
      genFormSearch: () => {
        return (
          <TextField
            id='outlined-search'
            type='search'
            size='small'
            sx={{ width: 150 }}
            name='email'
            onChange={onChangeTextAndSelectField}
            value={email.value}
          />
        )
      }
    },
    {
      name: 'Vai trò người dùng',
      genFormSearch: () => {
        return (
          <FormControl>
            <InputLabel id='status-select-label'>Vai trò</InputLabel>
            <Select
              labelId='status-select-label'
              id='demo-simple-select'
              label='Vai trò'
              name='role'
              size='small'
              value={role.value}
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
      name: 'Tên',
      havingSortIcon: true,
      sortBy: 'fullName',
      sortDirection: ''
    },
    {
      name: 'Số điện thoại',
      havingSortIcon: true,
      sortBy: 'phoneNumber',
      sortDirection: ''
    },
    {
      name: 'Tên đăng nhập',
      havingSortIcon: true,
      sortBy: 'username',
      sortDirection: ''
    },
    {
      name: 'Giới tính',
      havingSortIcon: false,
      sortBy: 'gender',
      sortDirection: ''
    },
    {
      name: 'Trạng thái',
      havingSortIcon: false,
      sortBy: 'isActive',
      sortDirection: ''
    },
    {
      name: 'Email',
      havingSortIcon: true,
      sortBy: 'email',
      sortDirection: ''
    },
    {
      name: 'Vai trò',
      havingSortIcon: true,
      sortBy: 'role',
      sortDirection: ''
    }
  ])

  //Table row
  //List table cell name
  const listTableCellName = ['id', 'fullName', 'phoneNumber', 'username', 'gender', 'userStatus', 'email', 'role']

  const [sortInfo, setSortInfo] = useState({
    sortBy: 'fullName',
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
    fullName: {
      value: '',
      operator: 'contains'
    },
    phoneNumber: {
      value: '',
      operator: 'contains'
    },
    username: {
      value: '',
      operator: 'contains'
    },
    gender: {
      value: '',
      operator: 'contains'
    },
    email: {
      value: '',
      operator: 'contains'
    },
    role: {
      value: '',
      operator: 'contains'
    }
  }

  const [queryParam, setQueryParam] = useState(defaultQueryParam)

  const { fullName, phoneNumber, username, gender, userStatus, email, role } = queryParam

  //====================================================================================
  //ONCHANGE CHO TỪNG LOẠI FIELD

  //cho các trường chỉ search theo free-text và select giá trị

  const onChangeTextAndSelectField = e => {
    e.preventDefault()
    setQueryParam({
      ...queryParam,
      [`${e.target.name}`]: { ...queryParam[`${e.target.name}`], ['value']: e.target.value }
    })

    console.log(e.target.value)
    console.log(e.target.name)

    if (e.target.name == 'role') {
      setSortInfo({ ...sortInfo, role: e.target.value })
      console.log(e.target.value)
      callFilter()
    }
  }

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
  const [list, setList] = useState([])
  const [fullList, setFullList] = useState([])

  const getRoleUser = () => {
    const tempLst = []

    tempLst.push({
      code: 'RECEPTIONIST',
      name: 'Lễ tân'
    })
    tempLst.push({
      code: 'CUSTOMER',
      name: 'Khách hàng'
    })
    tempLst.push({
      code: 'SPECIALIST',
      name: 'Chuyên viên chăm sóc'
    })
    tempLst.push({
      code: 'MANAGER',
      name: 'Quản lí'
    })
    setListStatusCodes(tempLst)
  }

  const [listStatusCodes, setListStatusCodes] = useState([])

  const callGetListRole = async () => {
    const data = await getListUser()
    if (!data) return
    if (!data.data) return
    const tempLst = []
    data.data.forEach(element => {
      tempLst.push({
        code: element.role.code,
        name: element.role.name
      })
      console.log(element.role.code)
    })
    setListStatusCodes(tempLst)
  }

  //Tạo data trong bảng với tên attribute custom
  const createData = (id, fullName, phoneNumber, username, gender, userStatus, email, role) => {
    return {
      id,
      fullName,
      phoneNumber,
      username,
      gender,
      userStatus,
      email,
      role
    }
  }

  const getFullList = async () => {
    const res = await getListUser()
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
    const data = await filterUser(queryParam ? queryParam : defaultQueryParam, pageProp, sizeProp, sortInfo)
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
      var genderUser
      item.gender === true ? (genderUser = 'Nam') : (genderUser = 'Nữ')
      var activeStatus
      item.isActive === true ? (activeStatus = 'Đang hoạt động') : (activeStatus = 'Đã vô hiệu hóa')
      tempList.push(
        createData(
          item.id,
          item.fullName,
          item.phoneNumber,
          item.username,
          genderUser,
          activeStatus,
          item.email,
          item.role.name
        )
      )
    })
    setList(tempList)
  }

  //First call when go into this page
  useEffect(() => {
    callFilter(page, size)
    getFullList()
    getRoleUser()
  }, [])

  // Dialog khi có lỗi
  const [error, setError] = useState('')
  const [openError, setOpenError] = useState(false)

  // Dialog create user
  const [openCreateUser, setOpenCreateUser] = useState(false)

  const [openDefaultPassword, setOpenDefaultPassword] = useState(false)

  // Dialog import phân quyền
  const [openImportPermission, setOpenImportPermission] = useState(false)

  //đóng dialog
  const handleClose = () => {
    setOpenError(false)
  }

  const isShortLine = {
    width: '250px',
    display: 'block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
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
            Quản lý người dùng
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
            <Box>
            {isAccessible('SSDS_C_ACCOUNT_PERMISSION') && (
              <Button variant='contained' style={{ marginRight: 10 }} onClick={() => setOpenImportPermission(true)}>
                Import phân quyền
              </Button>
              )}
              {isAccessible('SSDS_C_ACCOUNT_DEFAULT_PASSWORD') && (
                <Button variant='contained' style={{ marginRight: 10 }} onClick={() => setOpenDefaultPassword(true)}>
                  Cài lại mật khẩu
                </Button>
              )}
              {isAccessible('SSDS_C_ACCOUNT_CREATE') && (
                <Button variant='contained' ml={4} onClick={() => setOpenCreateUser(true)}>
                  Thêm người dùng
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Card>
            {isAccessible('SSDS_C_ACCOUNT_LISTING') && (
              <DataTable
                listData={list}
                listTableCellHead={listTableCellHead}
                listTableCellName={listTableCellName}
                callFilterFromProps={callFilterFromProps}
                renderIconActions={() => {
                  return <DotsVertical />
                }}
                listTableCellSort={listTableCellSort}
                isGenPagination
                isShortLine={isShortLine}
                onChangeSort={onChangeSort}
                count={count}
                isFewCol
              />
            )}
          </Card>
        </Grid>
        <DialogAlert
          nameDialog={'Có lỗi xảy ra'}
          open={openError}
          allertContent={error}
          handleClose={handleClose}
          onSuccess={() => {
            callFilter(page, size)
          }}
        />

        <DialogCreateUser
          open={openCreateUser}
          setOpen={setOpenCreateUser}
          handleClose={handleClose}
          error={error}
          setError={setError}
          openError={openError}
          setOpenError={setOpenError}
          onSuccess={() => {
            callFilter(page, size)
          }}
        />

        <DialogChangeDefaultPassword
          open={openDefaultPassword}
          setOpen={setOpenDefaultPassword}
          handleClose={handleClose}
          error={error}
          setError={setError}
          openError={openError}
          setOpenError={setOpenError}
          onSuccess={() => {
            callFilter(page, size)
          }}
        />

        <DialogImportRolePermission
          open={openImportPermission}
          setOpen={setOpenImportPermission}
          handleClose={handleClose}
          error={error}
          setError={setError}
          openError={openError}
          setOpenError={setOpenError}
          onSuccess={() => {
            callFilter(page, size)
          }}
        />

        {/* END Định nghĩa các thể loại dialog có thể mở của cái page này */}
        {/* START Định nghĩa Drawer của page này */}

        {/* END Định nghĩa các thể loại dialog có thể mở của cái page này */}
      </Grid>
    </div>
  )
}

export default ManageUserAdmin
