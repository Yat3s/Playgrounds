export const settings = {
  pauseOnHover: true,
  infinite: true,
  speed: 6000,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplaySpeed: 0,
  autoplay: true,
  loop: true,
  cssEase: "linear",
  arrows: false,
  responsive: [
    {
      breakpoint: 1460,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        dots: false,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        dots: false,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: false,
      },
    },
  ],
};
