import { useState, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import {
  TextareaAutosize,
  Grid,
  Card,
  Typography,
  Select,
  FormControl,
  MenuItem,
  IconButton,
  Button
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'

import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import { GridList, GridListTile, makeStyles, Modal, Backdrop, Fade } from '@material-ui/core'

//API import
import { getSCAById, submitComment } from '../../../api/feedback/feedbackApi'
import { getAllServices } from '../../../api/service/serviceApi'
import DialogAlert from 'src/component/dialog/dialogAlert'

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      backgroundcolor: 'red'
    }
  },
  img: {
    outline: 'none'
  }
}))

const CommentAdmin = () => {
  //====================================================================================
  //PAGINATION HANDLING
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [count, setCount] = useState(0)
  const [openAnswer, setOpenAnswer] = useState(false)
  const [sca, setSca] = useState({})
  const [answer, setAnswer] = useState([])
  const [question, setQuestion] = useState([])
  const [services, setServices] = useState([])
  const [spaservie, setSpaservice] = useState([])
  const [comment, setComment] = useState('')
  const [activeService, setActiveService] = useState({})
  const [selectedServices, setSelectedServices] = useState([])
  const [imageState, setImageState] = useState([])
  const [error, setError] = useState('')
  const [isOpenError, setIsOpenError] = useState(false)
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState('false')
  const classes = useStyles()

  const handleImage = value => {
    setImage(value)
    setOpen(true)
    console.log(image)
  }

  const handleCloseImage = () => {
    setOpen(false)
  }

  const handleClose = () => {
    setIsOpenError(false)
  }

  const router = useRouter()

  const getDetails = async () => {
    const paramsArray = window.location.search.split('&')
    let id = -1
    paramsArray.map(pr => {
      if (pr.indexOf('id=') != -1) {
        id = pr.replace('?', '').replace('id=', '')
      }
    })
    const data = await getSCAById(id)
    console.log(data)
    if (!data) return
    if (!data.data) return

    if (data.data.answerSet[0].textAnswer.length > 0 && data.data.answerSet[0].textQuestion) {
      setAnswer(data.data.answerSet[0].textAnswer.split(';'))
      setComment(data.data.comment)
      setQuestion(data.data.answerSet[0].textQuestion.split(';'))
      setSpaservice([...data.data.spaServices])
      console.log(data)
      console.log(data.data.files)
      setImageState([...data.data.files])
    }
    setSca(data.data)
  }

  const getServices = async () => {
    const data = await getAllServices()
    if (!data) return
    if (!data.data) return
    console.log(data.data)
    setServices([...data.data])
    setActiveService(data.data.length > 0 ? data.data[0].name : 'Xin mời chọn')
  }

  const changeComment = e => {
    const newSca = Object.assign({}, sca, { ...sca, comment: e.target.value })
    setSca(newSca)
  }

  const submit = async () => {
    console.log(sca.comment)

    if (sca.comment == null) {
      setError('Bạn chưa tư vấn cho khách hàng')
      setIsOpenError(true)    
    } else {
      const data = await submitComment({ ...sca, repliedBy: localStorage.getItem('id') })

      const newSca = Object.assign({}, sca, {
        ...sca,
        status: {
          ...sca.status,
          code: 'DONE_ANSWER'
        },
        repliedBy: localStorage.getItem('id')
      })

      setSca(newSca)
      router.push({
        pathname: '/manage/feedback'
      })
    }
  }

  const navigateBack = () => {
    router.push({
      pathname: '/manage/feedback'
    })
  }

  const changeActiveService = e => {
    setActiveService(e.target.value)
    if (selectedServices.filter(sv => sv.name === e.target.value).length === 0) {
      const newSelectedServices = [
        ...selectedServices,
        {
          id: services.filter(sv => sv.name === e.target.value)[0].id,
          name: services.filter(sv => sv.name === e.target.value)[0].name
        }
      ]
      console.log(newSelectedServices)
      setSelectedServices([...newSelectedServices])

      const sentSelectedServices = [
        ...selectedServices,
        {
          id: services.filter(sv => sv.name === e.target.value)[0].id
        }
      ]
      console.log(sca.customer.id)

      const newSca = Object.assign({}, sca, {
        ...sca,
        customer: {
          id: sca.customer.id
        },
        repliedBy: {
          id: localStorage.getItem('id')
        },
        spaServices: [...sentSelectedServices]
      })
      setSca(newSca)
    }
  }

  const deleteService = deletedId => {
    const newSelectedServices = selectedServices.filter(el => el.id !== deletedId)
    setSelectedServices([...newSelectedServices])

    const sentSelectedServices = [...sca.spaServices].filter(el => el.id !== deletedId)

    const newSca = Object.assign({}, sca, {
      ...sca,

      spaServices: [...sentSelectedServices]
    })
    setSca(newSca)
  }

  useEffect(() => {
    getDetails()
    getServices()
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5' style={{ marginBottom: 10 }}>
          Tư vấn khách hàng
        </Typography>
      </Grid>
      <Grid container xs={12} sx={{ display: 'flex', flexDirection: 'row' }}>
        <Grid item xs={6}>
          {sca.status && (
            <Card sx={{ padding: '10px' }}>
              <Grid item xs={12}>
                {'Khách hàng: ' + (sca.customer !== null ? sca.customer.fullName : 'unknown')}
              </Grid>
              <Grid item xs={12}>
                {'Trạng thái: ' + sca.status.description}
              </Grid>
              <br />
              <Grid item xs={12} sx={{ fontWeight: 'bold' }}>
                {'Danh sách câu hỏi và câu trả lời:'}
              </Grid>
              {answer.length > 0 &&
                answer
                  ?.filter(el => el.length > 0)
                  .map((ans, index) => {
                    return (
                      <Grid key={index} container spacing={10}>
                        {/* <Grid item xs={2} className="fm-row blue">
                                 Câu Hỏi {" " + (index + 1)}
                            </Grid> */}
                        <Grid item xs={8}>
                          Câu hỏi : {question[index]}
                          <br></br>
                          Câu trả lời :{ans}
                        </Grid>
                      </Grid>
                    )
                  })}
              <br></br>
              {'WAITING_FOR_RESULT' !== sca.status.code && (
                <Grid item xs={12} sx={{ fontWeight: 'bold' }}>
                  {'Tư vấn bới: ' + (sca.repliedBy !== null ? sca.repliedBy.fullName : 'unknown')}
                </Grid>
              )}
              <br></br>
              {'WAITING_FOR_RESULT' === sca.status.code && (
                <Grid item xs={12}>
                  <Grid item xs={12} sx={{ fontWeight: 'bold' }}>
                    {'Tư vấn khách hàng:'}
                  </Grid>
                  <Grid item xs={12}>
                    <TextareaAutosize
                      aria-label='Nội dung tư vấn'
                      style={{ width: 500, height: 100, fontSize: 20 }}
                      value={sca.comment || ''}
                      onChange={changeComment}
                      type='text'
                    />
                  </Grid>
                  {'WAITING_FOR_RESULT' === sca.status.code && selectedServices.length > 0 && (
                    <>
                      <Grid item xs={12} sx={{ fontWeight: 'bold' }}>
                        {'Dịch vụ khuyên dùng:'}
                      </Grid>
                      {selectedServices.map((sv, index) => {
                        return (
                          <Grid item key={index} xs={6} sx={{ display: 'flex', flexDirection: 'row' }}>
                            <Grid item xs={9}>
                              {index + 1 + ' ' + sv.name}
                            </Grid>
                            <Grid item xs={3}>
                              <IconButton onClick={e => deleteService(sv.id)}>
                                <CloseIcon style={{ color: 'red', fontSize: '15px' }} />
                              </IconButton>
                            </Grid>
                          </Grid>
                        )
                      })}
                    </>
                  )}
                  {'WAITING_FOR_RESULT' === sca.status.code && (
                    <>
                      <br></br>
                      <Grid item xs={12} sx={{ fontWeight: 'bold' }}>
                        {'Dịch vụ khả dụng:'}
                      </Grid>
                      <Grid container item xs={12} md={5}>
                        <FormControl>
                          <Select
                            labelId='demo-simple-select-label'
                            id='demo-simple-select'
                            label='------'
                            value={activeService || 'abc'}
                            onChange={changeActiveService}
                          >
                            <MenuItem value=''>
                              <em>Dịch vụ</em>
                            </MenuItem>
                            {services.length > 0 &&
                              services.map(sv => {
                                return (
                                  <MenuItem
                                    sx={{
                                      display:
                                        selectedServices.filter(el => el.id === sv.id).length > 0 ? 'none' : 'block'
                                    }}
                                    value={sv.name}
                                    key={sv.id}
                                  >
                                    {sv.name}
                                  </MenuItem>
                                )
                              })}
                          </Select>
                        </FormControl>
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12} mt={2}>
                    <Button
                      variant='contained'
                      onClick={e => {
                        submit(e.target.value)
                      }}
                    >
                      {'Comment'}
                    </Button>
                  </Grid>
                </Grid>
              )}
              {'WAITING_FOR_RESULT' !== sca.status.code && (
                <Grid item xs={12} sx={{ fontWeight: 'bold' }}>
                  {'Đã tư vấn: ' + sca.comment}
                </Grid>
              )}
              <br></br>
              {'WAITING_FOR_RESULT' !== sca.status.code && sca.spaServices.length > 0 && (
                <>
                  <Grid item xs={12} sx={{ fontWeight: 'bold' }}>
                    {'Dịch vụ được khuyên dùng:'}
                  </Grid>
                  {spaservie.map((sv, index) => {
                    return (
                      <Grid item key={index} xs={6} sx={{ display: 'flex', flexDirection: 'row' }}>
                        <Grid item xs={10}>
                          Dịch vụ {' ' + (index + 1)} : {sv.name}
                        </Grid>
                      </Grid>
                    )
                  })}
                </>
              )}
              <Grid item xs={12}>
                <Button variant='text' onClick={e => navigateBack()}>
                  {'Quay lại'}
                </Button>
              </Grid>
            </Card>
          )}
          {!sca.status && <Card sx={{ padding: '10px' }}>{'Loading...'}</Card>}
        </Grid>
        <Grid item xs={6}>
          {imageState.length > 0 && (
            <Grid p={10}>
              <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
                {imageState.map((item, index) => (
                  <ImageListItem key={index}>
                    <img src={item.url} alt='' loading='lazy' onClick={e => handleImage(item.url)} />
                    <Modal
                      open={open}
                      onClose={handleCloseImage}
                      className={classes.modal}
                      closeAfterTransition
                      BackdropComponent={Backdrop}
                      BackdropProps={{
                        timeout: 300
                      }}
                    >
                      <Fade in={open} timeout={300} className={classes.img}>
                        <img
                          src={image}
                          alt='asd'
                          style={{ maxHeight: '90%', maxWidth: '90%', textAlign: 'center', opacity: 0.9 }}
                        />
                      </Fade>
                    </Modal>
                  </ImageListItem>
                ))}
              </ImageList>
            </Grid>
          )}
          {imageState.length === 0 && (
            <Grid p={10}>
              <Typography variant='h5' style={{ marginBottom: 10 }}>
                Khách hàng không gửi ảnh
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
      <DialogAlert nameDialog={'Có lỗi xảy ra'} open={isOpenError} allertContent={error} handleClose={handleClose} />
    </Grid>
  )
}

export default CommentAdmin
