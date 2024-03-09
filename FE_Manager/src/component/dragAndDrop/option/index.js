import { useState, useEffect } from 'react'

//Component import
import DroppableList from '../droppableList'

//utils import
import { DragDropContext } from 'react-beautiful-dnd'

const OptionsDragDrop = props => {
  const [lstItemOrder, setLstItemOrder] = useState([])
  useEffect(() => {
    if (props.optionsOrder.length == 0) return
    setLstItemOrder(props.optionsOrder)
  }, [props.optionsOrder])

  const [droppableListInfo, setDroppableListInfo] = useState({
    referenceToListObj: 'optionIds',
    id: 'droppable-1',
    title: 'Lựa chọn :',
    optionIds: lstItemOrder
  })

  useEffect(() => {
    setDroppableListInfo({
      referenceToListObj: 'optionIds',
      id: 'droppable-1',
      title: 'Lựa chọn :',
      optionIds: lstItemOrder
    })
  }, [lstItemOrder])

  const onDragEnd = result => {
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    const column = { ...droppableListInfo }

    const newTaskIds = Array.from(column.optionIds)
    newTaskIds.splice(source.index, 1)
    newTaskIds.splice(destination.index, 0, draggableId)

    const newColumn = {
      ...column,
      optionIds: newTaskIds
    }
    props.setOptionsOrder(newTaskIds)
    setDroppableListInfo(newColumn)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <DroppableList items={props.options} droppableListInfo={droppableListInfo} onAdd={props.onAdd} onDelete={props.onDelete} handleChange={props.handleChange}/>
    </DragDropContext>
  )
}

export default OptionsDragDrop
