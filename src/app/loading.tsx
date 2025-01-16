import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";

interface LoadingProps {
  circular?: boolean;
}

export default function Loading(
  { circular }: LoadingProps
) {
  if (circular) {
    return (
      <CircularProgress color="inherit" sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 1100, opacity: "0.2" }} />
    )
  }
  return (
    <div style={{ position: "absolute", top: 0, left: 0, zIndex: 1100, width: "100%", color: "var(--accent-color)" }}>
      <LinearProgress color="inherit" />
    </div>
  )
}