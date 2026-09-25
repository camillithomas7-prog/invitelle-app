#!/bin/bash
# 6 nuovi temi: still verticale (gpt_image_2) + video intro (seedance_2_0, fallback kling3_0)
cd "$(dirname "$0")"
T=public/media/themes
TAIL="Vertical 9:16 photorealistic luxury wedding invitation backdrop, cinematic, the upper third of the frame is calm soft empty sky or space for text, no people, no text, no letters, no logos."
gen_one() {
  k=$1; still=$2; motion=$3
  ./gen.sh $T/$k.png gpt_image_2 --prompt "$still $TAIL" --aspect_ratio 9:16 --resolution 2k || return
  ./gen.sh $T/$k.mp4 seedance_2_0 --prompt "$motion Single continuous shot, slow and elegant, no people, no text." --start-image $T/$k.png --aspect_ratio 9:16 --duration 8 --resolution 1080p --generate_audio false \
  || ./gen.sh $T/$k.mp4 kling3_0 --prompt "$motion Single continuous shot, slow and elegant, no people, no text." --start-image $T/$k.png --aspect_ratio 9:16 --duration 10 --mode pro --sound off
}
gen_one toscana "A medieval stone castle on a gentle Tuscan hill in Val d'Orcia at golden sunset, rows of vineyards and tall cypress trees leading to it, warm honey light, a few candles and white flowers on a stone wall in the foreground." "Slow cinematic push-in toward the castle, cypress trees and vine leaves swaying gently in the warm breeze, golden light flickering." &
gen_one glicine "A romantic garden pergola completely covered with cascading lilac wisteria, white roses along a gravel path, a small marble fountain, soft morning light and gentle haze." "Slow dolly forward under the wisteria pergola, purple petals drifting slowly through the air, fountain water sparkling." &
gen_one puglia "A whitewashed Apulian masseria courtyard at dusk with ancient olive trees, strings of warm festoon lights (luminarie) hanging above a long table set with white linen, candles and olive branches." "Slow cinematic push-in into the courtyard, festoon lights twinkling softly, olive leaves moving in the evening breeze, candle flames flickering." &
gen_one mare "An elegant wedding arch of white roses and pampas grass on a pristine sandy beach at sunset, calm turquoise sea, soft pastel pink and gold sky, a few lanterns on the sand." "Slow cinematic push-in toward the floral arch, gentle waves rolling onto the shore, pampas grass and fabric swaying in the sea breeze." &
gen_one venezia "The Grand Canal in Venice at blue hour seen from a palazzo balcony with white flowers on the balustrade, illuminated gothic palazzi, a gondola moored with lanterns, calm reflective water." "Slow cinematic glide forward over the balcony toward the canal, water reflections shimmering, lanterns glowing softly, gondola gently rocking." &
gen_one serra "An enchanting Victorian glass greenhouse at night filled with hundreds of candles, white hydrangeas, hanging greenery and a long aisle of petals, warm glowing light through the glass panes." "Slow dolly forward down the petal aisle, hundreds of candle flames flickering, hanging greenery gently swaying, soft glowing bokeh." &
wait
