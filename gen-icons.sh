#!/bin/bash
cd "$(dirname "$0")"
while IFS=$'\t' read -r out prompt; do
  [ -s "$out" ] && continue
  echo "$out	$prompt"
done < /tmp/icon-jobs.txt | xargs -P 12 -d '\n' -I{} bash -c 'o=$(printf "%s" "{}" | cut -f1); p=$(printf "%s" "{}" | cut -f2); ./gen.sh "$o" gpt_image_2 --prompt "$p" --aspect_ratio 1:1'
