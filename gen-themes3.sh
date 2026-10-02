#!/bin/bash
# 6 temi più richiesti (ricerca di mercato ott. 2026): chiesa, Sicilia barocca, vigneto con tavolata, giardino all'italiana, Capri, boho
cd "$(dirname "$0")"
T=sorgenti/themes3; mkdir -p $T
TAIL="Vertical 9:16 photorealistic luxury wedding invitation backdrop, cinematic, the upper third of the frame is calm soft empty sky or space for text, no people, no text, no letters, no logos."
gen_one() {
  k=$1; still=$2; motion=$3
  ./gen.sh $T/$k.png gpt_image_2 --prompt "$still $TAIL" --aspect_ratio 9:16 --resolution 2k || return
  ./gen.sh $T/$k.mp4 seedance_2_0 --prompt "$motion Single continuous shot, slow and elegant, no people, no text." --start-image $T/$k.png --aspect_ratio 9:16 --duration 8 --resolution 1080p --generate_audio false \
  || ./gen.sh $T/$k.mp4 kling3_0 --prompt "$motion Single continuous shot, slow and elegant, no people, no text." --start-image $T/$k.png --aspect_ratio 9:16 --duration 10 --mode pro --sound off
}
gen_one chiesa "The interior of an elegant Italian Romanesque church prepared for a wedding, a long aisle with white petals, rows of wooden pews decorated with white roses and greenery, tall candles, soft golden light pouring through high arched windows." "Slow cinematic dolly forward down the petal-strewn aisle toward the altar, candle flames flickering, light rays drifting through the windows, petals gently stirring." &
gen_one sicilia "A Sicilian baroque terrace in Taormina at golden hour, ornate stone balustrade with lemon and orange trees in majolica pots, bougainvillea, the Mediterranean sea and Mount Etna on the horizon, a table set with white flowers." "Slow cinematic push-in across the baroque terrace toward the sea and Etna, citrus leaves and bougainvillea swaying in the warm breeze, sea sparkling." &
gen_one vigneto "A long rustic wedding banquet table in the middle of an Italian vineyard at dusk, white linen, olive branches, candles and wine glasses, string lights hanging above, rolling hills and a stone farmhouse at sunset." "Slow cinematic dolly forward along the long candle-lit table between the vines, string lights twinkling on, candle flames flickering, vine leaves moving in the breeze." &
gen_one giardino "A formal Italian Renaissance garden of a historic villa, symmetrical boxwood hedges, a central marble fountain, classical statues, an aisle of white hydrangeas and roses leading to the villa, soft morning light." "Slow cinematic glide forward between the boxwood hedges toward the fountain and the villa, water sparkling in the fountain, flowers swaying gently." &
gen_one capri "A classic Italian wooden motorboat moored in a turquoise cove of Capri, the Faraglioni rocks in the background, a dock decorated with white flowers and lemon garlands, bright Mediterranean summer light." "Slow cinematic push-in from the flower-decked dock toward the Faraglioni, the boat gently rocking on the crystal clear water, light sparkling on the waves." &
gen_one boho "A bohemian outdoor wedding ceremony at golden hour in a sandy field, a round wooden arch with pampas grass, dried flowers and draped neutral fabric, rugs and pillows, warm sun flare." "Slow cinematic dolly forward toward the pampas arch, pampas grass and fabric swaying in the warm breeze, golden sun flare shimmering." &
wait; echo TEMI FATTI
