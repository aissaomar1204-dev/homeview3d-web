"""
villa_turntable.py - 8 s seamless turntable of the cut-away maqueta (Cycles, same scene/light as the hero).

The camera orbits the model at the hero elevation (42 deg) starting at the hero azimuth (212 deg), one full
turn in FRAMES frames, so frame FRAMES+1 would equal frame 1 (seamless loop). Sun, sky, AgX look and the
shadow catcher are the hero's (villa_render.py); the sun stays fixed to the world, so the model keeps its
shadow while the light direction relative to the viewer turns, like a real camera orbit.

Output: RGBA PNG frames (transparent film) in --outdir (default: %TEMP%/villa_turntable/f_0001.png ...).
Then encode: node source/villa3d/blender/encode_turntable.mjs <outdir>  (ffmpeg: over the stage colour,
H.264 MP4 + VP9 WebM + poster + build/generated/videos.json).

  & $B -b --factory-startup -P villa_turntable.py -- [--frames 240] [--samples 128] [--res 1280x800]
"""
import bpy
import os
import sys
import math
import time
import tempfile
import argparse

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import villa_render as vr  # noqa: E402

AZ0 = 212.0
EL = 42.0
LENS = 50


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--frames", type=int, default=240)
    p.add_argument("--samples", type=int, default=128)
    p.add_argument("--res", default="1280x800")
    p.add_argument("--outdir", default=os.path.join(tempfile.gettempdir(), "villa_turntable"))
    p.add_argument("--start", type=int, default=1, help="first frame to render (resume)")
    a = p.parse_args(argv)
    a.scale = 100
    a.sun_az, a.sun_el = vr.SUN_AZ, vr.SUN_EL
    return a


def main():
    args = parse_args()
    W, H = (int(v) for v in args.res.lower().split("x"))
    cols, ground, sun, cams = vr.build(args)
    scene = bpy.context.scene
    vr.set_mode("maqueta", cols, ground, sun)
    vr.aim_sun(sun, vr.SUN_AZ, vr.SUN_EL)
    scene.render.resolution_x, scene.render.resolution_y = W, H
    scene.render.resolution_percentage = 100
    scene.cycles.samples = args.samples

    cd = bpy.data.cameras.new("CAM_turntable")
    cam = bpy.data.objects.new("CAM_turntable", cd)
    scene.collection.objects.link(cam)
    cd.lens = LENS
    cd.sensor_width = 36.0
    cd.sensor_fit = "AUTO"
    cd.clip_start = 0.05
    cd.clip_end = 500.0
    scene.camera = cam

    # One distance for the whole turn: the largest fitted distance over 24 azimuths (margin 7 %),
    # aimed at the centre of the model (no lens shift, so the orbit does not wobble).
    pts = vr.box_points((-0.03, -0.03, 9.13, 14.08, -0.60, 1.15))
    target = tuple(pts.mean(axis=0))
    dist = 0.0
    for k in range(24):
        _, d = vr.fit_perspective(cam, scene, pts, AZ0 + k * 15.0, EL, 0.07)
        dist = max(dist, d)
    cd.shift_x = cd.shift_y = 0.0
    vr.log("turntable: distance %.2f m, target %s" % (dist, tuple(round(v, 2) for v in target)))

    os.makedirs(args.outdir, exist_ok=True)
    t0 = time.time()
    for i in range(args.start - 1, args.frames):
        az = AZ0 + 360.0 * i / args.frames
        vr.place_orbit(cam, target, az, EL, dist)
        scene.render.filepath = os.path.join(args.outdir, "f_%04d.png" % (i + 1))
        bpy.ops.render.render(write_still=True)
        if i % 20 == 0:
            el = time.time() - t0
            vr.log("frame %d/%d  %.1fs elapsed" % (i + 1, args.frames, el))
    vr.log("turntable done in %.1fs -> %s" % (time.time() - t0, args.outdir))


if __name__ == "__main__":
    main()
