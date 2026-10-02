# Versione "senza giunture" dei bordi floreali per la cornice continua: la fine della ghirlanda sfuma nell'inizio
# uso: python3 tile-fiori.py  (legge public/media/flowers/*.webp, scrive *-tile.webp)
import glob, numpy as np
from PIL import Image
for f in sorted(glob.glob('public/media/flowers/*.webp')):
    if f.endswith('-tile.webp'): continue
    im = np.asarray(Image.open(f).convert('RGBA')).astype(np.float32) / 255
    h = im.shape[0]; o = int(h * .22)
    body = im[:h - o].copy()                       # tassello: altezza h - o
    tail = im[h - o:]                              # ultima parte, da fondere sopra l'inizio
    x = np.linspace(0, 1, o)[:, None, None]; t = 1 - x * x * (3 - 2 * x)   # dissolvenza incrociata morbida
    head = body[:o]
    a_t = tail[..., 3:] * t; a_h = head[..., 3:] * (1 - t)
    a = np.clip(a_t + a_h, 0, 1)
    rgb = (tail[..., :3] * a_t + head[..., :3] * a_h) / np.clip(a_t + a_h, 1e-4, None)
    body[:o] = np.concatenate([rgb, a], 2)
    out = Image.fromarray((np.clip(body, 0, 1) * 255).astype(np.uint8))
    out.save(f.replace('.webp', '-tile.webp'), quality=86, method=6)
    print('OK', f.split('/')[-1], out.size)
