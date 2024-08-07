/* eslint-disable prefer-const */
export function lighten(hexColor: string | undefined, percent: number): string {
    if (!hexColor) return "";
    let r = parseInt(hexColor.slice(1, 3), 16);
    let g = parseInt(hexColor.slice(3, 5), 16);
    let b = parseInt(hexColor.slice(5, 7), 16);

    r = Math.min(Math.floor(r + ((255 - r) * percent) / 100), 255);
    g = Math.min(Math.floor(g + ((255 - g) * percent) / 100), 255);
    b = Math.min(Math.floor(b + ((255 - b) * percent) / 100), 255);

    const newHexColor =
        "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

    return newHexColor;
}

export function generateSecondaryColor(primaryHex: string | undefined): string {
    if (!primaryHex) return "#000000";

    const primaryRgb = hexToRgb(primaryHex);

    const primaryHsl = rgbToHsl(primaryRgb);

    const hDiff = 0.54; // Hue difference
    const sDiff = -0.58; // Saturation difference
    const lDiff = 0.78; // Lightness difference

    const secondaryHsl: [number, number, number] = [
        primaryHsl[0] + hDiff,
        primaryHsl[1] + sDiff,
        primaryHsl[2] + lDiff,
    ];

    const secondaryRgb = hslToRgb(secondaryHsl);

    const secondaryHex = rgbToHex(secondaryRgb);

    return secondaryHex;
}

function hexToRgb(hex: string): [number, number, number] {
    return [
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16),
    ];
}

function rgbToHsl(rgb: [number, number, number]): [number, number, number] {
    // Convert RGB to HSL
    let r = rgb[0] / 255;
    let g = rgb[1] / 255;
    let b = rgb[2] / 255;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h,
        s,
        l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h! /= 6;
    }

    return [h!, s, l];
}

function hslToRgb(hsl: [number, number, number]): [number, number, number] {
    let r, g, b;
    let h = hsl[0];
    let s = hsl[1];
    let l = hsl[2];

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        let hue2rgb = function hue2rgb(p: number, q: number, t: number) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHex(rgb: [number, number, number]): string {
    return (
        "#" +
        ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2])
            .toString(16)
            .slice(1)
    );
}
