import Link from 'next/link';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

interface NoticeDialogProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
  hrefText?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function NoticeDialog({ icon, title, description, href, hrefText, open, setOpen }: NoticeDialogProps) {

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
        <span className="icon">
          {icon}
        </span>
        {title}
      </DialogTitle>
      <DialogContent className="content-wrapper">
        <p className="description">
          {description}
        </p>
        {href && hrefText && (
          <Link href={href} className="action-btn">
            {hrefText}
          </Link>
        )}
        <button onClick={handleClose} className="action-btn">
          確認
        </button>
      </DialogContent>
    </Dialog>
  );
}