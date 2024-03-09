import React from "react";
import { Box, Column, Container, FooterLink, Heading, Row, } from "./FooterStyles";
import Link from "next/link";
import Image from "next/image";
import VerticalCategory from "../category/VerticalCategory";
import { useEffect, useState } from "react";
import { filterService } from "../../api/service/serviceApi";
import { getAllServices } from "../../api/common/commonApi";
import DialogAlert from "../dialog/dialogAlert";
import { getAllBranches } from "../../api/common/commonApi";
import { getAllCategories } from "../../api/common/commonApi";
import { Typography } from "@material-ui/core";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const Footer = () => {

    const [branchesState, setBranchesState] = useState();
    const [list, setList] = useState();
    const [list1, setList1] = useState();
    const [categoriesState, setCategoriesState] = useState([]);
    const [branchList, setBranchList] = useState([])

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const callApiGetAllBranch = async () => {
        const res = await getAllBranches()
        if (!res) return
        if (!res.data) return
        let tempList = [];
        tempList = [...res.data];
        setList(tempList);
        console.log(...res.data);
    }

    const callGetAllCategories = async () => {
        const res = await getAllCategories()
        if (!res) return
        if (!res.data) return
        let tempList = [];
        tempList = [...res.data];
        setList1(tempList);
        console.log(...res.data);
    }

    useEffect(() => {
        callApiGetAllBranch()
        console.log(list)
        callGetAllCategories()
    }, []);

    return (
        <Box className="footer-container">
            <Container>
                <Row>
                    <Column>
                        <Heading>
                            <Link href="/">
                                <Image
                                    className="Logo"
                                    src="/logo/logo.png"
                                    alt="Logo"
                                    width={120}
                                    height={120}
                                />
                            </Link>
                        </Heading>
                    </Column>
                    <Column>
                        <Heading>Danh mục</Heading>
                        <FooterLink>
                            {list1?.map((item, key) => {
                                return (
                                    <FooterLink key={key} item>
                                        <Typography style={{ fontSize: '20px', marginLeft: "10px" }}>{item.name}</Typography>
                                    </FooterLink>
                                );

                            })}
                        </FooterLink>
                    </Column>
                    <Column>
                        <Heading>Chi nhánh</Heading>
                        <FooterLink>
                            {list?.map((item, key) => {
                                if(item.isActive === true){
                                return (
                                    <FooterLink key={key} item>
                                        <Typography style={{ fontSize: '20px', marginLeft: "10px" }}>{item.name}</Typography>
                                    </FooterLink>
                                );
                            }
                            })}
                        </FooterLink>
                    </Column>
                    <Column>
                        <Heading>Liên hệ</Heading>
                        <FooterLink onClick={handleClickOpen}>

                            <Typography style={{ fontSize: '20px', marginLeft: "10px" }}>
                                Facebook
                            </Typography>

                        </FooterLink>
                        <FooterLink onClick={handleClickOpen}>

                            <Typography style={{ fontSize: '20px', marginLeft: "10px" }}>
                                Instagram
                            </Typography>

                        </FooterLink>
                        <FooterLink onClick={handleClickOpen}>

                            <Typography style={{ fontSize: '20px', marginLeft: "10px" }}>
                                Twitter
                            </Typography>

                        </FooterLink>
                        <FooterLink onClick={handleClickOpen}>

                            <Typography style={{ fontSize: '20px', marginLeft: "10px" }}>
                                Youtube
                            </Typography>

                        </FooterLink>
                    </Column>
                </Row>
            </Container>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Thông báo"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Chức năng sẽ sớm được cập nhật
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </Box>
    );
};
export default Footer;
