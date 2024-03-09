import { useState, useEffect } from 'react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'

// import TextField from '@mui/material/TextField';

import { getConfigDetail } from '../../api/config/configApi'

import {
  Box,
  Button,
  Grid,
  Drawer,
  Typography,
  TableRow,
  TableCell,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TextField,
  TextareaAutosize,
  MenuItem,
  FormControl,
  Select
} from '@mui/material'

import Paper from '@mui/material/Paper'
import CloseIcon from '@mui/icons-material/Close'
import { editSca, deleteQuestion, deleteOption, addOption, addQuestion } from 'src/api/scaForm/scaApi'

const widthViewPort = '40vw'

//sticky style
const sticky = {
  position: 'sticky',
  left: 0,
  background: 'white'
}

export const DrawerViewSca = props => {
  const { openDrawer, setOpenDrawer, selectedItem, setSelectedItem, setOpenError, setError, onSuccess } = props

  useEffect(() => {}, [props])

  const handleKeyPress = e => {
    if (e.key === 'Escape') {
      setOpenDrawer(false)
    }
  }

  function AdvancedTableRow(props) {
    const [open, setOpen] = useState(false)

    const toggle = () => {
      setOpen(!open)
    }

    return (
      <div>
        <Table sx={{ border: 1 }}>
          <TableRow key={props.index}>
            <TableCell sx={{ fontSize: '25px', color: 'black' }}>Câu hỏi: {props.data.question}</TableCell>
          </TableRow>
          {props.data.options?.map((el, i) => (
            <TableRow key={i}>
              <TableCell sx={{ fontSize: '18px', color: 'black' }}>{el.option}</TableCell>
            </TableRow>
          ))}
        </Table>
      </div>
    )
  }

  return (
    <Drawer anchor={'right'} open={openDrawer} onKeyDown={handleKeyPress} hideBackdrop={true}>
      <Grid container spacing={6} style={{ width: `${widthViewPort}`, margin: 2 }}>
        {/* header */}
        <Grid item xs={12}>
          <Typography variant='h5' display={'inline'}>
            {`Chi tiết khảo sát`}
          </Typography>
        </Grid>
        {/* body */}
        {selectedItem ? (
          <Grid item xs={12}>
            <Typography>
              <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>
                Tên khảo sát: <Typography>{selectedItem?.scaName}</Typography>
              </Box>
              <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>
                Mã khảo sát: <Typography>{selectedItem?.scaCode}</Typography>
              </Box>
              <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>
                Miêu tả khảo sát: <Typography>{selectedItem?.scaDesc}</Typography>
              </Box>
              <Box sx={{ fontWeight: 'bold', m: 1, display: 'flex' }}>Câu hỏi:</Box>
            </Typography>
            <TableContainer>
              <Table sx={{ width: 500, border: 1 }}>
                {selectedItem.questions.map((item, index) => (
                  <AdvancedTableRow key={index} data={item} index={index}></AdvancedTableRow>
                ))}
              </Table>
            </TableContainer>
          </Grid>
        ) : (
          <Typography>Không có khảo sát</Typography>
        )}

        {/* end */}
        <Grid item xs={12} style={{ textAlign: 'right', marginRight: '16px' }}>
          <Button
            onClick={() => {
              setOpenDrawer(false)
              setSelectedItem()
              onSuccess()
            }}
          >
            Đóng
          </Button>
        </Grid>
      </Grid>
    </Drawer>
  )
}

export const DrawerEditSca = props => {
  const { openDrawer, setOpenDrawer, selectedItem, setSelectedItem, setOpenError, setError, onSuccess } = props
  const [itemData, setItemData] = useState({ questions: [], id: 0, scaName: '', scaCode: '' })
  const [questions, setQuestions] = useState([])
  const [questionIds, setQuestionIds] = useState([])
  const [optionIds, setOptionIds] = useState([])
  const [newOption, setNewOption] = useState('')
  const [optionsAdd, setOptionsAdd] = useState([])
  const [nameError, seNameError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')
  const [ErrorMessage, setErrorMessage] = useState([])
  const [ErrorMessage1, setErrorMessage1] = useState([])
  const [newQuestion, setNewQuestion] = useState('')
  const [QuestionAdd, setQuestionAdd] = useState([])
  const [options, setOptions] = useState([])
  const [questionType, setQuestionType] = useState(1)
  const [questionContent, setQuestionContent] = useState('')
  const [addQuestionEnabled, setAddQuestionEnabled] = useState(false)
  const changeQuestionType = e => setQuestionType(e.target.value)
  

  const handleAddnewQuestion = () => {
    setAddQuestionEnabled(!addQuestionEnabled)
  }

  const handleAddOption = (e, qstId, order, qstIdex) => {
    if (e.key === 'Enter') {
      setOptionsAdd([...optionsAdd, { option: e.target.value, questionId: qstId, order: order }])
      setNewOption('')

      let newArr = [...questions]
      newArr[qstIdex].options.push({ option: e.target.value, questionId: qstId, order: order })
      setQuestions([...newArr])
    }
  }

  const validateNewOption = (e) => {
    if(e.target.value.length > 0 && e.target.value.length < 200){
      setNewOption(e.target.value.trim())
    } else{
      setError(
        'Lựa chọn không được đê trống và chỉ được nhập tối đa 200 kí tự'
      )
      setOpenError(true)
    }
  }

  const handleAddQuestion = () => {
    console.log(selectedItem)
    if (questionContent !== '' && !(options.length < 2 && questionType === 2)) {
      setQuestions([
        ...questions,
        { question: questionContent, formId: selectedItem.id, options: options, order: 1, required: false }
      ])
      setQuestionAdd([
        ...QuestionAdd,
        { question: questionContent, formId: selectedItem.id, options: options, order: 1, required: true }
      ])
      clear()
      setNewOption('')
    } else {
      setError(
        'Câu hỏi và lựa chọn câu trả lời không được phép để trống và câu hỏi trắc nghiệm phải có ít nhất 2 câu trả lời'
      )
      setOpenError(true)
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

  // const callApiAddOption = async newOption => {
  //   const data = await addOption(newOption)
  //   if (!data) return
  //   if (data.meta.code != 200) {
  //     setError(data.meta.message)
  //     setOpenError(true)

  //     return
  //   }
  // }

  useEffect(() => {
    setItemData(selectedItem)
    setQuestions([...selectedItem.questions])
  }, [props])

  const handleChangeName = e => {
    var temp = itemData
    temp.scaName = e.target.value.trim()
    setItemData(temp)
    if (temp.scaName !== '' && temp.scaName.length < 200) {
      seNameError(false)
      setErrorMessage([''])
    } else {
      seNameError(true)
      setErrorMessage(['Trường này không được để trống và chỉ được nhập 200 kí tự'])
    }
  }

  const changeQuestion = e => {
    setQuestionContent(e.target.value)
  }

  const validateNewQuestion = (e) => {
    if(e.target.value.length > 0 && e.target.value.length < 200){
      setQuestionContent(e.target.value.trim())
    } else{
      setError(
        'Câu hỏi không được đê trống và chỉ được nhập tối đa 200 kí tự'
      )
      setOpenError(true)
    }
  }

  

  const handleChangeCode = e => {
    var temp = itemData
    temp.scaCode = e.target.value
    setItemData(temp)
  }

  const handleChangeDescription = e => {
    var temp = itemData
    temp.scaDesc = e.target.value.trim()
    setItemData(temp)
    if (temp.scaDesc.length < 200) {
      setDescriptionError(false)
      setErrorMessage1([''])
    } else {
      setDescriptionError(true)
      setErrorMessage1(['Trường này chỉ được nhập 200 kí tự'])
    }
  }

  const handlechangeQuestion = (index, newQuestionContent) => {
    if (newQuestionContent.length != 0 && newQuestionContent.length < 200) {
      let newArr = [...itemData.questions]
      newArr[index].question = newQuestionContent
      setQuestions([...newArr])
    } else {
      setError('Câu hỏi không được để trống và chỉ được nhập 200 kí tự')
      setOpenError(true)
    }
  }

  const handlechangeOption = (questionIndex, optionIndex, newOptionContent) => {
    if (newOptionContent.length != 0 && newOptionContent.length < 200) {
      let newArr = [...itemData.questions]
      newArr[questionIndex].options[optionIndex].option = newOptionContent
      setQuestions([...newArr])
    } else {
      setError('lựa chọn không được để trống và chỉ được nhập 200 kí tự')
      setOpenError(true)
    }
  }

  const handleDeleteQuestion = id => {
    if(questions.length >= 2){
      setQuestionIds([...questionIds, id])
      let newArr = [...questions.filter(qst => id !== qst.id)]
      setQuestions([...newArr])
    }else{
      setError('Bạn phải có ít nhất 1 câu hỏi')
      setOpenError(true)
    }
  }

  const callApiDeleteQuestion = async id => {
    const data = await deleteQuestion(id)
    if (!data) return
    if (data.meta.code != 200) {
      setError(data.meta.message)
      setOpenError(true)

      return
    }
  }

  const handleDeleteOption = (questionIndex, optionIndex, id) => {
    if(questions[questionIndex].options.length >= 3){
      let newArr = [...itemData.questions]
      newArr[questionIndex].options = newArr[questionIndex].options.filter((opt, i) => i !== optionIndex)
      setQuestions([...newArr])
      setOptionIds([...optionIds, [id]])
    }else{
      setError('Bạn phải có ít nhất 2 lựa chọn')
      setOpenError(true)
    }
  }

  const callApihandleDeleteOption = async id => {
    const data = await deleteOption(id)
    if (!data) return
    if (data.meta.code != 200) {
      setError(data.meta.message)
      setOpenError(true)

      return
    }
  }

  const handleEdit = () => {
    var data = {
      id: itemData.id,
      name: itemData.scaName,
      code: itemData.scaCode,
      description: itemData.scaDesc,
      questions: questions,
      active: itemData.isActive
    }
    if (questions.question && questions.question.length == 0) {
      setError('Câu hỏi không được để trống.')
      setOpenError(true)
      console.log('2222')

      return false
    } else if (questions.question && questions.question.length > 200) {
      setError('Độ dài câu hỏi không vượt quá 200 kí tự.')
      setOpenError(true)

      return false
    } else {
      // if (questions.options.option && questions.options.option.length == 0) {
      //   setError('Lựa chọn không được để trống.')
      //   setOpenError(true)

      //   return false
      // }
      // if (questions.options.option && questions.options.option.length > 200) {
      //   setError('Độ dài Lựa chọn không vượt quá 200 kí tự.')
      //   setOpenError(true)

      //   return false
      // }
      callApieditSca(data)

      if (questionIds.length > 0) {
        questionIds.forEach(deleteId => {
          callApiDeleteQuestion(deleteId)
        })
      }

      if (optionIds.length > 0) {
        optionIds.forEach(deleteId => {
          callApihandleDeleteOption([...deleteId])
        })
      }

      // if (optionsAdd.length > 0) {
      //   callApiAddOption(optionsAdd)
      // }

      setOptionIds([])
      setQuestionIds([])
      setOptionsAdd([])
      setNewOption('')
      setQuestionAdd([])
      setNewQuestion('')
      onSuccess(true)
      setOpenDrawer(false)
    }
  }

  const handleKeyPress = e => {
    if (e.key === 'Escape') {
      console.log(questions)
      setOpenDrawer(false)
      setSelectedItem()
      setItemData()
      setNewOption()
      setNewQuestion()
      setOptionIds([])
      setQuestionIds([])
      seNameError(false)
      setErrorMessage([''])
      setAddQuestionEnabled(false)
      setQuestionContent("")
      setNewOption("")
      onSuccess()
    }
  }

  const deleteOptionAdd = (deleteIndex) => {
      console.log(deleteOption)
      console.log(options)
      setOptions(options.filter((opt, index) => index != deleteIndex))
  }

  const handleKeyPress1 = (e, order) => {
    if (e.key === 'Enter') {
      setOptions([...options, { option: e.target.value, questionId: null, order: order }])
      setNewOption('')
    }
  }

  const callApieditSca = async item => {
    if (selectedItem) {
      const data = await editSca(item)
      if (!data) return
      if (data.meta.code != 200) {
        setError(data.meta.message)
        setOpenError(true)

        return
      }
    }
  }

  return (
    <Drawer anchor={'right'} open={openDrawer} onKeyDown={handleKeyPress} hideBackdrop={true}>
      <Grid container spacing={6} style={{ width: `${widthViewPort}`, margin: 2 }}>
        {/* header */}
        <Grid item xs={12}>
          <Typography variant='h5' display={'inline'}>
            {`Chỉnh sửa khảo sát`}
          </Typography>
        </Grid>
        {/* body */}
        {itemData ? (
          <Grid item sx={12}>
            <Typography>Tên khảo sát</Typography>
            <Box
              component='form'
              sx={{
                '& > :not(style)': { m: 1, width: '25ch' }
              }}
              noValidate
              autoComplete='off'
            >
              <TextField
                id='name'
                disabled={addQuestionEnabled}
                defaultValue={itemData.scaName}
                variant='outlined'
                error={nameError}
                helperText={ErrorMessage[0]}
                onChange={e => handleChangeName(e)}
              />
            </Box>
            <Typography>Mã </Typography>
            <Box
              component='form'
              sx={{
                '& > :not(style)': { m: 1, width: '25ch' }
              }}
              autoComplete='off'
            >
              <TextField
                id='code'
                disabled
                defaultValue={itemData.scaCode}
                variant='outlined'
                onChange={e => handleChangeCode(e)}
              />
            </Box>
            <Typography>Mô tả </Typography>
            <Box
              component='form'
              sx={{
                '& > :not(style)': { m: 1, width: '25ch' }
              }}
              autoComplete='off'
            >
              <TextField
                id='description'
                defaultValue={itemData.scaDesc}
                disabled={addQuestionEnabled}
                variant='outlined'
                error={descriptionError}
                helperText={ErrorMessage1[0]}
                onChange={e => handleChangeDescription(e)}
              />
            </Box>
            <Grid>
              <Grid className='fm-row blue'>
                <h4>{'Danh sách câu hỏi:'}</h4>
              </Grid>
              {questions.map((item, index) => (
                <Grid key={index} className='question-container'>
                  <Grid className='fm-row blue'>Câu Hỏi {' ' + (index + 1)} :</Grid>
                  <Grid className='fm-row'>
                    <TextField
                      aria-label='Nội dung câu hỏi'
                      
                      // style={{width: 800, fontSize: 20, display:'block',wordWrap:'break-word'}}

                      value={questions[index].question}
                      onChange={e => handlechangeQuestion(index, e.target.value)}
                      disabled={addQuestionEnabled}
                      multiline
                      size='small'
                    />
                    {addQuestionEnabled === false && (
                      <DeleteOutlinedIcon onClick={() => handleDeleteQuestion(item.id)} />
                    )}
                  </Grid>
                  <Grid className='fm-row mg-b-20'></Grid>
                  {item.options.length > 0 && (
                    <Grid ml={10} className='fm-row blue'>
                      {'Câu trả lời:'}
                    </Grid>
                  )}
                  {item.options.map((item1, index1) => (
                    <Grid ml={10} key={index1}>
                      <Grid className='fm-row'>
                        <Grid className='mg-r-10'>
                          <TextField
                            fullWidth
                            type='text'
                            name='name'
                            disabled={addQuestionEnabled}
                            value={item1.option}
                            onChange={e => handlechangeOption(index, index1, e.target.value)}
                            sx={{ width: '200px' }}
                          />
                          {addQuestionEnabled === false && (
                            <DeleteOutlinedIcon onClick={() => handleDeleteOption(index, index1, item1.id)} />
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                  {item.options.length > 0 && (
                    <Grid ml={10}>
                      <TextField
                        fullWidth
                        type='text'
                        value={newOption}
                        disabled={addQuestionEnabled}
                        placeholder='Thêm câu trả lời'
                        onKeyPress={e => handleAddOption(e, item.id, item.options.length, index)}
                        onChange={(e) => validateNewOption(e)}
                        sx={{ width: '200px' }}
                      />
                    </Grid>
                  )}
                </Grid>
              ))}
              <Button
                variant='contained'
                onClick={() => {
                  handleAddnewQuestion()
                }}
              >
                {!addQuestionEnabled ? 'Thêm câu hỏi mới' : 'Sửa khảo sát'}
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Typography>Không có khảo sát</Typography>
        )}
        {addQuestionEnabled === true && (
          <>
            <Grid item xs={12}>
              <Typography>Thêm câu hỏi:</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextareaAutosize
                aria-label='empty textarea'
                style={{ width: '100%', height: 100, fontSize: 20 }}
                value={questionContent}
                onChange={e => validateNewQuestion(e)}
                type='text'
              />
            </Grid>
            <Grid xs={12}>
              <Grid>
                <Typography>Dạng câu hỏi: </Typography>
              </Grid>
              <Grid className='mg-l-10'>
                <FormControl>
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
                        <Grid xs={9} ml={1}>
                          {opt.option}
                        </Grid>
                        <Grid xs={2}>
                          <CloseIcon onClick={() => deleteOptionAdd(i)} />
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
                      onKeyPress={e => handleKeyPress1(e, 1)}
                      onChange={(e) => validateNewOption(e)}
                    />
                  </Grid>
                </Grid>
              </Grid>
            ) : null}
            <Grid className='fm-row'>
              <Grid>
                <Button variant='contained' onClick={handleAddQuestion}>
                  Thêm câu hỏi
                </Button>
              </Grid>
            </Grid>
          </>
        )}
        {/* end */}
        <Grid item xs={12} style={{ textAlign: 'right', marginRight: '16px' }}>
          <Button
            onClick={() => {
              setOpenDrawer(false)
              setSelectedItem()
              setItemData()
              setOptionIds([])
              setNewOption()
              setQuestionIds([])
              seNameError(false)
              setErrorMessage([''])
              onSuccess()
              setAddQuestionEnabled(false)
              setQuestionContent("")
              setNewOption("")
              setOptions([])
              setQuestionType()
              
            }}
          >
            Đóng
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              handleEdit()
            }}
          >
            Cập nhật
          </Button>
        </Grid>
      </Grid>
    </Drawer>
  )
}
