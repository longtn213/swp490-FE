import DefaultLayout from "../../src/components/layout/DefaultLayout";
import {Breadcrumbs, Grid, Typography} from "@mui/material";
import {filterSCA} from "../../src/api/sca/scaApi";
import DialogAlert from "../../src/components/dialog/dialogAlert";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {useEffect, useState} from "react";
import ScaCard from "../../src/components/card/sca-card/ScaCard";
import Link from "next/link";
import Head from "next/head";

const ScaList = () => {

    const defaultQueryParam = {

        scaId: {
            value: "",
            operator: "contains",
        },
        scaName: {
            value: "",
            operator: "contains",
        },
        scaDesc: {
            value: "",
            operator: "contains",
        },
        scaQuestion: {
            value: "",
            operator: "in",
        },
    };

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [count, setCount] = useState(0);

    const [list, setList] = useState();
    const [error, setError] = useState("");
    const [openError, setOpenError] = useState(false);

    const [queryParam, setQueryParam] = useState(defaultQueryParam);

    const {scaName, scaDesc} = queryParam;

    const handleClose = () => {
        setOpenError(false);
    };

    const breadcrumbs = [
        <Link underline="hover" key="1" href="/">
            Trang chủ
        </Link>,
        <Typography key="2" color="text.primary">
            Câu hỏi đánh giá
        </Typography>,
    ];

    const callFilter = async (pageProp, sizeProp) => {
        console.log(localStorage.getItem("id"))
        const data = await filterSCA(
            queryParam ? queryParam : defaultQueryParam,
            pageProp,
            sizeProp  
        );
        if (!data) return;
        if (data.meta.code != 200) {
            setError(data.meta.message);
            setOpenError(true);
            return;
        }
        if (!data.data) return;
        setCount(data.meta.total);
        let tempList = [];
        console.log(data);
        tempList = [...data.data];
        setList(tempList);
    };

    useEffect(() => {
        callFilter(page, size);
    }, []);


    return (
        <DefaultLayout>
            <Head>
                <title>Các bộ câu hỏi đánh giá - SSDS</title>
            </Head>
            <Breadcrumbs
                separator={<NavigateNextIcon sx={{fontSize: "medium"}}/>}
                aria-label="breadcrumb"
                mx={{xs: 2, lg: 15}}
                mt={3}
                mb={3}
            >
                {breadcrumbs}
            </Breadcrumbs>
            <Typography variant="h4" sx={{textAlign: "center", mt: 4}}>
                Các bộ câu hỏi đánh giá
            </Typography>
            <Grid
                container
                rowSpacing={3}
                columnSpacing={{xs: 1, sm: 2, md: 3}}
            >
                {list?.map((item, key) => {
                    if (item.active === true) {
                        return (
                            <Grid
                                key={key}
                                item
                                xs={12}
                                ml={10}
                                mr={10}
                            >
                                <ScaCard item={item}/>
                            </Grid>
                        );
                    }
                })}
            </Grid>
            <DialogAlert
                nameDialog={"Có lỗi xảy ra"}
                open={openError}
                allertContent={error}
                handleClose={handleClose}
            />
        </DefaultLayout>
    );

};
export default ScaList;