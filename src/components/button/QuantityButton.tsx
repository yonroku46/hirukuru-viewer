import IconButton from '@mui/material/IconButton';
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

interface QuantityButtonProps {
  disabled?: boolean;
  notDelete?: boolean;
  quantity: number;
  handleMinus: () => void;
  handlePlus: () => void;
}

export default function QuantityButton({ disabled = false, notDelete = false, quantity, handleMinus, handlePlus }: QuantityButtonProps) {
  return (
    <div className={`item-quantity-btn ${disabled ? 'disabled' : ''}`}>
      <IconButton onClick={handleMinus}>
        {notDelete || quantity > 1 ?
          <RemoveIcon />
          :
          <DeleteOutlineOutlinedIcon />
        }
      </IconButton>
      <p className="quantity">
        {quantity}
      </p>
      <IconButton onClick={handlePlus}>
        <AddIcon />
      </IconButton>
    </div>
  );
};