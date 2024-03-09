// ** React Imports
import { useState } from "react";

// ** Next Imports
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";

// ** MUI Components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled, useTheme } from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import InputAdornment from "@mui/material/InputAdornment";
import MuiFormControlLabel from "@mui/material/FormControlLabel";

// ** Icons Imports
import Google from "mdi-material-ui/Google";
import Github from "mdi-material-ui/Github";
import Twitter from "mdi-material-ui/Twitter";
import Facebook from "mdi-material-ui/Facebook";
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";

//api
import { login, getProfile } from "../src/api/auth/authApi";
import { useEffect } from "react";
import { Alert } from "@mui/material";

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { width: "28rem" },
}));

const LinkStyled = styled("a")(({ theme }) => ({
  fontSize: "0.875rem",
  textDecoration: "none",
  color: theme.palette.primary.main,
}));

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  "& .MuiFormControlLabel-label": {
    fontSize: "0.875rem",
    color: theme.palette.text.secondary,
  },
}));

const LoginPage = () => {
  // ** State
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  const [username, setUsername] = useState("");

  // ** Hook
  const theme = useTheme();
  const router = useRouter();

  console.log("login page", router.query);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [displayError, setDisplayError] = useState(false);

  const handleLogin = async () => {
    console.log("username", username);
    console.log("password", values.password);
    const data = await login(username, values.password);

    if (data?.data?.token_type && data?.data?.access_token) {
      setDisplayError(false);
      localStorage.setItem(
        "access_token",
        `${data?.data?.token_type} ${data?.data?.access_token}`
      );
      localStorage.setItem(
        "expired_date",
        data?.data?.expires_in * 1000 + Date.now()
      );
      !localStorage.setItem('username', username)
      const res = await getProfile();
      console.log(res);
      console.log(res.meta.code === "200");
      if (res.meta.code === "200") {
        localStorage.setItem("full_name", res.data.fullName);
        localStorage.setItem("phone_number", res.data.phoneNumber);
        localStorage.setItem("email", res.data.email);
        localStorage.setItem("role", res.data.role.code);
        localStorage.setItem("id", res.data.id);
      }
      if (router.query.returnUrl) {
        router.push(`${router.query.returnUrl}`);
      } else {
        router.push(`/`);
      }
    } else {
      setDisplayError(true);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      localStorage.clear();
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing(5),
      }}
    >
      <Head>
        <title>Đăng nhập - SSDS</title>
      </Head>
      <Box
        className="app-content"
        sx={{ minHeight: "100vh", overflowX: "hidden", position: "relative" }}
      >
        <Box className="content-center">
          <Card sx={{ zIndex: 1 }}>
            <CardContent
              sx={{
                padding: 4,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Link href="/">
                  <Image
                    className="Logo"
                    src="/logo/black-transparent-logo.png"
                    alt="Logo"
                    width={150}
                    height={150}
                  />
                </Link>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6">Đăng nhập</Typography>
              </Box>
              <form
                noValidate
                autoComplete="off"
                onSubmit={(e) => e.preventDefault()}
              >
                {displayError && (
                  <Alert severity="error" sx={{ marginBottom: 2 }}>
                    Tên tài khoản hoặc Mật khẩu của bạn không đúng, vui lòng thử
                    lại
                  </Alert>
                )}
                <TextField
                  autoFocus
                  fullWidth
                  id="email"
                  label="Tài khoản"
                  sx={{ marginBottom: 4 }}
                  value={username}
                  onChange={(e) => {
                    e.preventDefault;
                    setUsername(e.target.value);
                  }}
                />
                <FormControl fullWidth>
                  <InputLabel htmlFor="auth-login-password">
                    Mật khẩu
                  </InputLabel>
                  <OutlinedInput
                    label="Password"
                    value={values.password}
                    id="auth-login-password"
                    onChange={handleChange("password")}
                    type={values.showPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          aria-label="toggle password visibility"
                        >
                          {values.showPassword ? (
                            <EyeOutline />
                          ) : (
                            <EyeOffOutline />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <Box
                  sx={{
                    mb: 4,
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                >
                  {/* <FormControlLabel
                    control={<Checkbox />}
                    label="Nhớ mật khẩu"
                  /> */}
                  <div></div>
                  <Link passHref href="/forgot-password">
                    <LinkStyled>
                      Quên mật khẩu?
                    </LinkStyled>
                  </Link>
                </Box>
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  sx={{ marginBottom: 7 }}
                  onClick={handleLogin}
                >
                  Đăng nhập
                </Button>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ marginRight: 2 }}>
                    Chưa có tài khoản?
                  </Typography>
                  <Typography variant="body2">
                    <Link passHref href="/signup">
                      <LinkStyled>Đăng ký ngay</LinkStyled>
                    </Link>
                  </Typography>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
