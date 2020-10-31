export const colorValues = {
  primary: "#6772E5",
  secondary: "#6772E5",
  black: "#000",
  white: "#FFFFFF",
  whiteSmoke: "#F5F5F5", // use in signin sub-title
  orange: "#FF7A00", // use in sign in title
  green: "#2FB41A", // use in button
  nero: "#191919", // use in input focus label color
  darkGray: "#303030",
  matterhorn: "#4F4F4F",
  gray: "#949494",
  gray20: "#333333",
  silver: "#BDBDBD",
  purple: "#AD00FF",
  transparent: "transparent",
};

const fontFamily = `'Rubik', 'Montserrat'`;

const fontSize = {
  fontSize12: "0.75rem",
  fontSize14: "0.875rem",
  fontSize16: "1rem",
  fontSize20: "1.25rem",
  fontSize18: "1.125rem",
  fontSize24: "1.5rem",
  fontSize36: "2.25rem",
};
const fonts = {
  h1: {
    fontFamily: fontFamily,
    fontSize: fontSize.fontSize12,
    fontStyle: "normal",
    fontWeight: "normal",
    lineHeight: "24px",
    letterSpacing: "0.02em",
    color: colorValues.white,
  },
  h2: {
    fontFamily: fontFamily,
    fontSize: fontSize.fontSize16,
    fontStyle: "normal",
    fontWeight: "normal",
    lineHeight: "24px",
    letterSpacing: "0.02em",
    color: colorValues.whiteSmoke,
  },
  //use in signin title
  h3: {
    fontFamily: fontFamily,
    fontSize: fontSize.fontSize36,
    fontStyle: "normal",
    lineHeight: "30px",
    fontWeight: "600",
    letterSpacing: "-0.015em",
    color: colorValues.orange,
  },
  //use in my profile title
  h4: {
    fontFamily: fontFamily,
    fontSize: fontSize.fontSize14,
    lineHeight: "24px",
    fontWeight: "500",
    letterSpacing: "0.02em",
    color: colorValues.darkGray,
  },
  //use in my profile change profile picture
  h5: {
    fontFamily: fontFamily,
    fontSize: fontSize.fontSize24,
    lineHeight: "48px",
    fontWeight: "500",
    letterSpacing: "0.02em",
    color: colorValues.matterhorn,
  },
  h6: {
    fontFamily: fontFamily,
    fontSize: fontSize.fontSize18,
    lineHeight: "30px",
    fontStyle: "normal",
    fontWeight: "normal",
    letterSpacing: "0.02em",
    color: colorValues.matterhorn,
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
      nero: colorValues.nero,
      darkGray: colorValues.darkGray,
      silver: colorValues.silver,
      matterhorn: colorValues.matterhorn,
      gray: colorValues.gray,
      gray20: colorValues.gray20,
      purple: colorValues.purple,
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
