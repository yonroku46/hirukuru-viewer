import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PlaceIcon from '@mui/icons-material/Place';

interface NoticeDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function NoticeDialog({ open, setOpen }: NoticeDialogProps) {

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      className="notice-dialog"
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "0.75rem",
        },
      }}
    >
      <DialogTitle className="title-wrapper">
        <PlaceIcon fontSize="large" className="icon" />
        {"位置情報の許可を変更してください"}
      </DialogTitle>
      <DialogContent className="content-wrapper">
        <p className="description">
          {`サービス利用には位置情報が必要です。\nブラウザ設定で位置情報をオンにしてください。`}
        </p>
        <button onClick={handleClose} className="confirm-button">
          確認
        </button>
      </DialogContent>
    </Dialog>
  );
}