import React from "react";
import IconButton from "@mui/material/IconButton";

interface MiniButtonProps {
  className?: string;
  icon: React.ReactNode;
  label?: string;
  onClick: (() => void) | ((e: React.MouseEvent<HTMLButtonElement>) => void);
  gray?: boolean;
  sx?: React.CSSProperties;
}

export default function MiniButton({ className, icon, label, onClick, gray, sx }: MiniButtonProps) {
  return (
    <IconButton
      className={className}
      onClick={onClick}
      sx={{
        borderRadius: "0.75rem",
        border: "1px solid var(--gray-alpha-300)",
        backgroundColor: gray ? "var(--gray-alpha-300)" : "var(--background)",
        color: gray ? "var(--background)" : "var(--icon-color)",
        gap: "0.25rem",
        "@media (hover: hover) and (pointer: fine)": {
          "&:hover": {
            backgroundColor: gray ? "var(--gray-alpha-200)" : "var(--icon-hover-color)",
          },
        },
        "@media (hover: none) and (pointer: coarse)": {
          "&:hover": {
            backgroundColor: gray ? "var(--gray-alpha-200)" : "var(--background)",
          },
          "&:active": {
            backgroundColor: gray ? "var(--gray-alpha-200)" : "var(--icon-hover-color)",
          },
        },
        ...sx,
      }}
    >
      {icon}
      {label && (
        <label style={{
          fontSize: "0.875rem",
          marginRight: "0.25rem",
          cursor: "pointer",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis"
        }}>
          {label}
        </label>
      )}
    </IconButton>
  );
};