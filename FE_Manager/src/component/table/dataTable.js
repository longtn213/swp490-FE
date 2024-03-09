import { useState, useEffect, Fragment } from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { Button, Checkbox, IconButton, SnackbarContent, TablePagination, TextField, Tooltip } from '@mui/material'
import Typography from '@mui/material/Typography'
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state'
import { Popover } from '@mui/material'
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar'

import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import CloseIcon from '@mui/icons-material/Close'

const DataTable = props => {

  //Get data from props
  const {
    listData,
    count,
    listTableCellHead,
    listTableCellName,
    listTableCellSort,
    onChangeSort,
    callFilterFromProps,
    isGenPagination,
    isFewCol,
    renderIconActions,
    renderActionItem,
    isHavingCheckboxes,
    messageSnackbar,
    renderActionSnackbar,
    isShortLine, 
    highlightIndice
  } = props

  //Render cái lable cho pagination

  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)

  const [isRerenderLable, setIsRerenderLable] = useState('1')

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setSize(+event.target.value)
    setPage(0)
    setIsRerenderLable(isRerenderLable == '1' ? '0' : '1')
  }

  useEffect(() => {
    isGenPagination && callFilterFromProps(page, size)
  }, [page, size])

  //data in table
  const [records, setRecords] = useState(0)
  useEffect(() => {
    if (!listData) return
    setRecords(listData)
  }, [listData])

  //sticky style
  const sticky = {
    position: 'sticky',
    left: 0,
    background: 'white'
  }

  const [from, setFrom] = useState(page * size + 1)
  const [to, setTo] = useState((page + 1) * size < count ? (page + 1) * size : count)

  useEffect(() => {
    setFrom(page * size + 1)
  }, [page, size])

  useEffect(() => {
    if (!count) return
    setPage(0)
    setTo(count != 0 ? ((page + 1) * size < count ? (page + 1) * size : count) : 0)
    if (count == 0) {
      setFrom(count)
    } else {
      setFrom(page * size + 1)
    }
  }, [count])

  useEffect(() => {
    if (!count) return
    setTo(count != 0 ? ((page + 1) * size < count ? (page + 1) * size : count) : 0)
  }, [from, isRerenderLable])

  function handleDisplay() {
    return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`
  }

  //handle check box
  const [listIdChecked, setListIdChecked] = useState([])
  const [listItemChecked, setListItemChecked] = useState([])

  useEffect(() => {
    const tempListItem = []
    listIdChecked.forEach(id => {
      let filterArr = listData.filter(item => item.id == id)
      if (filterArr.length > 0) {
        tempListItem.push(filterArr[0])
      }
    })
    setListItemChecked(tempListItem)
  }, [listIdChecked])

  const handleClickCheckbox = e => {
    if (listIdChecked.includes(e.target.id)) {
      setListIdChecked(listIdChecked.filter(item => item != e.target.id))
    } else {
      setListIdChecked([...listIdChecked, (e.target.id)])
    }
  }

  //handle Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbar(false)
    setListIdChecked([])
  }

  useEffect(() => {
    if (listIdChecked.length == 0) {
      setOpenSnackbar(false)

      return
    }
    setOpenSnackbar(true)
  }, [listIdChecked])

  const defineActionSnackbar = (
    <Fragment>
      <Typography sx={{ position: 'relative' }}>{messageSnackbar}</Typography>
      {renderActionSnackbar && renderActionSnackbar(handleCloseSnackbar, listItemChecked)}
      <Tooltip title='Bỏ chọn'>
        <IconButton size='small' aria-label='close' color='inherit' onClick={handleCloseSnackbar}>
          <CloseIcon fontSize='small' />
        </IconButton>
      </Tooltip>
    </Fragment>
  )

  return (
    <>
      <TableContainer component={Paper} sx={{ height: '60vh', minWidth: 650 }}>
        <Table sx={isFewCol ? {} : { width: 'max-content' }} stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...sticky, textTransform: 'none', zIndex: 99, borderRight: 1 }}>
                {/* <p>Thao tác</p> */}
                <Typography variant='subtitle1' gutterBottom>
                  {isHavingCheckboxes && (
                    <Checkbox
                      onChange={() => {
                        if (listData.length > 0 && listData.length == listIdChecked.length) {
                          setListIdChecked([])
                        } else {
                          setListIdChecked(listData.map(item => (item.id).toString()))
                        }
                      }}
                      checked={listData.length > 0 && listData.length == listIdChecked.length}
                    />
                  )}
                  Thao tác
                </Typography>
              </TableCell>

              {listTableCellHead.map((item, index) => (
                <TableCell key={index} sx={{ textTransform: 'none' }} align='left'>
                  <div>
                  <Typography variant='subtitle1' gutterBottom>
                    {item.name}
                    <span onClick={()=>{onChangeSort(listTableCellSort[index].sortBy,listTableCellSort[index].sortDirection,index)}} style={{float:"right"}}>
                    {
                      listTableCellSort[index].havingSortIcon && !listTableCellSort[index].sortDirection &&
                      <UnfoldMoreIcon />
                    }
                    {
                      listTableCellSort[index].havingSortIcon && listTableCellSort[index].sortDirection == 'desc' &&
                      <ArrowDownwardIcon />
                    }
                    {
                      listTableCellSort[index].havingSortIcon && listTableCellSort[index].sortDirection == 'asc' &&
                      <ArrowUpwardIcon />
                    }
                    </span>
                  </Typography>
                  <div style={{height:40}}>{item.genFormSearch && item.genFormSearch()}</div>
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {records && records.length > 0 ? (
              records.map((item, index) => {
                return (
                  <TableRow key={index} className={highlightIndice && highlightIndice.length > 0 && highlightIndice.indexOf(index) > -1 ? "hightlight" : ""}>
                    {/* 1st cell */}
                    <TableCell component='th' scope='row' sx={{ ...sticky, borderRight: 1 }}>
                      {isHavingCheckboxes && (
                        <Checkbox
                          id={(item.id).toString()}
                          type='checkbox'
                          onChange={e => handleClickCheckbox(e)}
                          checked={listIdChecked.includes((item.id).toString())}
                        />
                      )}
                      {renderActionItem && (
                        <PopupState variant='popover' popupId='demo-popup-popover'>
                          {popupState => (
                            <>
                              <IconButton {...bindTrigger(popupState)}>{renderIconActions()}</IconButton>
                              <Popover
                                {...bindPopover(popupState)}
                                anchorOrigin={{
                                  vertical: 'center',
                                  horizontal: 'right'
                                }}
                                transformOrigin={{
                                  vertical: 'center',
                                  horizontal: 'left'
                                }}
                              >
                                {renderActionItem(item, popupState,handleCloseSnackbar)}
                              </Popover>
                            </>
                          )}
                        </PopupState>
                      )}
                    </TableCell>
                    {/* the rest cells */}
                    {listTableCellName.map((itemField, indexCell) => {
                      return (
                        <TableCell key={indexCell} align='left' >
                          <Typography variant='subtitle2' gutterBottom sx={isShortLine}>
                            {item[`${itemField}`]?.length > 40 ? `${item[`${itemField}`].substring(0, 36)}...` : item[`${itemField}`]}
                          </Typography>
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })
            ) : (
              <TableRow
                sx={{
                  '&:last-of-type td, &:last-of-type th': {
                    border: 0
                  }
                }}
              >
                <TableCell component='th' scope='row'>
                  {'Không có bản ghi nào'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {isGenPagination && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component='div'
          count={count}
          rowsPerPage={size}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={() => handleDisplay()}
        />
      )}
      <Snackbar
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <SnackbarContent
          style={{ backgroundColor: 'white', color: 'black', height: 50 }}
          message={`${listIdChecked.length}`}
          action={defineActionSnackbar}
        />
      </Snackbar>
    </>
  )
}

export default DataTable
