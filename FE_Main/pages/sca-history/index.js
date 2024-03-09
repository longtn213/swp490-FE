import DefaultLayout from "../../src/components/layout/DefaultLayout";
import {Breadcrumbs, Grid, Typography} from "@mui/material";
import {filterAnswer, getOrderScaResult} from "../../src/api/answer/answerApi";
import DialogAlert from "../../src/components/dialog/dialogAlert";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {useEffect, useState} from "react";
import AnswerCard from "../../src/components/card/answer-card/AnswerCard";
import Link from "next/link";
import Head from "next/head";

const ScaHistory = () => {
    const defaultQueryParam = {

        answerId: {
            value: "",
            operator: "contains",
        },
        answerCName: {
            value: "",
            operator: "contains",
        },
        answerRepliedBy: {
            value: "",
            operator: "contains",
        },
        answerStatus: {
            value: "",
            operator: "contains",
        },
        answerAnswerSet: {
            value: "",
            operator: "contains",
        },
        answerSpaServices: {
            value: "",
            operator: "contains",
        },
    };

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(100);
    const [count, setCount] = useState(0);

    const [list, setList] = useState([]);
    const [error, setError] = useState("");
    const [openError, setOpenError] = useState(false);

    const [queryParam, setQueryParam] = useState(defaultQueryParam);

    const {answerRepliedBy, answerStatus} = queryParam;

    const handleClose = () => {
        setOpenError(false);
    };

    const breadcrumbs = [
        <Link underline="hover" key="1" href="/">
            Trang chủ
        </Link>,
        <Typography key="2" color="text.primary">
            Lịch sử trả lời form
        </Typography>,
    ];

    const callFilter = async (pageProp, sizeProp) => {
        
        const data = await filterAnswer(
            queryParam ? queryParam : defaultQueryParam,
            pageProp,
            sizeProp,
            localStorage.getItem("id")
        );
        console.log(data)
        if (!data) return;
        if (data.meta.code != 200) {
            setError(data.meta.message);
            setOpenError(true);
            return;
        }
        if (!data.data) return;
        setCount(data.meta.total);
        var tempList = [];
        console.log("data history sca:", data);
        tempList = [...data.data].sort((a,b) => b.createdDate - a.createdDate);
        setList([...tempList]);
    };

    useEffect(() => {
        callFilter(page, size);
    }, []);

    return (
        <DefaultLayout>
            <Head>
                <title>Các bộ câu hỏi đã được trả lời - SSDS</title>
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
                Các bộ câu hỏi bạn đã trả lời
            </Typography>
            <br></br>
            <Grid
                container
                rowSpacing={3}
                columnSpacing={{xs: 1, sm: 2, md: 3}}
            >
                {list.map((item, key) => {
                    return (
                        <Grid
                            key={key}
                            item
                            xs={12}
                            ml={10}
                            mr={10}
                        >
                            <AnswerCard item={item}/>

                        </Grid>
                    );

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

export default ScaHistory;