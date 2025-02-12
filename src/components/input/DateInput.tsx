"use client";

import { useRef } from "react";
import DatePicker from "react-datepicker";
import { ja } from "date-fns/locale/ja";
import "react-datepicker/dist/react-datepicker.css";
import dayjs, { Dayjs } from 'dayjs';

import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';

interface DateInputProps {
  selectedDate: Dayjs | null;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  onChange: (date: Dayjs | null) => void;
  filterDate?: (date: Dayjs) => boolean;
}

export default function DateInput({ selectedDate, minDate, maxDate, onChange, filterDate }: DateInputProps) {
  const datePickerRef = useRef<DatePicker>(null);

  const handleIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  return (
    <div className="date-input">
      <DatePicker
        ref={datePickerRef}
        locale={ja}
        selected={selectedDate ? selectedDate.toDate() : null}
        onChange={(date) => onChange(date ? dayjs(date) : null)}
        dateFormat="yyyy-MM-dd"
        placeholderText="日付を選択"
        minDate={minDate ? minDate.toDate() : undefined}
        maxDate={maxDate ? maxDate.toDate() : undefined}
        filterDate={(date) => {
          if (filterDate) {
            return filterDate(dayjs(date));
          }
          return true;
        }}
      />
      <ArrowDropDownRoundedIcon className="arrow-down" onClick={handleIconClick} />
    </div>
  );
};