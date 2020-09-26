import React from "react";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import { themes } from "../../themes";
const theme = createMuiTheme({
  typography: {
    h1: {
      ...themes.default.fonts.h1,
    },
    h2: {
      ...themes.default.fonts.h2,
    },
    h3: {
      ...themes.default.fonts.h3,
    },
  },
});
const useStyles = makeStyles({
  root: {},
});

const TypographyComponent = (props) => {
  const classes = useStyles();
  const { title, variant, onClick, style, className } = props;
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <Typography
          variant={variant}
          className={clsx(classes.primary, className)}
          onClick={onClick}
          style={{ ...style }}
        >
          {title}
        </Typography>
      </ThemeProvider>
    </React.Fragment>
  );
};
export default TypographyComponent;
