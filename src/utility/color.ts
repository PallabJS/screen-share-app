import Color from "color";

const getContrastMonoColor = (bgColor: string, alpha: number = 1): string => {
  const color = Color(bgColor);
  return color.isLight()
    ? `rgba(0, 0, 0, ${alpha})`
    : `rgba(255, 255, 255, ${alpha})`;
};

export const colorUtils = { getContrastMonoColor };
