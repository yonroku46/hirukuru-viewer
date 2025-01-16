"use client";

import { useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Image from "next/image";
import Slider from "react-slick";
import Link from "next/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import ArrowLeftRoundedIcon from '@mui/icons-material/ArrowLeftRounded';
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';

interface EventSliderProps {
  events: ServiceEvent[];
}

export default function EventSlider({ events }: EventSliderProps) {
  const isSp = useMediaQuery({ query: "(max-width: 1179px)" });

  const sliderRef = useRef<Slider | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const settings = {
    infinite: true,
    draggable: false,
    arrows: false,
    dots: false,
    slidesToShow: 1,
    speed: 1500,
    autoplay: true,
    autoplaySpeed: 10000,
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
  };

  const goToPrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    sliderRef.current?.slickPrev();
  };

  const goToNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    sliderRef.current?.slickNext();
  };

  return (
    <div className="event-slider">
      <Slider ref={sliderRef} {...settings}>
        {events.map((event) => (
          <Link key={event.eventId} href={event.href || `/events/${event.eventId}`} className="slider-item">
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
      <div className="event-index">
        {!isSp &&
          <button onClick={goToPrevious}>
            <ArrowLeftRoundedIcon />
          </button>
        }
        <p style={{ padding: isSp ? "0 0.5rem" : "0" }}>
          {currentSlide + 1}
          <span className="slash">/</span>
          {events.length}
        </p>
        {!isSp &&
          <button onClick={goToNext}>
            <ArrowRightRoundedIcon />
          </button>
        }
      </div>
    </div>
  );
};