// Minimal PNG generator for PWA icons
// Creates solid-colored square icons with a letter overlay
// No external dependencies — pure Node.js Buffer manipulation

const fs = require("fs");
const path = require("path");

function createPNG(size, r, g, b) {
  // Build a minimal valid PNG with solid color
  // PNG spec: signature + IHDR + IDAT + IEND

  const signature = Buffer.from([
    137, 80, 78, 71, 13, 10, 26, 10,
  ]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0); // width
  ihdrData.writeUInt32BE(size, 4); // height
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type (RGB)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = createChunk("IHDR", ihdrData);

  // IDAT chunk with unfiltered raw pixel data
  const rawData = [];
  for (let y = 0; y < size; y++) {
    rawData.push(0); // filter byte (none)
    for (let x = 0; x < size; x++) {
      // Create a subtle gradient effect
      const factor = 1 - (y / size) * 0.4;
      rawData.push(Math.floor(r * factor));
      rawData.push(Math.floor(g * factor));
      rawData.push(Math.floor(b * factor));
    }
  }

  // Compress with zlib (deflate)
  const zlib = require("zlib");
  const compressed = zlib.deflateSync(Buffer.from(rawData));
  const idat = createChunk("IDAT", compressed);

  // IEND chunk
  const iend = createChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type, "ascii");
  const crcData = Buffer.concat([typeBuffer, data]);

  const crc = crc32(crcData);
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc >>> 0, 0);

  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

// CRC32 implementation
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

const iconsDir = path.join(__dirname, "..", "public", "icons");
fs.mkdirSync(iconsDir, { recursive: true });

// Indigo-based color (#6366f1)
const r = 99;
const g = 102;
const b = 241;

fs.writeFileSync(path.join(iconsDir, "icon-192.png"), createPNG(192, r, g, b));
console.log("Generated icon-192.png");

fs.writeFileSync(path.join(iconsDir, "icon-512.png"), createPNG(512, r, g, b));
console.log("Generated icon-512.png");

console.log("Done!");