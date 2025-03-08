import { useState, useRef, useCallback, useEffect } from 'react';
import { useMediaQuery } from "react-responsive";
import { config } from "@/config";
import { Circle, GoogleMap, Marker } from '@react-google-maps/api';
import { enqueueSnackbar } from 'notistack';
import Image from "@/components/Image";
import MiniButton from '@/components/button/MiniButton';
import ConfirmDialog from '@/components/ConfirmDialog';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CloseIcon from "@mui/icons-material/Close";
import PinDropIcon from '@mui/icons-material/PinDrop';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

interface LocationDialogProps {
  spot: UserSpot | null;
  open: boolean;
  onClose: () => void;
}

export default function LocationDialog({ spot, open, onClose }: LocationDialogProps) {
  const isSp = useMediaQuery({ query: "(max-width: 1179px)" });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [spotName, setSpotName] = useState<string>(spot?.spotName || '');
  const [latitude, setLatitude] = useState<number>(spot?.latitude || config.googleMaps.defaultPosition.lat);
  const [longitude, setLongitude] = useState<number>(spot?.longitude || config.googleMaps.defaultPosition.lng);
  const [accuracy, setAccuracy] = useState<number>(spot?.accuracy || 0);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    setSpotName(spot?.spotName || '');
    setLatitude(spot?.latitude || config.googleMaps.defaultPosition.lat);
    setLongitude(spot?.longitude || config.googleMaps.defaultPosition.lng);
    setAccuracy(spot?.accuracy || 0);
  }, [spot]);

  const handleSave = async () => {
    if (!spotName) {
      enqueueSnackbar('スポット名を入力してください', { variant: 'error' });
      return;
    }

    const spotData = {
      spot_id: generateSpotId(),
      spot_name: spotName,
      latitude: latitude,
      longitude: longitude,
      accuracy: accuracy,
      create_time: new Date().toISOString(),
    };

    try {
      await saveSpot(spotData);
      enqueueSnackbar('保存されました', { variant: 'success' });
      onClose();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('保存に失敗しました', { variant: 'error' });
    }
  };

  const handleDelete = async () => {
    // await deleteSpot(spotId);
    setConfirmDialogOpen(false);
    onClose();
    enqueueSnackbar('削除されました', { variant: 'success' });
  };

  const handleZoomChanged = useCallback(() => {
    if (mapRef.current) {
      const zoomLevel: number = mapRef.current.getZoom() || 0;
      let newAccuracy = 0;

      if (zoomLevel <= 5) {
        newAccuracy = 10000;
      } else if (zoomLevel <= 8) {
        newAccuracy = 5000;
      } else if (zoomLevel <= 10) {
        newAccuracy = 2000;
      } else if (zoomLevel <= 12) {
        newAccuracy = 1000;
      } else if (zoomLevel <= 14) {
        newAccuracy = 500;
      } else if (zoomLevel <= 16) {
        newAccuracy = 300;
      } else if (zoomLevel <= 18) {
        newAccuracy = 100;
      } else {
        newAccuracy = 50;
      }

      setAccuracy(newAccuracy);
      handleMapDragEnd();
    }
  }, []);

  const generateSpotId = () => {
    return 'generated-uuid';
  };

  const saveSpot = async (spotData: any) => {
    console.log(spotData);
  };

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    map.setCenter({ lat: latitude, lng: longitude });
    handleZoomChanged();
    map.addListener('zoom_changed', handleZoomChanged);
  };

  const handleMapDragEnd = () => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      if (center) {
        setLatitude(center.lat());
        setLongitude(center.lng());
      }
    }
  };

  return (
    <>
      <ConfirmDialog
        icon={<DeleteOutlineOutlinedIcon />}
        title="スポットを削除しますか？"
        description="スポットを削除すると元に戻すことはできません。"
        open={confirmDialogOpen}
        setOpen={setConfirmDialogOpen}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDialogOpen(false)}
      />
      <Dialog
        className="location-dialog"
        fullScreen={isSp}
        open={open}
        onClose={onClose}
      >
        <DialogTitle className="title-wrapper">
          <div className="title">
            <PinDropIcon />
            スポット管理
          </div>
          <CloseIcon className="close-icon" onClick={onClose} />
        </DialogTitle>
        <DialogContent className="content">
          <div className="map-wrapper">
            <MiniButton
              className="delete-icon"
              icon={<DeleteOutlineOutlinedIcon />}
              onClick={() => setConfirmDialogOpen(true)}
            />
            <Image
              className="center-icon"
              src="/assets/icon/spot-marker.svg"
              alt="center-icon"
              width={32}
              height={32}
            />
            <GoogleMap
              onLoad={handleMapLoad}
              onDragEnd={handleMapDragEnd}
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={{ lat: latitude, lng: longitude }}
              zoom={15}
              options={config.googleMaps.options}
            >
              <Marker
                position={{ lat: latitude, lng: longitude }}
                icon={{
                  path: 0,
                  scale: 0,
                  strokeColor: 'transparent',
                }}
              />
              <Circle
                center={{ lat: latitude, lng: longitude }}
                radius={accuracy}
                options={{
                  fillColor: "blue",
                  fillOpacity: 0.1,
                  strokeColor: "blue",
                  strokeOpacity: 0.3,
                  strokeWeight: 1,
                }}
              />
            </GoogleMap>
          </div>
          <div className="location-form">
            <div className="location-form-item">
              <label>スポット名</label>
              <input
                type="text"
                value={spotName}
                onChange={(e) => setSpotName(e.target.value)}
                placeholder="スポット名を入力"
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions className="location-actions">
          <Button className="cancel-btn" onClick={onClose} variant="outlined">
            キャンセル
          </Button>
          <Button className="save-btn" onClick={handleSave} variant="contained" color="primary">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
