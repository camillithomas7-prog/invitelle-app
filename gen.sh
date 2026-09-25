#!/bin/bash
# Genera un asset con Higgsfield e lo scarica. uso: gen.sh <out> <model> [args...]
out=$1; shift
res=$(higgsfield generate create "$@" --wait --wait-timeout 25m --json 2>&1)
ext="${out##*.}"
# per i video/audio prende il file con la stessa estensione (non la miniatura jpg)
url=$(echo "$res" | grep -Eo "https://[^\"]+\.$ext" | tail -1)
case "$ext" in png|jpg|jpeg|webp) [ -z "$url" ] && url=$(echo "$res" | grep -Eo 'https://[^"]+\.(png|jpg|jpeg|webp)' | head -1);; esac
if [ -z "$url" ]; then echo "FAIL $out: $res" | head -c 600; echo; exit 1; fi
curl -sL "$url" -o "$out" && echo "OK $out"
