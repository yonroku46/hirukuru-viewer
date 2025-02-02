"use client";

import { Fragment } from 'react';
import { useMediaQuery } from "react-responsive";
import { config } from "@/config";
import Link from 'next/link';
import { isBusinessOpen } from '@/common/utils/DateUtils';
import { formatWeeklyBusinessHours } from '@/common/utils/DateUtils';
import Image from "@/components/Image";

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import CloseIcon from "@mui/icons-material/Close";
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';

interface ShopInfoDialogProps {
  data: Shop | null;
  position: PlacePosition;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function ShopInfoDialog({ data, position, open, setOpen }: ShopInfoDialogProps) {
  const isSp = useMediaQuery({ query: "(max-width: 1179px)" });

  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?
  &center=${position.lat},${position.lng}&zoom=17&size=600x300
  &markers=color:red%7C${position.lat},${position.lng}
  &style=element:labels|saturation:-15|lightness:20
  &key=${config.googleMaps.apiKey}`;
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=${position.lat},${position.lng}`;

  if (!data) {
    return null;
  }

  return (
    <Fragment>
      <Dialog
        className="shop-info-dialog"
        fullScreen={isSp}
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle className="title-wrapper">
          <div className="title">
            <ManageSearchOutlinedIcon />
            お店情報
          </div>
          <CloseIcon className="close-icon" onClick={() => setOpen(false)} />
        </DialogTitle>
        <DialogContent className="content">
          <div className="shop-map">
            <div className="map-image-wrapper">
              <Image
                src={mapUrl}
                alt={data.shopName}
                width={600}
                height={300}
              />
              <Link href={googleMapsUrl} target="_blank" className="link-btn">
                経路を見る
              </Link>
            </div>
            <div className="map-info-wrapper">
              <div className="map-info-item">
                <FmdGoodOutlinedIcon className="item-icon" />
                <div className="item-content">
                  {data.detailAddress}
                </div>
              </div>
              <div className="map-info-item">
                <AccessTimeOutlinedIcon className="item-icon" />
                <div className="item-content">
                  <strong>
                    {isBusinessOpen(data.businessHours || []) ? '営業中' : '営業時間外'}
                  </strong>
                  <p>
                    {formatWeeklyBusinessHours(data.businessHours || [])}
                  </p>
                </div>
              </div>
              <div className="map-info-item">
                <StorefrontOutlinedIcon className="item-icon" />
                <div className="item-content">
                  {data.description}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};