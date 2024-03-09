import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextareaAutosize,
  FormControl,
  Select,
  MenuItem
} from '@mui/material'
import { Grid, TextField, Typography } from '@mui/material'
import { addSca } from 'src/api/scaForm/scaApi'
import { Box } from '@mui/system'


function DialogCreateSCA(props) {
  const { open, handleClose, onSuccess } = props
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [questionContent, setQuestionContent] = useState('')
  const [questions, setQuestions] = useState([])
  const [questionType, setQuestionType] = useState(1)
  const [options, setOptions] = useState([])
  const [newOption, setNewOption] = useState('')
  const [nameError, seNameError] = useState('')
  const [codeError, setCodeError] = useState('')
  const [ErrorMessage, setErrorMessage] = useState([])
  const [error, setError] = useState('')
  const changeQuestionType = e => setQuestionType(e.target.value)
  const changeNewOption = e => setNewOption(e.target.value)

  const handleAdd = () => {
    const data = {
      name: name,
      code: code,
      questions: questions,
      description: description,
      active: true
    }
    if (questions.length < 1) {
      setError('Phải có ít nhất 1 câu hỏi')
    }
    if (name === '') {
      seNameError(true)
      setErrorMessage(['Trường này không được để trống'])
    }
    if (code === '') {
      setCodeError(true)
      setErrorMessage(['Trường này không được để trống'])
    } else {
      seNameError(false)
      setCodeError(false)
      callApiAddSca(data)
      console.log('questions===================')
      console.log(questions)
    }
  }

  const validationName = e => {
    setName(e.target.value)
    if (name !== '') {
      seNameError(false)
      setErrorMessage([''])
    }
  }

  const validationCode = e => {
    setCode(e.target.value)
    if (code !== '') {
      setCodeError(false)
      setErrorMessage([''])
    }
  }

  const changeQuestion = e => {
    setQuestionContent(e.target.value)
  }

  const handleKeyPress = (e, order) => {
    if (e.key === 'Enter') {
      setOptions([...options, { option: e.target.value, questionId: null, order: order }])
      setNewOption('')
    }
  }

  const addQuestion = () => {
    if (questionContent !== '' && !(options.length < 2 && questionType === 2)) {
      setQuestions([...questions, { question: questionContent, options: options, order: 1, required: false }])
      clear()
      setNewOption('')
    } else {
      setError(
        'Câu hỏi và lựa chọn câu trả lời không được phép để trống và câu hỏi trắc nghiệm phải có ít nhất 2 câu trả lời'
      )
    }

    console.log('questions===================')
    console.log(questions)
  }

  const clear = () => {
    setQuestionContent('')
    setOptions([])
    console.log(options)
    setError('')
  }

  const callApiAddSca = async data => {
    if (name === '') return
    const res = await addSca(data)
    if (!res) return
    setName('')
    setCode('')
    setDescription('')
    setQuestions([])
    handleClose()
    onSuccess()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      onKeyPress={ev => {
        if (ev.key === 'Enter') {
          ev.preventDefault()
        }
      }}
    >
      <DialogTitle>Thêm khảo sát</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs={6}>
            <Typography>Tên khảo sát :</Typography>
          </Grid>
          <Grid item xs={4}>
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
                error={nameError}
                helperText={ErrorMessage[0]}
                onChange={e => validationName(e)}
              />
            </Box>
          </Grid>
          <Grid item xs={2} mb={2} pl={2}>
            {' '}
            <Box sx={{ display: 'inline', color: 'red' }}>*</Box>
          </Grid>
          <Grid item xs={6}>
            <Typography>Mã:</Typography>
          </Grid>
          <Grid item xs={4}>
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
                error={codeError}
                helperText={ErrorMessage[0]}
                onChange={e => validationCode(e)}
              />
            </Box>
          </Grid>
          <Grid item xs={2} mb={2} pl={2}>
            {' '}
            <Box sx={{ display: 'inline', color: 'red' }}>*</Box>
          </Grid>
          <Grid item xs={6}>
            <Typography>Mô tả:</Typography>
          </Grid>
          <Grid item xs={4}>
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
                label='Nhập mô tả'
                variant='outlined'
                size='small'
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography>Câu hỏi:</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextareaAutosize
              aria-label='empty textarea'
              style={{ width: '100%', height: 100, fontSize: 20 }}
              value={questionContent}
              onChange={changeQuestion}
              type='text'
            />
          </Grid>
          <Grid xs={12}>
            <Grid>
              <Typography>Dạng câu hỏi: </Typography>
            </Grid>
            <Grid className='mg-l-10'>
              <FormControl fullWidth>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={questionType}
                  onChange={changeQuestionType}
                >
                  <MenuItem value={1}>Tự luận</MenuItem>
                  <MenuItem value={2}>Trắc nghiệm</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {questionType === 2 ? ( // multiple choices
            <Grid>
              <Grid>
                <Typography>Câu trả lời: </Typography>
                {options.map((opt, i) => {
                  return (
                    <Grid xs={12} key={i} sx={{ display: 'flex' }}>
                      <Grid xs={1}>{i + 1 + '.'}</Grid>
                      <Grid xs={11} ml={1}>
                        {opt.option}
                      </Grid>
                    </Grid>
                  )
                })}
                <Grid style={{ width: '100%', fontSize: 20 }}>
                  <input
                    type='text'
                    style={{ fontSize: 20 }}
                    value={newOption}
                    placeholder='Thêm câu trả lời'
                    onKeyPress={e => handleKeyPress(e, 1)}
                    onChange={changeNewOption}
                  />
                </Grid>
              </Grid>
            </Grid>
          ) : null}

          <Grid className='fm-row'>
            <Grid>
              <Button variant='contained' onClick={addQuestion}>
                Thêm câu hỏi
              </Button>
            </Grid>
          </Grid>
          <Grid md={10} className='fm-row'>
            ------------------------------
          </Grid>
          <Grid className='fm-column'>
            {questions.map((qst, i) => {
              return (
                <Grid className='fl-row' key={i}>
                  <Grid className='mg-r-10'>{i + 1}</Grid>
                  <Grid>{qst.question}</Grid>
                </Grid>
              )
            })}
          </Grid>
          <Grid className='fm-row'>
            <Grid className='error'>{error}</Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleClose()
            onSuccess()
            setCodeError(false)
            seNameError(false)
            setErrorMessage([''])
            setError('')
          }}
          variant='outlined'
        >
          Đóng
        </Button>
        <Button variant='contained' onClick={handleAdd}>
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogCreateSCA
