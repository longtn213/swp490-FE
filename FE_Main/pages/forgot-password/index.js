import { styled, Typography } from "@material-ui/core";
import { Button, Card, CardContent, TextField } from "@mui/material";
import { Box } from "@mui/system";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useEffect, useState } from "react";
import { forgotPassword } from "../../src/api/user/userApi";

const LinkStyled = styled("a")(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.primary.main,
}));

function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorEmailMessage, setErrorEmailMessage] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [count, setCount] = useState(30);

  // useEffect(() => {
  //   if (isValidEmail === true) {
  //     addTimer()
  //   }
  // }, [isValidEmail, count])

  const decrementTimer = useCallback(() => {
    setCount((count) => count - 1);
  }, []);

  useEffect(() => {
    if (isValidEmail) {
      if (count <= 0) {
        return;
      }
      const timeoutFunction = setInterval(decrementTimer, 1000);

      return () => clearInterval(timeoutFunction);
    }
  }, [decrementTimer, count, isValidEmail]);

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const handleRecoverPassword = () => {
    setIsValidEmail(false);
    setErrorEmail(false);
    setErrorEmailMessage("");
    if (email.trim() !== "") {
      if (emailRegex.test(email.trim())) {
        setEmail(email.trim());
      } else {
        setErrorEmail(true);
        setErrorEmailMessage("Email không đúng format. Vui lòng kiểm tra lại");

        return;
      }
      if (email.trim().length > 100) {
        setErrorEmail(true);
        setErrorEmailMessage("Độ dài email không được vượt quá 100 ký tự");

        return;
      }
    } else {
      setErrorEmail(true);
      setErrorEmailMessage("Không được để trống email");

      return;
    }

    // setIsValidEmail(true)

    // addTimer()
    callApiForgotPassword();
  };

  const callApiForgotPassword = async () => {
    const res = await forgotPassword(email);
    if (!res) return;
    if (res.meta.code != 200) {
      setErrorEmail(true);
      setErrorEmailMessage(res.meta.message);

      return;
    }

    setIsValidEmail(true);
  };

  const callApiForgotPasswordResend = async () => {
    const res = await forgotPassword(email);
    if (!res) return;
    if (res.meta.code != 200) {
      return;
    }

    setCount(30);
  };

  const handleResendEmail = () => {
    if (count === 0) {
      callApiForgotPasswordResend();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Head>
        <title>Quên mật khẩu - SSDS</title>
      </Head>
      <Box
        className="app-content"
        sx={{ minHeight: "100vh", overflowX: "hidden", position: "relative" }}
      >
        <Box className="content-center">
          <Card sx={{ zIndex: 1, width: "32rem", mt: 10 }}>
            {isValidEmail ? (
              <CardContent sx={{ padding: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    className="Logo"
                    src="/logo/black-transparent-logo.png"
                    alt="Logo"
                    width={150}
                    height={150}
                  />
                </Box>
                <Box mb={4}>
                  <Typography variant="h6">Quên mật khẩu</Typography>
                  <Box mb={4}>
                    <Typography variant="body2">
                      Mật khẩu mới đã được gửi về email <strong>{email}</strong>
                      , vui lòng kiểm tra hòm thư có chứa đường link để đổi mật
                      khẩu, sau đó thực hiện việc đăng nhập lại.
                    </Typography>
                    <Box mt={2}>
                      {count === 0 ? (
                        <Typography align="center" variant="body2">
                          Chưa nhận được email? -{" "}
                          <Link passHref href="/">
                            <LinkStyled
                              onClick={(e) => {
                                e.preventDefault();
                                handleResendEmail();
                              }}
                            >
                              gửi lại email
                            </LinkStyled>
                          </Link>{" "}
                          sau {count} giây
                        </Typography>
                      ) : (
                        <Typography align="center" variant="body2">
                          Chưa nhận được email? - gửi lại email sau {count} giây
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    sx={{ marginBottom: 7 }}
                    onClick={() => router.push("/login")}
                  >
                    Về trang đăng nhập
                  </Button>
                </Box>
              </CardContent>
            ) : (
              <CardContent sx={{ padding: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    className="Logo"
                    src="/logo/black-transparent-logo.png"
                    alt="Logo"
                    width={150}
                    height={150}
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Box mb={4}>
                    <Typography variant="h6">Quên mật khẩu</Typography>
                    <Typography variant="body2">
                      Vui lòng nhập email của bạn để khôi phục lại mật khẩu
                    </Typography>
                    <Typography variant="body2" color="error">
                      Nếu không có email, vui lòng liên hệ với quản lý để lấy
                      lại mật khẩu
                    </Typography>
                  </Box>
                  <TextField
                    mt={3}
                    fullWidth
                    id="email"
                    label="Email"
                    sx={{ marginBottom: 4 }}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    error={errorEmail}
                    helperText={errorEmailMessage}
                    onFocus={() => {
                      setErrorEmail(false);
                      setErrorEmailMessage("");
                    }}
                  />
                  <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    sx={{ marginBottom: 2 }}
                    onClick={handleRecoverPassword}
                  >
                    Lấy lại mật khẩu
                  </Button>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography align="right" variant="caption">
                      <Link passHref href="/login">
                        <LinkStyled>Về trang đăng nhập</LinkStyled>
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            )}
          </Card>
        </Box>
      </Box>
    </Box>
  );
}

export default ForgotPassword;
