// import { Box, Typography } from "@material-ui/core";
// import { Backdrop, CircularProgress } from "@material-ui/core";
import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";
import { useLoadingScreen } from "../hooks/useLoadingScreen";

export function CustomBackdrop() {
  const { isLoading } = useLoadingScreen();
  console.log(`is Loading ${isLoading}`);
  return (
    <Backdrop open={isLoading} style={{ zIndex: 10000 }}>
      <CircularProgress style={{ zIndex: 10001, color: "white" }} />
      <Box pl={3}>
        <Typography style={{ color: "white", fontWeight: "bold" }}>
          กำลังทำงาน
        </Typography>
      </Box>
    </Backdrop>
  );
}
