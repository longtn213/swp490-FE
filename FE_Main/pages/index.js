import {Box, Grid} from "@mui/material";
import {Fragment} from "react";
import HomepageCarousel from "../src/components/carousel/HomepageCarousel";
import PostCarousel from "../src/components/carousel/PostCarousel";
import VerticalCategory from "../src/components/category/VerticalCategory";
import SearchBar from "../src/components/search-bar/SearchBar";
import HomepageServiceList from "../src/components/service-list/HomepageServiceList";
import DefaultLayout from "../src/components/layout/DefaultLayout/index";
import Head from "next/head";

const Homepage = () => {
    return (
        <DefaultLayout>
            <Head>
                <title>Trang chủ - SSDS</title>
            </Head>
            <Fragment>
                <HomepageCarousel/>
            </Fragment>
            <Fragment>
                <Box mx={{xs: 2, lg: 15}} sx={{backgroundColor: "#FFFFFF", boxShadow: "0px 0px 8px 5px #dcdbff", marginTop: "15px"}}>
                    <Grid container justifyContent="space-around" py={3}>
                        {/* <Grid item xs={12} md={3}>
                            <Grid item xs={12}>
                                <SearchBar
                                    label="Tìm dịch vụ"
                                    placeholder="Nhập dịch vụ bạn muốn tìm"
                                    isFromHomepage
                                />
                            </Grid>
                            <Grid item display={{xs: "none", md: "block"}}>
                                <VerticalCategory xs={0} isFromHomepage/>
                            </Grid>
                        </Grid> */}
                        {/* <Grid item sm={12} md={9}> */}
                        <Grid item sm={12}>
                            <HomepageServiceList/>
                        </Grid>
                    </Grid>
                </Box>
            </Fragment>
            <Fragment>
                <PostCarousel/>
            </Fragment>
        </DefaultLayout>
    );
};

export default Homepage;
