import DatePicker from "react-datepicker";
import { ja } from "date-fns/locale/ja";
import "react-datepicker/dist/react-datepicker.css";
import dayjs, { Dayjs } from 'dayjs';

import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';

interface DateInputProps {
  selectedDate: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
  minDate?: Dayjs;
  maxDate?: Dayjs;
}

export default function DateInput({ selectedDate, onChange, minDate, maxDate }: DateInputProps) {
  return (
    <div className="date-input">
      <DatePicker
        locale={ja}
        selected={selectedDate ? selectedDate.toDate() : null}
        onChange={(date) => onChange(date ? dayjs(date) : null)}
        dateFormat="yyyy-MM-dd"
        placeholderText="日付を選択"
        minDate={minDate ? minDate.toDate() : undefined}
        maxDate={maxDate ? maxDate.toDate() : undefined}
      />
      <ArrowDropDownRoundedIcon className="arrow-down" />
    </div>
  );
};