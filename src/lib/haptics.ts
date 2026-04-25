export const haptics = {
  light: () => navigator.vibrate?.(10),
  medium: () => navigator.vibrate?.(20),
  heavy: () => navigator.vibrate?.([30, 10, 30]),
  success: () => navigator.vibrate?.([15, 10, 15]),
  error: () => navigator.vibrate?.([50, 50, 50]),
  selection: () => navigator.vibrate?.(5),
};
