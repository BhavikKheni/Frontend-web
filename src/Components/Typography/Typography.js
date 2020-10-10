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
    h2: { ...themes.default.fonts.h2 },
    h3: {
      ...themes.default.fonts.h3,
    },
    h4: {
      ...themes.default.fonts.h4,
    },
    h5: {
      ...themes.default.fonts.h5,
    },
    h6: {
      ...themes.default.fonts.h6,
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
  );
};
export default TypographyComponent;
