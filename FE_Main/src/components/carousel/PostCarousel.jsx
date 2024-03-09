import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PostCard from "../card/post-card/PostCard";
import {Typography} from "@mui/material";
// import { Fragment } from "react";
import styles from "./carousel.module.scss";

const PostCarousel = () => {
    var settings = {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        initialSlide: 0,
        arrows: false,
        autoplay: true,
        speed: 500,
        autoplaySpeed: 4000,
        cssEase: "linear",
    };

    return (
        <div className="post-carousel-container">
            <div className={styles.header}>
                <Typography
                    sx={{textAlign: "center"}}
                    variant="h5"
                    component="div"
                    mb={3}
                >
                    Bài viết gần đây
                </Typography>
            </div>
            <div>
                <Slider {...settings}>
                    <PostCard/>
                    <PostCard/>
                    <PostCard/>
                    <PostCard/>
                    <PostCard/>
                    <PostCard/>
                    <PostCard/>
                    <PostCard/>
                    <PostCard/>
                    <PostCard/>
                    <PostCard/>
                </Slider>
            </div>
        </div>
    );
};

export default PostCarousel;
