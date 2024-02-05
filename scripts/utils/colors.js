class HSLA {
  /**
   * @param {number} h hue [0, 360]
   * @param {number} s saturation [0, 100]
   * @param {number} l luminosity [0, 100]
   * @param {[number]} a alpha [0.0, 1.0]
   */
  constructor(h, s, l, a) {
    this.h = h;
    this.s = s;
    this.l = l;
    this.a = a ?? 1;
  }

  toString() {
    return `hsla(${this.h}, ${this.s}%, ${this.l}%, ${this.a})`;
  }
}

class RGBA {
  /**
   * @param {number} r [0, 255]
   * @param {number} g [0, 255]
   * @param {number} b [0, 255]
   * @param {[number]} a alpha [0.0, 1.0]
   */
  constructor(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a ?? 1;
  }

  toString() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }
}

/**
 * Creates a random color based on the UI theme and a given string (such as a
 * server name).
 *
 * @param {NS} ns
 * @param {string} str
 * @returns {string} color that can be used in CSS
 */
export function createColorForString(ns, str) {
  const primaryHsla = hexToHsla(ns.ui.getTheme().primary);
  const seed =
    str
      .split('')
      .map(character => character.charCodeAt(0))
      .reduce((a, b) => a + b) *
    (str.match(/\d/g) ?? [str.length])
      .map(number => parseInt(number))
      .reduce((a, b) => a + b);

  // Generate hue.
  const hue = seed % 360;

  // Generate saturation.
  const minSaturation = Math.max(0, primaryHsla.s - 50);
  const maxSaturation = Math.min(100, primaryHsla.s + 50);
  const saturation =
    ((seed % 100) / 100) * (maxSaturation - minSaturation) + minSaturation;

  // Generate luminosity.
  const minLuminosity = Math.max(0, primaryHsla.l - 10);
  const maxLuminosity = Math.min(100, primaryHsla.l + 10);
  const luminosity =
    ((seed % 100) / 100) * (maxLuminosity - minLuminosity) + minLuminosity;

  return new HSLA(hue, saturation, luminosity);
}

/**
 * @param {string} hex (e.g. #000000 or with alpha #FFFFFF33)
 * @returns {RGBA}
 */
function hexToRgba(hex) {
  hex = hex.replace('#', '');

  // Expand any shorted hex values (e.g. 000 or with alpha FFF3).
  if (hex.length <= 4) {
    hex = hex
      .split('')
      .map(part => part + part)
      .join('');
  }

  // Add alpha if it doesn't exist.
  if (hex.length === 6) hex += 'FF';

  return new RGBA(
    parseInt(hex.substring(0, 2), 16),
    parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16),
    Math.round((parseInt(hex.substring(6, 8), 16) / 255) * 100) / 100
  );
}

/**
 * @param {string} hex (e.g. #000000 or with alpha #FFFFFF33)
 * @returns {HSLA}
 */
function hexToHsla(hex) {
  return rgbaToHsla(hexToRgba(hex));
}

/**
 * @param {RGBA} rgba
 * @returns {HSLA}
 */
function rgbaToHsla(rgba) {
  // Make r, g, and b fractions of 1.
  const [r, g, b] = [rgba.r, rgba.g, rgba.b].map(part => part / 255);

  // Find greatest and smallest channel values.
  const [cmin, cmax] = [Math.min, Math.max].map(fn => fn(r, g, b));
  const delta = cmax - cmin;

  // Calculate hue.
  let h;
  if (delta === 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;

  // Calculate lightness.
  let l = (cmax + cmin) / 2;

  // Calculate saturation.
  let s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100.
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return new HSLA(h, s, l, rgba.a);
}

/**
 * @param {string} hexString (e.g. #FFFFFF)
 * @returns {string} translucent hex string (e.g. #FFFFFF33)
 */
export function getDimmedColor(hexString) {
  return hexString + '33';
}
