import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  shadows: Array(25).fill('none'),
  palette: {
    primary: {
      main: "#8b17b0",
    },
  },
  typography: {
    button: {
      textTransform: "none",
      fontWeight: 400,
    },
  },
});
