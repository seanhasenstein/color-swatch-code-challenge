export type RGB = {
  r: number;
  g: number;
  b: number;
};

export type HSL = {
  h: number;
  s: number;
  l: number;
};

export type ColorData = {
  name: string;
  hue: number;
  rgb: RGB;
  hsl: HSL;
  hex: string;
};

export type ColorAPIResponse = {
  hex: { value: string; clean: string };
  rgb: { r: number; g: number; b: number; value: string };
  hsl: { h: number; s: number; l: number; value: string };
  name: {
    value: string;
    closest_named_hex: string;
    exact_match_name: boolean;
    distance: number;
  };
};
