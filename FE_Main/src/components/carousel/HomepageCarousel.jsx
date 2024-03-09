import * as React from "react";
// import TinySlider from "tiny-slider-react";
// import "tiny-slider/dist/tiny-slider.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import 'lazysizes';
// import 'lazysizes/plugins/parent-fit/ls.parent-fit';
// import Carousel from "react-material-ui-carousel";
// import pic1 from "../../assets/carousel-picture/carousel-picture-1.jpg";
// import pic2 from "../../assets/carousel-picture/carousel-picture-2.png";
// import pic3 from "../../assets/carousel-picture/carousel-picture-3.png";

const HomepageCarousel = () => {
    var items = [
        {
            href: "/",
            picture: "images/carousel-pictures/327997078_1370030617098359_4557854194391542014_n.png",
        },
        {
            href: "/",
            picture:
                "images/carousel-pictures/329235147_728905815391992_5375821832321404041_n.png",
        },
    ];

    var settings = {
        dots: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
        arrows: false,
        autoplay: true,
        speed: 500,
        autoplaySpeed: 5000,
        cssEase: "linear",
    };

    return (
        <div>
            <Slider {...settings}>
                {items.map((el, key) => (
                    <div className="container" key={key}>
                        <img style={{width: "100%"}} src={el.picture} alt=""/>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default HomepageCarousel;
