import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { Button, TextField, Box, IconButton, TextareaAutosize, FormControl, InputLabel } from '@mui/material'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'

//Component import
import QuestionsBlock from '../../../../component/dragAndDrop/question/index'

import DialogAlert from '../../../../component/dialog/dialogAlert'
import CustomDialogConfirm from '../../../../component/dialog/customDialogConfirm'

//API import
import { addSca } from 'src/api/scaForm/scaApi'

//DnD import
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { useRouter } from 'next/router'

const ManageScaAdd = () => {
  const router = useRouter()

  //request single question
  const [formRequest, setFormRequest] = useState({
    name: '',

    // code: '',
    description: ''
  })

  const [count, setCount] = useState(0)

  const [questions, setQuestions] = useState([])
  const [questionsOrder, setQuestionsOrder] = useState([])

  const onChangeForm = e => {
    e.preventDefault()

    setFormRequest({ ...formRequest, [`${e.target.name}`]: e.target.value })
  }

  const handleChangeQuestion = question => {
    setQuestions(
      questions.map(item => {
        if (item.id != question.id) {
          return item
        } else {
          return question
        }
      })
    )
  }

  const onAddQuestion = () => {
    const tempLstItem = [...questions]
    const temmpLstItemOrder = [...questionsOrder]

    const newId = `question-${count + 1}`

    tempLstItem.push({
      id: newId,
      question: '',
      type: 0,
      isRequired: false,
      options: []
    })
    temmpLstItemOrder.push(newId)

    setCount(count + 1)
    setQuestions(tempLstItem)
    setQuestionsOrder(temmpLstItemOrder)
  }

  const onDeleteQuestion = itemId => {
    const filterdLstItem = questions.filter(item => item.id != itemId)

    const filterdLstItemOrder = questionsOrder.filter(item => item !== itemId)

    setQuestions(filterdLstItem)
    setQuestionsOrder(filterdLstItemOrder)
  }

  useEffect(() => {
    const tempLst = []
    questions.forEach(item => {
      const tempItemOrder = questionsOrder.indexOf(item.id)
      const tempItem = { ...item, ['order']: tempItemOrder }
      tempLst.push(tempItem)
    })

    // setQuestions(tempLst)
    setFormRequest({ ...formRequest, ['questions']: tempLst })
  }, [questions, questionsOrder])

  // useEffect(() => {
  //   setFormRequest({ ...formRequest, ['questions']: questions })
  // }, [questions])

  //validate form
  const validateRequest = () => {
    let isValid = true

    if (!formRequest.name) {
      setError('Vui lòng cung cấp tên Form.')
      setIsOpenError(true)

      return
    }

    if (formRequest.name.length > 50) {
      setError('Trường tên chỉ được nhập 50 kí tự.')
      setIsOpenError(true)

      return
    }

    if (formRequest.description.length > 200) {
      setError('Trường miêu tả chỉ được nhập 200 kí tự.')
      setIsOpenError(true)

      return
    }

    if (!formRequest.questions || formRequest.questions.length == 0) {
      setError('Vui lòng thêm câu hỏi cho form đánh giá.')
      setIsOpenError(true)

      return
    }

    formRequest.questions.forEach(question => {
      if (validateQuestion(question) == false) {
        isValid = false

        return
      }
    })

    if (!isValid) return
    setIsOpenReorderQuestion(true)
  }

  //validate question
  const validateQuestion = question => {
    if (!question.question) {
      setError('Vui lòng cung cấp nội dung câu hỏi.')
      setIsOpenError(true)

      return false
    }

    if (question.question.length > 200) {
      setError('Độ dài câu hỏi không vượt quá 200 kí tự.')
      setIsOpenError(true)

      return false
    }

    if (question.type == 1) {
      if (question.options.length == 0) {
        setError('Vui lòng cung cấp ít nhất một lựa chọn.')
        setIsOpenError(true)

        return false
      
      }
      else if (question.options.length < 2) {
        setError('Vui lòng cung cấp ít nhất 2 câu lựa chọn.')
        setIsOpenError(true)

        return false
      } else {
        let isLong = false
        let isEmpty = false
        question.options.forEach(opt => {
          if (!opt.option) {
            isEmpty = true
          }
          if (opt.option && opt.option.length > 200) {
            isLong = true
          }
        })
        if(isEmpty){
          setError('Vui lòng cung cấp nội dung lựa chọn.')
          setIsOpenError(true)

          return false
        }
        if(isLong){
          setError('Độ dài câu trả lời không vượt quá 200 kí tự.')
          setIsOpenError(true)

          return false
        }
      }
    }

    return true
  }

  //validate option

  // const validateOption = option => {

  //   console.log(option.length)

  //   if (!option.option) {
  //     setError('Vui lòng cung cấp nội dung lựa chọn.')
  //     setIsOpenError(true)

  //     return false
  //   }

  //   if (option.option.length > 200) {
  //     setError('Độ dài câu hỏi không vượt quá 200 kí tự.')
  //     setIsOpenError(true)

  //     return false
  //   }

  //   return true
  // }

  //dialog error
  const [error, setError] = useState('')
  const [isOpenError, setIsOpenError] = useState(false)

  //đóng dialog
  const handleClose = () => {
    setIsOpenError(false)
    setIsOpenReorderQuestion(false)
  }

  //dialog reorder question
  const [isOpenReorderQuestion, setIsOpenReorderQuestion] = useState(false)

  const onDragEnd = result => {
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    const questionIds = Array.from(questionsOrder)
    questionIds.splice(source.index, 1)
    questionIds.splice(destination.index, 0, draggableId)

    setQuestionsOrder(questionIds)
  }

  const onConfirmAdd = confirm => {
    if (confirm == true) {
      handleAdd()
    }
    handleClose()
  }

  const handleAdd = async () => {
    const newFormRequest = {
      ...formRequest,
      questions: formRequest.questions.map(q =>
        Object.assign(
          {},
          {
            isRequired: q.isRequired,
            options: q.options,
            type: q.type,
            question: q.question,
            order: q.order
          }
        )
      )
    }
    console.log('ssss')
    const data = await addSca(newFormRequest)
    if (!data) return
    if (data.meta.code != 200) {
      setError(data.meta.message)
      setIsOpenError(true)

      return
    }
    router.push('/manage/scaForm')
  }

  return (
    <div>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h5' style={{ marginBottom: 10 }}>
            Thêm mới form khảo sát
          </Typography>

          <Card style={{ padding: '2%', marginBottom: '3%' }}>
            <Typography variant='h6' style={{ marginBottom: '3%' }}>
              Thông tin chung
            </Typography>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 1,
                gridTemplateColumns: 'repeat(2, 1fr)'
              }}
            >
              <Grid item xs={4}>
                <Typography>Tên khảo sát : (Bắt buộc)</Typography>
              </Grid>
              <Grid item xs={8}>
                <Box
                  component='form'
                  sx={{
                    '& > :not(style)': { m: 1, width: '100%' }
                  }}
                  noValidate
                  autoComplete='off'
                >
                  <TextField
                    id='name'
                    label='Nhập tên khảo sát'
                    variant='outlined'
                    size='small'
                    name='name'
                    value={formRequest.name}
                    onChange={onChangeForm}
                  />
                </Box>
              </Grid>
              {/* <Grid item xs={2} mb={5} pl={2}>
                  {' '}
                  <Box sx={{ display: 'inline', color: 'red' }}>*</Box>
                </Grid> */}
            </Box>
            {/* <Box
              sx={{
                display: 'grid',
                columnGap: 3,
                rowGap: 1,
                gridTemplateColumns: 'repeat(2, 1fr)'
              }}
            >
              <Grid item xs={4}>
                <Typography>Mã : (Bắt buộc)</Typography>
              </Grid>
              <Grid item xs={8}>
                <Box
                  component='form'
                  sx={{
                    '& > :not(style)': { m: 1, width: '100%' }
                  }}
                  noValidate
                  autoComplete='off'
                >
                  <TextField
                    id='name'
                    label='Nhập mã'
                    variant='outlined'
                    size='small'
                    name='code'
                    value={formRequest.code}
                    onChange={onChangeForm}
                  />
                </Box>
              </Grid>
            </Box> */}
            <Box
              sx={{
                display: 'grid',
                columnGap: 3,
                rowGap: 1,
                gridTemplateColumns: 'repeat(2, 1fr)'
              }}
            >
              <Grid item xs={4}>
                <Typography>Mô tả :</Typography>
              </Grid>
              <Grid item xs={8}>
                <Box
                  component='form'
                  sx={{
                    '& > :not(style)': { m: 1, width: '100%' }
                  }}
                  noValidate
                  autoComplete='off'
                >
                  <TextField
                    fullWidth
                    multiline
                    label='Nhập mô tả'
                    InputProps={{
                      inputComponent: TextareaAutosize,
                      rows: 3
                    }}
                    name='description'
                    value={formRequest.description}
                    onChange={onChangeForm}
                  />
                </Box>
              </Grid>
            </Box>
          </Card>
          <Card style={{ padding: '2%' }}>
            <Grid>
              <Typography variant='h6' style={{ marginBottom: '1%' }}>
                Thông tin câu hỏi
              </Typography>
              <Button variant='contained' style={{ marginBottom: '1%' }} onClick={onAddQuestion}>
                Thêm mới câu hỏi
              </Button>
            </Grid>
            {questions.length > 0 &&
              questions.map(question => (
                <QuestionsBlock
                  key={question.id}
                  question={question}
                  handleChangeQuestion={handleChangeQuestion}
                  onDelete={onDeleteQuestion}
                />
              ))}
            <Grid container spacing={2}>
              <Grid xs={8} item={true}></Grid>
              <Grid xs={1.1} item={true}>
                <Button
                  variant='contained'
                  style={{ backgroundColor: 'red' }}
                  onClick={() => {
                    router.push('/manage/scaForm')
                  }}
                >
                  Quay lại
                </Button>
              </Grid>
              <Grid xs={2} item={true}>
                <Button variant='contained' onClick={() => validateRequest()}>
                  Thêm mới
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      <DialogAlert nameDialog={'Có lỗi xảy ra'} open={isOpenError} allertContent={error} handleClose={handleClose} />

      {/* DIALOG KÉO THẢ THỨ TỰ CÂU HỎI */}
      <CustomDialogConfirm
        nameDialog={`Sắp xếp các thứ tự câu hỏi`}
        open={isOpenReorderQuestion}
        handleConfirm={onConfirmAdd}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={'droppable-questions'}>
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps} isdraggingover={`${snapshot.isDraggingOver}`}>
                <List
                  style={{
                    padding: '2%',
                    border: `${snapshot.isDraggingOver ? 'solid 1px ' : ''}`,
                    borderRadius: `${snapshot.isDraggingOver ? '6px ' : ''}`,
                    borderColor: `${snapshot.isDraggingOver ? '#9155fd ' : ''}`
                  }}
                >
                  {questionsOrder.map((itemId, index) => {
                    const items = questions.filter(item => item.id == itemId)
                    const item = items[0]
                    if (!item) return

                    return (
                      <div key={itemId}>
                        <Draggable draggableId={itemId} index={index}>
                          {(provided, snapshot) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              isdragging={`${snapshot.isDragging}`}
                            >
                              <ListItem
                                style={{
                                  backgroundColor: `${snapshot.isDragging ? 'lightgreen' : 'white'}`,
                                  borderRadius: '6px',
                                  border: 'solid 1px',
                                  marginBottom: '1%'
                                }}
                              >
                                {item.question}
                              </ListItem>
                            </div>
                          )}
                        </Draggable>
                      </div>
                    )
                  })}
                  {provided.placeholder}
                </List>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </CustomDialogConfirm>
    </div>
  )
}

export default ManageScaAdd
