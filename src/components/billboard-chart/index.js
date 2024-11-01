// 1) import billboard.js
// as named import with desired shapes and interaction modules
// https://github.com/naver/billboard.js/wiki/CHANGELOG-v2#modularization-by-its-functionality
import {
  bb,
  area,
  areaLineRange,
  areaSpline,
  areaSplineRange,
  areaStep,
  bar,
  bubble,
  donut,
  gauge,
  line,
  pie,
  radar,
  scatter,
  spline,
  step,
  // interaction modules
  selection,
  subchart,
  zoom,
} from "billboard.js";

// or as importing default
//import bb, { area, bar, zoom } from "billboard.js";

// 2) import css if your dev-env supports. If don't, include them via <link>
import "billboard.js/dist/billboard.css";

// or theme style. Find more themes from 'theme' folder
//import "billboard.js/dist/theme/insight.css";
