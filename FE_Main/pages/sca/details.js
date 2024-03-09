import DefaultLayout from "../../src/components/layout/DefaultLayout";
import {
  Box,
  Breadcrumbs,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextareaAutosize,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useEffect, useState } from "react";
import { getSCAdetail, submitSCA, uploadImage } from "../../src/api/sca/scaApi";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import CommonAlert from "../../src/components/common/Alert";
import Head from "next/head";
import CloseIcon from "@mui/icons-material/Close";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { GridList, GridListTile, makeStyles, Modal, Backdrop, Fade } from '@material-ui/core'


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


const ScaDetails = () => {
  const [nameState, setNameState] = useState("");
  const [descriptionState, setDescriptionState] = useState("");
  const [data, setData] = useState([]);
  const [question, setQuestion] = useState("");
  const [answerArray, setAnswerArray] = useState([]);
  const [requiredArray, setRequiredArray] = useState([]);
  const [validArray, setValidArray] = useState([]);
  const [error, setError] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [alertProps, setAlertProps] = useState(["", ""]);
  const [file, setFile] = useState();
  const [fileArray, setFileArray] = useState([]);
  const [fileArrayId, setFileArrayId] = useState([]);
  const [displayUploadImage, setDisplayUploadImage] = useState(true);
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState('false')
  const [enableButton, setEnableButton] = useState(true)
  const classes = useStyles()

  const handleImage = value => {
    setImage(value)
    setOpen(true)
    console.log(image)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleDisplayUploadImage = async () => {
    setDisplayUploadImage(false);
  };

  const router = useRouter();

  const callFilter = async (id) => {
    const res = await getSCAdetail(id);
    if (!res) return;
    if (res.meta.code != 200) {
      return;
    }
    if (!res.data) return;
    setData(res.data.questions);
    setNameState(res.data.name);
    setDescriptionState(res.data.description);

    let questionString = "";
    let newArray = [];
    let rArray = [];
    let vArray = [];
    res.data.questions.map((qts, qstIndex) => {
      questionString += qts.question + ";";
      console.log(questionString);
      console.log(qstIndex);
      newArray = [...newArray, ""];
      rArray = [...rArray, qts.isRequired];
      vArray = [...vArray, true];
    });
    console.log(res);
    console.log(questionString);
    setAnswerArray([...newArray]);
    setRequiredArray([...rArray]);
    setValidArray([...vArray]);
    setQuestion(questionString);
  };

  const submit = async () => {
    let answerString = "";
    answerArray.map((ans) => {
      answerString += ans + ";";
    });
    console.log("17/1/2023");
    console.log(answerString);

    let valid = true;
    let vArray = [...validArray];
    answerArray.map((ans, index) => {
      vArray[index] = !(ans === "" && requiredArray[index] === true);
      if (ans === "" && requiredArray[index] === true) {
        // Nếu require thì phải trả lời
        valid = false;
      }
    });
    console.log(vArray);
    setValidArray([...vArray]);

    if (!valid) {
      setError(
        "Khách hàng vui lòng không để trống các câu hỏi bắt buộc đánh dấu *"
      );
    } else {
      console.log("payload");
      console.log(localStorage.getItem("id"));
      console.log(answerString);
      console.log(question);
      console.log(fileArrayId);
      const res = await submitSCA(
        localStorage.getItem("id"),
        answerString,
        question,
        fileArrayId
      );
      console.log(res);
      if (!res || res.meta.code != 200) {
        setAlertProps([
          "Internal Error",
          "Có lỗi khi vận hành, xin hãy liên lạc với quản trị của trang web.",
        ]);
      } else {
        setAlertProps(["Đã gửi thành công", "Cảm ơn đã điền khảo sát."]);
      }
      setOpenAlert(true);
      return;
    }
  };

  const selectFile = (e) => {
    const imageFile = e.target.files[0]
    console.log(e.target.name)
    if (!imageFile.name.match(/\.(jpg|jpeg|png|gif)$/)) {
      setAlertProps(["Chỉ được gửi file ảnh"]);
      e.target.value = null
    } else {
      setFile(e.target.files[e.target.files.length - 1]);
      handleDisplayUploadImage();
    }
    
  };

  const handleDisableImage = (index) => {
    console.log(index);
    setFileArray(fileArray.filter((file, i) => index != i));
    setFileArrayId(fileArrayId.filter((file, i) => index != i));
  };

  const uploadFile = async (e) => {
    console.log(file);
    if (e) {
      const res = await uploadImage(file);
      setFileArrayId([...fileArrayId, { id: res.data.id, url: res.data.url }]);
      setFileArray([...fileArray, res.data.url]);
      console.log(res);
      setEnableButton(false)
      setTimeout(function () {
        setEnableButton(true)
      }, 5000)
    }
  };

  const changeAnswer = (e, index) => {
    setError("");
    let tempArray = [...answerArray];
    tempArray[index] = e.target.value;
    setAnswerArray([...tempArray]);
  };

  const alertCallback = () => {
    setOpenAlert(false);
    router.push("/sca");
  };

  useEffect(() => {
    const paramsArray = window.location.search.split("&");
    let id = -1;
    paramsArray.map((pr) => {
      if (pr.indexOf("id=") !== -1) {
        id = pr.replace("?", "").replace("id=", "");
      }
    });

    if (id !== -1) {
      callFilter(id);
    }
  }, []);

  const breadcrumbs = [
    <Link underline="hover" key="1" href="/">
      Trang chủ
    </Link>,
    <Link underline="hover" key="2" href="/sca">
      Câu hỏi đánh giá
    </Link>,
    <Typography key="3" color="text.primary">
      {nameState}
    </Typography>,
  ];

  return (
    <DefaultLayout>
      <Head>
        <title>{nameState} - SSDS</title>
      </Head>
      <Breadcrumbs
        separator={<NavigateNextIcon sx={{ fontSize: "medium" }} />}
        aria-label="breadcrumb"
        mx={{xs: 2, lg: 15}}
        mt={3}
        mb={3}
      >
        {breadcrumbs}
      </Breadcrumbs>
      <Box
        mx={{xs: 2, lg: 15}}
        sx={{
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 0px 8px 5px #dcdbff",
        }}
      >
        <CommonAlert
          open={openAlert}
          okCallback={alertCallback}
          param={""}
          okLabel={"Ok"}
          message={alertProps[1]}
          title={alertProps[0]}
          variant={"oneButton"}
        />
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          {nameState}
        </Typography>
        <Grid container>
          <Grid item xs={12} ml={10} mr={10} mb={5}>
            <Typography sx={{ textAlign: "left" }}>
              {descriptionState}
            </Typography>
          </Grid>
          {data?.map((qts, qstIndex) => {
            return (
              <Grid item key={qstIndex} xs={12} ml={8} mr={8} mb={3}>
                <Typography sx={{ textAlign: "left" }}>
                  <Box sx={{ fontWeight: "bold", display: "inline" }}>
                    {"Câu hỏi " + (qstIndex + 1) + ":"}
                  </Box>
                  <Box sx={{ display: "inline", marginLeft: "5px" }}>
                    {qts.question}
                  </Box>
                  <Box sx={{ display: "inline", color: "red" }}>
                    {qts.isRequired === true ? " *" : ""}
                  </Box>
                </Typography>
                {qts.options && (
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      name={"radio-" + qstIndex}
                      onChange={(e) => {
                        changeAnswer(e, qstIndex);
                      }}
                    >
                      {qts.options?.map((opt, optIndex) => {
                        return (
                          <FormControlLabel
                            key={optIndex}
                            value={opt.option}
                            control={<Radio />}
                            label={opt.option}
                          />
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                )}
                {qts.options.length === 0 && (
                  <TextareaAutosize
                    aria-label="empty textarea"
                    placeholder="Empty"
                    style={{ width: "100%", height: "100px" }}
                    onChange={(e) => {
                      changeAnswer(e, qstIndex);
                    }}
                  />
                )}
                {!validArray[qstIndex] && (
                  <Typography
                    sx={{
                      textAlign: "center",
                      color: "red",
                    }}
                  >
                    {"Câu hỏi này không thể bỏ trống!"}
                  </Typography>
                )}
              </Grid>
            );
          })}
          <Grid
            container
            mb={3}
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Typography
              variant="h5"
              style={{ marginBottom: 5, textAlign: "center" }}
            >
              Bạn có thế gửi ảnh để chúng tôi đánh giá tình trạng
            </Typography>
          </Grid>
          <Grid
            container
            mb={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <input
              type={"file"}
              accept="image/png, image/jpeg"
              onChange={selectFile}
            ></input>
            <Grid
              p={4}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Grid sx={{ display: displayUploadImage ? "none" : "block" }}>
                <Button
                  variant="solid"
                  sx={{
                    borderRadius: "10px",
                    width: "150px",
                    backgroundColor: "rgb(218, 190, 12)",
                    marginRight: "10px",
                  }}
                  onClick={(e) => uploadFile(e)}
                >
                  Thêm ảnh
                </Button>
              </Grid>
            </Grid>
            <Grid
              p={5}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <ImageList
                sx={{
                  boxShadow: "0px 0px 8px 2px #dcdbff",
                }}
                cols={3}
                gap={2}
              >
                {fileArray.map((item, index) => {
                  const cols = item.featured ? 2 : 1;
                  const rows = item.featured ? 2 : 1;
                  return (
                    <Grid item key={index}>
                      <Grid>
                        <ImageListItem key={index} cols={cols} rows={rows}>
                          <img src={item} alt="" loading="lazy" height="180"  onClick={e => handleImage(item)}/>
                          <ImageListItemBar
                            sx={{
                              background:
                                "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
                                "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                            }}
                            position="top"
                            actionIcon={
                              <CloseIcon
                                style={{ color: "red", fontSize: "40px" }}
                                onClick={() => handleDisableImage(index)}
                              />
                            }
                            actionPosition="right"
                          ></ImageListItemBar>
                          <Modal
                              open={open}
                              onClose={handleClose}
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
                      </Grid>
                    </Grid>
                  );
                })}
              </ImageList>
            </Grid>
          </Grid>
          <Grid
            container
            xs={12}
            mb={3}
            mt={5}
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            {error !== "" && (
              <Typography sx={{ textAlign: "center", color: "red" }}>
                {error}
              </Typography>
            )}
          </Grid>
          <Grid
            container
            xs={12}
            mb={5}
            pd={5}
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item>
              <Link href="/sca">
                <Button
                  variant="solid"
                  onClick={() => {
                    router.push("/sca");
                  }}
                  className="comeback-btn"
                  sx={{
                    borderRadius: "10px",
                    width: "150px",
                    backgroundColor: "rgb(218, 190, 12)",
                    marginRight: "10px",
                  }}
                >
                  Hủy
                </Button>
              </Link>
              <Button
                disabled = {!enableButton}
                variant="solid"
                onClick={(e) => submit()}
                sx={{
                  borderRadius: "10px",
                  width: "150px",
                  backgroundColor: "rgb(218, 190, 12)",
                  marginLeft: "10px",
                }}
              >
                Gửi câu trả lời
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </DefaultLayout>
  );
};
export default ScaDetails;
