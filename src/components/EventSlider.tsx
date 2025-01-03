"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from 'react-responsive';
import Image from "next/image";
import Slider from "react-slick";
import Link from "next/link";

interface EventSliderProps {
  events: ServiceEvent[];
}

export default function EventSlider({ events }: EventSliderProps) {
  const isSp = useMediaQuery({ query: '(max-width: 1179px)' });
  const [itemsPerPage, setItemsPerPage] = useState<number>(1);

  useEffect(() => {
    setItemsPerPage(isSp ? 1 : 3);
  }, [isSp]);

  const settings = {
    className: "center",
    dots: true,
    centerMode: true,
    infinite: true,
    draggable: false,
    arrows: false,
    centerPadding: "30px",
    slidesToShow: itemsPerPage,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 8000,
    appendDots: (dots: any) => (
      <div
        style={{
          width: '100%',
          position: 'absolute',
          bottom: '-2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <ul> {dots} </ul>
      </div>
    ),
    dotsClass: 'dots-custom'
  };

  return (
    <div className="event-slider">
      <Slider {...settings}>
        {events.map((event) => (
          <Link key={event.id} href={event.href || `/events/${event.id}`} className="slider-item">
            <Image
              src={event.image}
              alt={event.title}
              fill
            />
            <div className="event-title">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
            </div>
          </Link>
        ))}
      </Slider>
    </div>
  );
};