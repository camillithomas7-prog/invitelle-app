#!/bin/bash
# post-produzione video busta: post-env.sh <id> <sorgente.mp4> [fine_sec inizio_sfumatura]
cd "$(dirname "$0")"; k=$1; src=$2; end=$3; fs=$4; D=public/media/envelopes
vf="scale=720:-2"
[ -n "$end" ] && vf="$vf,trim=0:$end,setpts=PTS-STARTPTS,fade=t=out:st=$fs:d=$(echo "$end-$fs"|bc|sed "s/^\./0./"):color=0xFBF7F0"
ffmpeg -y -loglevel error -i $src -an -vf "$vf" -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -movflags +faststart $D/$k.mp4 && echo "POST $k"
