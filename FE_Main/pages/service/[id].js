import DefaultLayout from "../../src/components/layout/DefaultLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAllServices } from "../../src/api/common/commonApi";
import Head from "next/head";
import Link from "next/link";
import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LinkIcon from "@mui/icons-material/Link";
import { FE_BASE_URL } from "../../public/constant";
import Image from "next/image";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import StarBorderIcon from "@mui/icons-material/StarBorder";
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

const ServiceDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [data, setdata] = useState({});
  const [serviceList, setServiceList] = useState();
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

  const breadcrumbs = [
    <Link underline="hover" key="1" href="/">
      Trang chủ
    </Link>,
    <Link underline="hover" key="2" href="/service">
      Danh sách dịch vụ
    </Link>,
    <Typography key="3" color="text.primary">
      {data.name}
    </Typography>,
  ];

  const [buttonContent, setButtonContent] = useState(() => {
    return (
      <>
        <LinkIcon />
      </>
    );
  });

  var tempList = [];

  useEffect(() => {
    callApiService();
  }, [router.query.id]);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (router.query.id && serviceList) {
      let isValidId = false;
      console.log(router.query.id);
      console.log(serviceList);
      serviceList.map((service) => {
        if (service.id == router.query.id) {
          isValidId = true;
        }
      });
      if (isValidId === false) {
        router.push(`/404`);
      }
    }

    serviceList?.map((item) => {
      if (item.id == id) {
        setdata(item);
      }
      console.log(item)
    });
  }, [router.query.id, router.isReady, serviceList]);

  const callApiService = async () => {
    const data = await getAllServices();
    tempList = [...data.data];
    setServiceList(tempList);
    console.log(data.data.files)
    return tempList;
    
  };

  const handleClick = () => {
    if (data) {
      localStorage.setItem("selectedService", JSON.stringify(data));
      // console.log(localStorage.getItem('selectedService'));
    }
    console.log(data)
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(FE_BASE_URL + "/service/" + data?.id);
    setButtonContent("Đã sao chép");
    // setTimeout(() => {
    //   setButtonContent(() => {
    //     return (
    //       <>
    //         <LinkIcon />
    //       </>
    //     );
    //   });
    // }, 5000);
  };

  const MyImage = (props) => {
    if (data.files && data.files[0].url) {
      const myLoader = () => {
        return data.files[0].url;
      };
      return (
        <Grid>
          <Image
            loader={myLoader}
            src={data.files[0].url}
            alt="Picture of the author"
            width="0"
            height="0"
            sizes="100vw"
            style={{ width: "90%", height: "auto", margin: "0 5%" }}
          />
        </Grid>
      );
    } else {
      const myLoader = () => {
        return `https://bucket.nhanh.vn/store/24031/ps/20220808/08082022040820_thumb_web_01__1__thumb.jpg`;
      };

      return (
        <Image
          loader={myLoader}
          src="https://bucket.nhanh.vn/store/24031/ps/20220808/08082022040820_thumb_web_01__1__thumb.jpg"
          alt="Picture of the author"
          width="0"
          height="0"
          sizes="100vw"
          style={{ width: "90%", height: "auto", margin: "0 5%" }}
        ></Image>
      );
    }
  };

  const currencyFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const timeConverter = (time) => {
    var convertedTime = "";
    if (Math.floor(time / 60) >= 1) {
      convertedTime += String(Math.floor(time / 60)) + " giờ ";
      if (time % 60 !== 0) {
        convertedTime += String(time % 60) + " phút";
      }
    } else {
      convertedTime += String(time) + " phút";
    }
    return convertedTime;
  };

  const selectCateFromHomepage = (code) => {
    localStorage.setItem("selectCateFromHomepage", code);
    console.log(code);
  };

  return (
    <DefaultLayout>
      <Head>
        <title>{data?.name} - SSDS</title>
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
      <Box mx={{xs: 2, lg: 15}} sx={{ backgroundColor: "#FFFFFF" }}>
        <Grid container spacing={2}>
          <Grid item xs={5} pb={3}>
            <MyImage />
            {data.files &&
            data.files.length > 1 && (
              <Grid p={10}>
                <ImageList
                  sx={{ width: 730, height: 150 }}
                  cols={4}
                  rowHeight={150}
                >
                  {data.files.filter((el, index) => index != 0).map((item, index) => (
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
            )}
            <Box mx="20%" mt={3}>
              Chia sẻ:{" "}
              <Tooltip title="Sao chép liên kết">
                <Button
                  variant="text"
                  onClick={() => handleCopy()}
                  onMouseLeave={() => {
                    setButtonContent(() => {
                      return (
                        <>
                          <LinkIcon />
                        </>
                      );
                    });
                  }}
                >
                  {buttonContent}
                </Button>
              </Tooltip>
            </Box>
          </Grid>
          <Grid item xs={7}>
            <Typography variant="h5">{data.name}</Typography>
            <Box
              sx={{ backgroundColor: "#F5F5F5", width: "95%", py: 2, my: 2 }}
            >
              <Typography variant="h6" sx={{ mx: 3, color: "red" }}>
                {currencyFormatter.format(data.currentPrice)}
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <Typography sx={{ color: "#757575" }}>Mô tả</Typography>
              </Grid>
              <Grid item xs={10}>
                <Typography sx={{ width: "70%" }}>
                  {data.description || "Không có mô tả chi tiết"}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography sx={{ color: "#757575" }}>
                  Thời gian thực hiện (dự tính)
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Typography sx={{ width: "70%" }}>
                  {timeConverter(data.duration) ||
                    "Không có thời gian thực hiện (dự tính)"}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography sx={{ color: "#757575" }}>Danh mục</Typography>
              </Grid>
              <Grid item xs={10}>
                {data.categoryName ? (
                  <Link
                    href="/service"
                    onClick={() => {
                      selectCateFromHomepage(data.categoryCode);
                    }}
                  >
                    <Typography sx={{ width: "70%", color: "#757575" }}>
                      {data.categoryName}
                    </Typography>
                  </Link>
                ) : (
                  <Typography sx={{ width: "70%" }}>
                    Không thuộc danh mục nào
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Box sx={{ display: "flex" }}>
              <Box m={3}>
                <Button onClick={() => router.back()} variant="outlined">
                  Quay lại
                </Button>
              </Box>
              <Box m={3}>
                <Link href="/booking">
                  <Button variant="contained" onClick={handleClick}>
                    Đặt lịch
                  </Button>
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </DefaultLayout>
  );
};

export default ServiceDetail;
