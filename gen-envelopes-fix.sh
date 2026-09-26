#!/bin/bash
# rifà i video apertura senza biglietto con scritte: dentro la busta solo luce calda
cd "$(dirname "$0")"
D=public/media/envelopes; S=sorgenti/envelopes
V2="The wax seal cracks gently and the envelope flap slowly lifts and opens upward toward the camera. Inside the envelope there is only soft warm glowing golden light and empty plain cream paper lining, completely blank, absolutely no card with writing, no printed text, no calligraphy, no letters anywhere. The camera glides forward into the glowing envelope, light blooms and the whole frame fades to warm creamy white. Elegant, slow, cinematic, single continuous shot, no hands."
fix() { k=$1
  ./gen.sh $S/$k-v2.mp4 seedance_2_0 --prompt "$V2" --start-image $S/$k.png --aspect_ratio 9:16 --duration 5 --resolution 1080p --generate_audio false \
  && ffmpeg -y -loglevel error -i $S/$k-v2.mp4 -an -vf scale=720:-2 -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -movflags +faststart $D/$k.mp4 && echo "FIXED $k"
}
for k in "$@"; do fix $k & done; wait
echo FIX FATTO "$@"
