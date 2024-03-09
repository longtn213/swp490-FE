import {useEffect, useState} from "react";
import SearchBar from "../../../../src/components/search-bar/SearchBar";
import BookingBranchList from "../../../../src/components/booking-branch-list/BookingBranchList";
import styles from "./booking-branch.module.css";
import {Box, Button, Grid, Typography} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
// import axios from "axios";
// import goongJs from "@goongmaps/goong-js";
import {getAllBranches} from "../../../api/common/commonApi";
import axios from "axios";
import BookingPreview from "../booking-preview/BookingPreview";

const BookingBranch = () => {
    var sortedBranches;
    const [isSorted, setIsSorted] = useState(false);
    const [branchesState, setBranchesState] = useState();

    // const {branchesState, setBranchesState} = useContext(BookingContext)
    useEffect(() => {
        setIsSorted(false);
        callGetAllBranches()
    }, []);

    const callGetAllBranches = async () => {
        const data = await getAllBranches()
        if (!data) return
        if (!data.data) return
        let temp = []
        data.data.map((item) => {
            if(item.isActive === true) {
                temp.push(item)
            }
        })
        setBranchesState(temp);
    }

    useEffect(() => {
        if (isSorted && sortedBranches) {
            console.log(sortedBranches);
            setBranchesState(sortedBranches);
        }
    }, [isSorted, sortedBranches]);

    const getDistance = async (lat, long) => {
        var spaDestination = "";
        branchesState.map((item, index, arr) => {
            spaDestination += item.latitude + "," + item.longitude;
            if (arr.length - 1 > index) {
                spaDestination += "%7C";
            }
            return null;
        });
        try {
            const res = await axios.get(
                `https://rsapi.goong.io/DistanceMatrix?origins=` +
                lat +
                "," +
                long +
                "&destinations=" +
                spaDestination +
                "&api_key=O8C34vNPiWUblu2Zhk76cGwiABK9WCj3Jtsqmkeu"
            );
            var spaDistance = res.data.rows[0].elements;
            branchesState.map((item, index) => {
                item.distance = spaDistance[index].distance;
                return null;
            });
            sortedBranches = branchesState;
            sortedBranches.sort((a, b) => a.distance.value - b.distance.value);
            console.log(sortedBranches);
            setIsSorted(true);
        } catch (error) {
            console.log(error.message);
        }
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                getDistance(position.coords.latitude, position.coords.longitude);
            });
        }
        console.log(branchesState);
    };

    return (
        <Box sx={{maxWidth: 1000, margin: "0 auto"}}>
            <Typography
                variant="h4"
                gutterBottom
                ml={15}
            >
                Chọn chi nhánh
            </Typography>
            <Grid container sx={{maxWidth: 1000, display: "flex", justifyContent: "center"}}>
                <Grid item xs={7}>
                    <div className={styles.container}>
                        <SearchBar
                            label="Tìm chi nhánh"
                            placeholder="Nhập chi nhánh mà bạn muốn tìm"
                        />
                        <Button size="small" variant="outlined" onClick={getLocation} sx={{margin: "8px 16px"}}>
                            <MyLocationIcon/>
                            Tìm spa gần nhất
                        </Button>
                        <BookingBranchList branches={branchesState}/>
                    </div>
                </Grid>
                <Grid item xs={5}>
                    <BookingPreview/>
                </Grid>
            </Grid>
        </Box>
    );
};

export default BookingBranch;
