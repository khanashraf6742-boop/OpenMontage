#!/usr/bin/env python3
"""
MP3 tools for the GFR explainer (no ffmpeg in this sandbox).

  duration <file>            print duration in seconds
  merge <out> <in1> <in2>…   concatenate MP3 streams at frame level

Frame concatenation is valid MPEG audio: we strip ID3v2/ID3v1 tags from every
input and append the raw frame streams. All clips in this project come from the
same TTS voice/encoder settings, so the bitrate and sample rate match.
"""
import sys
import struct


def _skip_id3v2(b):
    if len(b) > 10 and b[:3] == b"ID3":
        size = (b[6] & 0x7F) << 21 | (b[7] & 0x7F) << 14 | (b[8] & 0x7F) << 7 | (b[9] & 0x7F)
        return 10 + size
    return 0


def _strip_id3v1(b):
    if len(b) > 128 and b[-128:-125] == b"TAG":
        return b[:-128]
    return b


BITRATES = {  # kbps, V1L3 / V2L3
    1: [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0],
    2: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0],
}
RATES = {3: [44100, 48000, 32000], 2: [22050, 24000, 16000], 0: [11025, 12000, 8000]}


def frames(b, offset=0):
    """Yield (offset, length, samples, samplerate) for each valid MPEG frame."""
    i = offset
    n = len(b)
    while i + 4 <= n:
        if b[i] != 0xFF or (b[i + 1] & 0xE0) != 0xE0:
            i += 1
            continue
        ver_bits = (b[i + 1] >> 3) & 0x03
        layer_bits = (b[i + 1] >> 1) & 0x03
        if ver_bits == 1 or layer_bits != 1:      # reserved version / not Layer III
            i += 1
            continue
        br_i = (b[i + 2] >> 4) & 0x0F
        sr_i = (b[i + 2] >> 2) & 0x03
        pad = (b[i + 2] >> 1) & 0x01
        if br_i in (0, 15) or sr_i == 3:
            i += 1
            continue
        ver = 1 if ver_bits == 3 else 2           # 3 = MPEG1, 2 = MPEG2
        table = BITRATES[ver]
        rate = RATES[ver_bits][sr_i]
        bitrate = table[br_i] * 1000
        samples = 1152 if ver == 1 else 576
        length = int((samples / 8 * bitrate / rate)) + pad
        if length <= 4 or i + length > n:
            i += 1
            continue
        yield i, length, samples, rate
        i += length


def duration(path):
    b = open(path, "rb").read()
    start = _skip_id3v2(b)
    total = 0.0
    for _, _, samples, rate in frames(b, start):
        total += samples / rate
    return total


def merge(out, inputs):
    parts = []
    for f in inputs:
        b = open(f, "rb").read()
        b = _strip_id3v1(b[_skip_id3v2(b):])
        # drop a leading Xing/Info header frame so the merged stream has none
        fr = list(frames(b, 0))
        if fr and fr[0][0] == 0:
            tag = b[fr[0][0] + 4: fr[0][0] + 8]
            if tag[:4] in (b"Xing", b"Info"):
                b = b[fr[0][1]:]
        parts.append(b)
    data = b"".join(parts)
    open(out, "wb").write(data)
    # store the duration next to the file for the timing pass
    return duration(out)


if __name__ == "__main__":
    cmd = sys.argv[1]
    if cmd == "duration":
        for f in sys.argv[2:]:
            print(f"{duration(f):.2f}")
    elif cmd == "merge":
        out, ins = sys.argv[2], sys.argv[3:]
        print(f"{merge(out, ins):.2f}")
    else:
        sys.exit(__doc__)
