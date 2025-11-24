import { ColorAPIResponse, ColorData } from "@/types";

export async function fetchColors(
  saturation: number,
  lightness: number
): Promise<ColorData[]> {
  // Query all 360 hues for complete color coverage
  // Testing showed sampling (e.g., every 10°) missed 42% of distinct colors
  const sampleRate = 1;
  const hues = Array.from(
    { length: 360 / sampleRate },
    (_, i) => i * sampleRate
  );

  try {
    // Parallel requests complete in ~2-3 seconds despite 360 calls
    const responses = await Promise.all(
      hues.map((h) =>
        fetch(
          `https://www.thecolorapi.com/id?hsl=(${h},${saturation}%,${lightness}%)`
        )
      )
    );

    const failedResponses = responses.filter((r) => !r.ok);
    if (failedResponses.length > 0) {
      throw new Error(`Failed to fetch ${failedResponses.length} colors`);
    }

    const data: ColorAPIResponse[] = await Promise.all(
      responses.map((r) => r.json())
    );

    // Deduplicate by color name - typically reduces 360 results to 15-50 colors
    const colorMap = new Map<string, ColorData>();

    data.forEach((response) => {
      const name = response.name.value;
      if (!colorMap.has(name)) {
        colorMap.set(name, {
          name,
          hue: response.hsl.h,
          rgb: { r: response.rgb.r, g: response.rgb.g, b: response.rgb.b },
          hex: response.hex.value,
          hsl: { h: response.hsl.h, s: response.hsl.s, l: response.hsl.l },
        });
      }
    });

    return Array.from(colorMap.values()).sort((a, b) => a.hue - b.hue);
  } catch (error) {
    console.error("Error fetching colors:", error);
    throw error;
  }
}

// Sample api response: https://www.thecolorapi.com/id?hsl=(215,100%,34%)
// {
//     "hex": {
//         "value": "#0048AD",
//         "clean": "0048AD"
//     },
//     "rgb": {
//         "fraction": {
//             "r": 0,
//             "g": 0.2823529411764706,
//             "b": 0.6784313725490196
//         },
//         "r": 0,
//         "g": 72,
//         "b": 173,
//         "value": "rgb(0, 72, 173)"
//     },
//     "hsl": {
//         "fraction": {
//             "h": 0.5973025048169557,
//             "s": 1,
//             "l": 0.3392156862745098
//         },
//         "h": 215,
//         "s": 100,
//         "l": 34,
//         "value": "hsl(215, 100%, 34%)"
//     },
//     "hsv": {
//         "fraction": {
//             "h": 0.5973025048169557,
//             "s": 1,
//             "v": 0.6784313725490196
//         },
//         "value": "hsv(215, 100%, 68%)",
//         "h": 215,
//         "s": 100,
//         "v": 68
//     },
//     "name": {
//         "value": "Cobalt",
//         "closest_named_hex": "#0047AB",
//         "exact_match_name": false,
//         "distance": 7
//     },
//     "cmyk": {
//         "fraction": {
//             "c": 1,
//             "m": 0.5838150289017341,
//             "y": 0,
//             "k": 0.32156862745098036
//         },
//         "value": "cmyk(100, 58, 0, 32)",
//         "c": 100,
//         "m": 58,
//         "y": 0,
//         "k": 32
//     },
//     "XYZ": {
//         "fraction": {
//             "X": 0.2234262745098039,
//             "Y": 0.25092156862745096,
//             "Z": 0.6785054901960784
//         },
//         "value": "XYZ(22, 25, 68)",
//         "X": 22,
//         "Y": 25,
//         "Z": 68
//     },
//     "image": {
//         "bare": "https://www.thecolorapi.com/id?format=svg&named=false&hex=0048AD",
//         "named": "https://www.thecolorapi.com/id?format=svg&hex=0048AD"
//     },
//     "contrast": {
//         "value": "#ffffff"
//     },
//     "_links": {
//         "self": {
//             "href": "/id?hex=0048AD"
//         }
//     },
//     "_embedded": {}
// }
