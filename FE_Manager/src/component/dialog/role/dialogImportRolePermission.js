import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import { Box } from '@mui/system'
import { Download, Upload } from '@mui/icons-material'
import { Paper, Table, TableBody, TableHead, TableRow } from '@mui/material'
import { makeStyles, TableCell } from '@material-ui/core'
import { ExcelRenderer } from 'react-excel-renderer'
import { importRolePermission } from 'src/api/role/roleApi'

const useStyles = makeStyles({
  error: {
    backgroundColor: 'red'
  },
  valid: {
    backgroundColor: 'white'
  }
})

function DialogImportRolePermission(props) {
  const { open, setOpen, handleClose, onSuccess, error, setError, openError, setOpenError } = props

  const classes = useStyles()

  // ** States
  const [importedData, setImportedData] = useState()
  const [errorCellAxis, setErrorCellAxis] = useState()

  const handleCloseDialog = () => {
    setOpen(false)
    setImportedData()
    setErrorCellAxis()
    handleClose()
    onSuccess()
  }

  const handleImport = () => {
    console.log(importedData)
    console.log(errorCellAxis)

    if(importedData === undefined) {
      setError("Bạn chưa tải dữ liệu phân quyền, không thể thực hiện việc import. Vui lòng thử lại.")
      setOpenError(true)

      return
    }

    if(errorCellAxis) {
      errorCellAxis.forEach(element => {
        element.forEach(item => {
          if(item) {
            setError("Dữ liệu được tải lên không hợp lệ. Vui lòng kiểm tra và thử lại.")
            setOpenError(true)

            return
          }
        })
      });
    } else {
      return
    }

    let data = []

    importedData.map((item) => {
      if(item[1] == "YES") {
        data.push({
          permissionCode: item[0],
          roleCode: "MANAGER",
          isActive: true
        })
      }
      if(item[2] == "YES") {
        data.push({
          permissionCode: item[0],
          roleCode: "RECEPTIONIST",
          isActive: true
        })
      }
      if(item[3] == "YES") {
        data.push({
          permissionCode: item[0],
          roleCode: "CUSTOMER",
          isActive: true
        })
      }
    })

    console.log("Final data: ", data);

    callApiImportRolePermission(data)

  }

  const callApiImportRolePermission = async (data) => {
    const res = await importRolePermission(data)
      if(!res) return
      if(res.meta.code != 200) {
        setError(res.meta.message)
        setOpenError(true)

        return
      }

      handleCloseDialog()
  }

  const permissionCodeRegex = /^(([A-Z0-9]+(_[A-Z0-9]+)*)|([A-Z0-9])+)$/
  const permissionRoleRegex = /^(YES|NO|)$/

  const handleUpload = e => {
    let excelSheet = e.target.files[0]
    if(!excelSheet) return
    if (!excelSheet.name.match(/\.(xls|xlsx)$/)) {
      setError('Chỉ được chọn file excel')
      setOpenError(true)
      e.target.value = null

      return
    }
    ExcelRenderer(excelSheet, (err, res) => {
      if (err) {
        console.log(err)

        return
      } else {
        setImportedData()
        setErrorCellAxis()
        let tempErrorCellAxis = []
        let tempImportedData = []

        res.rows.map((item, index) => {
          if(typeof item === undefined || item.length === 0) return
          if (index > 2) {
            let temp = [null, null, null, null]
            let temp2 = [false, false, false, false]
            if (item[0]) {
              if (!permissionCodeRegex.test(item[0])) {
                temp2[0] = true
              }
              temp[0] = item[0]
            } else {
              temp2[0] = true
            }

            if (item[1]) {
              if (!permissionRoleRegex.test(item[1])) {
                temp2[1] = true
              }
              temp[1] = item[1]
            }

            if (item[2]) {
              if (!permissionRoleRegex.test(item[2])) {
                temp2[2] = true
              }
              temp[2] = item[2]
            }

            if (item[3]) {
              if (!permissionRoleRegex.test(item[3])) {
                temp2[3] = true
              }
              temp[3] = item[3]
            }

            tempImportedData.map(importedItem => {
              if(importedItem[0] === item[0]) temp2[0] = true
            })

            tempImportedData.push(temp)
            tempErrorCellAxis.push(temp2)
          }
        })

        setErrorCellAxis(tempErrorCellAxis)

        setImportedData(tempImportedData)

        console.log(res)
        if (res) {
          console.log('oke')
        } else {
          console.log('Failed')
        }
      }
    })
  }

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
      onKeyPress={ev => {
        if (ev.key === 'Enter') {
          ev.preventDefault()
        }
      }}
      fullWidth
      maxWidth='lg'
    >
      <DialogTitle>Import dữ liệu phân quyền</DialogTitle>
      <DialogContent sx={{ height: '80vh' }}>
        <Box mt={3}>
          <Paper sx={{ width: '100%', overflowX: 'auto' }}>
            <Table sx={{ minWidth: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell>Mã quyền</TableCell>
                  <TableCell align='right'>Quản lý</TableCell>
                  <TableCell align='right'>Lễ tân</TableCell>
                  <TableCell align='right'>Khách hàng</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {errorCellAxis &&
                  importedData &&
                  importedData?.map((item, y) => {
                    return (
                      <TableRow key={y}>
                        <TableCell
                          className={errorCellAxis[y][0] ? classes.error : classes.valid}
                          component='th'
                          scope='row'
                        >
                          {item[0]}
                        </TableCell>
                        <TableCell className={errorCellAxis[y][1] ? classes.error : classes.valid} align='right'>
                          {item[1]}
                        </TableCell>
                        <TableCell className={errorCellAxis[y][2] ? classes.error : classes.valid} align='right'>
                          {item[2]}
                        </TableCell>
                        <TableCell
                          className={errorCellAxis[y][3] == true ? classes.error : classes.valid}
                          align='right'
                        >
                          {item[3]}
                        </TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' component='label' sx={{ marginRight: 3 }} startIcon={<Upload />}>
          Tải lên
          <input
            type='file'
            hidden
            accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
            onClick={e => (e.target.value = null)}
            onChange={e => handleUpload(e)}
          ></input>
        </Button>
        <a href={"/file/Role_Permission_Sample.xlsx"} download style={{textDecoration: 'none'}}>
        <Button variant='outlined' startIcon={<Download />}>
          Tải bản mẫu
        </Button>
        </a>
        
        <div style={{ flexGrow: 1 }}></div>
        <Button
          onClick={() => {
            handleCloseDialog()
          }}
          variant='outlined'
        >
          Đóng
        </Button>
        <Button variant='contained' onClick={() => handleImport()}>
          Import
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogImportRolePermission
