import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Box, IconButton } from '@mui/material'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import List from '@mui/material/List'
import DraggableListItem from './draggableListItem'

export default function DroppableList(props) {
  return (
    <Droppable droppableId={props.droppableListInfo.id}>
      {(provided,snapshot) => (
    <Box
      sx={{
        display: 'grid',
        columnGap: 3,
        rowGap: 1,
        gridTemplateColumns: 'repeat(1, 1fr)'
      }}
    >
      <Grid item xs={4}>
        <Typography style={{ display: 'inline-block' }}>{props.droppableListInfo.title}</Typography>
        <IconButton onClick={() => props.onAdd()}>
          <AddCircleOutlineRoundedIcon fontSize='large' />
        </IconButton>
      </Grid>
          <div ref={provided.innerRef} {...provided.droppableProps} isdraggingover={`${snapshot.isDraggingOver}`}>
            <List style={{border: `${snapshot.isDraggingOver ? 'solid 1px ' : ''}`,borderRadius: `${snapshot.isDraggingOver ? '6px ' : ''}`,borderColor: `${snapshot.isDraggingOver ? '#9155fd ' : ''}`}}>
              {props.droppableListInfo[`${props.droppableListInfo.referenceToListObj}`].map((itemId, index) => {
                const items = props.items.filter(item => item.id == itemId)
                const item = items[0]
                if (!item) return

                return <DraggableListItem key={item.id} index={index} item={item} onDelete={props.onDelete} handleChange={props.handleChange}/>
              })}
              {provided.placeholder}
            </List>
          </div>
    </Box>)}
    </Droppable>
  )
}
