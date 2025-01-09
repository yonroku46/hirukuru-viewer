import IconButton from '@mui/material/IconButton';
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

interface QuantityButtonProps {
  quantity: number;
  handleMinus: () => void;
  handlePlus: () => void;
}

export default function QuantityButton({  quantity, handleMinus, handlePlus }: QuantityButtonProps) {
  return (
    <div className="item-quantity-btn">
      <IconButton onClick={handleMinus}>
        <RemoveIcon />
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