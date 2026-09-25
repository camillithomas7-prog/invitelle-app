#!/bin/bash
# Genera i template di apertura busta: foto busta chiusa (gpt_image_2) + video apertura (seedance_2_0)
cd "$(dirname "$0")"
BASE="Photorealistic extreme close-up top-down view of a luxury wedding envelope filling the entire vertical 9:16 frame edge to edge, the triangular back flap points down and ends slightly below the center of the frame, a round wax seal sits exactly on the tip of the flap, soft natural window light, fine paper texture, shallow depth of field, no text, no letters, no people, no hands."
P_ricamo="$BASE Ivory cotton paper with delicate embossed and embroidered 3D flowers: a cream paper rose, pastel blush and powder-blue little flowers and sage leaves around the flap tip. Dusty rose wax seal with an embossed peony emblem."
P_salvia="$BASE Sage green textured paper envelope with a deckled edge, a sprig of real dried eucalyptus and white baby's breath tucked under the seal. Antique gold wax seal with an embossed olive branch emblem."
P_notte="$BASE Midnight navy blue linen paper envelope with fine gold foil border lines and tiny gold foil stars. Shiny gold wax seal with an embossed crescent moon and star emblem."
P_amalfi="$BASE Crisp white paper envelope with a hand-painted watercolor border of lemons, lemon leaves and blue majolica tiles pattern on the flap. Deep burgundy red wax seal with an embossed lemon blossom emblem."
for k in ricamo salvia notte amalfi; do
  ( ./gen.sh public/media/envelopes/$k.png gpt_image_2 --prompt "$(eval echo \"\$P_$k\")" --aspect_ratio 9:16 --resolution 2k && \
    ./gen.sh public/media/envelopes/$k.mp4 seedance_2_0 --prompt "The wax seal cracks gently and the envelope flap slowly lifts and opens upward toward the camera, revealing a glowing cream invitation card inside, the camera glides forward into the opening envelope, soft warm light blooms and the frame fades to warm creamy white at the end. Elegant, slow, cinematic, single continuous shot, no text, no hands." --start-image public/media/envelopes/$k.png --aspect_ratio 9:16 --duration 5 --resolution 1080p --generate_audio false ) &
done
wait
