// Íconos SVG mínimos, inline (sin librería de íconos). currentColor: heredan el
// color del tema del strip automáticamente.
const PATHS: Record<string, string> = {
  mail: '<path d="M3 6h18v12H3z"/><path d="M3 7l9 6 9-6"/>',
  phone:
    '<path d="M6 2h4l2 5-2.5 1.5a11 11 0 0 0 5 5L16 11l5 2v4a2 2 0 0 1-2 2C10.5 19 5 13.5 5 4a2 2 0 0 1 1-2Z"/>',
  pin: '<circle cx="12" cy="10" r="3"/><path d="M12 21s7-6.5 7-11a7 7 0 0 0-14 0c0 4.5 7 11 7 11Z"/>',
  menu: '<path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/>',
  close: '<path d="M6 6l12 12"/><path d="M18 6L6 18"/>',
};

export function icon(name: keyof typeof PATHS): string {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${PATHS[name]}</svg>`;
}
