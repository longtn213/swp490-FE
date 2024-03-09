import {ListItem, ListItemButton, Typography} from "@mui/material";
import {useRouter} from "next/router";
import {Fragment, useEffect, useState} from "react";
import {getAllCategories} from "../../api/common/commonApi";
import styles from "./category.module.css";

const VerticalCategory = (props) => {
    const {onChangeCategory, onSelectAllCategory, isFromHomepage} = props;
    const router = useRouter();
    const [categoriesState, setCategoriesState] = useState([]);

    useEffect(() => {
        callGetAllCategories();
    }, []);

    const callGetAllCategories = async () => {
        const data = await getAllCategories();
        if (!data) return;
        if (!data.data) return;
        setCategoriesState(data.data);
    };

    const selectCateFromHomepage = (code) => {
        localStorage.setItem("selectCateFromHomepage", code);
        console.log(code);
        router.push(`/service`)
    }

    return (
        <Fragment>
            <ListItem
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                <ListItemButton
                    className={styles.button}
                    component="a"
                    name="serviceCategory"
                    onClick={() => {
                        if (onSelectAllCategory) onSelectAllCategory();
                        if (isFromHomepage) router.push(`/service`);
                    }}
                >
                    <Typography className={styles.title} textAlign="left">
                        Tất cả
                    </Typography>
                </ListItemButton>
                {categoriesState.map((category, key) => (
                    <ListItemButton
                        className={styles.button}
                        component="a"
                        key={key}
                        name="serviceCategory"
                        value={category.code}
                        onClick={(e) => {
                            if (onChangeCategory) onChangeCategory(category);
                            if (isFromHomepage) selectCateFromHomepage(category.code);
                        }}
                    >
                        <Typography className={styles.title} textAlign="left">
                            {category.name}
                        </Typography>
                    </ListItemButton>
                ))}
            </ListItem>
        </Fragment>
    );
};

export default VerticalCategory;
