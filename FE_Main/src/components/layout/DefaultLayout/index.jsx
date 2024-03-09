import {Fragment} from "react";
import Header from "../../header/Header";
import Footer from "../../footer/Footer";
import styles from "./default-layout.module.css"

function DefaultLayout({children}) {
    return (
        <div className={styles.container}>
            <Fragment>
                <Header/>
            </Fragment>
            <div className={styles.main}>{children}</div>
            <Fragment>
                <Footer/>
            </Fragment>
        </div>
    );
}

export default DefaultLayout;
