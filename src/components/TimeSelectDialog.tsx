"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useMediaQuery } from "react-responsive";

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from "@mui/icons-material/Close";
import Selector from './input/Selector';

const minutesPerOption = 5;

interface TimeSelectDialogProps {
  value: string;
  setValue:  React.Dispatch<React.SetStateAction<string>>;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function TimeSelectDialog({ value, setValue, open, setOpen }: TimeSelectDialogProps) {
  const isSp = useMediaQuery({ query: "(max-width: 1179px)" });

  const [period, setPeriod] = useState<"AM" | "PM">("AM");
  const [hourOptions, setHourOptions] = useState<{ label: string; value: string }[]>([]);
  const [selectedHour, setSelectedHour] = useState<string>(value.split(':')[0] || "00");
  const [selectedMinute, setSelectedMinute] = useState<string>(value.split(':')[1] || "00");

  useEffect(() => {
    const allOptions = [];
    for (let hour = 0; hour <= 23; hour++) {
      const formattedHour = hour.toString().padStart(2, '0');
      const label = `${formattedHour}時`;
      allOptions.push({ label, value: formattedHour });
    }
    setHourOptions(allOptions);
  }, []);

  useEffect(() => {
    setSelectedHour(value.split(':')[0] || "00");
    setSelectedMinute(value.split(':')[1] || "00");
    setPeriod(value.split(':')[0] < "12" ? "AM" : "PM");
  }, [value]);

  const handleTimeClick = useCallback((timeValue: string) => {
    setValue(timeValue);
    setOpen(false);
  }, [setValue, setOpen]);

  const minuteOptions = useMemo(() => {
    return Array.from({ length: 60 / minutesPerOption }, (_, i) => i * minutesPerOption).map((minute) => {
      const minuteString = minute.toString().padStart(2, '0');
      return (
        <button
          key={minute}
          className={`minute-option ${selectedMinute === minuteString ? "active" : ""}`}
          onClick={() => {
            setSelectedMinute(minuteString);
            handleTimeClick(`${selectedHour}:${minuteString}`);
          }}
        >
          {`${selectedHour}:${minuteString}`}
        </button>
      );
    });
  }, [selectedHour, selectedMinute, handleTimeClick]);

  return (
    <Fragment>
      <Dialog
        className="time-select-dialog"
        fullScreen={isSp}
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle className="title-wrapper">
          <div className="title">
            <AccessTimeIcon />
            時間選択
          </div>
          <CloseIcon className="close-icon" onClick={() => setOpen(false)} />
        </DialogTitle>
        <DialogContent className="content">
          <div className="option-hour-wrapper">
            <button
              className={`period-option ${period === "AM" ? "active" : ""}`}
              onClick={() => setPeriod("AM")}
            >
              午前
            </button>
            <button
              className={`period-option ${period === "PM" ? "active" : ""}`}
              onClick={() => setPeriod("PM")}
            >
              午後
            </button>
            <Selector
              options={hourOptions}
              value={selectedHour}
              onChange={(e) => {
                setSelectedHour(e.target.value);
              }}
            />
          </div>
          <div className="option-minute-wrapper">
            {minuteOptions}
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};