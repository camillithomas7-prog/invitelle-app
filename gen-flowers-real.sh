#!/bin/bash
# Bordi floreali fotografici (fiori veri) su grigio uniforme, poi scontornati con rembg (scontorna-fiori.py)
cd "$(dirname "$0")"; D=sorgenti/flowers-real
P="Photorealistic high-end floral photography: recreate this floral garland as a tall vertical border strip made of REAL fresh flowers and leaves, same flower varieties, same colors and the same arrangement flowing from top to bottom. Natural soft daylight, crisp realistic petals and leaves with fine detail, gentle natural shading, shot on a professional camera. The whole garland is isolated on a perfectly flat, uniform, plain medium grey seamless studio background (#8a8a8a), no shadow on the background, no vase, no table, no text, no frame. Nothing is cut off except at the top and bottom edges."
for k in "$@"; do
  ( ./gen.sh $D/$k.png gpt_image_2 --prompt "$P" --image sorgenti/flowers-jpg/$k.jpg --aspect_ratio 9:16 --resolution 2k --quality high ) &
done; wait; echo FIORI VERI FATTI
