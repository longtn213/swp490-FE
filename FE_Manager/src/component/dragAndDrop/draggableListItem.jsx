import { Draggable } from 'react-beautiful-dnd'
import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { TextField, Box, IconButton, TextareaAutosize } from '@mui/material'
import PanToolIcon from '@mui/icons-material/PanTool'
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded'
import ListItem from '@mui/material/ListItem'
import CustomDialogConfirm from '../dialog/customDialogConfirm'

export default function DraggableListItem(props) {
  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false)

  const onConfirmDelete = confirm => {
    if (confirm == true) {
      props.onDelete(props.item.id)
    }
    setIsOpenConfirmDelete(false)
  }

  return (
    <Draggable draggableId={props.item.id} index={props.index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isdragging={`${snapshot.isDragging}`}
        >
          <ListItem style={{ backgroundColor: `${snapshot.isDragging ? 'lightgreen' : 'white'}`, borderRadius: '6px' }}>
            <IconButton onClick={() => setIsOpenConfirmDelete(true)}>
              <RemoveCircleOutlineRoundedIcon fontSize='large' />
            </IconButton>
            <TextField
              fullWidth
              multiline
              label='Nhập nội dung lựa chọn'
              InputProps={{
                inputComponent: TextareaAutosize,
                rows: 3
              }}
              name={props.item.id}
              value={props.item.option}
              onChange={props.handleChange}
            />
            <PanToolIcon fontSize='medium' />
          </ListItem>
          <CustomDialogConfirm
            nameDialog={'Xác nhận'}
            open={isOpenConfirmDelete}
            handleConfirm={onConfirmDelete}
          >
            Bạn có chắc chắc muốn xóa lựa chọn này
          </CustomDialogConfirm>
        </div>
      )}
    </Draggable>
  )
}
