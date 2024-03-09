import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { Button, TextField, Box, IconButton, TextareaAutosize, FormControl, InputLabel } from '@mui/material'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'

import OptionsDragDrop from '../option/index'
import CustomDialogConfirm from '../../dialog/customDialogConfirm'

const QuestionsBlock = props => {
  //Handle Drag and Drop
  const [options, setOptions] = useState(props.question?.options)

  const [count, setCount] = useState(0)

  const [optionsOrder, setOptionsOrder] = useState([])

  const onAddOption = () => {
    const tempLstItem = [...options]
    const temmpLstItemOrder = [...optionsOrder]

    const newId = `option-${count + 1}`

    tempLstItem.push({ id: newId })
    temmpLstItemOrder.push(newId)

    setCount(count + 1)
    setOptionsOrder(temmpLstItemOrder)
    setOptions(tempLstItem)
  }

  const onDeleteOption = itemId => {
    const filterdLstItem = options.filter(item => item.id !== itemId)
    const filterdLstItemOrder = optionsOrder.filter(item => item !== itemId)

    setOptionsOrder(filterdLstItemOrder)
    setOptions(filterdLstItem)
  }

  //onchange Option
  const onChangeOption = e => {
    e.preventDefault()

    const temp = options.find(item => item.id == e.target.name)

    setOptions(
      [...options].map((item, index) => {
        if (index == options.indexOf(temp)) {
          return { ...item, option: e.target.value }
        } else {
          return item
        }
      })
    )
  }

  //request options
  useEffect(() => {
    const tempLst = []
    options.forEach(item => {
      const tempItemOrder = optionsOrder.indexOf(item.id)
      const tempItem = { option: item.option, order: tempItemOrder }
      tempLst.push(tempItem)
    })
    setQuestionRequest({ ...questionRequest, ['options']: tempLst })
  }, [options, optionsOrder])

  //request single question
  // const [questionRequest, setQuestionRequest] = useState({
  //   question: '',
  //   type: '',
  //   isRequired: '',
  //   order: '',
  //   options: ''
  // })

  const [questionRequest, setQuestionRequest] = useState(props.question)

  const onChangeQuestion = e => {
    e.preventDefault()
    if (e.target.name == 'isRequired') {
      setQuestionRequest({ ...questionRequest, ['isRequired']: questionRequest.isRequired == true ? false : true })
    } else {
      setQuestionRequest({ ...questionRequest, [`${e.target.name}`]: e.target.value })
    }
  }

  useEffect(() => {
    props.handleChangeQuestion(questionRequest)
  }, [questionRequest])

  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false)

  const onConfirmDelete = confirm => {
    if (confirm == true) {
      props.onDelete(questionRequest.id);
      console.log('XÓA',questionRequest.id);
    }
    setIsOpenConfirmDelete(false)
  }

  // ()=>props.onDelete(questionRequest.id)

  return (
    <Grid style={{ border: 'solid 0.5px', borderRadius: '6px', padding: '2%', marginBottom: '3%' }}>
      <Button
        variant='contained'
        style={{ marginBottom: '1%', backgroundColor: 'red' }}
        onClick={() => setIsOpenConfirmDelete(true)}
      >
        Xóa câu hỏi
      </Button>
      <Box
        sx={{
          display: 'grid',
          columnGap: 3,
          rowGap: 1,
          gridTemplateColumns: 'repeat(2, 1fr) 60%'
        }}
      >
        <Grid item xs={4}>
          <Typography>Câu hỏi :</Typography>
        </Grid>
        <Grid item xs={10}>
          <Box
            component='form'
            sx={{
              '& > :not(style)': { m: 1, width: '100%' }
            }}
            noValidate
            autoComplete='off'
          >
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-label'>Loại</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                label='Age'
                value={questionRequest.type}
                name={'type'}
                onChange={onChangeQuestion}
              >
                <MenuItem value={0}>Tự luận</MenuItem>
                <MenuItem value={1}>Trắc nghiệm</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={16}>
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
              label='Nhập nội dung câu hỏi'
              InputProps={{
                inputComponent: TextareaAutosize,
                rows: 3
              }}
              value={questionRequest.question}
              name={'question'}
              onChange={onChangeQuestion}
            />
          </Box>
        </Grid>
      </Box>
      <Box>
        <Grid item xs={4}>
          <Typography style={{ display: 'inline-block' }}>Câu hỏi bắt buộc :</Typography>
          <Switch color='warning' name={'isRequired'} checked={questionRequest.isRequired} onClick={onChangeQuestion} />
        </Grid>
      </Box>
      {(questionRequest.type == 1) && (
        <OptionsDragDrop
          options={options}
          optionsOrder={optionsOrder}
          setOptionsOrder={setOptionsOrder}
          onAdd={onAddOption}
          onDelete={onDeleteOption}
          handleChange={onChangeOption}
        />
      )}
      <CustomDialogConfirm nameDialog={'Xác nhận'} open={isOpenConfirmDelete} handleConfirm={onConfirmDelete}>
      Bạn có chắc chắc muốn xóa câu hỏi này
      </CustomDialogConfirm>
    </Grid>
  )
}

export default QuestionsBlock
