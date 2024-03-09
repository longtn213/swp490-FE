import * as React from "react";
import { useState } from "react";
import styles from "./navbar.module.scss";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
// import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Drawer } from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect } from "react";
import { getProfile } from "../../api/auth/authApi";

const Navbar = (props) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { to, anchorOrigin, ...rest } = props;

  const router = useRouter();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // gen màu cho avatar

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name) {
    if (name.split(" ").length >= 2) {
      return {
        sx: {
          bgcolor: stringToColor(name),
        },
        children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
      };
    } else {
      return {
        sx: {
          bgcolor: stringToColor(name),
        },
        children: `${name.split(" ")[0][0]}`,
      };
    }
  }

  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    callApiGetProfile();
  }, []);

  const callApiGetProfile = async () => {
    if (localStorage.getItem("access_token")) {
      const data = await getProfile();
      if (!data) return;
      if (data.meta.code != 200) {
        return;
      }
      if (!data.data) return;

      console.log(data.data);

      setUserInfo(data.data);
    }
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AppBar
      className="header-navbar"
      position="sticky"
      sx={{ bgcolor: "black", color: "#acacac" }}
    >
      {/* <Container maxWidth="xl"> */}
      <Toolbar className={styles.toolbar} disableGutters>
        <Box
          sx={{
            mx: 3,
            ml: 5,
            flexGrow: 1,
            display: { xs: "none", md: "flex" },
          }}
        >
          <Link href="/">
            {/* <Typography
              variant="h6"
              align="left"
              component="div"
              sx={{
                mx: 3,
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              LOGO
            </Typography> */}
            <Image
              className="Logo"
              src="/logo/logo.png"
              alt="Logo"
              width={60}
              height={60}
            />
          </Link>
        </Box>

        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
            sx={{ mx: 3 }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            id="menu-appbar"
            anchorel={anchorElNav}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformorigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: "block", md: "none" },
            }}
            PaperProps={{
              sx: { width: "150px" },
            }}
          >
            <MenuItem
              key="booking"
              onClick={() => {
                router.push("/booking");
                handleCloseNavMenu;
              }}
            >
              <Typography textAlign="right">Đặt lịch</Typography>
            </MenuItem>
            {localStorage.getItem("access_token") !== null && (
              <MenuItem
                key="sca"
                onClick={() => {
                  router.push("/sca");
                  handleCloseNavMenu;
                }}
              >
                <Typography textAlign="right">Câu hỏi đánh giá</Typography>
              </MenuItem>
            )}

            <MenuItem
              key="service"
              onClick={() => {
                router.push("/service");
                handleCloseNavMenu;
              }}
            >
              <Typography textAlign="right">Dịch vụ</Typography>
            </MenuItem>
            <MenuItem key="post" onClick={handleCloseNavMenu}>
              <Typography textAlign="right">Bài viết</Typography>
            </MenuItem>
          </Drawer>
        </Box>
        <Box sx={{ flexGrow: 1, mr: 2, display: { xs: "flex", md: "none" } }}>
          <Link href="/">
            {/* <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              LOGO
            </Typography> */}
            <Image
              src="/logo/logo.png"
              alt="Logo"
              width={60}
              height={60}
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
              }}
            />
          </Link>
        </Box>
        <Box
          sx={{
            display: { xs: "none", md: "flex", justifyContent: "center" },
          }}
        >
          <Button
            className={styles.item}
            key="booking"
            onClick={() => {
              router.push("/booking");
              handleCloseNavMenu;
            }}
            sx={{ color: "white", display: "block" }}
          >
            Đặt lịch
          </Button>
          {localStorage.getItem("access_token") !== null && (
            <Button
              className={styles.item}
              key="sca-list"
              sx={{ color: "white", display: "block" }}
              onClick={() => {
                router.push("/sca");
                handleCloseNavMenu;
              }}
            >
              Câu hỏi đánh giá
            </Button>
          )}
          <Button
            className={styles.item}
            key="service"
            onClick={() => {
              router.push("/service");
              handleCloseNavMenu;
            }}
            sx={{ color: "white", display: "block" }}
          >
            Dịch vụ
          </Button>
          <Button
            className={styles.item}
            key="post"
            onClick={handleClickOpen}
            sx={{ color: "white", display: "block" }}
          >
            Bài viết
          </Button>
        </Box>

        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Tài khoản">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, mx: 4 }}>
              {localStorage.getItem("access_token") !== null ? (
                <Avatar
                  {...stringAvatar(localStorage.getItem("full_name"))}
                  src={userInfo?.avatar?.url}
                />
              ) : (
                <Avatar />
              )}
            </IconButton>
          </Tooltip>
          <Drawer
            sx={{ mt: "45px", display: { xs: "block", md: "none" } }}
            id="menu-appbar"
            anchor="right"
            anchorel={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformorigin={{
              vertical: "top",
              horizontal: "right",
            }}
            width={220}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            PaperProps={{
              sx: { width: "150px" },
            }}
          >
            {localStorage.getItem("access_token") !== null ? (
              <>
                <Typography ml={2} mt={3}>
                  Xin chào, <strong>{localStorage.getItem("full_name")}</strong>
                </Typography>
                <hr />
                <MenuItem
                  key="account"
                  onClick={() => {
                    router.push("/profile");
                    handleCloseUserMenu;
                  }}
                >
                  <Typography textAlign="center">Tài khoản</Typography>
                </MenuItem>
                <MenuItem
                  key="appointment-history"
                  onClick={() => {
                    router.push("/appointment-history");
                    handleCloseUserMenu;
                  }}
                >
                  <Typography textAlign="center">Lịch hẹn</Typography>
                </MenuItem>
                <MenuItem
                  key="sca-history"
                  onClick={() => {
                    router.push("/sca-history");
                    handleCloseUserMenu;
                  }}
                >
                  <Typography textAlign="center">
                    Các bộ câu hỏi đã trả lời
                  </Typography>
                </MenuItem>
                <MenuItem
                  key="logout"
                  onClick={() => {
                    localStorage.clear();
                    router.push("/login");
                    handleCloseUserMenu();
                  }}
                >
                  <Typography textAlign="center">Đăng xuất</Typography>
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem
                  key="login"
                  onClick={() => {
                    router.push("/login");
                    handleCloseUserMenu;
                  }}
                >
                  <Typography textAlign="center">Đăng nhập</Typography>
                </MenuItem>
                <MenuItem
                  key="signup"
                  onClick={() => {
                    router.push("/signup");
                    handleCloseUserMenu();
                  }}
                >
                  <Typography textAlign="center">Đăng ký</Typography>
                </MenuItem>
              </>
            )}
          </Drawer>
        </Box>
        <Box sx={{ flexGrow: 0 }}>
          <Menu
            sx={{ mt: "45px", display: { xs: "none", md: "flex" } }}
            id="menu-appbar"
            anchor="right"
            anchorel={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformorigin={{
              vertical: "top",
              horizontal: "right",
            }}
            width={200}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {localStorage.getItem("access_token") !== null ? (
              <Box>
                <Typography mx={2}>
                  Xin chào, <strong>{localStorage.getItem("full_name")}</strong>
                </Typography>
                <hr />
                <MenuItem
                  key="account"
                  onClick={() => {
                    router.push("/profile");
                    handleCloseUserMenu;
                  }}
                >
                  <Typography textAlign="center">Tài khoản</Typography>
                </MenuItem>
                <MenuItem
                  key="appointment-history"
                  onClick={() => {
                    router.push("/appointment-history");
                    handleCloseUserMenu;
                  }}
                >
                  <Typography textAlign="center">Lịch hẹn</Typography>
                </MenuItem>
                <MenuItem
                  key="sca-history"
                  onClick={() => {
                    router.push("/sca-history");
                    handleCloseUserMenu;
                  }}
                >
                  <Typography textAlign="center">
                    Các bộ câu hỏi đã trả lời
                  </Typography>
                </MenuItem>
                <MenuItem
                  key="logout"
                  onClick={() => {
                    localStorage.clear();
                    router.push("/login");
                    handleCloseUserMenu();
                  }}
                >
                  <Typography textAlign="center">Đăng xuất</Typography>
                </MenuItem>
              </Box>
            ) : (
              <>
                <MenuItem
                  key="login"
                  onClick={() => {
                    router.push("/login");
                    handleCloseUserMenu;
                  }}
                >
                  <Typography textAlign="center">Đăng nhập</Typography>
                </MenuItem>
                <MenuItem
                  key="signup"
                  onClick={() => {
                    router.push("/signup");
                    handleCloseUserMenu();
                  }}
                >
                  <Typography textAlign="center">Đăng ký</Typography>
                </MenuItem>
              </>
            )}
          </Menu>
        </Box>
      </Toolbar>
      {/* </Container> */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Thông báo"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Chức năng sẽ sớm được cập nhật
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </AppBar>
  );
};
export default Navbar;
