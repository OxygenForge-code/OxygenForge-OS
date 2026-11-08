#!/usr/bin/env node
/*
 * Generate OxygenForgeOS logo PNGs without external dependencies.
 * The mark is a forged ring around a four-point spark, rendered with
 * supersampling so it stays crisp at installer and Plymouth sizes.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const ROOT = path.resolve(__dirname, "..");
const SS = 3;

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function smoothBand(distance, outer, inner, aa) {
  return clamp((outer - distance) / aa + 0.5) * clamp((distance - inner) / aa + 0.5);
}

function mix(a, b, t) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

function blend(dst, color, alpha) {
  if (alpha <= 0) return;
  const outA = alpha + dst[3] * (1 - alpha);
  if (outA <= 0) return;
  dst[0] = (color[0] * alpha + dst[0] * dst[3] * (1 - alpha)) / outA;
  dst[1] = (color[1] * alpha + dst[1] * dst[3] * (1 - alpha)) / outA;
  dst[2] = (color[2] * alpha + dst[2] * dst[3] * (1 - alpha)) / outA;
  dst[3] = outA;
}

function roundedRectCoverage(nx, ny, half, radius, aa) {
  const qx = Math.abs(nx - 0.5) - (half - radius);
  const qy = Math.abs(ny - 0.5) - (half - radius);
  const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
  const inside = Math.min(Math.max(qx, qy), 0);
  const distance = outside + inside - radius;
  return clamp(0.5 - distance / aa);
}

function sample(nx, ny, withBackground) {
  const pixel = [0, 0, 0, 0];
  const dx = nx - 0.5;
  const dy = ny - 0.5;
  const distance = Math.hypot(dx, dy);

  if (withBackground) {
    const coverage = roundedRectCoverage(nx, ny, 0.47, 0.15, 0.008);
    blend(pixel, [27, 17, 12], coverage);
  }

  const gradientT = clamp(nx * 0.35 + ny * 0.65);
  const warm = mix([255, 224, 196], [169, 79, 34], gradientT);
  const bright = mix([255, 236, 218], [208, 122, 59], gradientT);

  // Outer ring.
  const ring = smoothBand(distance, 0.405, 0.337, 0.007);
  blend(pixel, warm, ring);

  // Four-point spark: an astroid-like implicit shape.
  const radius = 0.205;
  const ax = Math.abs(dx) / radius;
  const ay = Math.abs(dy) / radius;
  const sparkField = Math.pow(ax, 0.62) + Math.pow(ay, 0.62);
  const spark = clamp((1 - sparkField) / 0.10 + 0.5);
  const centerHole = clamp((distance - 0.052) / 0.008 + 0.5);
  blend(pixel, bright, spark * centerHole);

  // Small orbiting spark.
  const dotDistance = Math.hypot(nx - 0.735, ny - 0.265);
  blend(pixel, [240, 177, 132], clamp((0.038 - dotDistance) / 0.006 + 0.5));

  return pixel;
}

function render(size, withBackground) {
  const width = size * SS;
  const data = Buffer.alloc(width * width * 4);

  for (let y = 0; y < width; y++) {
    for (let x = 0; x < width; x++) {
      const nx = (x + 0.5) / width;
      const ny = (y + 0.5) / width;
      const pixel = sample(nx, ny, withBackground);
      const offset = (y * width + x) * 4;
      data[offset] = Math.round(pixel[0]);
      data[offset + 1] = Math.round(pixel[1]);
      data[offset + 2] = Math.round(pixel[2]);
      data[offset + 3] = Math.round(pixel[3] * 255);
    }
  }

  // Box-filter downsample from the supersampled buffer.
  const out = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const offset = ((y * SS + sy) * width + (x * SS + sx)) * 4;
          r += data[offset];
          g += data[offset + 1];
          b += data[offset + 2];
          a += data[offset + 3];
        }
      }
      const count = SS * SS;
      const offset = (y * size + x) * 4;
      out[offset] = Math.round(r / count);
      out[offset + 1] = Math.round(g / count);
      out[offset + 2] = Math.round(b / count);
      out[offset + 3] = Math.round(a / count);
    }
  }
  return out;
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function encodePng(size, rgba) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    const rowStart = y * (size * 4 + 1);
    raw[rowStart] = 0;
    rgba.copy(raw, rowStart + 1, y * size * 4, (y + 1) * size * 4);
  }

  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function writePng(relativePath, size, withBackground) {
  const output = path.join(ROOT, relativePath);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, encodePng(size, render(size, withBackground)));
  process.stdout.write(`wrote ${relativePath} (${size}x${size})\n`);
}

const assets = [
  ["assets/oxygenforge-logo.png", 512, false],
  ["config/includes.chroot/usr/share/oxygenforge/logo.png", 256, false],
  ["config/includes.chroot/usr/share/plymouth/themes/oxygenforge/logo.png", 256, false],
  ["config/includes.chroot/etc/calamares/branding/oxygenforge/logo.png", 128, false],
  ["config/includes.chroot/usr/share/icons/hicolor/256x256/apps/oxygenforge.png", 256, true],
  ["config/includes.chroot/usr/share/icons/hicolor/128x128/apps/oxygenforge.png", 128, true],
  ["config/includes.chroot/usr/share/icons/hicolor/48x48/apps/oxygenforge.png", 48, true],
  ["config/includes.chroot/usr/share/pixmaps/oxygenforge.png", 48, true],
];

for (const [relativePath, size, withBackground] of assets) {
  writePng(relativePath, size, withBackground);
}
