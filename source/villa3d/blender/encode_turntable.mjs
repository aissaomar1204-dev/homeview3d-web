// Encode the turntable frames (villa_turntable.py) into web video + poster, and write the manifest.
//   node source/villa3d/blender/encode_turntable.mjs [framesDir]
// In:  <framesDir>/f_0001.png … (RGBA, 1280×800, 30 fps; default %TEMP%/villa_turntable)
// Out: public/assets/video/villa-turntable.mp4   H.264 High, yuv420p, BT.709, faststart, no audio (≤ 2 MB)
//      public/assets/video/villa-turntable.webm  VP9, no audio
//      public/assets/video/villa-turntable-poster.{webp,jpg}  first frame (= the loop start)
//      build/generated/videos.json
// Frames are composited over the light --color-stage token (a video has no alpha), read from tokens.css.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const FRAMES = path.resolve(process.argv[2] || path.join(os.tmpdir(), 'villa_turntable'));
const OUT = path.join(ROOT, 'public/assets/video');
const MANIFEST = path.join(ROOT, 'build/generated/videos.json');
const NAME = 'villa-turntable';
const FPS = 30;
const MAX_MP4 = 2 * 1024 * 1024;

function token(name, fallback) {
  for (const p of ['src/css/00-tokens.css', 'docs/design/tokens.css']) {
    const f = path.join(ROOT, p);
    if (!fs.existsSync(f)) continue;
    const m = fs.readFileSync(f, 'utf8').match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
    if (m) return m[1].toUpperCase();
  }
  return fallback;
}

const frames = fs.readdirSync(FRAMES).filter((f) => /^f_\d{4}\.png$/.test(f)).sort();
if (!frames.length) throw new Error(`no frames in ${FRAMES}`);
const meta = await sharp(path.join(FRAMES, frames[0])).metadata();
const { width: W, height: H } = meta;
const stage = token('color-stage', '#E4E7EA');
fs.mkdirSync(OUT, { recursive: true });

const ff = (args) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
// Background plate as an exact RGB PNG (ffmpeg's lavfi `color` source is generated in YUV and drifts 1-2 levels).
const bg = path.join(os.tmpdir(), `turntable-bg-${W}x${H}.png`);
await sharp({ create: { width: W, height: H, channels: 3, background: stage } }).png().toFile(bg);
const input = ['-framerate', String(FPS), '-i', path.join(FRAMES, 'f_%04d.png'), '-loop', '1', '-framerate', String(FPS), '-i', bg];
const graph = '[1:v]format=rgb24[bg];[0:v]format=rgba[fg];[bg][fg]overlay=shortest=1:format=rgb,'
  + 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p[v]';
const colour = ['-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv'];

const mp4 = path.join(OUT, `${NAME}.mp4`);
let crf = 23;
for (;;) {
  ff([...input, '-filter_complex', graph, '-map', '[v]', '-an', '-c:v', 'libx264', '-preset', 'veryslow', '-crf', String(crf),
    '-profile:v', 'high', '-level', '4.0', '-g', String(FPS * 2), ...colour, '-movflags', '+faststart', mp4]);
  if (fs.statSync(mp4).size <= MAX_MP4 || crf >= 32) break;
  crf += 2;
}
const webm = path.join(OUT, `${NAME}.webm`);
ff([...input, '-filter_complex', graph, '-map', '[v]', '-an', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '36', '-row-mt', '1',
  '-deadline', 'good', '-cpu-used', '1', '-g', String(FPS * 2), ...colour, webm]);

const first = await sharp(path.join(FRAMES, frames[0])).flatten({ background: stage }).toBuffer();
const posterWebp = path.join(OUT, `${NAME}-poster.webp`);
const posterJpg = path.join(OUT, `${NAME}-poster.jpg`);
await sharp(first).webp({ quality: 80, effort: 6 }).toFile(posterWebp);
await sharp(first).jpeg({ quality: 82, mozjpeg: true, progressive: true }).toFile(posterJpg);

const size = (f) => fs.statSync(f).size;
const manifest = {
  [NAME]: {
    width: W,
    height: H,
    fps: FPS,
    frames: frames.length,
    duration: Math.round((frames.length / FPS) * 100) / 100,
    loop: true,
    background: stage,
    sources: [
      { src: `/assets/video/${NAME}.webm`, type: 'video/webm; codecs="vp9"', bytes: size(webm) },
      { src: `/assets/video/${NAME}.mp4`, type: 'video/mp4; codecs="avc1.640028"', bytes: size(mp4) },
    ],
    poster: `/assets/video/${NAME}-poster.webp`,
    posterJpg: `/assets/video/${NAME}-poster.jpg`,
    posterBytes: { webp: size(posterWebp), jpg: size(posterJpg) },
    note: 'Cycles render of the cut-away maqueta (one camera orbit, same light as the hero render). No audio.',
  },
};
fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
fs.writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`[video] ${frames.length} frames ${W}×${H} @${FPS} · mp4 crf ${crf} ${(size(mp4) / 1048576).toFixed(2)} MB · webm ${(size(webm) / 1048576).toFixed(2)} MB · poster webp ${(size(posterWebp) / 1024).toFixed(1)} KB / jpg ${(size(posterJpg) / 1024).toFixed(1)} KB`);
