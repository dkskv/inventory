interface Rgb {
  red: number;
  green: number;
  blue: number;
}

const hexToRgb = (hex: string): Rgb => {
  if (hex.length !== 7) {
    throw new Error(`unsupported hex color ${hex}`);
  }

  return {
    red: Number(`0x${hex[1]}${hex[2]}`),
    green: Number(`0x${hex[3]}${hex[4]}`),
    blue: Number(`0x${hex[5]}${hex[6]}`),
  };
};

export function isColorDark(hex: string) {
  const { red, green, blue } = hexToRgb(hex);
  // Luma Coefficient
  const lightness =
    ((red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255) * 100;

  return lightness <= 64;
}
