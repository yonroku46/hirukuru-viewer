import React from "react";
import IconButton from "@mui/material/IconButton";

interface MiniButtonProps {
  icon: React.ReactNode;
  onClick: (() => void) | ((e: React.MouseEvent<HTMLButtonElement>) => void);
  sx?: React.CSSProperties;
}

export default function MiniButton({ icon, onClick, sx }: MiniButtonProps) {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        borderRadius: "1rem",
        border: "1px solid var(--gray-alpha-300)",
        backgroundColor: "var(--background)",
        color: "var(--icon-color)",
        ...sx,
      }}
    >
      {icon}
    </IconButton>
  );
};