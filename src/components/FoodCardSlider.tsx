"use client";

import { useEffect, useRef, useState } from 'react';
import Slider, { Settings } from 'react-slick';
import { useMediaQuery } from 'react-responsive';
import FoodCard from '@/components/FoodCard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Box } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Skeleton from '@mui/material/Skeleton';

interface FoodCardSliderProps {
  title: string;
  data: Food[];
}

export default function FoodCardSlider({ title, data }: FoodCardSliderProps) {
  const sliderRef = useRef<Slider>(null);
  const isSp = useMediaQuery({ query: '(max-width: 1179px)' });

  const [favoriteItems, setFavoriteItems] = useState<string[]>([]);
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

  const handleFavorite = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    if (favoriteItems.includes(id)) {
      setFavoriteItems(favoriteItems.filter((item) => item !== id));
    } else {
      setFavoriteItems([...favoriteItems, id]);
    }
  };

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
    <div className="food-card-slider">
      <div className='food-card-slider-header'>
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
          <FoodCard
            key={item.foodId}
            data={item}
            isFavorite={favoriteItems.includes(item.foodId)}
            handleFavorite={handleFavorite}
            href={`/shop/${item.shopId}?q=${item.name}`}
          />
        ))}
      </Slider>
    </div>
  );
};