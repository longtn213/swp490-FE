import {Grid, IconButton, TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
// import { Fragment } from "react";
import styles from "./search-bar.module.scss";
import {useRouter} from "next/router";
import {useState} from "react";

const SearchBar = (props) => {
    const {onChangeTextAndSelectField, isFromHomepage} = props;
    const [value, setValue] = useState("")
    const router = useRouter();

    const searchFromHomepage = (e) => {
        e.preventDefault()
        if (value) {
            localStorage.setItem("searchFromHomepage", value);
            router.push(`/service`)
        }
    }

    return (
        <div className={styles.container}>
            <form className={styles.form}>
                <Grid container>
                    <Grid item xs={isFromHomepage ? 10 : 12}>
                        <TextField
                            id="search-bar"
                            className={styles.text}
                            label={props.label}
                            variant="outlined"
                            name="serviceName"
                            placeholder={props.placeholder}
                            value={value}
                            size="small"
                            onChange={(e) => {
                                if (onChangeTextAndSelectField) onChangeTextAndSelectField(e);
                                setValue(e.target.value)
                            }}
                        />
                    </Grid>
                    <Grid item xs={isFromHomepage ? 2 : 0}>
                        <IconButton
                            type="submit"
                            aria-label="search"
                            sx={isFromHomepage ? {mx: "auto"} : {display: "none"}}
                            onClick={(e) => {
                                if (isFromHomepage) searchFromHomepage(e)
                            }}
                        >
                            <SearchIcon/>
                        </IconButton>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
};

export default SearchBar;
