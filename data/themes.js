import { custom } from "../utilities/colors.js";
export const THEMES = {
  default: {
    name: "default",
    fontColor: 214,
    backgroundColor: "",
    leadingSymbol: "",
    traillingSymbol: "",
  },
  hacker: {
    name: "hacker",
    fontColor: 46,
    backgroundColor: 232,
    leadingSymbol: custom("", 232),
    traillingSymbol: custom("", 232),
  },
  sunset: {
    name: "sunset",
    fontColor: 214,
    backgroundColor: 52,
    leadingSymbol: custom("", 52),
    traillingSymbol: custom("", 52),
  },
  ocean: {
    name: "default",
    fontColor: 123,
    backgroundColor: 24,
    leadingSymbol: custom("", 24),
    traillingSymbol: custom("", 24),
  },
  forest: {
    name: "forest",
    fontColor: 70,
    backgroundColor: "",
    leadingSymbol: "",
    traillingSymbol: "",
  },
  neon: {
    name: "neon",
    fontColor: 207,
    backgroundColor: 17,
    leadingSymbol: custom("", 17),
    traillingSymbol: custom("", 17),
  },
  arctic: {
    name: "arctic",
    fontColor: 159,
    backgroundColor: 236,
    leadingSymbol: custom("", 236),
    traillingSymbol: custom("", 236),
  },
  minimum: {
    name: "minimum",
    fontColor: 250,
    backgroundColor: "",
    leadingSymbol: "",
    traillingSymbol: "ß",
  },
};
export const currentTheme = [THEMES.default];
