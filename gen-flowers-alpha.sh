#!/bin/bash
# Bordi floreali con vera trasparenza: gpt_image_2 background=transparent partendo dall'originale
cd "$(dirname "$0")"; mkdir -p sorgenti/flowers-cut
P="Recreate this exact watercolor floral garland as a tall vertical border strip: same flowers, same colors, same leaves, same hand-painted watercolor style and arrangement, flowing from top to bottom. Isolated on a fully transparent background: no paper, no white background, no frame, no shadow, no text. White petals must stay fully painted and opaque."
for k in "$@"; do
  ( ./gen.sh sorgenti/flowers-cut/$k.png gpt_image_2 --prompt "$P" --image sorgenti/flowers-jpg/$k.jpg --background transparent --aspect_ratio 9:16 --resolution 2k --quality high ) &
done; wait; echo FIORI FATTO
