export type OrangeShowcasePosition = {
  depth: "back" | "front";
  exitX: string;
  exitY: string;
  mobileHidden?: boolean;
  rotation: number;
  scale: number;
  x: string;
  y: string;
};

// These deliberately fixed poses give the scattering a natural feel without
// changing composition between renders or causing layout shifts.
export const ORANGE_SHOWCASE_POSITIONS: OrangeShowcasePosition[] = [
  { depth: "back", exitX: "-58vw", exitY: "-42vh", rotation: -28, scale: 0.76, x: "-38vw", y: "-29vh" },
  { depth: "front", exitX: "-64vw", exitY: "-8vh", rotation: 38, scale: 0.92, x: "-42vw", y: "-7vh" },
  { depth: "back", exitX: "-50vw", exitY: "36vh", rotation: -52, scale: 0.7, x: "-31vw", y: "28vh" },
  { depth: "front", exitX: "-20vw", exitY: "48vh", rotation: 24, scale: 0.8, x: "-13vw", y: "34vh" },
  { depth: "front", exitX: "20vw", exitY: "48vh", rotation: -31, scale: 0.83, x: "18vw", y: "33vh" },
  { depth: "back", exitX: "52vw", exitY: "38vh", rotation: 45, scale: 0.72, x: "34vw", y: "28vh" },
  { depth: "front", exitX: "66vw", exitY: "4vh", rotation: -20, scale: 0.9, x: "43vw", y: "-4vh" },
  { depth: "back", exitX: "58vw", exitY: "-40vh", rotation: 34, scale: 0.74, x: "36vw", y: "-27vh" },
  { depth: "front", exitX: "21vw", exitY: "-51vh", mobileHidden: true, rotation: -42, scale: 0.66, x: "18vw", y: "-34vh" },
  { depth: "back", exitX: "-18vw", exitY: "-51vh", mobileHidden: true, rotation: 28, scale: 0.68, x: "-16vw", y: "-35vh" },
  { depth: "front", exitX: "-56vw", exitY: "22vh", mobileHidden: true, rotation: -35, scale: 0.59, x: "-46vw", y: "18vh" },
  { depth: "back", exitX: "56vw", exitY: "24vh", mobileHidden: true, rotation: 52, scale: 0.61, x: "46vw", y: "18vh" },
];
