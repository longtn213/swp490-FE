import {Button} from "@mui/material";
import {useContext} from "react";
// import { useNavigate } from "react-router-dom";
import {BookingContext} from "../../../../context/BookingContext";
import styles from "./booking-stepper-control.module.css"
import {useRouter} from "next/router";

const BookingStepperControl = () => {
    // const navigate = useNavigate();
    const {activeStep, handleBack, handleNext, handleBooking, isDisabled} = useContext(BookingContext);

    const router = useRouter();

    return (
        <div className={styles.container}>
            {activeStep !== 0 ? (
                <Button onClick={handleBack} className="back-btn">
                    Quay lại
                </Button>
            ) : (
                <Button variant="outlined" onClick={() => router.push(`/`)} className="back-btn">
                    Về trang chủ
                </Button>
            )}

            {activeStep === 3 ? (
                <Button
                    disabled={isDisabled}
                    color="primary"
                    onClick={() => {
                        handleBooking()
                    }}
                    className="next-btn"
                >
                    Đặt lịch
                </Button>
            ) : (
                <Button
                    disabled={isDisabled}
                    color="primary"
                    onClick={() => {
                        handleNext();
                    }}
                    className="next-btn"
                >
                    Bước kế tiếp
                </Button>
            )}
        </div>
    );
};

export default BookingStepperControl;
