// ** React Imports
import { useState, Fragment } from "react";

// ** Next Imports
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

// ** MUI Components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled, useTheme } from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import InputAdornment from "@mui/material/InputAdornment";
import MuiFormControlLabel from "@mui/material/FormControlLabel";
import { FormHelperText } from "@mui/material";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

// ** Icons Imports
import Google from "mdi-material-ui/Google";
import Github from "mdi-material-ui/Github";
import Twitter from "mdi-material-ui/Twitter";
import Facebook from "mdi-material-ui/Facebook";
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";
import { Alert } from "@mui/material";
import { signup } from "../src/api/auth/authApi";
import { useRouter } from "next/router";

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
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(4),
  "& .MuiFormControlLabel-label": {
    fontSize: "0.875rem",
    color: theme.palette.text.secondary,
  },
}));

const RegisterPage = () => {
  // ** States
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
    showRePassword: false,
  });
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [termsAccept, setTermAccept] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState([]);
  const [ErrorMessage1, setErrorMessage1] = useState([]);
  const [ErrorMessage2, setErrorMessage2] = useState([]);
  const [ErrorMessage3, setErrorMessage3] = useState([]);

  const [passwordError, setPasswordError] = useState("");

  const [isRePasswordError, setIsRePasswordError] = useState(false);

  // ** Hook
  const theme = useTheme();

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowRePassword = () => {
    setValues({ ...values, showRePassword: !values.showRePassword });
  };

  const handleMouseDownRePassword = (event) => {
    event.preventDefault();
  };

  // Xử lý đăng ký
  const router = useRouter();

  const phoneRegex =
    /(03|05|07|08|09|01[2|6|8|9]|\+843|\+845|\+847|\+848|\+849|\+841[2|6|8|9])+([0-9]{8})\b/;
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const usernameRegex = /^([a-zA-Z0-9,:\S/-]*)$/gim;

  const SpaceRegex = /^[^\s]+(\s+[^\s]+)*$/g;

  const nameRegex =
    /^[a-zA-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ][a-zA-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$/gm;
  const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{7,19}$/;

  const [displayError, setDisplayError] = useState(false);
  const [displayPasswordInfo, setDisplayPasswordInfo] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    var tempError = [];
    var tempError1 = [];
    var tempError2 = [];
    var tempError3 = [];

    let isValid = true;

    if (username.trim() === "") {
      isValid = false;
      setUsernameError(true);
      setErrorMessage([
        "Tên đăng nhập không được để trống. Vui lòng kiểm tra lại",
      ]);
    } else if (username.length > 50) {
      isValid = false;
      setUsernameError(true);
      setErrorMessage(["Trường này chỉ được nhập tối đa 50 kí tự"]);
    } else if (!usernameRegex.test(username) || !SpaceRegex.test(username)) {
      isValid = false;
      setUsernameError(true);
      setErrorMessage(["Tên đăng nhập không hợp lệ. Vui lòng kiểm tra lại"]);
    } else {
      setUsernameError(false);
      setErrorMessage([""]);
    }

    if (!passwordRegex.test(values.password.trim())) {
      isValid = false;
      tempError.push("Mật khẩu");
      setPasswordError(true);
    } else if (values.password.length > 20) {
      isValid = false;
      tempError1.push("Mật khẩu");
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }

    if (isRePasswordError === true) {
      isValid = false;
      tempError.push("Mật khẩu nhập lại");
    }

    if (!phoneRegex.test(phoneNumber.trim())) {
      isValid = false;
      setPhoneNumberError(true);
      setErrorMessage3(["Số điện thoại không hợp lệ. Vui lòng kiểm tra lại"]);
    } else {
      setPhoneNumberError(false);
      setErrorMessage3([""]);
    }

    if (name.trim() === "") {
      isValid = false;
      setNameError(true);
      setErrorMessage2(["Họ tên không được để trống. Vui lòng kiểm tra lại"]);
    } else if (name.length > 50) {
      isValid = false;
      setNameError(true);
      setErrorMessage2(["Trường này chỉ được nhập tối đa 50 kí tự"]);
    } else if (!nameRegex.test(name)) {
      isValid = false;
      setNameError(true);
      setErrorMessage2(["Họ tên không hợp lệ. Vui lòng kiểm tra lại"]);
    } else {
      setNameError(false);
      setErrorMessage2([""]);
    }

    if (Array.isArray(tempError) && tempError.length) {
      isValid = false;
      setError(tempError.join(", ") + " không hợp lệ. Vui lòng kiểm tra lại");
      setDisplayError(true);

      return;
    } else {
      setError("");
      setDisplayError(false);
    }

    if (Array.isArray(tempError1) && tempError1.length) {
      isValid = false;
      setError(tempError1.join(", ") + " chỉ được nhập tối đa 50 kí tự");
      setDisplayError(true);

      return;
    } else {
      setError("");
      setDisplayError(false);
    }

    if (termsAccept === false) {
      setError(
        "Bạn cần phải đồng ý với các điểu khoản & dịch vụ của chúng tôi"
      );
      setDisplayError(true);

      return;
    }

    if (isValid) {
      var data = {
        username: username,
        password: values.password,
        phoneNumber: phoneNumber,
        fullName: name,
       
      };

      const res = await signup(data);
      console.log(data);
      if (!res) return;
      console.log(res);
      if (res.meta.code != 200) {
        setError(res.meta.message);
        setDisplayError(true);

        return;
      }

      setOpen(true);
      setError("");
      setDisplayError(false);

      return;
    }
  };

  const validationName = (e) => {
    setName(e.target.value);
    if (
      e.target.value !== "" &&
      e.target.value.length <= 50 &&
      nameRegex.test(e.target.value.trim()) &&
      SpaceRegex.test(e.target.value)
    ) {
      setNameError(false);
      setErrorMessage2([""]);
    } else {
      setNameError(true);
      setErrorMessage2([
        "Trường này không được để trống, phải hợp lệ và chỉ được tối đa 50 kí tự",
      ]);
    }
  };

  const validationUserName = (e) => {
    setUsername(e.target.value);
    if (
      e.target.value.trim() !== "" &&
      e.target.value.length <= 50 &&
      usernameRegex.test(e.target.value.trim()) &&
      SpaceRegex.test(e.target.value)
    ) {
      setUsernameError(false);
      setErrorMessage([""]);
    } else {
      setUsernameError(true);
      setErrorMessage([
        "Trường này không được để trống, phải hợp lệ và chỉ được tối đa 50 kí tự",
      ]);
    }
  };

  const validationPhone = (e) => {
    setPhoneNumber(e.target.value);
    if (phoneRegex.test(e.target.value.trim())) {
      setPhoneNumberError(false);
      setErrorMessage3([""]);
    } else {
      setPhoneNumberError(true);
      setErrorMessage3(["Số điện thoại không hợp lệ"]);
    }
  };

  const validationEmail = (e) => {
    setEmail(e.target.value);
    if (emailRegex.test(e.target.value.trim()) && e.target.value.length <= 50) {
      setEmailError(false);
      setErrorMessage1([""]);
    } else {
      setEmailError(true);
      setErrorMessage1(["Sai format và chỉ được nhập số với tối đa 50 kí tự"]);
    }
  };

  // Xử lý pop-up dialog sau khi đăng ký thành công

  const [open, setOpen] = useState(false);

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
        <title>Đăng ký - SSDS</title>
      </Head>
      <Box
        className="app-content"
        sx={{ minHeight: "100vh", overflowX: "hidden", position: "relative" }}
      >
        <Box className="content-center">
          <Card sx={{ zIndex: 1 }}>
            <CardContent sx={{ padding: 4 }}>
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
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, marginBottom: 1.5 }}
                >
                  Đăng ký tài khoản
                </Typography>
                <Typography variant="body2">
                  Đăng ký để có trải nghiệm sử dụng trọn vẹn với tất cả các dịch
                  vụ của chúng tôi!
                </Typography>
              </Box>
              {displayError && (
                <Alert severity="error" sx={{ marginBottom: 2 }}>
                  {error}
                </Alert>
              )}
              <form
                noValidate
                autoComplete="off"
                onSubmit={(e) => e.preventDefault()}
              >
                <TextField
                  autoFocus
                  fullWidth
                  label="Họ tên"
                  required
                  //value={name}
                  error={nameError}
                  helperText={ErrorMessage2[0]}
                  onChange={(e) => validationName(e)}
                  sx={{ marginBottom: 4 }}
                />
                <TextField
                  fullWidth
                  id="username"
                  label="Tên đăng nhập"
                  required
                  //value={username}
                  error={usernameError}
                  helperText={ErrorMessage[0]}
                  onChange={(e) => validationUserName(e)}
                  sx={{ marginBottom: 4 }}
                />
                <FormControl fullWidth>
                  <InputLabel htmlFor="auth-register-password" required>
                    Mật khẩu
                  </InputLabel>
                  <OutlinedInput
                    label="Mật khẩu"
                    value={values.password}
                    error={passwordError}
                    id="auth-register-password"
                    onChange={handleChange("password")}
                    type={values.showPassword ? "text" : "password"}
                    onFocus={() => setDisplayPasswordInfo(true)}
                    onBlur={() => setDisplayPasswordInfo(false)}
                    sx={{ marginBottom: 2 }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          aria-label="toggle password visibility"
                        >
                          {values.showPassword ? (
                            <EyeOutline fontSize="small" />
                          ) : (
                            <EyeOffOutline fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {displayPasswordInfo && (
                    <Alert severity="info" icon={false}>
                      <ul>
                        <li>
                          <Typography variant="caption">
                            Có từ 8 - 20 ký tự
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="caption">
                            Bắt đầu bằng chữ cái hoặc chữ số
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="caption">
                            Có ít nhất 1 chữ cái, 1 chữ số và 1 ký tự đặc biệt
                          </Typography>
                        </li>
                      </ul>
                    </Alert>
                  )}
                </FormControl>
                <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 2 }}>
                  <InputLabel
                    htmlFor="auth-register-repassword"
                    required
                    error={isRePasswordError}
                  >
                    Nhập lại mật khẩu
                  </InputLabel>
                  <OutlinedInput
                    label="Nhập lại mật khẩu"
                    // value={values.password}
                    id="auth-register-repassword"
                    // onChange={handleChange("password")}
                    type={values.showRePassword ? "text" : "password"}
                    onBlur={(e) => {
                      e.target.value === values.password
                        ? setIsRePasswordError(false)
                        : setIsRePasswordError(true);
                    }}
                    onChange={(e) => {
                      if (e.target.value === values.password)
                        setIsRePasswordError(false);
                    }}
                    error={isRePasswordError}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={handleClickShowRePassword}
                          onMouseDown={handleMouseDownRePassword}
                          aria-label="toggle password visibility"
                        >
                          {values.showRePassword ? (
                            <EyeOutline fontSize="small" />
                          ) : (
                            <EyeOffOutline fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {isRePasswordError && (
                    <FormHelperText
                      error={isRePasswordError}
                      id="repassword-error"
                    >
                      Không trùng khớp với mật khẩu! Vui lòng kiểm tra lại
                    </FormHelperText>
                  )}
                </FormControl>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  required
                  //value={phoneNumber}
                  error={phoneNumberError}
                  helperText={ErrorMessage3[0]}
                  onChange={(e) => validationPhone(e)}
                  sx={{ marginBottom: 4, marginTop: 2 }}
                />

                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  error={emailError}
                  helperText={ErrorMessage1[0]}
                  onChange={(e) => validationEmail(e)}
                  sx={{ marginBottom: 4 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox onChange={() => setTermAccept(!termsAccept)} />
                  }
                  label={
                    <Fragment>
                      <span>Tôi đồng ý với </span>
                      <Link href="/" passHref>
                        <LinkStyled onClick={(e) => e.preventDefault()}>
                          các điều khoản & dịch vụ
                        </LinkStyled>
                      </Link>
                    </Fragment>
                  }
                />
                <Button
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  sx={{ marginBottom: 4 }}
                  onClick={() => handleSignup()}
                >
                  Đăng ký
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
                    Đã có tài khoản?
                  </Typography>
                  <Typography variant="body2">
                    <Link passHref href="/login">
                      <LinkStyled>Đăng nhập ngay</LinkStyled>
                    </Link>
                  </Typography>
                </Box>
                <Divider sx={{ my: 5 }}>hoặc</Divider>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Link href="/" passHref>
                    <IconButton
                      component="a"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Facebook sx={{ color: "#497ce2" }} />
                    </IconButton>
                  </Link>
                  <Link href="/" passHref>
                    <IconButton
                      component="a"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Twitter sx={{ color: "#1da1f2" }} />
                    </IconButton>
                  </Link>
                  <Link href="/" passHref>
                    <IconButton
                      component="a"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Github sx={{ color: "#272727" }} />
                    </IconButton>
                  </Link>
                  <Link href="/" passHref>
                    <IconButton
                      component="a"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Google sx={{ color: "#db4437" }} />
                    </IconButton>
                  </Link>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Box>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Đăng ký thành công"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Đăng ký tài khoản thành công! Đăng nhập ngay?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              router.push("/");
              setOpen(false);
            }}
          >
            Về trang chủ
          </Button>
          <Button
            onClick={() => {
              router.push("/login");
              setOpen(false);
            }}
            autoFocus
          >
            Đăng nhập
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default RegisterPage;
