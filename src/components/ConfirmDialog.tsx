import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

interface ConfirmDialogProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  optional?: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ icon, title, description, optional, open, setOpen, onConfirm, onCancel }: ConfirmDialogProps) {

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      className="confirm-dialog"
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "0.75rem",
        },
      }}
    >
      <DialogTitle className="title-wrapper">
        <span className="icon">
          {icon}
        </span>
        {title}
      </DialogTitle>
      <DialogContent className="content-wrapper">
        <p className="description">
          {description}
        </p>
        {optional && (
          <div className="optional">
            {optional}
          </div>
        )}
        <div className="action-btn-group">
          <button onClick={onCancel} className="action-btn">
            キャンセル
          </button>
          <button onClick={onConfirm} className="action-btn">
            確認
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}