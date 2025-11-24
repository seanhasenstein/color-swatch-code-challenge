"use client";

import { useEffect, useState } from "react";

import useDebounce from "@/hooks/useDebounce";
import { fetchColors } from "@/lib/colorApi";
import InputControls from "../InputControls";
import ColorSwatch from "../ColorSwatch";

import { ColorData } from "@/types";

import styles from "./ColorGrid.module.css";

export default function ColorGrid() {
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [colors, setColors] = useState<ColorData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tooltipVisibleHex, setTooltipVisibleHex] = useState<string | null>(
    null
  );
  const [tooltipTimeout, setTooltipTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const debouncedSaturation = useDebounce(saturation, 500);
  const debouncedLightness = useDebounce(lightness, 500);

  // Fetch colors when debounced values change
  useEffect(() => {
    const loadColors = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const fetchedColors = await fetchColors(
          debouncedSaturation,
          debouncedLightness
        );
        setColors(fetchedColors);
      } catch (error) {
        setError("Failed to load colors. Please try again.");
        console.error("Error loading colors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadColors();
  }, [debouncedSaturation, debouncedLightness]);

  const handleSwatchClick = (hex: string) => {
    // Clear any existing timeout
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
    }

    // Copy to clipboard
    navigator.clipboard.writeText(hex).catch((err) => {
      console.error("Failed to copy color code to clipboard:", err);
    });

    // Show tooltip for this hex
    setTooltipVisibleHex(hex);

    // Set new timeout and store its ID
    const newTimeout = setTimeout(() => {
      setTooltipVisibleHex(null);
      setTooltipTimeout(null);
    }, 1000);

    setTooltipTimeout(newTimeout);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>HSL Color Swatch Grid</h1>
          <p className={styles.subtitle}>
            Explore color names by adjusting the saturation and lightness
            values.
          </p>
          <p className={styles.subtitle}>
            Click on a color to copy its hex code to your clipboard.
          </p>
        </header>

        <InputControls
          saturation={saturation}
          lightness={lightness}
          onSaturationChange={setSaturation}
          onLightnessChange={setLightness}
          isLoading={isLoading}
        />

        {error && <div className={styles.error}>{error}</div>}

        {!isLoading && colors.length > 0 && (
          <div className={styles.count}>
            Showing {colors.length} color
            {colors.length !== 1 ? "s" : ""}
          </div>
        )}

        <div className={styles.grid}>
          {isLoading
            ? // Loading skeleton
              Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className={styles.skeleton} />
              ))
            : colors.map((color) => (
                <ColorSwatch
                  key={`${color.name}-${color.hue}`}
                  color={color}
                  onClick={handleSwatchClick}
                  tooltipVisible={tooltipVisibleHex === color.hex}
                />
              ))}
        </div>

        {!isLoading && colors.length === 0 && !error && (
          <div className={styles.emptyState}>
            No colors found for these values. Try adjusting the saturation or
            lightness.
          </div>
        )}
      </div>
    </div>
  );
}
