"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import Selector from '@/components/input/Selector';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from "@mui/icons-material/Close";

const MINUTES_PER_OPTION = 5;

interface TimeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
}

export default function TimeInput({ value, setValue, placeholder, ...props }: TimeInputProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentInput, setCurrentInput] = useState<React.Dispatch<React.SetStateAction<string>> | null>(null);

  const handleInputClick = useCallback((setValue: React.Dispatch<React.SetStateAction<string>>) => {
    setCurrentInput(() => setValue);
    setDialogOpen(true);
  }, []);

  return (
    <div className="time-input">
      <div className="input-wrapper" onClick={() => handleInputClick(setValue)}>
        <input
          type="text"
          placeholder={placeholder || "時間選択"}
          value={value}
          readOnly
          {...props}
        />
        <AccessTimeIcon className="time-icon"/>
      </div>
      {dialogOpen && currentInput && (
        <TimeSelectDialog
          value={value}
          setValue={currentInput}
          open={dialogOpen}
          setOpen={setDialogOpen}
        />
      )}
    </div>
  );
}

interface TimeSelectDialogProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  open: boolean;
  setOpen: (open: boolean) => void;
}

function TimeSelectDialog({ value, setValue, open, setOpen }: TimeSelectDialogProps) {
  const isSp = useMediaQuery({ query: "(max-width: 1179px)" });

  const [hourOptions, setHourOptions] = useState<{ label: string; value: string }[]>([]);
  const [period, setPeriod] = useState<"AM" | "PM">(value.split(':')[0] < "12" ? "AM" : "PM");
  const [selectedHour, setSelectedHour] = useState<string>(value.split(':')[0] || "00");
  const [selectedMinute, setSelectedMinute] = useState<string>(value.split(':')[1] || "00");

  useEffect(() => {
    setPeriod(value.split(':')[0] < "12" ? "AM" : "PM");
    setSelectedHour(value.split(':')[0] || "00");
    setSelectedMinute(value.split(':')[1] || "00");
  }, [value]);

  useEffect(() => {
    const allOptions = [];
    const startHour = period === "AM" ? 0 : 12;
    const endHour = period === "AM" ? 11 : 23;
    for (let hour = startHour; hour <= endHour; hour++) {
      const formattedHour = hour.toString().padStart(2, '0');
      const label = `${formattedHour}時`;
      allOptions.push({ label, value: formattedHour });
    }
    setHourOptions(allOptions);
  }, [period]);

  const handleTimeClick = useCallback((timeValue: string) => {
    setValue(timeValue);
    setOpen(false);
  }, [setValue, setOpen]);

  const minuteOptions = React.useMemo(() => {
    return Array.from({ length: 60 / MINUTES_PER_OPTION }, (_, i) => i * MINUTES_PER_OPTION).map((minute) => {
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
  );
}