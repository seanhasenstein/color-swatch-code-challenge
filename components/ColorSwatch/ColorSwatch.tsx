"use client";

import { ColorData } from "@/types";

import styles from "./ColorSwatch.module.css";

type Props = {
  color: ColorData;
  onClick: (hex: string) => void;
  tooltipVisible: boolean;
};

export default function ColorSwatch({ color, onClick, tooltipVisible }: Props) {
  const { hex, name, rgb } = color;

  // Determine if text should be white or black based on background brightness
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  const textColor = brightness > 120 ? styles.textDark : styles.textLight;

  return (
    <button
      className={styles.swatch}
      style={{ backgroundColor: hex }}
      onClick={() => onClick(hex)}
    >
      {/* The color box */}
      <div className={styles.colorDisplay} />

      {/* The color name, rgb values, and the hex code */}
      <div className={`${styles.info} ${textColor}`}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.rgb}>
          RGB({rgb.r}, {rgb.g}, {rgb.b})
        </p>
        <p className={styles.hex}>{hex}</p>
      </div>
      {/* A tooltip that shows when the color swatch is clicked */}
      {tooltipVisible && (
        <div className={styles.tooltip}>Hex copied to clipboard!</div>
      )}
    </button>
  );
}
