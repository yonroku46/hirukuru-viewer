import React from "react";
import IconButton from "@mui/material/IconButton";

interface MiniButtonProps {
  className?: string;
  icon: React.ReactNode;
  onClick: (() => void) | ((e: React.MouseEvent<HTMLButtonElement>) => void);
  gray?: boolean;
  sx?: React.CSSProperties;
}

export default function MiniButton({ className, icon, onClick, gray, sx }: MiniButtonProps) {
  return (
    <IconButton
      className={className}
      onClick={onClick}
      sx={{
        borderRadius: "0.75rem",
        border: "1px solid var(--gray-alpha-300)",
        backgroundColor: gray ? "var(--gray-alpha-300)" : "var(--background)",
        color: gray ? "var(--background)" : "var(--icon-color)",
        ...sx,
      }}
    >
      {icon}
    </IconButton>
  );
};