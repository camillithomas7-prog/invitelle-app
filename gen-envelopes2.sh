#!/bin/bash
# 12 nuove aperture busta per matrimonio: foto busta chiusa (gpt_image_2) + video apertura (seedance, fallback kling tagliato)
cd "$(dirname "$0")"
D=public/media/envelopes; mkdir -p sorgenti/envelopes
BASE="Photorealistic extreme close-up top-down view of a luxury wedding envelope filling the entire vertical 9:16 frame edge to edge, the triangular back flap points down and ends slightly below the center of the frame, a round wax seal sits exactly on the tip of the flap, soft natural window light, fine paper texture, shallow depth of field, editorial fine-art wedding stationery photography, no text, no letters, no monogram letters, no people, no hands."
V="The wax seal cracks gently and the envelope flap slowly lifts and opens upward toward the camera, revealing a glowing cream invitation card inside, the camera glides forward into the opening envelope, soft warm light blooms and the frame fades to warm creamy white at the end. Elegant, slow, cinematic, single continuous shot, no text, no hands."
post() { k=$1; src=$2; trim=$3
  ffmpeg -y -loglevel error -i sorgenti/envelopes/$k.png -vf scale=720:-2 -q:v 3 $D/$k.jpg
  if [ -n "$trim" ]; then vf="scale=720:-2,trim=0:2.9,setpts=PTS-STARTPTS,fade=t=out:st=2.2:d=0.7:color=0xFBF7F0"; else vf="scale=720:-2"; fi
  ffmpeg -y -loglevel error -i $src -an -vf "$vf" -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -movflags +faststart $D/$k.mp4
}
one() { k=$1; p=$2; S=sorgenti/envelopes
  [ -f $S/$k.png ] || ./gen.sh $S/$k.png gpt_image_2 --prompt "$BASE $p" --aspect_ratio 9:16 --resolution 2k || return
  if ./gen.sh $S/$k.mp4 seedance_2_0 --prompt "$V" --start-image $S/$k.png --aspect_ratio 9:16 --duration 5 --resolution 1080p --generate_audio false; then post $k $S/$k.mp4
  elif ./gen.sh $S/$k-kling.mp4 kling3_0 --prompt "$V" --start-image $S/$k.png --aspect_ratio 9:16 --duration 5 --mode pro --sound off; then post $k $S/$k-kling.mp4 trim
  fi
}
one peonie "Soft ivory cotton paper with a lush hand-painted watercolor garland of blush pink peonies, garden roses and eucalyptus leaves along the flap edges. Pale blush pink wax seal with an embossed peony emblem." &
one pizzo "Ivory envelope wrapped with delicate white French Chantilly bridal lace across the flap, tiny pearls scattered. Pearl white iridescent wax seal with an embossed rose emblem." &
one marmo "White Carrara marble-effect paper with fine elegant gold veins, gold foil thin border lines. Shiny gold wax seal with an embossed laurel wreath emblem." &
one glicine "Pale lilac paper with a romantic watercolor cascade of wisteria flowers hanging from the top of the frame over the flap. Lavender purple wax seal with an embossed wisteria emblem." &
one bordeaux "Deep burgundy wine red velvet-textured paper envelope with a thin gold foil border and a dried red rose laid beside the seal. Antique gold wax seal with an embossed heart and rose emblem." &
one uliveto "Warm cream handmade paper with deckled edges, a real fresh olive branch with green olives tied with natural linen twine under the seal. Olive green wax seal with an embossed olive tree emblem." &
wait
one riviera "Crisp white paper envelope with a hand-painted watercolor Italian Riviera border of blue sea waves, seashells and white bougainvillea on the flap. Navy blue wax seal with an embossed seashell emblem." &
one pampas "Soft beige sand-colored textured paper with dried pampas grass plumes, bunny tail grass and dried terracotta flowers tucked under the seal, boho chic. Terracotta rust wax seal with an embossed sun emblem." &
one rose-bianche "Luminous white satin-textured paper envelope with a small bouquet of real white garden roses and baby's breath and a satin ivory ribbon bow above the seal. Ivory cream wax seal with an embossed pair of wedding rings emblem." &
one vigneto "Ivory paper with a watercolor Tuscan landscape of cypress trees, rolling hills and vineyard grapevines on the flap, golden hour tones. Deep forest green wax seal with an embossed grape cluster emblem." &
one inverno "Pale silver-grey pearlescent paper with delicate silver foil snowflakes and frosted white winter greenery, pine sprigs and white berries around the seal. Shiny silver wax seal with an embossed snowflake emblem." &
one art-deco "Black envelope with luxurious gold foil Art Deco geometric fan and line patterns, Great Gatsby 1920s glamour, gold border. Shiny gold wax seal with an embossed Art Deco fan emblem." &
wait
echo TUTTO FATTO
