import { useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';
import { useMediaQuery } from "react-responsive";

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CropFreeIcon from '@mui/icons-material/CropFree';
import CloseIcon from "@mui/icons-material/Close";

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropDialogProps {
  open: boolean;
  imageSrc: string;
  imageType: 'thumbnailImg' | 'profileImg';
  onClose: () => void;
  onCropComplete: (croppedBlob: Blob, type: 'thumbnailImg' | 'profileImg') => void;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', error => reject(error));
    image.src = url;
  });

const getCroppedImg = async (imageSrc: string, pixelCrop: CropArea): Promise<Blob> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, 'image/jpeg');
  });
};

export default function ImageCropDialog({ open, imageSrc, imageType, onClose, onCropComplete }: ImageCropDialogProps) {
  const isSp = useMediaQuery({ query: "(max-width: 1179px)" });

  const [crop, setCrop] = useState<{x: number, y: number}>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [imageHeight, setImageHeight] = useState<number | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setImageHeight(img.height);
    };
  }, [imageSrc]);

  const handleCropComplete = (croppedArea: any, croppedAreaPixels: CropArea) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleConfirm = async () => {
    try {
      if (croppedAreaPixels) {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        onCropComplete(croppedImage, imageType);
      }
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog
      className="crop-dialog"
      fullScreen={isSp}
      open={open}
      onClose={onClose}
    >
      <DialogTitle className="title-wrapper">
        <div className="title">
          <CropFreeIcon />
          画像編集
        </div>
        <CloseIcon className="close-icon" onClick={onClose} />
      </DialogTitle>
      <DialogContent className="content">
        <div style={{ position: 'relative', height: imageHeight ? `${imageHeight}px` : '400px' }}>
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={imageType === 'thumbnailImg' ? 16 / 10 : 1}
              cropShape={imageType === 'profileImg' ? 'round' : 'rect'}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          )}
        </div>
      </DialogContent>
      <DialogActions className="crop-actions">
        <Button className="cancel-btn" onClick={onClose} variant="outlined">
          キャンセル
        </Button>
        <Button className="save-btn" onClick={handleConfirm} variant="contained" color="primary">
          確認
        </Button>
      </DialogActions>
    </Dialog>
  );
}