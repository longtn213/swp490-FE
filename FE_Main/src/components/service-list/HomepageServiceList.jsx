import {Button, Grid, Typography} from "@mui/material";
import Link from "next/link";
import {Fragment, useEffect, useState} from "react";
import {getAllServices} from "../../api/common/commonApi";
import ServiceCard from "../card/service-card/ServiceCard";
import styles from "./homepage-service-list.module.scss";

const HomepageServiceList = () => {
    const [services, setServices] = useState();
    

    useEffect(() => {
        callGetAllServices()
    }, []);

    const callGetAllServices = async () => {
        const data = await getAllServices()
        if (!data) return
        if (!data.data) return
        let newServices = data.data.sort((a, b) => Number(b.isActive)*b.id - Number(a.isActive)*a.id)

        //setServices(data.data.sort((a, b) => Number(b.isActive) - Number(a.isActive)));
        setServices(newServices);
    }

    return (
        <Fragment>
            <Typography
                // sx={{marginLeft: "16px"}}
                variant="h6"
                component="div"
                my={1.5}
                ml={3}
            >
                Dịch vụ mới
            </Typography>
            <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                {services?.map((item, key) => {
                    if (key <= 11) {
                        if (item.isActive === true) {
                        return (
                            <Grid
                                key={key}
                                item
                                xs={6}
                                sm={4}
                                lg={3}
                                sx={{display: "flex", justifyContent: "center"}}
                            >
                                <ServiceCard item={item} url={item.files && item.files[0].url}/>
                            </Grid>
                        );
                    }
                }
                })}
            </Grid>
            <div
                className="button-container"
                style={{display: "flex", justifyContent: "center", marginTop: 3}}
            >
                <Link href="/service">
                    <Button
                        className={styles.button}
                        variant="contained"

                        sx={{color: "white", bgcolor: "#D4AE80", borderRadius: "25px"}}
                    >
                        XEM TẤT CẢ
                    </Button>
                </Link>
            </div>
        </Fragment>
    );
};

export default HomepageServiceList;
