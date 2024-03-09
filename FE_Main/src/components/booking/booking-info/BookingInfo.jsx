import { FormControl, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Fragment, useContext } from "react";
import { BookingContext } from "../../../../context/BookingContext";
import styles from "./booking-info.module.css";
// import BookingStepper from "../../components/stepper/BookingStepper";

const BookingInfo = () => {
  const {
    nameState,
    phoneState,
    emailState,
    validateName,
    validatePhone,
    validateEmail,
    nameError,
    phoneError,
    emailError,
    checkDisabled,
  } = useContext(BookingContext);
  // const [nameError, setNameError] = useState("");
  // const [phoneError, setPhoneError] = useState("");
  // const [emailError, setEmailError] = useState("");
  const nameRegex =
    /^[a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđA-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ0-9]*(?:[ a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđA-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ0-9]*)*$/;
  const phoneRegex =
    /(03|05|07|08|09|01[2|6|8|9]|\+843|\+845|\+847|\+848|\+849|\+841[2|6|8|9])+([0-9]{8})\b/;
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <h1>
          Thông tin khách hàng
        </h1>
      </Box>
      {/* <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open="true"
          anchororigin={{
            vertical: "top",
            horizontal: "right",
          }}
          autoHideDuration={6000}
        >
          <Alert severity="error" sx={{ width: "100%" }}>
            Thông tin người dùng không hợp lệ
          </Alert>
        </Snackbar>
      </Stack> */}
      <div className={styles.container}>
        <FormControl className={styles.form}>
          <TextField
            className={styles.input}
            id="name"
            name="name"
            label="Họ tên"
            variant="outlined"
            placeholder="Nhập họ tên khách hàng"
            size="small"
            value={nameState}
            onChange={(e) => {
              validateName(e, nameRegex);
            }}
            // onBlur={checkNextable()}
          />
          <div className={styles.errorcontainer}>
            {nameError && (
              <div className={styles.validateerror}>{nameError}</div>
            )}
          </div>
          <TextField
            className={styles.input}
            id="phone"
            name="phone"
            label="Điện thoại"
            value={phoneState}
            variant="outlined"
            placeholder="Nhập số điện thoại liên lạc"
            size="small"
            onChange={(e) => {
              validatePhone(e, phoneRegex);
            }}
            // onBlur={checkNextable()}
          />
          <div className={styles.errorcontainer}>
            {phoneError && (
              <div className={styles.validateerror}>{phoneError}</div>
            )}
          </div>
          <TextField
            className={styles.input}
            id="email"
            name="email"
            label="Email (tùy chọn)"
            value={emailState}
            variant="outlined"
            placeholder="Nhập email"
            size="small"
            onChange={(e) => {
              validateEmail(e, emailRegex);
            }}
            // onBlur={checkNextable()}
          />
          <div className={styles.errorcontainer}>
            {emailError && (
              <div className={styles.validateerror}>{emailError}</div>
            )}
          </div>
        </FormControl>
      </div>
    </>
  );
};

export default BookingInfo;
