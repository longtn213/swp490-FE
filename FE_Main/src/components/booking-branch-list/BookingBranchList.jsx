import {List, ListItemButton, ListItemText, Typography} from "@mui/material";
import { useEffect } from "react";
import {useContext} from "react";
import {BookingContext} from "../../../context/BookingContext";
import styles from "./booking-branch-list.module.css";

const BookingBranchList = (props) => {
    const {selectedBranch, setSelectedBranch, setIsNextable1, setIsDisabled, setSelectedTimestamp} = useContext(BookingContext);

    var currentBranch;
    var tempBranch = selectedBranch;
    useEffect(() => {
        if (selectedBranch === undefined) {
            setIsNextable1(false)
            setIsDisabled(true)
        } else {
            setIsNextable1(true)
            setIsDisabled(false)
        }
    }, [selectedBranch])

    const selectBranch = (branch) => {
        var prevBranch = selectedBranch
        if (prevBranch !== branch) {
            console.log("Reset selected timestamp");
            setSelectedTimestamp(0)
        }
        setSelectedBranch(branch);
        currentBranch = branch
        // setIsNextable1(true);
    }
    return (
        <div>
            <List className={styles.container}>
                {props?.branches?.map((branch, key) => (
                    <ListItemButton
                        onClick={() => selectBranch(branch)}
                        key={key}
                        className={styles.btn}
                        sx={{
                            border: 2,
                            borderColor: (tempBranch?.code === branch?.code)
                                ? "#EDBB0F"
                                : "#000000",
                            borderRadius: 1
                        }}
                    >
                        <ListItemText className="branch-title">{branch.name}</ListItemText>
                        <Typography className="branch-distance">{branch?.distance?.text}</Typography>
                        {/* <ListItemText className="brach-distance">Chi nhánh 1</ListItemText> */}
                    </ListItemButton>
                ))}
            </List>
        </div>
    );
};

export default BookingBranchList;
