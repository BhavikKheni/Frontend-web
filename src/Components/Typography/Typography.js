import React from "react";
import Typography from "@material-ui/core/Typography";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
const theme = createMuiTheme({
  typography: {
    h1: {
      fontSize: 36,
      fontWeight: 500,
      letterSpacing: "0.02em",
    },
    fontFamily: ["Rubik"].join(","),
    fontStyle: "normal",
  },
});
const useStyles = makeStyles({
  root: {},
  primary: {
    color: "#ff7a00",
  },
});
const TypographyComponent = (props) => {
  const classes = useStyles();
  const { title, variant } = props;
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <Typography variant={variant} className={classes.primary}>
          {title}
        </Typography>
      </ThemeProvider>
    </React.Fragment>
  );
};

export default TypographyComponent;
