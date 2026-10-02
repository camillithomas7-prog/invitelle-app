# Scontorna i bordi floreali fotografici generati su grigio uniforme e salva WEBP trasparenti in public/media/flowers
# Metodo: distanza di colore dal grigio dello sfondo (misurato sui bordi) -> alfa morbida, poi "decontaminazione" del grigio
# uso: python3 scontorna-fiori.py classico peonie ...
import sys, numpy as np
from PIL import Image
from scipy import ndimage
for k in sys.argv[1:]:
    a = np.asarray(Image.open(f'sorgenti/flowers-real/{k}.png').convert('RGB')).astype(np.float32)
    h, w, _ = a.shape
    edge = np.concatenate([a[:, :12].reshape(-1, 3), a[:, -12:].reshape(-1, 3)])
    bg = np.median(edge, 0)
    dist = np.sqrt(((a - bg) ** 2).sum(2))
    sat = a.max(2) - a.min(2)
    score = np.maximum(dist, sat * 1.4)
    alpha = np.clip((score - 14) / (42 - 14), 0, 1)
    # solo le zone collegate alla ghirlanda (via puntini isolati), riempiendo i buchi interni
    solid = alpha > .5
    lab, n = ndimage.label(solid)
    if n:
        sizes = ndimage.sum(solid, lab, range(1, n + 1))
        keep = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > 400])
        keep = ndimage.binary_fill_holes(ndimage.binary_dilation(keep, iterations=3))
        alpha = alpha * ndimage.gaussian_filter(keep.astype(np.float32), 1.2)
    alpha = ndimage.gaussian_filter(alpha, .6)
    al = np.clip(alpha, 1e-3, 1)[..., None]
    rgb = np.clip((a - bg * (1 - al)) / al, 0, 255)
    out = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    # taglio stretto attorno alla ghirlanda: così riempie tutta la larghezza del bordo
    ys, xs = np.where(alpha > .04)
    x0, x1 = max(0, xs.min() - 6), min(w, xs.max() + 7)
    out = out[:, x0:x1]
    im = Image.fromarray(out); im.thumbnail((380, 1100))
    im.save(f'public/media/flowers/{k}.webp', quality=88, method=6)
    print('OK', k, im.size, 'sfondo', bg.round())
