import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const ProgressCircle = ({ progress = 0.75, size = 40 }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const angle = progress * 360;

  // Calculate the color dynamically based on progress (progress should be between 0 and 1)
  const getProgressColor = (progress) => {
    if (progress >= 0.75) {
      return colors.greenAccent[400]; // High progress, green
    } else if (progress >= 0.5) {
      return colors.greenAccent[700]; // Medium progress, yellow
    } else {
      return colors.redAccent[700]; // Low progress, red
    }
  };

  const progressColor = getProgressColor(progress);

  return (
    <Box
      sx={{
        background: `radial-gradient(${colors.primary[400]} 55%, transparent 56%),
            conic-gradient(${progressColor} 0deg ${angle}deg, ${colors.blueAccent[200]} ${angle}deg 360deg),
            ${colors.primary[400]}`,
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
};

export default ProgressCircle;
