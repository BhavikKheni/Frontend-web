export const colorValues = {
  primary: "#6772E5",
  secondary: "#6772E5",
  black: "#000",
  white: '#FFFFFF',
  whiteSmoke:"#F5F5F5",// use in signin sub-title
  orange: "#FF7A00",// use in sign in title
  green: "#2FB41A",// use in button
  Nero:'#191919',
  transparent: "transparent",
};

const fontFamily = `'Rubik', 'Montserrat'`;

const fontSize = {
  fontSize12: "0.75rem",
  fontSize16: "1rem",
  fontSize36: "2.25rem",
};
const fonts = {
  h1: {
    fontFamily: fontFamily,
    fontSize: fontSize.fontSize12,
    fontStyle: "normal",
    fontWeight: "normal",
    lineHeight: 24,
    letterSpacing: '0.02em',
    color: colorValues.white,
  },
  h2: {
    fontFamily: fontFamily,
    fontSize: fontSize.fontSize16,
    fontStyle: "normal",
    fontWeight: "normal",
    lineHeight: '24px',
    letterSpacing: '0.02em',
    color: colorValues.whiteSmoke,
  },
  //use in signin title
  h3: {
    fontFamily: fontFamily,
    fontSize: fontSize.fontSize36,
    lineHeight: '30px',
    fontWeight: '600px',
    letterSpacing: '-0.015em',
    color: colorValues.orange
  },
  h4: {
    fontFamily: fontFamily,
    fontSize: "0.9rem",
    lineHeight: "1.33",
    fontWeight: "600",
    color: colorValues.black,
    fontStyle: "italic",
    paddingTop: "16px",
    paddingBottom: "4px",
  },
  p: {
    fontFamily: fontFamily,
    fontSize: "1rem",
    lineHeight: "1.5",
    fontWeight: "400",
    color: colorValues.black,
  },
};

const btnBase = {
  height: "30px",
  minWidth: "100px",
  maxWidth: "100%",
  border: "1px solid",
  borderRadius: "30px",
  textTransform: "none",
  padding: "0 16px",
  fontWeight: "400",
  "> span:first-child": {
    overflow: "hidden",
  },
};

export const themes = {
  default: {
    fonts: fonts,
    fontSize: fontSize,
    fontFamily: fontFamily,

    colors: {
      primary: colorValues.primary,
      secondary: colorValues.secondary,
      green: colorValues.green,
      white: colorValues.white,
      whiteSmoke: colorValues.whiteSmoke,
      orange: colorValues.orange,
      Nero: colorValues.Nero,
      background: {
        main: colorValues.white,
      },
      btn: {
        main: colorValues.primary,
      },
    },

    buttons: {
      primary: {
        ...btnBase,
        borderColor: colorValues.primary,
        backgroundColor: colorValues.primary,
        color: colorValues.white,
        fontSize: "0.9em",
        ":hover": {
          backgroundColor: colorValues.secondary,
          borderColor: colorValues.secondary,
        },
      },
    },
  },
};
