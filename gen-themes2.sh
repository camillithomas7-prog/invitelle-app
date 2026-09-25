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
gen_one dolomiti "An elegant alpine wooden chalet terrace in the Italian Dolomites at golden sunset, a meadow full of wildflowers, dramatic pink-lit rocky peaks (enrosadira), a small table with white flowers and candles." "Slow cinematic push-in across the flower meadow toward the peaks, wildflowers swaying in the mountain breeze, pink alpenglow slowly intensifying." &
gen_one inverno "A magical winter wedding scene in a snowy fir forest at blue hour, a path lined with glowing lanterns and candles in the snow, white roses and pine branches, soft falling snowflakes." "Slow dolly forward along the lantern-lit snowy path, gentle snowflakes falling, candle flames flickering, soft glowing light." &
gen_one parigi "A Parisian balcony with wrought iron railing covered in blush roses, overlooking Paris rooftops and the Eiffel Tower at dusk with a soft pink and lavender sky." "Slow cinematic push-in past the roses toward the Eiffel Tower, rose petals gently moving in the breeze, city lights slowly twinkling on." &
gen_one santorini "A whitewashed Santorini chapel with a blue dome, magenta bougainvillea, white steps with lanterns, the deep blue Aegean sea and caldera at sunset." "Slow cinematic glide forward along the white steps toward the blue dome, bougainvillea swaying, sea sparkling in the sunset light." &
gen_one lavanda "Endless rows of purple lavender fields in Provence at golden hour, a rustic wooden wedding arch draped with white flowers and linen in the middle, a stone farmhouse far away." "Slow dolly forward between the lavender rows toward the wooden arch, lavender and linen fabric swaying in the warm breeze, butterflies fluttering." &
gen_one marrakech "A luxurious Moroccan riad courtyard at night with a reflecting pool, dozens of ornate brass lanterns casting patterned light, zellige tiles, rose petals floating on the water, palm trees." "Slow cinematic push-in over the reflecting pool, lanterns glowing and casting moving patterned light, rose petals drifting on the water." &
gen_one bosco "An enchanted forest clearing at night with hundreds of warm fairy lights hanging from ancient trees, a moss-covered aisle lined with candles and white flowers, soft mist." "Slow dolly forward down the candle-lit mossy aisle, fairy lights twinkling, soft mist drifting between the trees." &
gen_one roma "An elegant Roman rooftop terrace garden at sunset with lemon trees in terracotta pots, white flowers on a stone balustrade, and the dome of St. Peter's Basilica glowing on the skyline." "Slow cinematic push-in toward the dome of St. Peter's, lemon leaves swaying in the breeze, warm golden light, swallows flying in the distance." &
gen_one ciliegi "A serene Japanese garden in full cherry blossom, a small red wooden bridge over a calm koi pond, pink petals everywhere, soft spring morning light." "Slow dolly forward toward the red bridge, cherry blossom petals slowly falling and drifting on the pond, branches gently swaying." &
gen_one reggia "A grand baroque palace ballroom with crystal chandeliers, gilded stucco, tall mirrors and windows, a long aisle of white flowers and candelabras, warm golden evening light." "Slow cinematic dolly forward down the ballroom aisle, crystal chandeliers sparkling, candle flames flickering, reflections shimmering in the mirrors." &
wait
