import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import { SxProps, Theme } from "@mui/material";

interface LoadingProps {
  circular?: boolean;
  sx?: SxProps<Theme>;
}

export default function Loading(
  { circular, sx }: LoadingProps
) {
  if (circular) {
    return (
      <CircularProgress color="inherit" sx={ sx ? sx : { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 1100, opacity: "0.2" }} />
    )
  }
  return (
    <Box sx={{ position: "absolute", top: 0, left: 0, zIndex: 1100, width: "100%", color: "var(--accent-color)" }}>
      <LinearProgress color="inherit" />
    </Box>
  )
}