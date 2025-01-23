"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface NewShopSliderProps {
  shops: Shop[];
}

export default function NewShopSlider({ shops }: NewShopSliderProps) {
  const settings: Settings = {
    infinite: true,
    draggable: false,
    arrows: false,
    dots: true,
    pauseOnHover: true,
    fade: true,
    slidesToShow: 1,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 10000,
    customPaging: function () {
      return <a className="dot" />;
    },
  };

  const getRandomDarkColor = () => {
    const letters = '0123456789';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 10)];
    }
    return color;
  };

  useEffect(() => {
    if (shops.length > 5) {
      console.error("新規店舗は5件以上は表示できません");
    }
  }, [shops]);

  return (
    <div className="newshop-slider">
      <Slider {...settings}>
        {shops.slice(0, 4).map((shop, index) => (
          <Link key={index} href={`/shop/${shop.shopId}`} className="newshop-link">
            <div className="newshop-item" style={{ backgroundColor: getRandomDarkColor() }}>
              <p className="newshop-title">New Open</p>
              <p className="newshop-name">
                {shop.name}
              </p>
              <p className="newshop-description">
                {"#福岡 #ランチ"}
              </p>
              <Image
                className="newshop-image"
                src={"/assets/img/new-open.png"}
                alt={shop.name}
                width={200}
                height={200}
              />
            </div>
          </Link>
        ))}
      </Slider>
    </div>
  );
};