"use client";

import { useEffect, useRef, useState } from 'react';
import Slider, { Settings } from 'react-slick';
import { useMediaQuery } from 'react-responsive';
import ItemCard from '@/components/ItemCard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Box } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Skeleton from '@mui/material/Skeleton';

interface ItemCardSliderProps {
  title: string;
  data: Item[];
}

export default function ItemCardSlider({ title, data }: ItemCardSliderProps) {
  const sliderRef = useRef<Slider>(null);
  const isSp = useMediaQuery({ query: '(max-width: 1179px)' });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isSliderRendering, setIsSliderRendering] = useState<boolean>(true);

  const settings: Settings = {
    dots: false,
    draggable: false,
    arrows: false,
    speed: 400,
    lazyLoad: "ondemand",
    slidesToShow: itemsPerPage,
    slidesToScroll: itemsPerPage,
    onInit: () => {
      setIsSliderRendering(false);
    }
  };

  useEffect(() => {
    setItemsPerPage(isSp ? 2 : 4);
  }, [isSp]);

  const handlePrev = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isAnimating) return;
    e.stopPropagation();
    setIsAnimating(true);
    const newIndex = Math.max(currentIndex - itemsPerPage, 0);
    setCurrentIndex(newIndex);
    sliderRef.current?.slickPrev();
    setTimeout(() => setIsAnimating(false), 450);
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isAnimating) return;
    e.stopPropagation();
    setIsAnimating(true);
    const newIndex = Math.min(currentIndex + itemsPerPage, data.length - 1);
    setCurrentIndex(newIndex);
    sliderRef.current?.slickNext();
    setTimeout(() => setIsAnimating(false), 450);
  };

  return (
    <div className="item-card-slider">
      <div className='item-card-slider-header'>
        <div className='title-wrapper'>
          <h2 className="title">
            {title}
          </h2>
        </div>
        <div className='btn-wrapper'>
          <button className='all-btn'>
            すべて表示
          </button>
          <button
            className={`pc-only prev-btn ${currentIndex > 0 ? 'active' : ''}`}
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            <ArrowBackRoundedIcon />
          </button>
          <button
            className={`pc-only next-btn ${currentIndex + itemsPerPage < data.length ? 'active' : ''}`}
            onClick={handleNext}
            disabled={currentIndex + itemsPerPage >= data.length}
          >
            <ArrowForwardRoundedIcon />
          </button>
        </div>
      </div>
      {isSliderRendering &&
        <Box>
          <Skeleton variant="rectangular" height={148} />
          <Skeleton />
          <Skeleton width="60%" />
        </Box>
      }
      <Slider ref={sliderRef} {...settings}>
        {data.map((item) => (
          <ItemCard
            key={item.itemId}
            data={item}
            href={`/shop/${item.shopId}?q=${item.name}`}
          />
        ))}
      </Slider>
    </div>
  );
};