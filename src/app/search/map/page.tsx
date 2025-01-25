"use client";

import { useState, useEffect, useCallback } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { config } from "@/config";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import { enqueueSnackbar } from "notistack";
import Loading from "@/app/loading";
import Image from "@/components/Image";
import { formatRating } from "@/common/utils/StringUtils";
import ShopCard from "@/components/ShopCard";
import Selector from "@/components/input/Selector";
import SwitchButton from "@/components/button/SwitchButton";
import MiniButton from "@/components/button/MiniButton";

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import CloseIcon from "@mui/icons-material/Close";
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FoodCard from "@/components/FoodCard";

const defaultPosition = {
  lat: 33.5902,
  lng: 130.4017
};
const maxZoom = 20;
const minZoom = 5;
const googleMapOptions = {
  maxZoom: maxZoom,
  minZoom: minZoom,
  scrollwheel: true,
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
  zoomControl: false,
  keyboardShortcuts: false,
  gestureHandling: "greedy",
  styles: [
    {
      "elementType": "labels",
      "stylers": [{ "saturation": -15 }, { "lightness": 20 }]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "poi.business",
      "stylers": [{ "visibility": "simplified" }]
    },
    {
      "featureType": "road.local",
      "elementType": "labels",
      "stylers": [{ "visibility": "off" }]
    }
  ]
};

export default function SearchMapPage() {
  const isSp = useMediaQuery({ query: "(max-width: 1179px)" });

  const [favoriteItems, setFavoriteItems] = useState<string[]>([]);
  const [searchType, setSearchType] = useState<'shop' | 'food'>('shop');
  const [shops, setShops] = useState<Shop[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [markPlaces, setMarkPlaces] = useState<Place[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentPlace, setCurrentPlace] = useState<Place | null>(null);
  const [lastSelectedPosition, setLastSelectedPosition] = useState<PlacePosition | null>(null);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [isResultsVisible, setIsResultsVisible] = useState<boolean>(true);
  const [isMapVisible, setIsMapVisible] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(15);

  const handleFavorite = useCallback((e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    if (favoriteItems.includes(id)) {
      setFavoriteItems(favoriteItems.filter((item) => item !== id));
    } else {
      setFavoriteItems([...favoriteItems, id]);
    }
  }, [favoriteItems]);

  const toggleResultsVisibility = () => {
    setIsResultsVisible(!isResultsVisible);
  };

  const toggleMapVisibility = () => {
    setIsMapVisible(!isMapVisible);
  };

  const zoomIn = () => {
    if (map) {
      const newZoom = Math.min((map.getZoom() ?? 0) + 1, maxZoom);
      map.setZoom(newZoom);
      setZoomLevel(newZoom);
    }
  };

  const zoomOut = () => {
    if (map) {
      const newZoom = Math.max((map.getZoom() ?? 0) - 1, minZoom);
      map.setZoom(newZoom);
      setZoomLevel(newZoom);
    }
  };

  const handleCloseInfoWindow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setActiveMarker(null);
  };

  const handleBoundsChanged = () => {
    if (map) {
      const bounds = map.getBounds();
      if (bounds) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const latDiff = ne.lat() - sw.lat();
        const lngDiff = ne.lng() - sw.lng();

        // console.log(`Current bounds: NE(${ne.lat()}, ${ne.lng()}), SW(${sw.lat()}, ${sw.lng()})`);
        // SELECT * FROM places
        // WHERE latitude BETWEEN :southWestLat AND :northEastLat
        // AND longitude BETWEEN :southWestLng AND :northEastLng;

        // マップのズームレベルに応じて、マーカーの表示を切り替える
        // const largeZoomSize = 0.041;
        const smallZoomSize = 0.025;
        const size = smallZoomSize;
        if (latDiff > size || lngDiff > size) {
          // console.log("Zoom in for a closer view!");
        } else {
          // console.log("OK")
        }
      }
    }
  };

  function activateMarkerForShop(shopId: string) {
    const place = markPlaces.find((p) => p.shopId === shopId);
    if (place) {
      setActiveMarker(place.placeId);
    }
  }

  useEffect(() => {
    const dummyShops: Shop[] = [
      { shopId: '1', location: '福岡市博多区', name: '唐揚げ壱番屋', description: '揚げ物専門店', type: 'bento', image: 'https://i.pinimg.com/236x/71/65/43/716543eb8e6907d7163b55000376e2be.jpg', ratingAvg: 4.5, businessHours: [
          { day: 'mon', open: '10:00', close: '23:50' },
          { day: 'tue', open: '10:00', close: '23:50' },
          { day: 'wed', open: '10:00', close: '23:50' },
          { day: 'thu', open: '10:00', close: '23:50' },
          { day: 'fri', open: '10:00', close: '23:50' },
          { day: 'sat', open: '10:00', close: '23:50' },
          { day: 'sun', open: '10:00', close: '23:50' },
        ]
      },
      { shopId: '2', location: '福岡市中央区', name: 'チキンが一番', description: 'チキン専門店', type: 'foodtruck', image: 'https://i.pinimg.com/736x/d2/bb/52/d2bb52d3639b77f024c8b5a584949644.jpg', ratingAvg: 4.0, businessHours: [
          { day: 'mon', open: '10:00', close: '20:00' },
          { day: 'wed', open: '10:00', close: '20:00' },
        ]
      },
      { shopId: '3', location: '福岡市中央区', name: 'チキンが一番', description: 'チキン専門店', type: 'foodtruck', image: 'https://i.pinimg.com/736x/d2/bb/52/d2bb52d3639b77f024c8b5a584949644.jpg', ratingAvg: 4.0, businessHours: [
          { day: 'mon', open: '10:00', close: '20:00' },
          { day: 'wed', open: '10:00', close: '20:00' },
        ]
      },
      { shopId: '4', location: '福岡市中央区', name: 'チキンが一番', description: 'チキン専門店', type: 'foodtruck', image: 'https://i.pinimg.com/736x/d2/bb/52/d2bb52d3639b77f024c8b5a584949644.jpg', ratingAvg: 4.0, businessHours: [
          { day: 'mon', open: '10:00', close: '20:00' },
          { day: 'wed', open: '10:00', close: '20:00' },
        ]
      },
    ];
    const dummyPlaces = [
      { placeId: "P1", shopId: "1", position: { lat: 33.5902, lng: 130.4017 } },
      { placeId: "P2", shopId: "2", position: { lat: 33.5898, lng: 130.4100 } },
    ];
    setShops(dummyShops);
    const dummyFoods: Food[] = [
      { foodId: '1', shopId: '1', category: '日替わり弁当', name: '唐揚げ弁当', description: "国内産の鶏肉を使用した唐揚げ弁当です。", ingredients: ["唐揚げ", "ほうれん草ナムル", "白ごはん"], price: 2000, discountPrice: 500, rating: 4.3, stock: 9, image: 'https://i.pinimg.com/736x/f2/67/df/f267dfdd2b0cb8eac4b5e9674aa49e97.jpg', optionMultiple: true, options: [
        { optionId: '1', foodId: '1', shopId: 'fuk001', name: 'お茶', price: 150 },
        { optionId: '2', foodId: '1', shopId: 'fuk001', name: 'コーラ', price: 200 },
        { optionId: '11', foodId: '1', shopId: 'fuk001', name: 'メガ盛り', price: 300 },
      ]},
    ];
    setFoods(dummyFoods);
    setMarkPlaces(dummyPlaces);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPlace: Place = {
          placeId: "current",
          position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        };
        setCurrentPlace(userPlace);
      },
      (err) => {
        console.error(err.message);
        const defaultPlace: Place = {
          placeId: "default",
          position: defaultPosition
        };
        setCurrentPlace(defaultPlace);
        enqueueSnackbar('位置情報を取得に失敗しました。', { variant: 'error' });
      }
    );
  }, []);

  useEffect(() => {
    if (isSp && isMapVisible) {
      window.scrollTo({
        top: 0,
      });
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = '';
    }
  }, [isSp, isMapVisible]);

  useEffect(() => {
    if (isSp) {
      setIsMapVisible(true);
    }
  }, [isSp]);

  return (
    <div className="search-map-page">
      <div className="content-header">
        <div className="filter-container container">
          <div className="btn-wrapper">
            <SwitchButton
              labels={[{ label: "店舗", value: "shop" }, { label: "弁当", value: "food" }]}
              onChange={(value) => {
                setSearchType(value as 'shop' | 'food');
              }}
            />
          </div>
          <div className="filter-wrapper">
            <Selector
              options={[{ label: "全て", value: "all" }, { label: "営業中のみ", value: "open" }]}
              onChange={(value) => {
                console.log(value);
              }}
            />
          </div>
        </div>
      </div>
      <div className={`content ${isSp && isMapVisible ? "open" : "close"}`}>
        {/* Search Results */}
        {isResultsVisible && (
          <div className={`results ${isSp && isMapVisible ? "open" : "close"}`}>
            <div className="results-wrapper">
              <div>
                検索結果
                <span className="count">
                  {shops.length}
                </span>
                件
              </div>
              {isSp && !isMapVisible && (
                <MiniButton
                  className="sp-map-btn"
                  icon={<MapOutlinedIcon />}
                  onClick={toggleMapVisibility}
                />
              )}
            </div>
            <div className="results-list">
              {searchType === 'shop' ? shops.map((shop, index) => (
                <ShopCard
                  key={index}
                  data={shop}
                  href={`/shop/${shop.shopId}`}
                  openNewTab
                  onHover={() => activateMarkerForShop(shop.shopId)}
                  onClick={() => activateMarkerForShop(shop.shopId)}
                  isFavorite={favoriteItems.includes(shop.shopId)}
                  handleFavorite={handleFavorite}
                />
              )) : foods.map((food, index) => (
                <FoodCard
                  key={index}
                  data={food}
                  href={`/shop/${food.shopId}?q=${food.name}`}
                  openNewTab
                  onHover={() => activateMarkerForShop(food.shopId)}
                  onClick={() => activateMarkerForShop(food.shopId)}
                  isFavorite={favoriteItems.includes(food.foodId)}
                  handleFavorite={handleFavorite}
                />
              ))}
            </div>
          </div>
        )}
        {/* Google Map */}
        <div className={`map ${isSp && isMapVisible ? "open" : "close"}`}>
          <button className="toggle-results-btn" onClick={toggleResultsVisibility}>
            <KeyboardArrowRightIcon className={`arrow-icon ${isResultsVisible ? "open" : "close"}`} />
            {!isResultsVisible &&
              <span className="text">
                リスト表示
              </span>
            }
          </button>
          {isSp && isMapVisible && (
            <MiniButton
              className="sp-list-btn"
              icon={<ListOutlinedIcon />}
              onClick={toggleMapVisibility}
            />
          )}
          <div className="zoom-btn-group">
            <button className={`zoom-btn zoom-in ${zoomLevel >= maxZoom ? 'over' : ''}`} onClick={zoomIn}>
              <AddIcon className="icon" />
            </button>
            <button className={`zoom-btn zoom-out ${zoomLevel <= minZoom ? 'over' : ''}`} onClick={zoomOut}>
              <RemoveIcon className="arrow-icon" />
            </button>
          </div>
          <LoadScript
            googleMapsApiKey={config.googleMaps.apiKey}
            loadingElement={<Loading />}
          >
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              onLoad={(mapInstance) => setMap(mapInstance)}
              onBoundsChanged={handleBoundsChanged}
              onZoomChanged={() => {
                if (map) {
                  setZoomLevel(map.getZoom() ?? 15);
                }
              }}
              center={lastSelectedPosition || currentPlace?.position}
              zoom={zoomLevel}
              options={googleMapOptions}
            >
              {currentPlace?.position && (
                <Marker
                  position={currentPlace?.position}
                  icon={`/assets/icon/user-marker.svg`}
                />
              )}
              {markPlaces.map((place, index) => {
                const shop = shops.find((s) => s.shopId === place.shopId);
                if (!shop) return null;
                return (
                  <Marker
                    key={index}
                    position={place.position}
                    icon={`/assets/icon/${shop.type}-marker.svg`}
                    onClick={() => {
                      setActiveMarker(place.placeId);
                      setLastSelectedPosition(place.position);
                    }}
                    onMouseOver={() => {
                      setActiveMarker(place.placeId);
                    }}
                  >
                    {activeMarker === place.placeId && shop && (
                      <InfoWindow>
                        <Link href={`/shop/${shop.shopId}`} target="_blank">
                          <div className="info-window">
                            <div className="info-image">
                              <Image src={shop.image} alt={shop.name} width={220} height={120} />
                              <button className="close-btn" onClick={handleCloseInfoWindow}>
                                <CloseIcon fontSize="small" />
                              </button>
                            </div>
                            <div className="info-content">
                              <div className="shop-title">
                                {shop.name}
                                <div className="shop-rating">
                                  <StarRoundedIcon fontSize="small" style={{ color: 'var(--rating-color)' }} />
                                  <span>{formatRating(shop.ratingAvg || 0)}</span>
                                </div>
                              </div>
                              <div className="shop-description">
                                {shop.description}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </InfoWindow>
                    )}
                  </Marker>
                );
              })}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
  );
}