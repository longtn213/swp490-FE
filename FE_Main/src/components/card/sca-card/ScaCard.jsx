import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {Button, Grid} from "@mui/material";
import styles from "./sca-card.module.scss";
import Link from "next/link";
import {useRouter} from "next/router";

const ScaCard = (props) => {
    const router = useRouter();
    const item = props.item

    const navigate = () => {
        router.push({
            pathname: '/sca/details',
            query: {id: item.id},
        })
    }

    return (

        <Card className={styles.card} sx={{boxShadow: "0px 0px 8px 2px #dcdbff"}} onClick={(e) => {
            navigate()
        }}>
            <CardContent sx={{width: "100%"}}>
                <Grid container>
                    <Grid
                        item
                        xs={10}
                    >
                        <Typography className={styles.title}>
                            {item.name}
                        </Typography>
                        <Typography className={styles.description} component="div">
                            {item.description}
                        </Typography>
                    </Grid>
                    <Grid item xs={2} sx={{display: "flex", flexDirection: "row-reverse"}}>
                        <Link href={{pathname: '/sca/details', query: {id: item.id}}} passHref>
                            <Button variant="solid"
                                    sx={{
                                        border: "30px",
                                        backgroundColor: "rgb(218, 190, 12)",
                                    }}>
                                Trả lời
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>

    );
};

export default ScaCard;