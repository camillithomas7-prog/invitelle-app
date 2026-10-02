#!/bin/bash
# Illustrazioni ad acquerello pronte per il blocco "Disegno" (sfondo trasparente, stile partecipazione)
cd "$(dirname "$0")"; D=sorgenti/drawings
S="Delicate loose watercolor and fine sepia ink line illustration, elegant Italian wedding stationery style, soft pastel palette, airy brush strokes, isolated on a fully transparent background: no paper texture, no white background, no frame, no border, no shadow, no text, no letters. White areas must stay painted and opaque."
g() { ./gen.sh $D/$1.png gpt_image_2 --prompt "$2 $S" --background transparent --aspect_ratio ${3:-4:5} --resolution 2k --quality high ${4:+--image $4}; }
g sposi-mano "Recreate this exact illustration of the bride and groom holding hands, same pose, same outfits, same flowers." 4:5 public/media/demo/drawing.webp &
g villa-mare "Recreate this exact illustration of the white seaside villa with bougainvillea, lemon tree and the floral wedding arch on the beach." 4:3 public/media/demo/venue.webp &
g sposi-ballo "A bride and groom dancing their first dance, the bride's long white gown twirling, the groom in a navy suit, seen full figure, a few falling petals around them." &
g sposi-arco "A bride and groom facing each other holding hands under a round arch of white roses and eucalyptus, full figure, wedding vows moment." &
wait
g sposi-vespa "A bride with veil flowing in the wind and a groom riding a vintage pastel mint Vespa scooter, tin cans tied with ribbons trailing behind, side view." 4:3 &
g chiesa "A small romantic Italian countryside chapel with a bell tower, tall cypress trees and a stone path lined with white flowers." &
g torta "An elegant three-tier white wedding cake decorated with cascading fresh roses, peonies and greenery on a cake stand." &
g brindisi "Two champagne flutes clinking together with a small golden splash and bubbles, tied with a silk ribbon and a sprig of flowers." &
wait
g fedi "Two gold wedding rings resting on a small bed of white roses, baby's breath and olive leaves." 4:3 &
g bouquet "A romantic bridal bouquet of white and blush roses, peonies, ranunculus and eucalyptus tied with a long flowing silk ribbon." &
g casale "A Tuscan stone farmhouse with olive trees, rows of cypresses and a long table set for a wedding dinner under string lights." 4:3 &
g auto "A vintage cream convertible car decorated with flowers on the hood and white ribbons, a just married wedding getaway car, side view." 4:3 &
wait; echo DISEGNI FATTI
