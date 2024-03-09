import { useEffect, useState } from "react";

// ** Next Import
import { useRouter } from "next/router";
import DefaultLayout from "../../src/components/layout/DefaultLayout";

// ** MUI Imports
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Grid,
  Typography,
} from "@mui/material";
import Link from "next/link";

import SpaServiceCard from "../../src/components/card/spaService-card/SpaServiceCard";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

//API import
import { getAnswerdetail } from "../../src/api/answer/answerApi";
import Head from "next/head";
import {
  GridList,
  GridListTile,
  makeStyles,
  Modal,
  Backdrop,
  Fade,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      backgroundcolor: "red",
    },
  },
  img: {
    outline: "none",
  },
}));

const Detailform = () => {
  const [idState, setIdState] = useState("");
  const [commentState, setCommentState] = useState("");
  const [sca, setSca] = useState({});
  const [answer, setAnswer] = useState([]);
  const [question, setQuestion] = useState([]);
  const [services, setServices] = useState([]);
  const [imageState, setImageState] = useState([]);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("false");
  const classes = useStyles();

  const handleImage = (value) => {
    setImage(value);
    setOpen(true);
    console.log(image);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const router = useRouter();

  const getDetails = async () => {
    const paramsArray = window.location.search.split("&");
    let id = -1;
    paramsArray.map((pr) => {
      if (pr.indexOf("id=") != -1) {
        id = pr.replace("?", "").replace("id=", "");
      }
    });
    const data = await getAnswerdetail(id);
    if (!data) return;
    if (!data.data) return;

    if (
      data.data.answerSet[0].textAnswer.length > 0 &&
      data.data.answerSet[0].textQuestion
    ) {
      setIdState(data.data.id);
      setAnswer(data.data.answerSet[0].textAnswer.split(";"));
      setCommentState(data.data.comment);
      setQuestion(data.data.answerSet[0].textQuestion.split(";"));
      setServices([...data.data.spaServices]);
      console.log(data);
      console.log(data.data.files);
      setImageState([...data.data.files]);
    }
    setSca(data.data);
  };

  const navigateBack = () => {
    router.push({
      pathname: "/sca-history",
    });
  };

  useEffect(() => {
    getDetails();
  }, []);

  const breadcrumbs = [
    <Link underline="hover" key="1" href="/">
      Trang chủ
    </Link>,
    <Link underline="hover" key="2" href="/sca-history">
      Lịch sử trả lời form
    </Link>,
    <Typography key="3" color="text.primary">
      {idState}
    </Typography>,
  ];

  return (
    <DefaultLayout>
      <Head>
        <title>Chi tiết - SSDS</title>
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
      <Grid container spacing={6}>
        <Grid item xs={12} pl={15}>
          <Typography variant="h5" style={{ marginBottom: 10 }}></Typography>
        </Grid>
        <Grid
          container
          xs={12}
          sx={{ display: "flex", flexDirection: "row" }}
          pl={20}
        >
          <Grid item xs={7}>
            {sca.status && (
              <Card sx={{ padding: "10px" }}>
                <Grid item xs={12} sx={{ fontWeight: "bold" }}>
                  {"Danh sách câu hỏi và câu trả lời:"}
                  <br></br>
                </Grid>
                <br></br>
                {answer.length > 0 &&
                  answer
                    ?.filter((el) => el.length > 0)
                    .map((ans, index) => {
                      return (
                        <Grid key={index} container spacing={12}>
                          <Grid item xs={6} spacing={12}>
                            <strong>Câu hỏi :</strong> {question[index]}
                            <br></br>
                            <strong>-</strong>
                            {ans}
                          </Grid>
                          {/* <Grid item xs={6}  spacing={12}>
                          {ans}
                        </Grid> */}
                        </Grid>
                      );
                    })}

                <br></br>
                {"WAITING_FOR_RESULT" !== sca.status.code && (
                  <Grid item xs={12} md={10}>
                    <Typography>
                      <Box sx={{ fontWeight: "bold", display: "flex" }}>
                        Bạn được tư vấn bới: &nbsp;
                        <Typography>
                          {sca.repliedBy !== null
                            ? sca.repliedBy.fullName
                            : "unknown"}
                        </Typography>
                      </Box>
                    </Typography>
                  </Grid>
                )}
                {"WAITING_FOR_RESULT" !== sca.status.code && (
                  <Grid item xs={12} md={10}>
                    <Box sx={{ fontWeight: "bold", display: "flex" }}>
                      Nội dung tư vấn : &nbsp;{" "}
                      <Typography>{commentState}</Typography>
                    </Box>
                  </Grid>
                )}
                <br></br>
                {sca.spaServices.length > 0 && (
                  <>
                    <Grid
                      container
                      rowSpacing={3}
                      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    >
                      <Grid item xs={12} md={10} sx={{ fontWeight: "bold" }}>
                        {
                          "Dịch vụ được chúng tôi khuyên dùng:(Bấm vào để xem chi tiết)"
                        }
                      </Grid>
                      {services.map((item, key) => {
                        return (
                          <Grid key={key} item xs={12} ml={10} mr={10}>
                            <SpaServiceCard item={item} />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </>
                )}
                <Grid item xs={12}>
                  <Button
                    variant="text"
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      textAlign: "center",
                    }}
                    onClick={(e) => navigateBack()}
                  >
                    {"Quay lại"}
                  </Button>
                </Grid>
              </Card>
            )}
          </Grid>
          <Grid item xs={5}>
            {imageState.length > 0 ? (
              <Grid p={10}>
                <Grid item xs={12}>
                  <Typography variant="h5" style={{ marginBottom: 10 }}>
                    Những ảnh đã gửi
                  </Typography>
                </Grid>
                <ImageList
                  sx={{ width: 500, height: 450 }}
                  cols={3}
                  rowHeight={164}
                >
                  {imageState.map((item, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={item.url}
                        alt=""
                        loading="lazy"
                        onClick={(e) => handleImage(item.url)}
                      />
                      <Modal
                        open={open}
                        onClose={handleClose}
                        className={classes.modal}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                          timeout: 300,
                        }}
                      >
                        <Fade in={open} timeout={300} className={classes.img}>
                          <img
                            src={image}
                            alt="asd"
                            style={{
                              maxHeight: "90%",
                              maxWidth: "90%",
                              textAlign: "center",
                              opacity: 0.9,
                            }}
                          />
                        </Fade>
                      </Modal>
                    </ImageListItem>
                  ))}
                </ImageList>
              </Grid>
            ) : (
              <Grid p={10}>
                <Typography variant="h5" style={{ marginBottom: 10 }}>
                  Bạn không gửi ảnh
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </DefaultLayout>
  );
};

export default Detailform;
