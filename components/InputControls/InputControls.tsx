import styles from "./InputControls.module.css";

type Props = {
  saturation: number;
  lightness: number;
  onSaturationChange: (value: number) => void;
  onLightnessChange: (value: number) => void;
  isLoading: boolean;
};

export default function InputControls({
  isLoading,
  lightness,
  onLightnessChange,
  onSaturationChange,
  saturation,
}: Props) {
  const handleSaturationChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      onSaturationChange(num);
    }
  };

  const handleLightnessChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      onLightnessChange(num);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Color Controls</h2>

      <div className={styles.grid}>
        {/* Saturation */}
        <div className={styles.controlGroup}>
          <label htmlFor="saturation" className={styles.label}>
            Saturation: {saturation}%
          </label>
          <div className={styles.inputContainer}>
            <input
              type="range"
              id="saturation"
              min="0"
              max="100"
              value={saturation}
              onChange={(e) => handleSaturationChange(e.target.value)}
              disabled={isLoading}
              className={styles.slider}
            />
            <input
              type="number"
              min="0"
              max="100"
              value={saturation}
              onChange={(e) => handleSaturationChange(e.target.value)}
              disabled={isLoading}
              className={styles.numberInput}
            />
          </div>
        </div>

        {/* Lightness */}
        <div className={styles.controlGroup}>
          <label htmlFor="lightness" className={styles.label}>
            Lightness: {lightness}%
          </label>
          <div className={styles.inputContainer}>
            <input
              type="range"
              id="lightness"
              min="0"
              max="100"
              value={lightness}
              onChange={(e) => handleLightnessChange(e.target.value)}
              disabled={isLoading}
              className={styles.slider}
            />
            <input
              type="number"
              min="0"
              max="100"
              value={lightness}
              onChange={(e) => handleLightnessChange(e.target.value)}
              disabled={isLoading}
              className={styles.numberInput}
            />
          </div>
        </div>
      </div>

      {isLoading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <span className={styles.loadingText}>Loading colors...</span>
        </div>
      )}
    </div>
  );
}
