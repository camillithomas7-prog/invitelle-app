#!/bin/bash
cd "$(dirname "$0")"
D=public/media/envelopes/custom
BASE="Photorealistic extreme close-up top-down view of a luxury wedding envelope filling the entire vertical 9:16 frame edge to edge, the triangular back flap points down and its tip ends exactly at the center of the frame, pure white paper, soft even natural window light, subtle realistic shadows under the flap edge, fine paper texture, no wax seal, no stamp, no text, no letters, no decorations on the flap tip, no people, no hands."
V="The envelope flap slowly lifts and opens upward toward the camera, revealing a glowing cream invitation card inside, the camera glides forward into the opening envelope, soft warm light blooms and the frame fades to warm creamy white at the end. Elegant, slow, cinematic, single continuous shot, no text, no hands."
one() { k=$1; p=$2
  ./gen.sh $D/$k.png gpt_image_2 --prompt "$BASE $p" --aspect_ratio 9:16 --resolution 2k || return
  ./gen.sh $D/$k.mp4 kling3_0 --prompt "$V" --start-image $D/$k.png --aspect_ratio 9:16 --duration 5 --mode pro --sound off \
  || ./gen.sh $D/$k.mp4 seedance_2_0 --prompt "$V" --start-image $D/$k.png --aspect_ratio 9:16 --duration 5 --resolution 1080p --generate_audio false
}
one liscia "Smooth heavy cotton paper, completely plain and minimal." &
one floreale "Heavy cotton paper with an elegant blind-embossed floral pattern of roses and leaves in relief all over the envelope, white on white." &
wait
