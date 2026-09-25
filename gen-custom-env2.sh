#!/bin/bash
cd "$(dirname "$0")"
D=public/media/envelopes/custom
BASE="Photorealistic extreme close-up top-down view of a luxury wedding envelope filling the entire vertical 9:16 frame edge to edge, the triangular back flap points down and its tip ends exactly at the center of the frame, everything pure white or off-white only (white on white, no colors, no gold, no metallic), soft even natural window light, subtle realistic shadows under the flap edge, no wax seal, no stamp, no text, no letters, nothing on the flap tip, no people, no hands."
V="The envelope flap slowly lifts and opens upward toward the camera, revealing a glowing cream invitation card inside, the camera glides forward into the opening envelope, soft warm light blooms and the frame fades to warm creamy white at the end. Elegant, slow, cinematic, single continuous shot, no text, no hands."
one() { k=$1; p=$2
  ./gen.sh $D/$k.png gpt_image_2 --prompt "$BASE $p" --aspect_ratio 9:16 --resolution 2k || return
  ./gen.sh $D/$k.mp4 kling3_0 --prompt "$V" --start-image $D/$k.png --aspect_ratio 9:16 --duration 5 --mode pro --sound off \
  || ./gen.sh $D/$k.mp4 seedance_2_0 --prompt "$V" --start-image $D/$k.png --aspect_ratio 9:16 --duration 5 --resolution 1080p --generate_audio false
}
one lino "Fine natural linen-textured paper with a visible woven canvas texture." &
one sfrangiato "Thick handmade cotton rag paper with soft deckled torn edges on the flap, visible fibers." &
one artdeco "Paper with an elegant blind-embossed Art Deco geometric fan pattern in relief all over, white on white." &
one pizzo "Paper with a delicate blind-embossed lace pattern in relief, like fine bridal lace, white on white." &
one ulivo "Paper with blind-embossed olive branches and leaves in relief, Mediterranean style, white on white." &
one perlata "Smooth pearlescent shimmer paper with a soft satin pearl sheen." &
one fiori-secchi "Handmade paper with tiny pressed white dried flowers and petals embedded in the paper fibers, white on white." &
wait
