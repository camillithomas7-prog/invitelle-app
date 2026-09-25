#!/bin/bash
cd "$(dirname "$0")"
D=public/media/flowers
F="Watercolor botanical illustration on a pure white background, a vertical garland running along the full left edge of the frame, hanging from the top-left corner and fading out towards the bottom, the right 75% of the image completely empty pure white. Delicate luxury wedding stationery style, soft painted edges, no text."
g() { ./gen.sh $D/$1.png gpt_image_2 --prompt "$F $2" --aspect_ratio 9:16; }
g eucalipto "Only eucalyptus branches and sage green leaves, minimal and airy." &
g peonie "Lush blush pink peonies and garden roses with soft green leaves." &
g ranuncoli "Peach and apricot ranunculus with dusty rose buds and greenery." &
g glicine "Cascading lilac wisteria clusters with light green leaves." &
g limoni "Amalfi lemons with lemon blossoms and glossy green leaves." &
g ulivo "Olive branches with small green and black olives, Mediterranean." &
g boho "Dried pampas grass, bunny tails, dried palm leaves and terracotta dried flowers, boho style." &
g campo "Wildflowers: white daisies, blue cornflowers, red poppies, lavender sprigs and grasses." &
g inverno "Winter greenery: white roses, pine branches, eucalyptus, white berries and tiny pinecones." &
g ortensie "Soft blue and white hydrangeas with delphinium and white anemones." &
wait
