// ** React Imports
import { useState } from "react";
import { forwardRef } from "react";
import { useRouter } from "next/router";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Breadcrumbs } from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

// ** Third Party Imports
import DatePicker, { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";
import { useEffect } from "react";

registerLocale("vi", vi);

//api
import { getProfile } from "../../src/api/auth/authApi";
import DialogAlert from "../../src/components/dialog/dialogAlert";
import { format, fromUnixTime } from "date-fns";
import DefaultLayout from "../../src/components/layout/DefaultLayout";
import Link from "next/link";

const CustomInput = forwardRef((props, ref) => {
  return <TextField inputRef={ref} label="Ngày sinh" fullWidth {...props} />;
});

const ImgStyled = styled("img")(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius,
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    textAlign: "center",
  },
}));

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    marginLeft: 0,
    textAlign: "center",
    marginTop: theme.spacing(4),
  },
}));

const Profile = () => {
  // ** State
  // const [openAlert, setOpenAlert] = useState(true)
  const [openAlert, setOpenAlert] = useState(false);
  const [imgSrc, setImgSrc] = useState("/images/avatars/1.png");
  const [date, setDate] = useState(null);

  // Dialog khi có lỗi
  const [error, setError] = useState("");
  const [openError, setOpenError] = useState(false);

  //Account data
  const [accountData, setAccountData] = useState();

  const router = useRouter();

  useEffect(() => {
    callApiGetProfile();
  }, []);

  const callApiGetProfile = async () => {
    const data = await getProfile();
    if (!data) return;
    if (data.meta.code != 200) {
      setError(data.meta.message);
      setOpenError(true);

      return;
    }
    if (!data.data) return;

    console.log(data.data);

    setAccountData(data.data);

    if(data.data.avatar) {
      setImgSrc(data.data.avatar.url)
    }
  };

  const breadcrumbs = [
    <Link underline="hover" key="1" href="/">
      Trang chủ
    </Link>,
    <Typography key="2" color="text.primary">
      Danh sách dịch vụ
    </Typography>,
  ];

  return (
    <DefaultLayout>
      {/* <Breadcrumbs
        separator={<NavigateNextIcon sx={{ fontSize: "medium" }} />}
        aria-label="breadcrumb"
        mx={15}
        mt={3}
        mb={1}
      >
        {breadcrumbs}
      </Breadcrumbs> */}
      <Box
        mx={{xs: 2, lg: 15}}
        mt={2}
        sx={{
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 0px 8px 5px #dcdbff",
        }}
      >
        <Box
          py={5}
        >
          <Grid container spacing={7} sx={{ marginX: "0px" }}>
            <Grid item xs={12}>
              <Typography variant="h6">Thông tin tài khoản</Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ marginTop: 4.8, marginBottom: 3, textAlign: "center" }}
            >
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <ImgStyled
                  src={imgSrc}
                  alt="Profile Pic"
                  sx={{ margin: "0 auto" }}
                />
              </Box>
              <Typography variant="caption">Ảnh đại diện</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2">Tên đăng nhập:</Typography>
              <Typography>
                {accountData?.username ? accountData?.username : "Không có"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">Họ tên:</Typography>
              <Typography>
                {accountData?.fullName ? accountData?.fullName : "Không có"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">Email:</Typography>
              <Typography>
                {accountData?.email ? accountData?.email : "Không có"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">Ngày sinh:</Typography>
              <Typography>
                {accountData?.dob
                  ? format(fromUnixTime(accountData?.dob / 1000), "dd/MM/yyyy")
                  : "Không có"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">Số điện thoại:</Typography>
              <Typography>
                {accountData?.phoneNumber
                  ? accountData?.phoneNumber
                  : "Không có"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">Giới tính:</Typography>
              <Typography>
                {(accountData?.gender === true && "Nam") ||
                  (accountData?.gender === false && "Nữ") ||
                  "Không có"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                sx={{ marginRight: 3.5 }}
                onClick={() => router.push(`/profile/edit`)}
              >
                Cập nhật thông tin
              </Button>
              <Button
                type="reset"
                variant="outlined"
                color="secondary"
                onClick={() => router.back()}
              >
                Quay lại
              </Button>
            </Grid>
          </Grid>
          <DialogAlert
            nameDialog={"Có lỗi xảy ra"}
            open={openError}
            allertContent={error}
            handleClose={() => setOpenError(false)}
          />
        </Box>
      </Box>
    </DefaultLayout>
  );
};

export default Profile;
